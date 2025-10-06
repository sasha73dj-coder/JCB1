// NEXX Store - Полная база данных магазина
// Система управления всеми данными интернет-магазина

class StoreDatabase {
    constructor() {
        this.initializeDatabase();
        this.loadFromStorage();
    }

    // Инициализация базовых данных
    initializeDatabase() {
        this.data = {
            // Конфигурация магазина
            config: {
                siteName: "NEXX",
                siteDescription: "Профессиональный интернет-магазин запчастей JCB",
                companyName: "ООО 'NEXX'",
                companyPhone: "+7 (495) 123-45-67",
                companyEmail: "info@nexx.ru",
                companyAddress: "г. Москва, ул. Промышленная, д. 5",
                inn: "7712345678",
                kpp: "771234567",
                ogrn: "1127747123456",
                bankName: "ПАО Сбербанк",
                bik: "044525225",
                accountNumber: "40702810338000123456",
                theme: {
                    primaryColor: "#f97316",
                    secondaryColor: "#1f2937",
                    accentColor: "#374151"
                },
                seo: {
                    keywords: "запчасти JCB, оригинальные запчасти, спецтехника",
                    description: "Оригинальные запчасти JCB. Широкий ассортимент, быстрая доставка"
                }
            },

            // Пользователи системы
            users: [
                {
                    id: 1,
                    email: "admin@nexx.ru",
                    phone: "+79991234567",
                    password: "admin123", // В реальной системе должен быть хеширован
                    role: "admin",
                    profileType: "individual",
                    profile: {
                        fullName: "Администратор Системы",
                        birthDate: "1980-01-01",
                        gender: "male",
                        deliveryAddress: "г. Москва, ул. Админская, д. 1"
                    },
                    account: {
                        balance: 0,
                        bonusPoints: 0,
                        creditLimit: 0
                    },
                    permissions: ["all"],
                    createdAt: new Date().toISOString(),
                    isActive: true
                }
            ],

            // Товары
            products: [
                {
                    id: 1,
                    name: "Фильтр гидравлический JCB 32/925994",
                    description: "Оригинальный гидравлический фильтр для экскаваторов JCB. Высокое качество, длительный срок службы. Подходит для моделей JCB JS200, JS210, JS220.",
                    sku: "32/925994",
                    brand: "JCB",
                    category: "Гидравлика",
                    price: 8500,
                    wholesalePrice: 7200,
                    images: [
                        "https://via.placeholder.com/400x300/374151/f97316?text=Фильтр+JCB+1",
                        "https://via.placeholder.com/400x300/374151/f97316?text=Фильтр+JCB+2"
                    ],
                    stock: 15,
                    minStock: 5,
                    weight: 2.5,
                    dimensions: "25x15x10",
                    rating: 4.8,
                    reviews: 12,
                    tags: ["фильтр", "гидравлика", "оригинал"],
                    seoTitle: "Фильтр гидравлический JCB 32/925994 - купить оригинал",
                    seoDescription: "Оригинальный гидравлический фильтр JCB 32/925994. В наличии, быстрая доставка.",
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Тормозные колодки передние JCB 15/920200",
                    description: "Высококачественные тормозные колодки для спецтехники JCB. Обеспечивают надежное торможение в любых условиях.",
                    sku: "15/920200",
                    brand: "JCB",
                    category: "Тормозная система",
                    price: 12500,
                    wholesalePrice: 10600,
                    images: [
                        "https://via.placeholder.com/400x300/374151/f97316?text=Колодки+JCB"
                    ],
                    stock: 8,
                    minStock: 3,
                    weight: 3.2,
                    dimensions: "30x20x5",
                    rating: 4.6,
                    reviews: 8,
                    tags: ["тормоза", "колодки", "безопасность"],
                    seoTitle: "Тормозные колодки JCB 15/920200 передние",
                    seoDescription: "Качественные тормозные колодки JCB для надежного торможения спецтехники.",
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Масляный фильтр двигателя JCB 02/100284",
                    description: "Оригинальный масляный фильтр для двигателей JCB. Обеспечивает чистоту масла и продлевает срок службы двигателя.",
                    sku: "02/100284",
                    brand: "JCB",
                    category: "Двигатель",
                    price: 1200,
                    wholesalePrice: 1020,
                    images: [
                        "https://via.placeholder.com/400x300/374151/f97316?text=Фильтр+масла"
                    ],
                    stock: 25,
                    minStock: 10,
                    weight: 0.8,
                    dimensions: "15x15x8",
                    rating: 4.9,
                    reviews: 15,
                    tags: ["фильтр", "масло", "двигатель"],
                    seoTitle: "Масляный фильтр JCB 02/100284 для двигателя",
                    seoDescription: "Оригинальный масляный фильтр JCB для защиты двигателя от загрязнений.",
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: "Коленвал JCB 320/03336",
                    description: "Коленчатый вал для двигателей JCB. Высокое качество изготовления, точное соответствие оригинальным спецификациям.",
                    sku: "320/03336",
                    brand: "JCB",
                    category: "Двигатель",
                    price: 95000,
                    wholesalePrice: 80750,
                    images: [
                        "https://via.placeholder.com/400x300/374151/f97316?text=Коленвал+JCB"
                    ],
                    stock: 3,
                    minStock: 1,
                    weight: 45.5,
                    dimensions: "80x30x30",
                    rating: 5.0,
                    reviews: 5,
                    tags: ["коленвал", "двигатель", "капремонт"],
                    seoTitle: "Коленвал JCB 320/03336 оригинальный",
                    seoDescription: "Качественный коленвал JCB для капитального ремонта двигателя.",
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: "Гидронасос основной JCB 20/925592",
                    description: "Основной гидравлический насос для экскаваторов JCB. Обеспечивает стабильную работу гидросистемы.",
                    sku: "20/925592",
                    brand: "JCB",
                    category: "Гидравлика",
                    price: 185000,
                    wholesalePrice: 157250,
                    images: [
                        "https://via.placeholder.com/400x300/374151/f97316?text=Насос+JCB"
                    ],
                    stock: 2,
                    minStock: 1,
                    weight: 35.0,
                    dimensions: "50x40x35",
                    rating: 4.7,
                    reviews: 3,
                    tags: ["насос", "гидравлика", "основной"],
                    seoTitle: "Гидронасос JCB 20/925592 основной",
                    seoDescription: "Надежный гидронасос JCB для стабильной работы гидросистемы экскаватора.",
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            ],

            // Заказы
            orders: [
                {
                    id: 1,
                    orderNumber: "NEXX-000001",
                    userId: 1,
                    customerName: "Тестовый клиент",
                    customerEmail: "test@example.com",
                    customerPhone: "+79991234567",
                    items: [
                        {
                            productId: 1,
                            name: "Фильтр гидравлический JCB 32/925994",
                            price: 8500,
                            quantity: 2,
                            total: 17000
                        }
                    ],
                    subtotal: 17000,
                    deliveryMethod: "courier",
                    deliveryCost: 500,
                    totalAmount: 17500,
                    paymentMethod: "card",
                    paymentStatus: "paid",
                    status: "completed",
                    deliveryAddress: "г. Москва, ул. Тестовая, д. 1",
                    notes: "Тестовый заказ",
                    createdAt: "2024-10-01T10:00:00Z",
                    updatedAt: "2024-10-01T15:00:00Z"
                }
            ],

            // Корзины пользователей
            carts: {},

            // Категории товаров
            categories: [
                { id: 1, name: "Двигатель", slug: "engine", description: "Запчасти для двигателя", isActive: true },
                { id: 2, name: "Гидравлика", slug: "hydraulics", description: "Гидравлические компоненты", isActive: true },
                { id: 3, name: "Трансмиссия", slug: "transmission", description: "Детали трансмиссии", isActive: true },
                { id: 4, name: "Тормозная система", slug: "brakes", description: "Тормозные компоненты", isActive: true },
                { id: 5, name: "Электрика", slug: "electrical", description: "Электрические компоненты", isActive: true },
                { id: 6, name: "Кузовные детали", slug: "body", description: "Кузовные запчасти", isActive: true }
            ],

            // Поставщики
            suppliers: [
                {
                    id: 1,
                    name: "JCB Russia",
                    description: "Официальный дистрибьютор JCB в России",
                    apiUrl: "https://api.jcb-russia.com/v1/",
                    apiKey: "jcb_api_key_example",
                    apiType: "rest",
                    status: "active",
                    rating: 4.9,
                    supportedBrands: ["JCB"],
                    deliveryDays: 3,
                    priceMarkup: 15,
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            ],

            // Методы доставки
            deliveryMethods: [
                {
                    id: 1,
                    name: "Курьерская доставка",
                    description: "Доставка курьером по Москве и области",
                    price: 500,
                    freeFrom: 50000,
                    estimatedDays: 1,
                    isActive: true,
                    settings: {
                        workingHours: "9:00-18:00",
                        weekends: false
                    }
                },
                {
                    id: 2,
                    name: "Самовывоз",
                    description: "Забрать со склада",
                    price: 0,
                    freeFrom: 0,
                    estimatedDays: 0,
                    isActive: true,
                    settings: {
                        address: "г. Москва, ул. Промышленная, д. 5",
                        workingHours: "9:00-18:00",
                        weekends: false
                    }
                },
                {
                    id: 3,
                    name: "Транспортная компания",
                    description: "Доставка по всей России",
                    price: 1500,
                    freeFrom: 100000,
                    estimatedDays: 7,
                    isActive: true,
                    settings: {
                        companies: ["СДЭК", "Boxberry", "ПЭК"]
                    }
                }
            ],

            // Методы оплаты
            paymentMethods: [
                {
                    id: 1,
                    name: "Банковская карта",
                    type: "card",
                    provider: "stripe",
                    isActive: true,
                    settings: {
                        publicKey: "pk_test_example",
                        secretKey: "sk_test_example"
                    }
                },
                {
                    id: 2,
                    name: "ЮMoney",
                    type: "yandex",
                    provider: "yandex",
                    isActive: true,
                    settings: {
                        shopId: "12345",
                        secretKey: "test_secret"
                    }
                },
                {
                    id: 3,
                    name: "Сбербанк Онлайн",
                    type: "sberbank",
                    provider: "sberbank",
                    isActive: true,
                    settings: {
                        userName: "test_user",
                        password: "test_pass"
                    }
                },
                {
                    id: 4,
                    name: "Наличными при получении",
                    type: "cash",
                    provider: "manual",
                    isActive: true,
                    settings: {}
                },
                {
                    id: 5,
                    name: "Банковский перевод",
                    type: "transfer",
                    provider: "manual",
                    isActive: true,
                    settings: {}
                }
            ],

            // Страницы сайта
            pages: [
                {
                    id: 1,
                    title: "О компании",
                    slug: "about",
                    content: `<h2>О компании NEXX</h2>
                    <p>Мы являемся ведущим поставщиком оригинальных запчастей JCB в России. Наша компания работает на рынке уже более 10 лет и зарекомендовала себя как надежный партнер.</p>
                    <h3>Наши преимущества:</h3>
                    <ul>
                        <li>Только оригинальные запчасти</li>
                        <li>Гарантия на всю продукцию</li>
                        <li>Быстрая доставка</li>
                        <li>Профессиональная поддержка</li>
                    </ul>`,
                    seoTitle: "О компании NEXX - поставщик запчастей JCB",
                    seoDescription: "Компания NEXX - ведущий поставщик оригинальных запчастей JCB в России",
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Доставка и оплата",
                    slug: "delivery",
                    content: `<h2>Доставка и оплата</h2>
                    <h3>Способы доставки:</h3>
                    <ul>
                        <li>Курьерская доставка по Москве - 500₽</li>
                        <li>Самовывоз - бесплатно</li>
                        <li>Транспортная компания - от 1500₽</li>
                    </ul>
                    <h3>Способы оплаты:</h3>
                    <ul>
                        <li>Банковская карта</li>
                        <li>ЮMoney</li>
                        <li>Наличными при получении</li>
                        <li>Банковский перевод</li>
                    </ul>`,
                    seoTitle: "Доставка и оплата - NEXX",
                    seoDescription: "Удобные способы доставки и оплаты запчастей JCB",
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Контакты",
                    slug: "contacts",
                    content: `<h2>Контактная информация</h2>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3>Офис и склад</h3>
                            <p><strong>Адрес:</strong> г. Москва, ул. Промышленная, д. 5</p>
                            <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
                            <p><strong>Email:</strong> info@nexx.ru</p>
                            <p><strong>Режим работы:</strong> Пн-Пт 9:00-18:00</p>
                        </div>
                        <div>
                            <h3>Реквизиты</h3>
                            <p><strong>ИНН:</strong> 7712345678</p>
                            <p><strong>КПП:</strong> 771234567</p>
                            <p><strong>ОГРН:</strong> 1127747123456</p>
                            <p><strong>Банк:</strong> ПАО Сбербанк</p>
                            <p><strong>БИК:</strong> 044525225</p>
                            <p><strong>Счет:</strong> 40702810338000123456</p>
                        </div>
                    </div>`,
                    seoTitle: "Контакты компании NEXX",
                    seoDescription: "Контактная информация и реквизиты компании NEXX",
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            ],

            // Роли и права доступа
            roles: [
                {
                    id: "admin",
                    name: "Администратор",
                    permissions: [
                        "dashboard.view", "users.manage", "products.manage", "orders.manage",
                        "suppliers.manage", "payments.manage", "delivery.manage", "staff.manage",
                        "settings.manage", "pages.manage", "analytics.view", "reports.view"
                    ]
                },
                {
                    id: "manager",
                    name: "Менеджер",
                    permissions: [
                        "dashboard.view", "users.view", "products.view", "orders.manage",
                        "analytics.view"
                    ]
                },
                {
                    id: "moderator",
                    name: "Модератор контента",
                    permissions: [
                        "dashboard.view", "products.manage", "pages.manage"
                    ]
                },
                {
                    id: "accountant",
                    name: "Бухгалтер",
                    permissions: [
                        "dashboard.view", "orders.view", "analytics.view", "reports.view"
                    ]
                }
            ],

            // Счетчики для ID
            counters: {
                nextUserId: 2,
                nextProductId: 6,
                nextOrderId: 2,
                nextSupplierId: 2,
                nextPageId: 4,
                nextCategoryId: 7
            }
        };
    }

    // Загрузка данных из localStorage
    loadFromStorage() {
        const savedData = localStorage.getItem('nexxFullStoreData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Объединяем с дефолтными данными
                this.data = { ...this.data, ...parsedData };
            } catch (e) {
                console.error('Ошибка загрузки данных:', e);
            }
        }
    }

    // Сохранение данных в localStorage
    saveToStorage() {
        try {
            localStorage.setItem('nexxFullStoreData', JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения данных:', e);
            return false;
        }
    }

    // Методы для работы с пользователями
    getUsers() {
        return this.data.users;
    }

    getUserById(id) {
        return this.data.users.find(user => user.id == id);
    }

    getUserByEmail(email) {
        return this.data.users.find(user => user.email === email);
    }

    getUserByPhone(phone) {
        return this.data.users.find(user => user.phone === phone);
    }

    addUser(userData) {
        const user = {
            id: this.data.counters.nextUserId++,
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        this.data.users.push(user);
        this.saveToStorage();
        return user;
    }

    updateUser(userId, userData) {
        const userIndex = this.data.users.findIndex(u => u.id == userId);
        if (userIndex !== -1) {
            this.data.users[userIndex] = { ...this.data.users[userIndex], ...userData };
            this.saveToStorage();
            return this.data.users[userIndex];
        }
        return null;
    }

    // Методы для работы с товарами
    getProducts() {
        return this.data.products.filter(p => p.isActive);
    }

    getProductById(id) {
        return this.data.products.find(p => p.id == id);
    }

    addProduct(productData) {
        const product = {
            id: this.data.counters.nextProductId++,
            ...productData,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        this.data.products.push(product);
        this.saveToStorage();
        return product;
    }

    updateProduct(productId, productData) {
        const index = this.data.products.findIndex(p => p.id == productId);
        if (index !== -1) {
            this.data.products[index] = { ...this.data.products[index], ...productData };
            this.saveToStorage();
            return this.data.products[index];
        }
        return null;
    }

    deleteProduct(productId) {
        const index = this.data.products.findIndex(p => p.id == productId);
        if (index !== -1) {
            this.data.products[index].isActive = false;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Методы для работы с заказами
    getOrders() {
        return this.data.orders;
    }

    addOrder(orderData) {
        const order = {
            id: this.data.counters.nextOrderId++,
            orderNumber: `NEXX-${String(this.data.counters.nextOrderId).padStart(6, '0')}`,
            ...orderData,
            createdAt: new Date().toISOString()
        };
        this.data.orders.push(order);
        this.saveToStorage();
        return order;
    }

    updateOrder(orderId, orderData) {
        const index = this.data.orders.findIndex(o => o.id == orderId);
        if (index !== -1) {
            this.data.orders[index] = { 
                ...this.data.orders[index], 
                ...orderData,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            return this.data.orders[index];
        }
        return null;
    }

    // Методы для работы с корзиной
    getCart(userId) {
        return this.data.carts[userId] || [];
    }

    addToCart(userId, productId, quantity = 1) {
        if (!this.data.carts[userId]) {
            this.data.carts[userId] = [];
        }

        const existingItem = this.data.carts[userId].find(item => item.productId == productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const product = this.getProductById(productId);
            if (product) {
                this.data.carts[userId].push({
                    productId: productId,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity: quantity
                });
            }
        }

        this.saveToStorage();
        return this.data.carts[userId];
    }

    updateCartItem(userId, productId, quantity) {
        if (!this.data.carts[userId]) return [];

        if (quantity <= 0) {
            this.data.carts[userId] = this.data.carts[userId].filter(item => item.productId != productId);
        } else {
            const item = this.data.carts[userId].find(item => item.productId == productId);
            if (item) {
                item.quantity = quantity;
            }
        }

        this.saveToStorage();
        return this.data.carts[userId];
    }

    clearCart(userId) {
        this.data.carts[userId] = [];
        this.saveToStorage();
        return [];
    }

    // Методы конфигурации
    getConfig() {
        return this.data.config;
    }

    updateConfig(configData) {
        this.data.config = { ...this.data.config, ...configData };
        this.saveToStorage();
        return this.data.config;
    }

    // Получение статистики
    getStats() {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const ordersThisMonth = this.data.orders.filter(order => 
            new Date(order.createdAt) >= thisMonth
        );
        
        const revenue = ordersThisMonth.reduce((sum, order) => 
            sum + (order.totalAmount || 0), 0
        );

        return {
            totalProducts: this.data.products.filter(p => p.isActive).length,
            totalUsers: this.data.users.filter(u => u.isActive && u.role !== 'admin').length,
            totalOrders: this.data.orders.length,
            ordersThisMonth: ordersThisMonth.length,
            revenueThisMonth: revenue,
            activeSuppliers: this.data.suppliers.filter(s => s.isActive).length,
            lowStock: this.data.products.filter(p => p.isActive && p.stock <= p.minStock).length
        };
    }
}

// Инициализация глобальной базы данных
window.storeDB = new StoreDatabase();