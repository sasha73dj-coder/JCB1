// Storage utility for NEXX store - replaces backend API with localStorage
import { v4 as uuidv4 } from 'uuid';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'nexx_products',
  USERS: 'nexx_users', 
  CART: 'nexx_cart',
  ORDERS: 'nexx_orders',
  SUPPLIERS: 'nexx_suppliers',
  CURRENT_USER: 'nexx_current_user',
  SETTINGS: 'nexx_settings'
};

// Default admin user
const DEFAULT_ADMIN = {
  id: 'admin-001',
  email: 'admin@nexx.ru',
  username: 'bluxs',
  password: 'Sashanata1/', // In real app, this would be hashed
  name: 'Администратор NEXX',
  role: 'admin',
  created_at: new Date().toISOString()
};

// Initialize storage with default data
export const initializeStorage = () => {
  // Initialize users with admin
  const users = getStorageItem(STORAGE_KEYS.USERS) || [];
  if (!users.find(u => u.username === DEFAULT_ADMIN.username)) {
    users.push(DEFAULT_ADMIN);
    setStorageItem(STORAGE_KEYS.USERS, users);
  }

  // Initialize empty cart
  if (!getStorageItem(STORAGE_KEYS.CART)) {
    setStorageItem(STORAGE_KEYS.CART, []);
  }

  // Initialize empty orders
  if (!getStorageItem(STORAGE_KEYS.ORDERS)) {
    setStorageItem(STORAGE_KEYS.ORDERS, []);
  }

  // Initialize suppliers if not exist
  if (!getStorageItem(STORAGE_KEYS.SUPPLIERS)) {
    setStorageItem(STORAGE_KEYS.SUPPLIERS, []);
  }

  // Initialize products with some starter products
  if (!getStorageItem(STORAGE_KEYS.PRODUCTS)) {
    const starterProducts = [
      {
        id: uuidv4(),
        name: 'Фильтр гидравлический JCB 32/925994',
        description: 'Оригинальный гидравлический фильтр для экскаваторов JCB. Высокое качество, длительный срок службы.',
        part_number: '32/925994',
        brand: 'JCB',
        category: 'Гидравлика',
        base_price: 8500,
        image_url: '/images/filter-hydraulic.jpg',
        slug: 'filtr-gidravlicheskij-jcb-32-925994',
        in_stock: true,
        created_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Тормозные колодки передние JCB 15/920200',
        description: 'Высококачественные тормозные колодки для спецтехники JCB. Обеспечивают надежное торможение.',
        part_number: '15/920200', 
        brand: 'JCB',
        category: 'Тормозная система',
        base_price: 12500,
        image_url: '/images/brake-pads.jpg',
        slug: 'tormoznye-kolodki-jcb-15-920200',
        in_stock: true,
        created_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Масляный фильтр двигателя JCB 02/100284',
        description: 'Оригинальный масляный фильтр для двигателей JCB. Обеспечивает чистоту масла и продлевает срок службы двигателя.',
        part_number: '02/100284',
        brand: 'JCB', 
        category: 'Двигатель',
        base_price: 1200,
        image_url: '/images/oil-filter.jpg',
        slug: 'maslyanyj-filtr-jcb-02-100284',
        in_stock: true,
        created_at: new Date().toISOString()
      }
    ];
    setStorageItem(STORAGE_KEYS.PRODUCTS, starterProducts);
  }
};

// Storage helpers
const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return null;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting storage item:', error);
    return false;
  }
};

// Authentication
export const authStorage = {
  login: (username, password) => {
    const users = getStorageItem(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
      const userSession = { ...user };
      delete userSession.password; // Don't store password in session
      setStorageItem(STORAGE_KEYS.CURRENT_USER, userSession);
      return { success: true, user: userSession };
    }
    
    return { success: false, error: 'Неверный логин или пароль' };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
  },

  getCurrentUser: () => {
    return getStorageItem(STORAGE_KEYS.CURRENT_USER);
  },

  register: (userData) => {
    const users = getStorageItem(STORAGE_KEYS.USERS) || [];
    
    // Check if user already exists
    const existingUser = users.find(u => 
      u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) {
      return { success: false, error: 'Пользователь уже существует' };
    }
    
    const newUser = {
      id: uuidv4(),
      ...userData,
      role: 'user',
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    setStorageItem(STORAGE_KEYS.USERS, users);
    
    const userSession = { ...newUser };
    delete userSession.password;
    setStorageItem(STORAGE_KEYS.CURRENT_USER, userSession);
    
    return { success: true, user: userSession };
  }
};

// Products management
export const productsStorage = {
  getAll: () => {
    return getStorageItem(STORAGE_KEYS.PRODUCTS) || [];
  },

  getById: (id) => {
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS) || [];
    return products.find(p => p.id === id);
  },

  getBySlug: (slug) => {
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS) || [];
    return products.find(p => p.slug === slug);
  },

  create: (productData) => {
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS) || [];
    const newProduct = {
      id: uuidv4(),
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    products.push(newProduct);
    setStorageItem(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  update: (id, productData) => {
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS) || [];
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...productData,
        updated_at: new Date().toISOString()
      };
      setStorageItem(STORAGE_KEYS.PRODUCTS, products);
      return products[index];
    }
    
    return null;
  },

  delete: (id) => {
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS) || [];
    const filteredProducts = products.filter(p => p.id !== id);
    setStorageItem(STORAGE_KEYS.PRODUCTS, filteredProducts);
    return true;
  }
};

