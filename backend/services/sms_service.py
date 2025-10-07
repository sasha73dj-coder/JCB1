"""
SMS Service для российских SMS провайдеров
Поддержка SMSC.ru, SMS.ru и других российских сервисов
"""

import httpx
import json
import secrets
import time
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class SMSService:
    def __init__(self):
        self.codes_storage = {}  # Временное хранение кодов (в продакшене - Redis/DB)
        self.settings = {
            'provider': 'smsc',  # smsc, smsru, unifone
            'login': '',
            'password': '',
            'api_key': '',
            'sender': 'NEXX'
        }
    
    def update_settings(self, settings: Dict[str, Any]):
        """Обновление настроек SMS провайдера"""
        self.settings.update(settings)
        logger.info(f"SMS settings updated for provider: {settings.get('provider', 'unknown')}")
    
    def generate_code(self, length: int = 4) -> str:
        """Генерация SMS кода"""
        return ''.join([str(secrets.randbelow(10)) for _ in range(length)])
    
    async def send_sms_smsc(self, phone: str, message: str) -> Dict[str, Any]:
        """Отправка SMS через SMSC.ru"""
        if not self.settings.get('login') or not self.settings.get('password'):
            # Мок режим для тестирования
            logger.info(f"MOCK SMS to {phone}: {message}")
            return {
                'success': True,
                'message_id': f'mock_{int(time.time())}',
                'cost': 2.5,
                'provider': 'smsc_mock'
            }
        
        url = "https://smsc.ru/sys/send.php"
        params = {
            'login': self.settings['login'],
            'psw': self.settings['password'],
            'phones': phone,
            'mes': message,
            'charset': 'utf-8',
            'fmt': '3',  # JSON ответ
            'sender': self.settings['sender']
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, timeout=10)
                result = response.json()
                
                if 'id' in result:
                    return {
                        'success': True,
                        'message_id': result['id'],
                        'cost': result.get('cost', 0),
                        'provider': 'smsc'
                    }
                else:
                    return {
                        'success': False,
                        'error': result.get('error_code', 'Unknown error'),
                        'provider': 'smsc'
                    }
        except Exception as e:
            logger.error(f"SMSC SMS error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'provider': 'smsc'
            }
    
    async def send_sms_smsru(self, phone: str, message: str) -> Dict[str, Any]:
        """Отправка SMS через SMS.ru"""
        if not self.settings.get('api_key'):
            # Мок режим для тестирования
            logger.info(f"MOCK SMS.RU to {phone}: {message}")
            return {
                'success': True,
                'message_id': f'mock_smsru_{int(time.time())}',
                'cost': 2.8,
                'provider': 'smsru_mock'
            }
        
        url = "https://sms.ru/sms/send"
        data = {
            'api_id': self.settings['api_key'],
            'to': phone,
            'msg': message,
            'json': 1,
            'from': self.settings['sender']
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, data=data, timeout=10)
                result = response.json()
                
                if result.get('status_code') == 100:
                    sms_data = result.get('sms', {}).get(phone, {})
                    return {
                        'success': True,
                        'message_id': sms_data.get('sms_id'),
                        'cost': sms_data.get('cost', 0),
                        'provider': 'smsru'
                    }
                else:
                    return {
                        'success': False,
                        'error': result.get('status_text', 'Unknown error'),
                        'provider': 'smsru'
                    }
        except Exception as e:
            logger.error(f"SMS.RU error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'provider': 'smsru'
            }
    
    async def send_verification_code(self, phone: str) -> Dict[str, Any]:
        """Отправка кода подтверждения"""
        # Очистка номера телефона
        clean_phone = ''.join(filter(str.isdigit, phone))
        if clean_phone.startswith('8'):
            clean_phone = '7' + clean_phone[1:]
        if not clean_phone.startswith('7'):
            clean_phone = '7' + clean_phone
        
        # Генерация кода
        code = self.generate_code()
        
        # Создание сообщения
        message = f"Код подтверждения NEXX: {code}. Никому не сообщайте этот код!"
        
        # Отправка через выбранный провайдер
        provider = self.settings.get('provider', 'smsc')
        
        if provider == 'smsc':
            result = await self.send_sms_smsc(clean_phone, message)
        elif provider == 'smsru':
            result = await self.send_sms_smsru(clean_phone, message)
        else:
            # Универсальный мок режим
            logger.info(f"MOCK SMS ({provider}) to {clean_phone}: {message}")
            result = {
                'success': True,
                'message_id': f'mock_{provider}_{int(time.time())}',
                'cost': 2.5,
                'provider': f'{provider}_mock'
            }
        
        if result['success']:
            # Сохранение кода для верификации
            self.codes_storage[clean_phone] = {
                'code': code,
                'timestamp': datetime.now(),
                'attempts': 0,
                'message_id': result.get('message_id')
            }
            
            logger.info(f"SMS code sent to {clean_phone} via {provider}")
        
        return {
            'success': result['success'],
            'phone': clean_phone,
            'provider': result.get('provider'),
            'message_id': result.get('message_id'),
            'error': result.get('error')
        }
    
    def verify_code(self, phone: str, code: str) -> Dict[str, Any]:
        """Проверка SMS кода"""
        clean_phone = ''.join(filter(str.isdigit, phone))
        if clean_phone.startswith('8'):
            clean_phone = '7' + clean_phone[1:]
        if not clean_phone.startswith('7'):
            clean_phone = '7' + clean_phone
        
        stored_data = self.codes_storage.get(clean_phone)
        
        if not stored_data:
            return {
                'success': False,
                'error': 'Код не найден или истек'
            }
        
        # Проверка времени жизни кода (5 минут)
        if datetime.now() - stored_data['timestamp'] > timedelta(minutes=5):
            del self.codes_storage[clean_phone]
            return {
                'success': False,
                'error': 'Код истек'
            }
        
        # Проверка количества попыток (максимум 3)
        if stored_data['attempts'] >= 3:
            del self.codes_storage[clean_phone]
            return {
                'success': False,
                'error': 'Превышено количество попыток'
            }
        
        # Проверка кода
        if stored_data['code'] == code:
            del self.codes_storage[clean_phone]
            return {
                'success': True,
                'phone': clean_phone
            }
        else:
            # Увеличиваем счетчик попыток
            stored_data['attempts'] += 1
            self.codes_storage[clean_phone] = stored_data
            
            return {
                'success': False,
                'error': f'Неверный код. Осталось попыток: {3 - stored_data["attempts"]}'
            }
    
    def get_settings(self) -> Dict[str, Any]:
        """Получение текущих настроек (без паролей)"""
        safe_settings = self.settings.copy()
        safe_settings['password'] = '***' if safe_settings.get('password') else ''
        safe_settings['api_key'] = '***' if safe_settings.get('api_key') else ''
        return safe_settings

# Глобальный экземпляр сервиса
sms_service = SMSService()