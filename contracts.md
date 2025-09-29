# API Контракты для интернет-магазина NEXX

## Описание
Данный документ описывает API контракты для интеграции frontend и backend интернет-магазина NEXX для продажи запчастей тракторов JCB.

## Мок данные для замены
В `frontend/src/data/mockData.js` находятся следующие мок данные, которые будут заменены на реальные API:

### Категории товаров
- `categories` - список категорий с подкатегориями
- `brands` - список брендов производителей

### Товары
- `products` - полный каталог товаров с ценами, рейтингами, описаниями
- `featuredProducts` - рекомендуемые товары

### Дополнительные данные
- `reviews` - отзывы покупателей
- `banners` - рекламные баннеры
- `deliveryMethods` - способы доставки
- `paymentMethods` - способы оплаты

## API Endpoints

### Аутентификация
```
POST /api/auth/login - вход по email/пароль
POST /api/auth/login-phone - вход по телефону с кодом  
POST /api/auth/register - регистрация
POST /api/auth/send-code - отправка SMS кода
POST /api/auth/logout - выход
GET /api/auth/profile - профиль пользователя
PUT /api/auth/profile - обновление профиля
```

### Каталог товаров
```
GET /api/categories - список категорий
GET /api/categories/{id}/products - товары категории
GET /api/products - все товары с фильтрами (?search, ?category, ?brand, ?priceMin, ?priceMax, ?page, ?limit)
GET /api/products/{id} - детали товара
GET /api/products/featured - рекомендуемые товары
GET /api/products/{id}/reviews - отзывы о товаре
POST /api/products/{id}/reviews - добавить отзыв
```

### Корзина и заказы
```
GET /api/cart - содержимое корзины
POST /api/cart/add - добавить товар в корзину
PUT /api/cart/update/{itemId} - обновить количество
DELETE /api/cart/remove/{itemId} - удалить из корзины
POST /api/orders - создать заказ
GET /api/orders - список заказов пользователя
GET /api/orders/{id} - детали заказа
```

### Пользователи
```
GET /api/users/profile - профиль пользователя
PUT /api/users/profile - обновить профиль
GET /api/users/orders - заказы пользователя
GET /api/users/favorites - избранные товары
POST /api/users/favorites/{productId} - добавить в избранное
DELETE /api/users/favorites/{productId} - удалить из избранного
```

### Админка
```
GET /api/admin/dashboard - статистика
GET /api/admin/products - управление товарами
POST /api/admin/products - создать товар
PUT /api/admin/products/{id} - обновить товар
DELETE /api/admin/products/{id} - удалить товар
GET /api/admin/orders - управление заказами
PUT /api/admin/orders/{id}/status - изменить статус заказа
GET /api/admin/users - управление пользователями
PUT /api/admin/settings - настройки сайта
```

## Модели данных

### User
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "phone": "string",
  "role": "customer|admin",
  "addresses": [Address],
  "createdAt": "datetime"
}
```

### Product
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "sku": "string",
  "description": "string",
  "price": "number",
  "originalPrice": "number",
  "discount": "number",
  "categoryId": "string",
  "subcategoryId": "string",
  "brand": "string",
  "country": "string",
  "images": ["string"],
  "specifications": "object",
  "availability": "string",
  "stockLevel": "string",
  "rating": "number",
  "reviewsCount": "number",
  "tags": ["string"]
}
```

### Order
```json
{
  "id": "string",
  "userId": "string",
  "items": [OrderItem],
  "total": "number",
  "status": "string",
  "paymentMethod": "string",
  "deliveryMethod": "string",
  "shippingAddress": "Address",
  "createdAt": "datetime"
}
```

### OrderItem
```json
{
  "productId": "string",
  "quantity": "number",
  "price": "number"
}
```

### Category
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "parentId": "string|null",
  "image": "string"
}
```

## Интеграция

### Этапы замены мок данных:

1. **Аутентификация** - заменить мок логику в AuthPage.jsx на реальные API вызовы
2. **Каталог** - заменить импорт mockData в CatalogPage.jsx на API вызовы
3. **Товары** - заменить данные в ProductPage.jsx на API запросы
4. **Корзина** - подключить CartPage.jsx к backend API
5. **Заказы** - интегрировать CheckoutPage.jsx с API заказов
6. **Профиль** - подключить ProfilePage.jsx к API пользователя
7. **Админка** - заменить мок данные в AdminPage компонентах на реальные API

### Конфигурация API клиента:
```javascript
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

// В каждом компоненте заменить импорт mockData на:
import { apiClient } from '../services/api';
```

## Безопасность

- JWT токены для аутентификации
- Валидация всех входящих данных
- Ограничение прав доступа (admin vs customer)
- Защита от SQL инъекций
- Rate limiting для API
- HTTPS для production

## SEO и производительность

- Server-side rendering для каталога
- Пагинация для больших списков
- Кэширование запросов
- Оптимизация изображений
- Мета теги для товаров

## Развертывание

- Docker контейнеры для backend/frontend
- MongoDB для базы данных
- CDN для статических файлов
- Мониторинг и логирование