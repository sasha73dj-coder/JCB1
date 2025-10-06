// NEXX Store - Система аутентификации и авторизации
// Полная система управления пользователями с ролями и правами

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Загрузка текущего пользователя
    loadCurrentUser() {
        const savedUser = localStorage.getItem('nexxCurrentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateUI();
            } catch (e) {
                console.error('Ошибка загрузки пользователя:', e);
            }
        }
    }

    // Сохранение текущего пользователя
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('nexxCurrentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('nexxCurrentUser');
        }
    }

    // Вход в систему
    login(login, password) {
        // Поиск пользователя по email или телефону
        const user = window.storeDB.data.users.find(u => 
            (u.email === login || u.phone === login) && u.isActive
        );

        if (!user) {
            return { success: false, error: 'Пользователь не найден' };
        }

        if (user.password !== password) {
            return { success: false, error: 'Неверный пароль' };
        }

        // Успешный вход
        this.currentUser = { ...user };
        delete this.currentUser.password; // Убираем пароль из сессии
        this.saveCurrentUser();
        this.updateUI();

        return { 
            success: true, 
            user: this.currentUser,
            redirectTo: user.role === 'admin' ? 'admin' : 'profile'
        };
    }

    // Регистрация нового пользователя
    register(userData) {
        // Проверка существования пользователя
        const existingEmail = window.storeDB.getUserByEmail(userData.email);
        const existingPhone = window.storeDB.getUserByPhone(userData.phone);

        if (existingEmail) {
            return { success: false, error: 'Пользователь с таким email уже существует' };
        }

        if (existingPhone) {
            return { success: false, error: 'Пользователь с таким телефоном уже существует' };
        }

        // Создание нового пользователя
        const newUser = {
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            role: 'user',
            profileType: userData.profileType || 'individual',
            profile: this.createUserProfile(userData),
            account: {
                balance: 0,
                bonusPoints: 0,
                creditLimit: userData.profileType === 'legal' ? 100000 : 10000
            },
            permissions: ["profile.view", "orders.view", "cart.manage"]
        };

        const savedUser = window.storeDB.addUser(newUser);
        
        // Автоматический вход после регистрации
        this.currentUser = { ...savedUser };
        delete this.currentUser.password;
        this.saveCurrentUser();
        this.updateUI();

        return { success: true, user: this.currentUser };
    }

    // Создание профиля пользователя
    createUserProfile(userData) {
        if (userData.profileType === 'legal') {
            return {
                companyName: userData.companyName || '',
                inn: userData.inn || '',
                kpp: userData.kpp || '',
                legalAddress: userData.legalAddress || '',
                contactPerson: userData.contactPerson || '',
                deliveryAddress: userData.deliveryAddress || '',
                accountingEmail: userData.email,
                directorName: userData.contactPerson || ''
            };
        } else {
            return {
                fullName: userData.fullName || '',
                birthDate: userData.birthDate || '',
                gender: userData.gender || '',
                deliveryAddress: userData.deliveryAddress || '',
                passportSeries: '',
                passportNumber: '',
                passportIssued: ''
            };
        }
    }

    // Выход из системы
    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
        this.updateUI();
        showPage('home');
        showNotification('Вы вышли из системы', 'info');
    }

    // Проверка прав доступа
    hasPermission(permission) {
        if (!this.currentUser) return false;
        if (this.currentUser.role === 'admin') return true;
        return this.currentUser.permissions?.includes(permission) || false;
    }

    // Проверка роли
    hasRole(role) {
        return this.currentUser?.role === role;
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Проверка авторизации
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Обновление интерфейса
    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const adminButton = document.getElementById('adminButton');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            // Показываем меню пользователя
            authButtons.classList.add('hidden');
            userMenu.classList.remove('hidden');
            userName.textContent = this.currentUser.profile?.fullName || 
                                  this.currentUser.profile?.companyName || 
                                  this.currentUser.email;

            // Показываем кнопку админки для административных ролей
            if (['admin', 'manager', 'moderator', 'accountant'].includes(this.currentUser.role)) {
                adminButton.classList.remove('hidden');
            }
        } else {
            // Показываем кнопки входа/регистрации
            authButtons.classList.remove('hidden');
            userMenu.classList.add('hidden');
            adminButton.classList.add('hidden');
        }
    }

    // Обновление профиля пользователя
    updateProfile(profileData) {
        if (!this.currentUser) return { success: false, error: 'Не авторизован' };

        const updated = window.storeDB.updateUser(this.currentUser.id, {
            profile: { ...this.currentUser.profile, ...profileData }
        });

        if (updated) {
            this.currentUser = updated;
            this.saveCurrentUser();
            return { success: true, user: this.currentUser };
        }

        return { success: false, error: 'Ошибка обновления профиля' };
    }

    // Пополнение счета
    addToBalance(amount) {
        if (!this.currentUser) return { success: false, error: 'Не авторизован' };

        const newBalance = this.currentUser.account.balance + amount;
        const updated = window.storeDB.updateUser(this.currentUser.id, {
            account: { ...this.currentUser.account, balance: newBalance }
        });

        if (updated) {
            this.currentUser = updated;
            this.saveCurrentUser();
            return { success: true, newBalance: newBalance };
        }

        return { success: false, error: 'Ошибка пополнения счета' };
    }

    // Списание с счета
    deductFromBalance(amount) {
        if (!this.currentUser) return { success: false, error: 'Не авторизован' };

        if (this.currentUser.account.balance < amount) {
            return { success: false, error: 'Недостаточно средств на счете' };
        }

        const newBalance = this.currentUser.account.balance - amount;
        const updated = window.storeDB.updateUser(this.currentUser.id, {
            account: { ...this.currentUser.account, balance: newBalance }
        });

        if (updated) {
            this.currentUser = updated;
            this.saveCurrentUser();
            return { success: true, newBalance: newBalance };
        }

        return { success: false, error: 'Ошибка списания со счета' };
    }

    // Начисление бонусных баллов
    addBonusPoints(points) {
        if (!this.currentUser) return { success: false, error: 'Не авторизован' };

        const newPoints = this.currentUser.account.bonusPoints + points;
        const updated = window.storeDB.updateUser(this.currentUser.id, {
            account: { ...this.currentUser.account, bonusPoints: newPoints }
        });

        if (updated) {
            this.currentUser = updated;
            this.saveCurrentUser();
            return { success: true, newPoints: newPoints };
        }

        return { success: false, error: 'Ошибка начисления баллов' };
    }

    // Получение заказов пользователя
    getUserOrders() {
        if (!this.currentUser) return [];
        return window.storeDB.getOrders().filter(order => order.userId == this.currentUser.id);
    }
}

