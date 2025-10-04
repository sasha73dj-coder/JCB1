// NEXX Store - Standalone E-commerce Application
// Полностью автономный интернет-магазин без внешних зависимостей

// Данные магазина
let storeData = {
    products: [
        {
            id: 1,
            name: "Фильтр гидравлический JCB 32/925994",
            description: "Оригинальный гидравлический фильтр для экскаваторов JCB. Высокое качество, длительный срок службы.",
            sku: "32/925994",
            brand: "JCB",
            category: "Гидравлика",
            price: 8500,
            image: "https://via.placeholder.com/300x200/374151/f97316?text=Фильтр+JCB",
            stock: 15,
            rating: 4.8,
            reviews: 12
        },
        {
            id: 2,
            name: "Тормозные колодки передние JCB 15/920200",
            description: "Высококачественные тормозные колодки для спецтехники JCB. Обеспечивают надежное торможение.",
            sku: "15/920200",
            brand: "JCB",
            category: "Тормозная система",
            price: 12500,
            image: "https://via.placeholder.com/300x200/374151/f97316?text=Колодки+JCB",
            stock: 8,
            rating: 4.6,
            reviews: 8
        },
        {
            id: 3,
            name: "Масляный фильтр двигателя JCB 02/100284",
            description: "Оригинальный масляный фильтр для двигателей JCB. Обеспечивает чистоту масла и продлевает срок службы двигателя.",
            sku: "02/100284",
            brand: "JCB",
            category: "Двигатель",
            price: 1200,
            image: "https://via.placeholder.com/300x200/374151/f97316?text=Фильтр+масла",
            stock: 25,
            rating: 4.9,
            reviews: 15
        },
        {
            id: 4,
            name: "Коленвал JCB 320/03336",
            description: "Коленчатый вал для двигателей JCB. Высокое качество изготовления, точное соответствие оригинальным спецификациям.",
            sku: "320/03336",
            brand: "JCB",
            category: "Двигатель",
            price: 95000,
            image: "https://via.placeholder.com/300x200/374151/f97316?text=Коленвал+JCB",
            stock: 3,
            rating: 5.0,
            reviews: 5
        },
        {
            id: 5,
            name: "Гидронасос основной JCB 20/925592",
            description: "Основной гидравлический насос для экскаваторов JCB. Обеспечивает стабильную работу гидросистемы.",
            sku: "20/925592",
            brand: "JCB",
            category: "Гидравлика",
            price: 185000,
            image: "https://via.placeholder.com/300x200/374151/f97316?text=Насос+JCB",
            stock: 2,
            rating: 4.7,
            reviews: 3
        }
    ],
    cart: [],
    orders: [
        {
            id: 1,
            date: "2024-10-01",
            customer: "ООО Стройтехника",
            total: 97500,
            status: "Доставлен"
        },
        {
            id: 2,
            date: "2024-10-02", 
            customer: "ИП Иванов С.С.",
            total: 21000,
            status: "В обработке"
        }
    ],
    nextProductId: 6,
    nextOrderId: 3
};

// Загрузка данных из localStorage
function loadData() {
    const savedData = localStorage.getItem('nexxStoreData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Объединяем с дефолтными данными, сохраняя новые
            storeData = { ...storeData, ...parsedData };
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
    updateUI();
}

// Сохранение данных в localStorage
function saveData() {
    try {
        localStorage.setItem('nexxStoreData', JSON.stringify(storeData));
    } catch (e) {
        console.error('Ошибка сохранения данных:', e);
        alert('Ошибка сохранения данных!');
    }
}

// Управление страницами
function showPage(pageId) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Показываем нужную страницу
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        
        // Загружаем содержимое в зависимости от страницы
        if (pageId === 'catalog') {
            loadProducts();
        } else if (pageId === 'admin') {
            loadAdminData();
        }
    }
}

// Показать корзину
function showCart() {
    showPage('cart');
    loadCart();
}

// Показать админку
function showAdmin() {
    // Простая проверка доступа (в реальном приложении нужна полная аутентификация)
    const password = prompt('Введите пароль администратора:');
    if (password === 'Sashanata1/') {
        showPage('admin');
    } else {
        alert('Неверный пароль!');
    }
}

