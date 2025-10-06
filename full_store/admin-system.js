// NEXX Store - Административная система
// Полная панель управления интернет-магазином

class AdminSystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.initializeAdminData();
    }

    initializeAdminData() {
        this.adminSections = {
            dashboard: {
                name: 'Дашборд',
                icon: 'fas fa-tachometer-alt',
                permissions: ['dashboard.view']
            },
            users: {
                name: 'Пользователи',
                icon: 'fas fa-users',
                permissions: ['users.manage', 'users.view']
            },
            products: {
                name: 'Товары',
                icon: 'fas fa-box',
                permissions: ['products.manage']
            },
            orders: {
                name: 'Заказы',
                icon: 'fas fa-shopping-bag',
                permissions: ['orders.manage', 'orders.view']
            },
            suppliers: {
                name: 'Поставщики',
                icon: 'fas fa-truck',
                permissions: ['suppliers.manage']
            },
            payments: {
                name: 'Платежные системы',
                icon: 'fas fa-credit-card',
                permissions: ['payments.manage']
            },
            delivery: {
                name: 'Доставка',
                icon: 'fas fa-shipping-fast',
                permissions: ['delivery.manage']
            },
            staff: {
                name: 'Персонал',
                icon: 'fas fa-user-tie',
                permissions: ['staff.manage']
            },
            pages: {
                name: 'Страницы сайта',
                icon: 'fas fa-file-alt',
                permissions: ['pages.manage']
            },
            settings: {
                name: 'Настройки',
                icon: 'fas fa-cog',
                permissions: ['settings.manage']
            },
            analytics: {
                name: 'Аналитика',
                icon: 'fas fa-chart-bar',
                permissions: ['analytics.view']
            }
        };
    }

    // Показать админ панель
    show() {
        if (!window.authSystem.isAuthenticated()) {
            showNotification('Необходимо войти в систему', 'error');
            showAuthModal('login');
            return;
        }

        if (!window.authSystem.hasPermission('dashboard.view')) {
            showNotification('Нет прав доступа к панели управления', 'error');
            return;
        }

        // Скрываем обычные страницы
        document.getElementById('regularPages').classList.add('hidden');
        document.getElementById('profilePanel').classList.add('hidden');
        
        // Показываем админ панель
        document.getElementById('adminPanel').classList.remove('hidden');
        
        this.renderNavigation();
        this.showSection('dashboard');
    }

    // Выход из админ панели
    exit() {
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('regularPages').classList.remove('hidden');
        showPage('home');
    }

    // Отрисовка навигации админки
    renderNavigation() {
        const nav = document.getElementById('adminNavigation');
        nav.innerHTML = '';

        Object.entries(this.adminSections).forEach(([key, section]) => {
            // Проверяем права доступа
            if (!section.permissions.some(perm => window.authSystem.hasPermission(perm))) {
                return;
            }

            const navItem = document.createElement('button');
            navItem.className = `w-full text-left px-4 py-3 rounded-lg transition-colors ${
                this.currentSection === key 
                    ? 'bg-primary text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`;
            
            navItem.innerHTML = `
                <i class="${section.icon} mr-3"></i>
                ${section.name}
            `;
            
            navItem.onclick = () => this.showSection(key);
            nav.appendChild(navItem);
        });
    }

    // Показать секцию админки
    showSection(sectionName) {
        this.currentSection = sectionName;
        this.renderNavigation();

        const content = document.getElementById('adminContent');
        
        switch(sectionName) {
            case 'dashboard':
                content.innerHTML = this.renderDashboard();
                break;
            case 'users':
                content.innerHTML = this.renderUsers();
                break;
            case 'products':
                content.innerHTML = this.renderProducts();
                break;
            case 'orders':
                content.innerHTML = this.renderOrders();
                break;
            case 'suppliers':
                content.innerHTML = this.renderSuppliers();
                break;
            case 'payments':
                content.innerHTML = this.renderPayments();
                break;
            case 'delivery':
                content.innerHTML = this.renderDelivery();
                break;
            case 'staff':
                content.innerHTML = this.renderStaff();
                break;
            case 'pages':
                content.innerHTML = this.renderPages();
                break;
            case 'settings':
                content.innerHTML = this.renderSettings();
                break;
            case 'analytics':
                content.innerHTML = this.renderAnalytics();
                break;
        }
    }

    // Дашборд
    renderDashboard() {
        const stats = window.storeDB.getStats();
        
        return `
            <div>
                <h1 class="text-3xl font-bold mb-8">Дашборд</h1>
                
                <!-- Основная статистика -->
                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gray-800 rounded-lg p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Выручка за месяц</p>
                                <p class="text-2xl font-bold text-green-400">${this.formatPrice(stats.revenueThisMonth)} ₽</p>
                            </div>
                            <i class="fas fa-ruble-sign text-3xl text-green-400"></i>
                        </div>
                    </div>
                    
                    <div class="bg-gray-800 rounded-lg p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Заказов за месяц</p>
                                <p class="text-2xl font-bold text-blue-400">${stats.ordersThisMonth}</p>
                            </div>
                            <i class="fas fa-shopping-cart text-3xl text-blue-400"></i>
                        </div>
                    </div>
                    
                    <div class="bg-gray-800 rounded-lg p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Всего пользователей</p>
                                <p class="text-2xl font-bold text-purple-400">${stats.totalUsers}</p>
                            </div>
                            <i class="fas fa-users text-3xl text-purple-400"></i>
                        </div>
                    </div>
                    
                    <div class="bg-gray-800 rounded-lg p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm">Товаров в каталоге</p>
                                <p class="text-2xl font-bold text-yellow-400">${stats.totalProducts}</p>
                            </div>
                            <i class="fas fa-box text-3xl text-yellow-400"></i>
                        </div>
                    </div>
                </div>

                <!-- Предупреждения -->
                ${stats.lowStock > 0 ? `
                <div class="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-8">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-triangle text-yellow-400 text-xl mr-3"></i>
                        <div>
                            <h3 class="text-yellow-400 font-semibold">Внимание!</h3>
                            <p class="text-gray-300">${stats.lowStock} товаров заканчивается на складе</p>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Последние заказы -->
                <div class="bg-gray-800 rounded-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Последние заказы</h2>
                        <button onclick="window.adminSystem.showSection('orders')" class="text-primary hover:underline">
                            Все заказы
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-700 text-left">
                                    <th class="pb-2">№ заказа</th>
                                    <th class="pb-2">Клиент</th>
                                    <th class="pb-2">Сумма</th>
                                    <th class="pb-2">Статус</th>
                                    <th class="pb-2">Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderRecentOrders()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Пользователи
    renderUsers() {
        const users = window.storeDB.getUsers().filter(u => u.role !== 'admin');
        
        return `
            <div>
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Управление пользователями</h1>
                    <button onclick="showAddUserModal()" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Добавить пользователя
                    </button>
                </div>

                <!-- Статистика пользователей -->
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Физические лица</h3>
                        <div class="text-3xl font-bold text-blue-400">
                            ${users.filter(u => u.profileType === 'individual').length}
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Юридические лица</h3>
                        <div class="text-3xl font-bold text-green-400">
                            ${users.filter(u => u.profileType === 'legal').length}
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Активные</h3>
                        <div class="text-3xl font-bold text-purple-400">
                            ${users.filter(u => u.isActive).length}
                        </div>
                    </div>
                </div>

                <!-- Таблица пользователей -->
                <div class="bg-gray-800 rounded-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Список пользователей</h2>
                        <div class="flex space-x-2">
                            <input type="text" placeholder="Поиск пользователей..." 
                                   class="bg-gray-700 border border-gray-600 rounded px-3 py-2"
                                   onkeyup="filterUsers(this.value)">
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-700 text-left">
                                    <th class="pb-2">Пользователь</th>
                                    <th class="pb-2">Тип</th>
                                    <th class="pb-2">Контакты</th>
                                    <th class="pb-2">Баланс</th>
                                    <th class="pb-2">Заказов</th>
                                    <th class="pb-2">Статус</th>
                                    <th class="pb-2">Действия</th>
                                </tr>
                            </thead>
                            <tbody id="usersTableBody">
                                ${this.renderUsersTable(users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderUsersTable(users) {
        return users.map(user => {
            const userOrders = window.storeDB.getOrders().filter(o => o.userId == user.id);
            const displayName = user.profileType === 'legal' 
                ? user.profile?.companyName || 'Не указано'
                : user.profile?.fullName || 'Не указано';

            return `
                <tr class="border-b border-gray-700">
                    <td class="py-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                ${displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div class="font-semibold">${displayName}</div>
                                <div class="text-gray-400 text-sm">ID: ${user.id}</div>
                            </div>
                        </div>
                    </td>
                    <td class="py-4">
                        <span class="px-2 py-1 rounded text-xs ${
                            user.profileType === 'legal' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        }">
                            ${user.profileType === 'legal' ? 'Юр. лицо' : 'Физ. лицо'}
                        </span>
                    </td>
                    <td class="py-4">
                        <div class="text-sm">
                            <div>${user.email}</div>
                            <div class="text-gray-400">${user.phone}</div>
                        </div>
                    </td>
                    <td class="py-4">
                        <div class="text-sm">
                            <div class="font-semibold">${this.formatPrice(user.account?.balance || 0)} ₽</div>
                            <div class="text-gray-400">${user.account?.bonusPoints || 0} баллов</div>
                        </div>
                    </td>
                    <td class="py-4">
                        <span class="font-semibold">${userOrders.length}</span>
                    </td>
                    <td class="py-4">
                        <span class="px-2 py-1 rounded text-xs ${
                            user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }">
                            ${user.isActive ? 'Активен' : 'Заблокирован'}
                        </span>
                    </td>
                    <td class="py-4">
                        <div class="flex space-x-2">
                            <button onclick="viewUserDetails(${user.id})" class="text-blue-400 hover:text-blue-300">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button onclick="editUser(${user.id})" class="text-yellow-400 hover:text-yellow-300">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="toggleUserStatus(${user.id})" class="text-${user.isActive ? 'red' : 'green'}-400">
                                <i class="fas fa-${user.isActive ? 'ban' : 'check'}"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Управление товарами
    renderProducts() {
        const products = window.storeDB.getProducts();
        
        return `
            <div>
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Управление товарами</h1>
                    <button onclick="showAddProductModal()" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Добавить товар
                    </button>
                </div>

                <!-- Статистика товаров -->
                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Всего товаров</h3>
                        <div class="text-3xl font-bold text-primary">${products.length}</div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Заканчивается</h3>
                        <div class="text-3xl font-bold text-yellow-400">
                            ${products.filter(p => p.stock <= p.minStock).length}
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Средняя цена</h3>
                        <div class="text-3xl font-bold text-blue-400">
                            ${this.formatPrice(products.reduce((sum, p) => sum + p.price, 0) / products.length)} ₽
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Категорий</h3>
                        <div class="text-3xl font-bold text-purple-400">
                            ${window.storeDB.data.categories.length}
                        </div>
                    </div>
                </div>

                <!-- Таблица товаров -->
                <div class="bg-gray-800 rounded-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Каталог товаров (${products.length})</h2>
                        <div class="flex space-x-2">
                            <select class="bg-gray-700 border border-gray-600 rounded px-3 py-2" onchange="filterProductsByCategory(this.value)">
                                <option value="">Все категории</option>
                                ${window.storeDB.data.categories.map(cat => 
                                    `<option value="${cat.name}">${cat.name}</option>`
                                ).join('')}
                            </select>
                            <input type="text" placeholder="Поиск товаров..." 
                                   class="bg-gray-700 border border-gray-600 rounded px-3 py-2"
                                   onkeyup="filterProducts(this.value)">
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-700 text-left">
                                    <th class="pb-2">Товар</th>
                                    <th class="pb-2">Артикул</th>
                                    <th class="pb-2">Цена</th>
                                    <th class="pb-2">Остаток</th>
                                    <th class="pb-2">Категория</th>
                                    <th class="pb-2">Рейтинг</th>
                                    <th class="pb-2">Действия</th>
                                </tr>
                            </thead>
                            <tbody id="productsTableBody">
                                ${this.renderProductsTable(products)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductsTable(products) {
        return products.map(product => `
            <tr class="border-b border-gray-700">
                <td class="py-4">
                    <div class="flex items-center space-x-3">
                        <img src="${product.images[0]}" alt="${product.name}" class="w-12 h-12 object-cover rounded">
                        <div>
                            <div class="font-semibold line-clamp-1">${product.name}</div>
                            <div class="text-gray-400 text-sm">${product.brand}</div>
                        </div>
                    </div>
                </td>
                <td class="py-4 font-mono text-sm">${product.sku}</td>
                <td class="py-4">
                    <div class="font-semibold">${this.formatPrice(product.price)} ₽</div>
                    <div class="text-gray-400 text-xs">Опт: ${this.formatPrice(product.wholesalePrice)} ₽</div>
                </td>
                <td class="py-4">
                    <div class="font-semibold ${product.stock <= product.minStock ? 'text-yellow-400' : ''}">${product.stock} шт</div>
                    <div class="text-gray-400 text-xs">Мин: ${product.minStock}</div>
                </td>
                <td class="py-4">
                    <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">${product.category}</span>
                </td>
                <td class="py-4">
                    <div class="flex items-center">
                        <span class="text-yellow-400 mr-1">★</span>
                        <span>${product.rating}</span>
                        <span class="text-gray-400 text-sm ml-1">(${product.reviews})</span>
                    </div>
                </td>
                <td class="py-4">
                    <div class="flex space-x-2">
                        <button onclick="viewProduct(${product.id})" class="text-blue-400 hover:text-blue-300">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editProduct(${product.id})" class="text-yellow-400 hover:text-yellow-300">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProduct(${product.id})" class="text-red-400 hover:text-red-300">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Управление заказами  
    renderOrders() {
        const orders = window.storeDB.getOrders().sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        return `
            <div>
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Управление заказами</h1>
                    <div class="flex space-x-2">
                        <select class="bg-gray-700 border border-gray-600 rounded px-3 py-2" onchange="filterOrdersByStatus(this.value)">
                            <option value="">Все статусы</option>
                            <option value="pending">Ожидает</option>
                            <option value="processing">В обработке</option>
                            <option value="shipped">Отправлен</option>
                            <option value="delivered">Доставлен</option>
                            <option value="completed">Завершен</option>
                            <option value="cancelled">Отменен</option>
                        </select>
                    </div>
                </div>

                <!-- Статистика заказов -->
                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Всего заказов</h3>
                        <div class="text-3xl font-bold text-primary">${orders.length}</div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">В обработке</h3>
                        <div class="text-3xl font-bold text-yellow-400">
                            ${orders.filter(o => ['pending', 'processing'].includes(o.status)).length}
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Завершенных</h3>
                        <div class="text-3xl font-bold text-green-400">
                            ${orders.filter(o => o.status === 'completed').length}
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-2">Общая сумма</h3>
                        <div class="text-3xl font-bold text-blue-400">
                            ${this.formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0))} ₽
                        </div>
                    </div>
                </div>

                <!-- Таблица заказов -->
                <div class="bg-gray-800 rounded-lg p-6">
                    <h2 class="text-xl font-semibold mb-6">Список заказов</h2>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-700 text-left">
                                    <th class="pb-2">№ заказа</th>
                                    <th class="pb-2">Клиент</th>
                                    <th class="pb-2">Товаров</th>
                                    <th class="pb-2">Сумма</th>
                                    <th class="pb-2">Статус</th>
                                    <th class="pb-2">Оплата</th>
                                    <th class="pb-2">Дата</th>
                                    <th class="pb-2">Действия</th>
                                </tr>
                            </thead>
                            <tbody id="ordersTableBody">
                                ${this.renderOrdersTable(orders)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrdersTable(orders) {
        return orders.map(order => `
            <tr class="border-b border-gray-700">
                <td class="py-4">
                    <div class="font-mono font-semibold">${order.orderNumber}</div>
                </td>
                <td class="py-4">
                    <div class="font-semibold">${order.customerName}</div>
                    <div class="text-gray-400 text-sm">${order.customerPhone}</div>
                </td>
                <td class="py-4">
                    <span class="font-semibold">${order.items?.length || 0}</span>
                </td>
                <td class="py-4">
                    <div class="font-semibold">${this.formatPrice(order.totalAmount)} ₽</div>
                </td>
                <td class="py-4">
                    <select onchange="updateOrderStatus(${order.id}, this.value)" 
                            class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Ожидает</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>В обработке</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Отправлен</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Доставлен</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Завершен</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Отменен</option>
                    </select>
                </td>
                <td class="py-4">
                    <span class="px-2 py-1 rounded text-xs ${
                        order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }">
                        ${order.paymentStatus === 'paid' ? 'Оплачен' : 'Ожидает'}
                    </span>
                </td>
                <td class="py-4">
                    <div class="text-sm">${new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                </td>
                <td class="py-4">
                    <div class="flex space-x-2">
                        <button onclick="viewOrderDetails(${order.id})" class="text-blue-400 hover:text-blue-300">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="printOrder(${order.id})" class="text-green-400 hover:text-green-300">
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Управление поставщиками
    renderSuppliers() {
        const suppliers = window.storeDB.data.suppliers;
        
        return `
            <div>
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Управление поставщиками</h1>
                    <button onclick="showAddSupplierModal()" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Добавить поставщика
                    </button>
                </div>

                <div class="grid gap-6">
                    ${suppliers.map(supplier => `
                        <div class="bg-gray-800 rounded-lg p-6">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <h3 class="text-xl font-semibold mb-2">${supplier.name}</h3>
                                    <p class="text-gray-400 mb-4">${supplier.description}</p>
                                    
                                    <div class="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <div class="text-sm text-gray-400">API URL:</div>
                                            <div class="font-mono text-sm bg-gray-700 px-2 py-1 rounded">${supplier.apiUrl}</div>
                                        </div>
                                        <div>
                                            <div class="text-sm text-gray-400">Тип API:</div>
                                            <div class="text-sm">${supplier.apiType.toUpperCase()}</div>
                                        </div>
                                        <div>
                                            <div class="text-sm text-gray-400">Наценка:</div>
                                            <div class="text-sm">${supplier.priceMarkup}%</div>
                                        </div>
                                        <div>
                                            <div class="text-sm text-gray-400">Доставка:</div>
                                            <div class="text-sm">${supplier.deliveryDays} дня</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex flex-col space-y-2">
                                    <span class="px-3 py-1 rounded text-xs ${
                                        supplier.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }">
                                        ${supplier.status === 'active' ? 'Активен' : 'Неактивен'}
                                    </span>
                                    
                                    <button onclick="testSupplierConnection(${supplier.id})" class="text-blue-400 hover:text-blue-300 text-sm">
                                        <i class="fas fa-plug mr-1"></i>Тест
                                    </button>
                                    <button onclick="editSupplier(${supplier.id})" class="text-yellow-400 hover:text-yellow-300 text-sm">
                                        <i class="fas fa-edit mr-1"></i>Изменить
                                    </button>
                                    <button onclick="deleteSupplier(${supplier.id})" class="text-red-400 hover:text-red-300 text-sm">
                                        <i class="fas fa-trash mr-1"></i>Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Управление платежными системами
    renderPayments() {
        const methods = window.storeDB.data.paymentMethods;
        
        return `
            <div>
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Платежные системы</h1>
                    <button onclick="showAddPaymentModal()" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Добавить метод оплаты
                    </button>
                </div>

                <div class="grid gap-6">
                    ${methods.map(method => `
                        <div class="bg-gray-800 rounded-lg p-6">
                            <div class="flex justify-between items-start">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                                        <i class="fas fa-${this.getPaymentIcon(method.type)} text-white"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-semibold">${method.name}</h3>
                                        <p class="text-gray-400">Провайдер: ${method.provider}</p>
                                        <p class="text-sm text-gray-500">Тип: ${method.type}</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center space-x-4">
                                    <span class="px-3 py-1 rounded text-xs ${
                                        method.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }">
                                        ${method.isActive ? 'Активен' : 'Отключен'}
                                    </span>
                                    
                                    <div class="flex space-x-2">
                                        <button onclick="togglePaymentMethod(${method.id})" class="text-${method.isActive ? 'red' : 'green'}-400 hover:text-${method.isActive ? 'red' : 'green'}-300">
                                            <i class="fas fa-power-off"></i>
                                        </button>
                                        <button onclick="editPaymentMethod(${method.id})" class="text-yellow-400 hover:text-yellow-300">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deletePaymentMethod(${method.id})" class="text-red-400 hover:text-red-300">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Настройки системы
    renderSettings() {
        const config = window.storeDB.getConfig();
        
        return `
            <div>
                <h1 class="text-3xl font-bold mb-8">Настройки системы</h1>
                
                <!-- Вкладки настроек -->
                <div class="bg-gray-800 rounded-lg">
                    <div class="flex border-b border-gray-700">
                        <button onclick="showSettingsTab('general')" class="px-6 py-4 border-b-2 border-primary text-primary">
                            Основные
                        </button>
                        <button onclick="showSettingsTab('company')" class="px-6 py-4 text-gray-400 hover:text-white">
                            Компания
                        </button>
                        <button onclick="showSettingsTab('design')" class="px-6 py-4 text-gray-400 hover:text-white">
                            Дизайн
                        </button>
                        <button onclick="showSettingsTab('seo')" class="px-6 py-4 text-gray-400 hover:text-white">
                            SEO
                        </button>
                    </div>
                    
                    <div class="p-6">
                        <!-- Основные настройки -->
                        <div id="generalSettings" class="settings-tab">
                            <form onsubmit="saveGeneralSettings(event)">
                                <div class="grid md:grid-cols-2 gap-6">
                                    <div class="form-group">
                                        <label class="form-label">Название сайта</label>
                                        <input type="text" name="siteName" value="${config.siteName}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Описание сайта</label>
                                        <input type="text" name="siteDescription" value="${config.siteDescription}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Телефон</label>
                                        <input type="tel" name="companyPhone" value="${config.companyPhone}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Email</label>
                                        <input type="email" name="companyEmail" value="${config.companyEmail}" class="form-input">
                                    </div>
                                </div>
                                
                                <button type="submit" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors mt-4">
                                    Сохранить изменения
                                </button>
                            </form>
                        </div>

                        <!-- Настройки компании -->
                        <div id="companySettings" class="settings-tab hidden">
                            <form onsubmit="saveCompanySettings(event)">
                                <div class="grid md:grid-cols-2 gap-6">
                                    <div class="form-group">
                                        <label class="form-label">Название компании</label>
                                        <input type="text" name="companyName" value="${config.companyName}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Адрес</label>
                                        <input type="text" name="companyAddress" value="${config.companyAddress}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">ИНН</label>
                                        <input type="text" name="inn" value="${config.inn}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">КПП</label>
                                        <input type="text" name="kpp" value="${config.kpp}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">ОГРН</label>
                                        <input type="text" name="ogrn" value="${config.ogrn}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Название банка</label>
                                        <input type="text" name="bankName" value="${config.bankName}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">БИК</label>
                                        <input type="text" name="bik" value="${config.bik}" class="form-input">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Расчетный счет</label>
                                        <input type="text" name="accountNumber" value="${config.accountNumber}" class="form-input">
                                    </div>
                                </div>
                                
                                <button type="submit" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors mt-4">
                                    Сохранить реквизиты
                                </button>
                            </form>
                        </div>

                        <!-- Настройки дизайна -->
                        <div id="designSettings" class="settings-tab hidden">
                            <form onsubmit="saveDesignSettings(event)">
                                <div class="grid md:grid-cols-3 gap-6">
                                    <div class="form-group">
                                        <label class="form-label">Основной цвет</label>
                                        <input type="color" name="primaryColor" value="${config.theme.primaryColor}" class="form-input h-12">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Вторичный цвет</label>
                                        <input type="color" name="secondaryColor" value="${config.theme.secondaryColor}" class="form-input h-12">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Акцентный цвет</label>
                                        <input type="color" name="accentColor" value="${config.theme.accentColor}" class="form-input h-12">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Логотип (URL изображения)</label>
                                    <input type="url" name="logoUrl" placeholder="https://example.com/logo.png" class="form-input">
                                </div>
                                
                                <button type="submit" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors mt-4">
                                    Применить дизайн
                                </button>
                            </form>
                        </div>

                        <!-- SEO настройки -->
                        <div id="seoSettings" class="settings-tab hidden">
                            <form onsubmit="saveSeoSettings(event)">
                                <div class="form-group">
                                    <label class="form-label">Ключевые слова</label>
                                    <input type="text" name="keywords" value="${config.seo.keywords}" class="form-input"
                                           placeholder="запчасти JCB, оригинальные запчасти, спецтехника">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Описание для поисковиков</label>
                                    <textarea name="description" class="form-input" rows="3"
                                              placeholder="Краткое описание вашего магазина для Google">${config.seo.description}</textarea>
                                </div>
                                
                                <button type="submit" class="bg-primary hover-primary px-4 py-2 rounded-lg transition-colors mt-4">
                                    Сохранить SEO
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Вспомогательные методы
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }

    getPaymentIcon(type) {
        const icons = {
            'card': 'credit-card',
            'yandex': 'money-bill',
            'sberbank': 'university',
            'cash': 'hand-holding-usd',
            'transfer': 'exchange-alt'
        };
        return icons[type] || 'credit-card';
    }

    renderRecentOrders() {
        const recentOrders = window.storeDB.getOrders()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (recentOrders.length === 0) {
            return `
                <tr>
                    <td colspan="5" class="py-8 text-center text-gray-400">
                        Заказов пока нет
                    </td>
                </tr>
            `;
        }

        return recentOrders.map(order => `
            <tr class="border-b border-gray-700">
                <td class="py-3 font-mono">${order.orderNumber}</td>
                <td class="py-3">${order.customerName}</td>
                <td class="py-3 font-semibold">${this.formatPrice(order.totalAmount)} ₽</td>
                <td class="py-3">
                    <span class="px-2 py-1 rounded text-xs ${this.getStatusColor(order.status)}">
                        ${this.getStatusText(order.status)}
                    </span>
                </td>
                <td class="py-3 text-sm">${new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
            </tr>
        `).join('');
    }

    getStatusColor(status) {
        const colors = {
            'pending': 'bg-yellow-500/20 text-yellow-400',
            'processing': 'bg-blue-500/20 text-blue-400',
            'shipped': 'bg-purple-500/20 text-purple-400',
            'delivered': 'bg-green-500/20 text-green-400',
            'completed': 'bg-green-500/20 text-green-400',
            'cancelled': 'bg-red-500/20 text-red-400'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400';
    }

    getStatusText(status) {
        const texts = {
            'pending': 'Ожидает',
            'processing': 'В обработке',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'completed': 'Завершен',
            'cancelled': 'Отменен'
        };
        return texts[status] || 'Неизвестно';
    }
}

// Глобальные функции для админки
function showAdmin() {
    window.adminSystem.show();
}

function exitAdmin() {
    window.adminSystem.exit();
}

// Функции для настроек
function showSettingsTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Показываем нужную вкладку
    document.getElementById(tabName + 'Settings').classList.remove('hidden');
    
    // Обновляем активную кнопку
    event.target.parentElement.querySelectorAll('button').forEach(btn => {
        btn.className = 'px-6 py-4 text-gray-400 hover:text-white';
    });
    event.target.className = 'px-6 py-4 border-b-2 border-primary text-primary';
}

// Сохранение настроек
function saveGeneralSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const updates = {
        siteName: formData.get('siteName'),
        siteDescription: formData.get('siteDescription'),
        companyPhone: formData.get('companyPhone'),
        companyEmail: formData.get('companyEmail')
    };
    
    window.storeDB.updateConfig(updates);
    showNotification('Основные настройки сохранены', 'success');
    
    // Обновляем интерфейс
    document.getElementById('siteLogo').textContent = updates.siteName;
    document.getElementById('companyPhone').textContent = updates.companyPhone;
    document.getElementById('companyEmail').textContent = updates.companyEmail;
}

function saveCompanySettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const updates = {
        companyName: formData.get('companyName'),
        companyAddress: formData.get('companyAddress'),
        inn: formData.get('inn'),
        kpp: formData.get('kpp'),
        ogrn: formData.get('ogrn'),
        bankName: formData.get('bankName'),
        bik: formData.get('bik'),
        accountNumber: formData.get('accountNumber')
    };
    
    window.storeDB.updateConfig(updates);
    showNotification('Реквизиты компании сохранены', 'success');
}

function saveDesignSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const themeUpdates = {
        theme: {
            primaryColor: formData.get('primaryColor'),
            secondaryColor: formData.get('secondaryColor'), 
            accentColor: formData.get('accentColor')
        }
    };
    
    window.storeDB.updateConfig(themeUpdates);
    
    // Применяем новые цвета
    document.documentElement.style.setProperty('--primary-color', formData.get('primaryColor'));
    document.documentElement.style.setProperty('--secondary-color', formData.get('secondaryColor'));
    document.documentElement.style.setProperty('--accent-color', formData.get('accentColor'));
    
    showNotification('Дизайн обновлен', 'success');
}

function saveSeoSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const seoUpdates = {
        seo: {
            keywords: formData.get('keywords'),
            description: formData.get('description')
        }
    };
    
    window.storeDB.updateConfig(seoUpdates);
    
    // Обновляем мета-теги
    document.querySelector('meta[name="keywords"]').content = formData.get('keywords');
    document.querySelector('meta[name="description"]').content = formData.get('description');
    
    showNotification('SEO настройки сохранены', 'success');
}

// Управление товарами из админки
function showAddProductModal() {
    const modal = document.createElement('div');
    modal.id = 'productModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-8 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Добавить товар</h2>
                <button onclick="hideProductModal()" class="text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form onsubmit="addProductFromAdmin(event)">
                <div class="grid md:grid-cols-2 gap-6 mb-4">
                    <div class="form-group">
                        <label class="form-label">Название товара</label>
                        <input type="text" name="name" required class="form-input" placeholder="Название товара">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Артикул</label>
                        <input type="text" name="sku" required class="form-input" placeholder="12/345678">
                    </div>
                </div>
                
                <div class="form-group mb-4">
                    <label class="form-label">Описание</label>
                    <textarea name="description" class="form-input" rows="3" placeholder="Подробное описание товара"></textarea>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6 mb-4">
                    <div class="form-group">
                        <label class="form-label">Бренд</label>
                        <input type="text" name="brand" required class="form-input" placeholder="JCB">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Категория</label>
                        <select name="category" required class="form-input">
                            <option value="">Выберите категорию</option>
                            ${window.storeDB.data.categories.map(cat => 
                                `<option value="${cat.name}">${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Вес (кг)</label>
                        <input type="number" step="0.1" name="weight" class="form-input" placeholder="2.5">
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-4">
                    <div class="form-group">
                        <label class="form-label">Розничная цена (₽)</label>
                        <input type="number" name="price" required class="form-input" placeholder="10000">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Оптовая цена (₽)</label>
                        <input type="number" name="wholesalePrice" class="form-input" placeholder="8500">
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-4">
                    <div class="form-group">
                        <label class="form-label">Количество на складе</label>
                        <input type="number" name="stock" required class="form-input" placeholder="10">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Минимальный остаток</label>
                        <input type="number" name="minStock" class="form-input" placeholder="3">
                    </div>
                </div>
                
                <div class="form-group mb-6">
                    <label class="form-label">URL изображений (по одному на строку)</label>
                    <textarea name="images" class="form-input" rows="3" 
                              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
                </div>
                
                <div class="flex justify-end space-x-4">
                    <button type="button" onclick="hideProductModal()" 
                            class="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                        Отмена
                    </button>
                    <button type="submit" class="bg-primary hover-primary px-6 py-2 rounded-lg transition-colors">
                        Добавить товар
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function hideProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
}

function addProductFromAdmin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const productData = {
        name: formData.get('name'),
        description: formData.get('description') || '',
        sku: formData.get('sku'),
        brand: formData.get('brand'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        wholesalePrice: parseFloat(formData.get('wholesalePrice')) || parseFloat(formData.get('price')) * 0.85,
        stock: parseInt(formData.get('stock')),
        minStock: parseInt(formData.get('minStock')) || 1,
        weight: parseFloat(formData.get('weight')) || 0,
        images: formData.get('images').split('\n').filter(url => url.trim()).map(url => url.trim()),
        rating: 0,
        reviews: 0,
        tags: [formData.get('brand').toLowerCase(), formData.get('category').toLowerCase()]
    };
    
    // Добавляем изображение по умолчанию если не указано
    if (productData.images.length === 0) {
        productData.images = [`https://via.placeholder.com/400x300/374151/f97316?text=${encodeURIComponent(productData.name)}`];
    }
    
    const newProduct = window.storeDB.addProduct(productData);
    
    if (newProduct) {
        hideProductModal();
        showNotification('Товар успешно добавлен!', 'success');
        
        // Обновляем интерфейс
        if (window.adminSystem.currentSection === 'products') {
            window.adminSystem.showSection('products');
        }
    } else {
        showNotification('Ошибка при добавлении товара', 'error');
    }
}

// Удаление товара
function deleteProduct(productId) {
    const product = window.storeDB.getProductById(productId);
    
    if (confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
        window.storeDB.deleteProduct(productId);
        showNotification('Товар удален', 'info');
        
        if (window.adminSystem.currentSection === 'products') {
            window.adminSystem.showSection('products');
        }
    }
}

// Обновление статуса заказа
function updateOrderStatus(orderId, newStatus) {
    window.storeDB.updateOrder(orderId, { status: newStatus });
    showNotification('Статус заказа обновлен', 'success');
}

// Инициализация админ системы
window.adminSystem = new AdminSystem();