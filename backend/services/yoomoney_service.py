"""
YooMoney (YooKassa) Payment Service
Интеграция с российской платежной системой YooMoney для обработки платежей
"""

import httpx
import json
import uuid
import hashlib
import hmac
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class YooMoneyPayment(BaseModel):
    id: str
    status: str
    amount: Dict[str, Any]
    description: str
    created_at: str
    confirmation: Optional[Dict[str, Any]] = None
    paid: bool = False
    refundable: bool = False
    test: bool = True

class YooMoneyService:
    def __init__(self, shop_id: str, secret_key: str, sandbox: bool = True):
        self.shop_id = shop_id
        self.secret_key = secret_key
        self.sandbox = sandbox
        self.base_url = "https://api.yookassa.ru" if not sandbox else "https://api.yookassa.ru"
        
        self.client = httpx.AsyncClient(
            auth=(shop_id, secret_key),
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            timeout=30.0
        )
    
    def generate_idempotency_key(self) -> str:
        """Генерация ключа идемпотентности"""
        return str(uuid.uuid4())
    
    async def create_payment(
        self,
        amount: float,
        currency: str = "RUB",
        description: str = "Оплата заказа",
        return_url: str = None,
        capture: bool = True,
        metadata: Optional[Dict] = None
    ) -> YooMoneyPayment:
        """Создание платежа в YooMoney"""
        try:
            payment_data = {
                "amount": {
                    "value": f"{amount:.2f}",
                    "currency": currency
                },
                "description": description,
                "capture": capture,
                "confirmation": {
                    "type": "redirect",
                    "return_url": return_url or "https://example.com/return"
                }
            }
            
            if metadata:
                payment_data["metadata"] = metadata
            
            idempotency_key = self.generate_idempotency_key()
            
            response = await self.client.post(
                f"{self.base_url}/v3/payments",
                json=payment_data,
                headers={"Idempotence-Key": idempotency_key}
            )
            
            if response.status_code == 200:
                result = response.json()
                return YooMoneyPayment(**result)
            else:
                logger.error(f"YooMoney payment creation failed: {response.status_code} - {response.text}")
                raise Exception(f"Payment creation failed: {response.text}")
                
        except Exception as e:
            logger.error(f"Error creating YooMoney payment: {str(e)}")
            raise
    
    async def get_payment_status(self, payment_id: str) -> YooMoneyPayment:
        """Получение статуса платежа"""
        try:
            response = await self.client.get(f"{self.base_url}/v3/payments/{payment_id}")
            
            if response.status_code == 200:
                result = response.json()
                return YooMoneyPayment(**result)
            else:
                logger.error(f"Failed to get payment status: {response.status_code} - {response.text}")
                raise Exception(f"Failed to get payment status: {response.text}")
                
        except Exception as e:
            logger.error(f"Error getting payment status: {str(e)}")
            raise
    
    async def capture_payment(self, payment_id: str, amount: Optional[float] = None) -> YooMoneyPayment:
        """Подтверждение платежа"""
        try:
            capture_data = {}
            if amount:
                capture_data["amount"] = {
                    "value": f"{amount:.2f}",
                    "currency": "RUB"
                }
            
            idempotency_key = self.generate_idempotency_key()
            
            response = await self.client.post(
                f"{self.base_url}/v3/payments/{payment_id}/capture",
                json=capture_data,
                headers={"Idempotence-Key": idempotency_key}
            )
            
            if response.status_code == 200:
                result = response.json()
                return YooMoneyPayment(**result)
            else:
                logger.error(f"Payment capture failed: {response.status_code} - {response.text}")
                raise Exception(f"Payment capture failed: {response.text}")
                
        except Exception as e:
            logger.error(f"Error capturing payment: {str(e)}")
            raise
    
    def verify_webhook(self, request_body: bytes, signature: str) -> bool:
        """Проверка подписи webhook уведомления"""
        try:
            expected_signature = hmac.new(
                self.secret_key.encode('utf-8'),
                request_body,
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(signature, expected_signature)
        except Exception as e:
            logger.error(f"Error verifying webhook signature: {str(e)}")
            return False
    
    async def process_webhook(self, webhook_data: Dict[str, Any]) -> bool:
        """Обработка webhook уведомления"""
        try:
            event_type = webhook_data.get("event")
            payment_object = webhook_data.get("object", {})
            
            payment_id = payment_object.get("id")
            payment_status = payment_object.get("status")
            
            logger.info(f"Processing webhook: {event_type} for payment {payment_id} with status {payment_status}")
            
            # Здесь должна быть логика обновления заказа в базе данных
            # В зависимости от статуса платежа
            
            if event_type == "payment.succeeded":
                # Платеж успешно завершен
                await self._handle_successful_payment(payment_object)
            elif event_type == "payment.canceled":
                # Платеж отменен
                await self._handle_canceled_payment(payment_object)
            
            return True
            
        except Exception as e:
            logger.error(f"Error processing webhook: {str(e)}")
            return False
    
    async def _handle_successful_payment(self, payment_object: Dict[str, Any]):
        """Обработка успешного платежа"""
        payment_id = payment_object.get("id")
        amount = payment_object.get("amount", {}).get("value")
        
        logger.info(f"Payment {payment_id} succeeded with amount {amount}")
        
        # Здесь нужно:
        # 1. Обновить статус заказа в базе данных
        # 2. Отправить уведомление покупателю
        # 3. Запустить процесс выполнения заказа
        
    async def _handle_canceled_payment(self, payment_object: Dict[str, Any]):
        """Обработка отмененного платежа"""
        payment_id = payment_object.get("id")
        
        logger.info(f"Payment {payment_id} was canceled")
        
        # Здесь нужно:
        # 1. Обновить статус заказа в базе данных
        # 2. Освободить товары в корзине
        # 3. Отправить уведомление покупателю
    
    async def close(self):
        """Закрытие HTTP клиента"""
        await self.client.aclose()

# Глобальный экземпляр сервиса
yoomoney_service = None

def init_yoomoney_service(shop_id: str, secret_key: str, sandbox: bool = True):
    """Инициализация сервиса YooMoney"""
    global yoomoney_service
    yoomoney_service = YooMoneyService(shop_id, secret_key, sandbox)
    return yoomoney_service

def get_yoomoney_service() -> YooMoneyService:
    """Получение экземпляра сервиса YooMoney"""
    if yoomoney_service is None:
        raise Exception("YooMoney service not initialized")
    return yoomoney_service