// Cart management
export const cartStorage = {
  getItems: () => {
    return getStorageItem(STORAGE_KEYS.CART) || [];
  },

  addItem: (productId, quantity = 1) => {
    const cart = getStorageItem(STORAGE_KEYS.CART) || [];
    const product = productsStorage.getById(productId);
    
    if (!product) return null;
    
    const existingItemIndex = cart.findIndex(item => item.product_id === productId);
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: uuidv4(),
        product_id: productId,
        product_name: product.name,
        product_price: product.base_price || 0,
        product_image: product.image_url,
        quantity: quantity,
        added_at: new Date().toISOString()
      });
    }
    
    setStorageItem(STORAGE_KEYS.CART, cart);
    return cart;
  },

  updateItem: (itemId, quantity) => {
    const cart = getStorageItem(STORAGE_KEYS.CART) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      setStorageItem(STORAGE_KEYS.CART, cart);
      return cart;
    }
    
    return null;
  },

  removeItem: (itemId) => {
    const cart = getStorageItem(STORAGE_KEYS.CART) || [];
    const filteredCart = cart.filter(item => item.id !== itemId);
    setStorageItem(STORAGE_KEYS.CART, filteredCart);
    return filteredCart;
  },

  clear: () => {
    setStorageItem(STORAGE_KEYS.CART, []);
    return [];
  },

  getTotal: () => {
    const cart = getStorageItem(STORAGE_KEYS.CART) || [];
    return cart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  },

  getItemCount: () => {
    const cart = getStorageItem(STORAGE_KEYS.CART) || [];
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};

// Orders management
export const ordersStorage = {
  getAll: () => {
    return getStorageItem(STORAGE_KEYS.ORDERS) || [];
  },

  create: (orderData) => {
    const orders = getStorageItem(STORAGE_KEYS.ORDERS) || [];
    const cart = cartStorage.getItems();
    
    const newOrder = {
      id: uuidv4(),
      order_number: `NEXX-${Date.now()}`,
      items: cart,
      total_amount: cartStorage.getTotal(),
      status: 'pending',
      ...orderData,
      created_at: new Date().toISOString()
    };
    
    orders.push(newOrder);
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
    
    // Clear cart after order
    cartStorage.clear();
    
    return newOrder;
  },

  updateStatus: (orderId, status) => {
    const orders = getStorageItem(STORAGE_KEYS.ORDERS) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      orders[orderIndex].updated_at = new Date().toISOString();
      setStorageItem(STORAGE_KEYS.ORDERS, orders);
      return orders[orderIndex];
    }
    
    return null;
  }
};

// Suppliers management
export const suppliersStorage = {
  getAll: () => {
    return getStorageItem(STORAGE_KEYS.SUPPLIERS) || [];
  },

  create: (supplierData) => {
    const suppliers = getStorageItem(STORAGE_KEYS.SUPPLIERS) || [];
    const newSupplier = {
      id: uuidv4(),
      ...supplierData,
      created_at: new Date().toISOString()
    };
    
    suppliers.push(newSupplier);
    setStorageItem(STORAGE_KEYS.SUPPLIERS, suppliers);
    return newSupplier;
  },

  update: (id, supplierData) => {
    const suppliers = getStorageItem(STORAGE_KEYS.SUPPLIERS) || [];
    const index = suppliers.findIndex(s => s.id === id);
    
    if (index !== -1) {
      suppliers[index] = {
        ...suppliers[index],
        ...supplierData,
        updated_at: new Date().toISOString()
      };
      setStorageItem(STORAGE_KEYS.SUPPLIERS, suppliers);
      return suppliers[index];
    }
    
    return null;
  },

  delete: (id) => {
    const suppliers = getStorageItem(STORAGE_KEYS.SUPPLIERS) || [];
    const filteredSuppliers = suppliers.filter(s => s.id !== id);
    setStorageItem(STORAGE_KEYS.SUPPLIERS, filteredSuppliers);
    return true;
  }
};

// Initialize storage on import
initializeStorage();