// Загрузка товаров в каталог
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    storeData.products.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg card-hover transition-all duration-300';
    
    card.innerHTML = `
        <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="absolute top-2 right-2">
                <span class="bg-green-500 text-white px-2 py-1 rounded text-xs">В наличии</span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-semibold mb-2 line-clamp-2">${product.name}</h3>
            <p class="text-gray-400 text-sm mb-2">Артикул: ${product.sku}</p>
            <p class="text-gray-300 text-sm mb-3 line-clamp-2">${product.description}</p>
            
            <div class="flex items-center mb-3">
                <div class="flex text-yellow-400">
                    ${generateStars(product.rating)}
                </div>
                <span class="text-gray-400 text-sm ml-2">(${product.reviews})</span>
            </div>
            
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-2xl font-bold text-orange">${formatPrice(product.price)} ₽</div>
                    <div class="text-gray-400 text-sm">Остаток: ${product.stock} шт</div>
                </div>
            </div>
            
            <button onclick="addToCart(${product.id})" 
                    class="w-full mt-4 bg-orange hover-orange py-2 px-4 rounded-lg transition-colors font-semibold">
                <i class="fas fa-shopping-cart mr-2"></i> В корзину
            </button>
        </div>
    `;
    
    return card;
}

// Генерация звездочек для рейтинга
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

