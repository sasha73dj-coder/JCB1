"""
ABCP.ru API Service
Интеграция с российской системой поставок автозапчастей ABCP.ru
"""

import httpx
import hashlib
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class ABCPProduct(BaseModel):
    brand: str
    number: str
    description: str
    price: float
    availability: int
    supplier_code: str
    item_key: str
    delivery_days: int = 3

class ABCPCartItem(BaseModel):
    brand: str
    number: str
    quantity: int
    supplier_code: str
    item_key: str

class ABCPService:
    def __init__(self, username: str, password: str, host: str = "api.abcp.ru"):
        self.username = username
        self.password = password
        self.host = host
        self.base_url = f"https://{host}"
        
        # MD5 хеш пароля для API ABCP
        self.password_hash = hashlib.md5(password.encode('utf-8')).hexdigest()
        
        self.client = httpx.AsyncClient(
            timeout=30.0,
            limits=httpx.Limits(max_connections=10)
        )
    
    def _get_auth_params(self) -> Dict[str, str]:
        """Получение параметров аутентификации"""
        return {
            "userlogin": self.username,
            "userpsw": self.password_hash
        }
    
    async def search_products(
        self,
        part_number: str,
        brand: Optional[str] = None,
        limit: int = 100
    ) -> List[ABCPProduct]:
        """Поиск товаров по артикулу"""
        try:
            params = self._get_auth_params()
            params.update({
                "number": part_number,
                "limit": str(limit)
            })
            
            if brand:
                params["brand"] = brand
            
            response = await self.client.get(
                f"{self.base_url}/search/articles",
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Проверяем на ошибки API
                if isinstance(data, dict) and "error" in data:
                    logger.error(f"ABCP API error: {data}")
                    return []
                
                # Преобразуем результаты в наши модели
                products = []
                if isinstance(data, list):
                    for item in data:
                        try:
                            # Симулируем реальные данные на основе ответа API
                            product = ABCPProduct(
                                brand=item.get("brand", brand or "Unknown"),
                                number=item.get("number", part_number),
                                description=item.get("description", f"Запчасть {part_number}"),
                                price=float(item.get("price", 1000.0)),
                                availability=int(item.get("availability", 5)),
                                supplier_code=item.get("supplierCode", f"SUP_{len(products)+1}"),
                                item_key=item.get("itemKey", f"key_{len(products)+1}"),
                                delivery_days=int(item.get("deliveryDays", 3))
                            )
                            products.append(product)
                        except Exception as e:
                            logger.warning(f"Error parsing product item: {e}")
                            continue
                
                return products[:limit]
            else:
                logger.error(f"ABCP search failed: {response.status_code} - {response.text}")
                return []
                
        except Exception as e:
            logger.error(f"Error searching ABCP products: {str(e)}")
            return []
    
    async def get_product_offers(
        self,
        part_number: str,
        brand: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Получение предложений по товару от разных поставщиков"""
        try:
            # Поиск товаров
            products = await self.search_products(part_number, brand, 10)
            
            offers = []
            for product in products:
                # Добавляем наценку магазина (например, 15%)
                markup = 1.15
                client_price = product.price * markup
                
                offer = {
                    "supplier_id": f"abcp_{product.supplier_code}",
                    "supplier_name": f"ABCP Поставщик {product.supplier_code}",
                    "brand": product.brand,
                    "part_number": product.number,
                    "description": product.description,
                    "wholesale_price": product.price,
                    "client_price": client_price,
                    "stock_quantity": product.availability,
                    "delivery_time_days": product.delivery_days,
                    "supplier_rating": 4.5,
                    "item_key": product.item_key
                }
                offers.append(offer)
            
            # Сортируем по цене
            offers.sort(key=lambda x: x["client_price"])
            
            return offers
            
        except Exception as e:
            logger.error(f"Error getting product offers: {str(e)}")
            return []
    
    async def add_to_cart(self, item: ABCPCartItem) -> Dict[str, Any]:
        """Добавление товара в корзину ABCP"""
        try:
            data = self._get_auth_params()
            data.update({
                "brand": item.brand,
                "number": item.number,
                "quantity": str(item.quantity),
                "supplierCode": item.supplier_code,
                "itemKey": item.item_key
            })
            
            response = await self.client.post(
                f"{self.base_url}/ts/cart/create",
                data=data
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "position_id": result.get("positionId"),
                    "message": "Товар добавлен в корзину"
                }
            else:
                logger.error(f"Failed to add to ABCP cart: {response.status_code} - {response.text}")
                return {
                    "success": False,
                    "message": "Ошибка добавления в корзину"
                }
                
        except Exception as e:
            logger.error(f"Error adding to ABCP cart: {str(e)}")
            return {
                "success": False,
                "message": f"Ошибка: {str(e)}"
            }
    
    async def get_cart_items(self) -> List[Dict[str, Any]]:
        """Получение товаров в корзине"""
        try:
            params = self._get_auth_params()
            
            response = await self.client.get(
                f"{self.base_url}/ts/cart/get",
                params=params
            )
            
            if response.status_code == 200:
                result = response.json()
                return result if isinstance(result, list) else []
            else:
                logger.error(f"Failed to get ABCP cart: {response.status_code} - {response.text}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting ABCP cart: {str(e)}")
            return []
    
    async def create_order(
        self,
        cart_positions: List[int],
        delivery_address: str,
        contact_person: str,
        contact_phone: str,
        comment: Optional[str] = None
    ) -> Dict[str, Any]:
        """Создание заказа в ABCP"""
        try:
            data = self._get_auth_params()
            data.update({
                "delivery[methodId]": "1",  # Метод доставки
                "delivery[meetData][address]": delivery_address,
                "delivery[meetData][person]": contact_person,
                "delivery[meetData][contact]": contact_phone
            })
            
            if comment:
                data["delivery[meetData][comment]"] = comment
            
            # Добавляем позиции корзины
            for i, position_id in enumerate(cart_positions):
                data[f"positions[{i}]"] = str(position_id)
            
            response = await self.client.post(
                f"{self.base_url}/ts/orders/createByCart",
                data=data
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "order_id": result.get("orderId"),
                    "message": "Заказ создан успешно"
                }
            else:
                logger.error(f"Failed to create ABCP order: {response.status_code} - {response.text}")
                return {
                    "success": False,
                    "message": "Ошибка создания заказа"
                }
                
        except Exception as e:
            logger.error(f"Error creating ABCP order: {str(e)}")
            return {
                "success": False,
                "message": f"Ошибка: {str(e)}"
            }
    
    async def test_connection(self) -> Dict[str, Any]:
        """Тестирование подключения к API ABCP"""
        try:
            # Пробуем сделать простой запрос
            params = self._get_auth_params()
            
            start_time = datetime.now()
            response = await self.client.get(
                f"{self.base_url}/search/articles",
                params={**params, "number": "test", "limit": "1"}
            )
            end_time = datetime.now()
            
            response_time = (end_time - start_time).total_seconds() * 1000
            
            if response.status_code == 200:
                data = response.json()
                
                # Проверяем на ошибки аутентификации
                if isinstance(data, dict) and "error" in data:
                    error_code = data.get("errorCode", 0)
                    if error_code == 102:
                        return {
                            "success": False,
                            "message": "Ошибка аутентификации",
                            "response_time_ms": response_time
                        }
                
                return {
                    "success": True,
                    "message": "Подключение успешно",
                    "response_time_ms": response_time
                }
            else:
                return {
                    "success": False,
                    "message": f"HTTP Error {response.status_code}",
                    "response_time_ms": response_time
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Ошибка подключения: {str(e)}",
                "response_time_ms": 0
            }
    
    async def close(self):
        """Закрытие HTTP клиента"""
        await self.client.aclose()

# Глобальный экземпляр сервиса
abcp_service = None

def init_abcp_service(username: str, password: str, host: str = "api.abcp.ru"):
    """Инициализация сервиса ABCP"""
    global abcp_service
    abcp_service = ABCPService(username, password, host)
    return abcp_service

def get_abcp_service() -> Optional[ABCPService]:
    """Получение экземпляра сервиса ABCP"""
    return abcp_service