// Обработчики форм аутентификации
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const login = formData.get('login');
    const password = formData.get('password');

    if (!login || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }

    const result = window.authSystem.login(login, password);
    
    if (result.success) {
        hideAuthModal();
        showNotification(`Добро пожаловать, ${result.user.profile?.fullName || result.user.email}!`, 'success');
        
        // Перенаправление в зависимости от роли
        if (result.redirectTo === 'admin') {
            setTimeout(() => showAdmin(), 500);
        } else {
            setTimeout(() => showProfile(), 500);
        }
    } else {
        showNotification(result.error, 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Проверка совпадения паролей
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Пароль должен быть не менее 6 символов', 'error');
        return;
    }

    // Сбор данных формы
    const userData = {
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: password,
        profileType: formData.get('profileType'),
        deliveryAddress: formData.get('deliveryAddress')
    };

    // Добавляем поля в зависимости от типа профиля
    if (userData.profileType === 'legal') {
        userData.companyName = formData.get('companyName');
        userData.inn = formData.get('inn');
        userData.kpp = formData.get('kpp');
        userData.legalAddress = formData.get('legalAddress');
        userData.contactPerson = formData.get('contactPerson');
    } else {
        userData.fullName = formData.get('fullName');
        userData.birthDate = formData.get('birthDate');
        userData.gender = formData.get('gender');
    }

    const result = window.authSystem.register(userData);
    
    if (result.success) {
        hideAuthModal();
        showNotification('Регистрация успешна! Добро пожаловать в NEXX!', 'success');
        setTimeout(() => showProfile(), 500);
    } else {
        showNotification(result.error, 'error');
    }
}

// Показать модальное окно аутентификации
function showAuthModal(type = 'login') {
    document.getElementById('authModal').classList.remove('hidden');
    switchAuthTab(type);
}

// Скрыть модальное окно аутентификации
function hideAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
    
    // Очистка форм
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

// Переключение вкладок аутентификации
function switchAuthTab(type) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');

    if (type === 'login') {
        loginTab.classList.add('bg-primary', 'text-white');
        loginTab.classList.remove('text-gray-300');
        registerTab.classList.remove('bg-primary', 'text-white');
        registerTab.classList.add('text-gray-300');
        
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        authTitle.textContent = 'Вход в систему';
    } else {
        registerTab.classList.add('bg-primary', 'text-white');
        registerTab.classList.remove('text-gray-300');
        loginTab.classList.remove('bg-primary', 'text-white');
        loginTab.classList.add('text-gray-300');
        
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        authTitle.textContent = 'Регистрация в системе';
    }
}

// Переключение полей профиля при регистрации
function toggleProfileFields(profileType) {
    const individualFields = document.getElementById('individualFields');
    const legalFields = document.getElementById('legalFields');
    
    if (profileType === 'legal') {
        individualFields.classList.add('hidden');
        legalFields.classList.remove('hidden');
        
        // Делаем обязательными поля юр.лица
        legalFields.querySelectorAll('input[name="companyName"], input[name="inn"], input[name="contactPerson"]')
                  .forEach(input => input.required = true);
        
        // Убираем обязательность с полей физ.лица
        individualFields.querySelectorAll('input')
                       .forEach(input => input.required = false);
    } else {
        legalFields.classList.add('hidden');
        individualFields.classList.remove('hidden');
        
        // Делаем обязательными поля физ.лица
        individualFields.querySelectorAll('input[name="fullName"]')
                       .forEach(input => input.required = true);
        
        // Убираем обязательность с полей юр.лица
        legalFields.querySelectorAll('input')
                  .forEach(input => input.required = false);
    }
}

// Переключение видимости пароля
function togglePassword(button) {
    const input = button.previousElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Выход из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.authSystem.logout();
    }
}

// Инициализация системы аутентификации
window.authSystem = new AuthSystem();