// Добавление товара в корзину
function addToCart(productId) {
    const product = storeData.products.find(p => p.id === productId);
    if (!product) {
        alert('Товар не найден!');
        return;
    }
    
    const existingItem = storeData.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        storeData.cart.push({
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveData();
    
    // Показываем уведомление
    showNotification(`${product.name} добавлен в корзину!`, 'success');
}

// Обновление счетчика корзины
function updateCartCount() {
    const count = storeData.cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Загрузка корзины
function loadCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (storeData.cart.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center py-16">
                <i class="fas fa-shopping-cart text-6xl text-gray-600 mb-4"></i>
                <h2 class="text-2xl font-bold mb-4">Корзина пуста</h2>
                <p class="text-gray-400 mb-8">Добавьте товары из каталога</p>
                <button onclick="showPage('catalog')" class="bg-orange hover-orange px-6 py-3 rounded-lg font-semibold transition-colors">
                    Перейти в каталог
                </button>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let cartHTML = '<div class="space-y-4">';
    
    storeData.cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div>
                        <h3 class="font-semibold">${item.name}</h3>
                        <p class="text-gray-400">${formatPrice(item.price)} ₽ за шт</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <button onclick="updateCartQuantity(${index}, ${item.quantity - 1})" 
                                class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors">
                            <i class="fas fa-minus text-sm"></i>
                        </button>
                        <span class="w-12 text-center font-semibold">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${index}, ${item.quantity + 1})" 
                                class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors">
                            <i class="fas fa-plus text-sm"></i>
                        </button>
                    </div>
                    
                    <div class="text-lg font-bold text-orange w-24 text-right">
                        ${formatPrice(itemTotal)} ₽
                    </div>
                    
                    <button onclick="removeFromCart(${index})" 
                            class="text-red-400 hover:text-red-300 transition-colors">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        </div>
        
        <div class="mt-8 bg-gray-800 rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <span class="text-xl font-semibold">Итого:</span>
                <span class="text-2xl font-bold text-orange">${formatPrice(total)} ₽</span>
            </div>
            
            <div class="space-y-4">
                <button onclick="checkout()" 
                        class="w-full bg-orange hover-orange py-3 px-6 rounded-lg font-semibold text-lg transition-colors">
                    <i class="fas fa-credit-card mr-2"></i> Оформить заказ
                </button>
                
                <button onclick="clearCart()" 
                        class="w-full bg-gray-700 hover:bg-gray-600 py-2 px-6 rounded-lg transition-colors">
                    Очистить корзину
                </button>
            </div>
        </div>
    `;
    
    cartContent.innerHTML = cartHTML;
}

// Обновление количества товара в корзине
function updateCartQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    storeData.cart[index].quantity = newQuantity;
    updateCartCount();
    loadCart();
    saveData();
}

// Удаление товара из корзины
function removeFromCart(index) {
    storeData.cart.splice(index, 1);
    updateCartCount();
    loadCart();
    saveData();
    showNotification('Товар удален из корзины', 'info');
}

// Очистка корзины
function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        storeData.cart = [];
        updateCartCount();
        loadCart();
        saveData();
        showNotification('Корзина очищена', 'info');
    }
}

// Оформление заказа
function checkout() {
    if (storeData.cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    // Простое оформление заказа (в реальном приложении нужна полная форма)
    const customerName = prompt('Введите ваше имя:');
    const customerPhone = prompt('Введите ваш телефон:');
    
    if (customerName && customerPhone) {
        const total = storeData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const order = {
            id: storeData.nextOrderId++,
            date: new Date().toISOString().split('T')[0],
            customer: customerName,
            phone: customerPhone,
            items: [...storeData.cart],
            total: total,
            status: 'Новый'
        };
        
        storeData.orders.push(order);
        storeData.cart = [];
        
        updateCartCount();
        saveData();
        
        alert(`Заказ №${order.id} успешно оформлен!\nСумма: ${formatPrice(total)} ₽\nМы свяжемся с вами в ближайшее время.`);
        showPage('home');
    }
}

// Загрузка данных админки
function loadAdminData() {
    // Обновляем статистику
    document.getElementById('adminProductCount').textContent = storeData.products.length;
    document.getElementById('adminOrderCount').textContent = storeData.orders.length;
    
    // Загружаем таблицу товаров
    const table = document.getElementById('adminProductsTable');
    table.innerHTML = '';
    
    storeData.products.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-700';
        row.innerHTML = `
            <td class="py-3">${product.name}</td>
            <td class="py-3">${product.sku}</td>
            <td class="py-3">${formatPrice(product.price)} ₽</td>
            <td class="py-3">${product.stock}</td>
            <td class="py-3">
                <button onclick="editProduct(${product.id})" class="text-blue-400 hover:text-blue-300 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct(${product.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Показать модалку добавления товара
function showAddProductModal() {
    document.getElementById('addProductModal').classList.remove('hidden');
}

// Скрыть модалку добавления товара
function hideAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
    document.getElementById('addProductForm').reset();
}

// Добавление товара (из админки)
function addProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const product = {
        id: storeData.nextProductId++,
        name: formData.get('name'),
        description: formData.get('description') || '',
        sku: formData.get('sku'),
        brand: formData.get('brand'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        image: formData.get('image') || `https://via.placeholder.com/300x200/374151/f97316?text=${encodeURIComponent(formData.get('name'))}`,
        stock: parseInt(formData.get('stock')),
        rating: 0,
        reviews: 0
    };
    
    storeData.products.push(product);
    saveData();
    loadAdminData();
    hideAddProductModal();
    
    showNotification('Товар успешно добавлен!', 'success');
}

// Удаление товара
function deleteProduct(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        storeData.products = storeData.products.filter(p => p.id !== productId);
        saveData();
        loadAdminData();
        showNotification('Товар удален', 'info');
    }
}

// Редактирование товара (упрощенная версия)
function editProduct(productId) {
    const product = storeData.products.find(p => p.id === productId);
    if (!product) return;
    
    const newPrice = prompt(`Введите новую цену для "${product.name}":`, product.price);
    const newStock = prompt(`Введите новое количество на складе:`, product.stock);
    
    if (newPrice !== null && newStock !== null) {
        product.price = parseFloat(newPrice) || product.price;
        product.stock = parseInt(newStock) || product.stock;
        
        saveData();
        loadAdminData();
        showNotification('Товар обновлен!', 'success');
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-semibold transform transition-all duration-300 translate-x-full`;
    
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500');
            break;
        case 'error':
            notification.classList.add('bg-red-500');
            break;
        default:
            notification.classList.add('bg-blue-500');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Обновление интерфейса
function updateUI() {
    updateCartCount();
    
    // Если мы на странице каталога, обновляем товары
    if (!document.getElementById('catalogPage').classList.contains('hidden')) {
        loadProducts();
    }
    
    // Если мы в админке, обновляем данные
    if (!document.getElementById('adminPage').classList.contains('hidden')) {
        loadAdminData();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    showPage('home');
    
    // Добавляем обработчик для ESC в модалках
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAddProductModal();
        }
    });
});

// Автосохранение каждые 30 секунд
setInterval(saveData, 30000);