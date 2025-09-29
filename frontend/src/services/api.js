// API Client for NEXX E-Commerce Backend
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api';

// Token management
export const tokenStorage = {
  get: () => localStorage.getItem('access_token'),
  set: (token) => localStorage.setItem('access_token', token),
  remove: () => localStorage.removeItem('access_token'),
  isValid: () => {
    const token = tokenStorage.get();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }
};

// User state management
export const userStorage = {
  get: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  set: (user) => localStorage.setItem('user_data', JSON.stringify(user)),
  remove: () => localStorage.removeItem('user_data')
};

// HTTP client with auth headers
class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = tokenStorage.get();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.detail || response.statusText, errorData);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error', { originalError: error.message });
    }
  }

  // GET request
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  }

  // PUT request
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options });
  }

  // DELETE request
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Custom error class
export class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isAuthError() {
    return this.status === 401;
  }

  get isValidationError() {
    return this.status === 400 || this.status === 422;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Authentication API
export const authAPI = {
  // Register new user
  async register(userData) {
    const response = await apiClient.post('/auth/register', {
      first_name: userData.name.split(' ')[0] || userData.name,
      last_name: userData.name.split(' ').slice(1).join(' ') || '',
      email: userData.email,
      phone: userData.phone,
      password: userData.password
    });
    
    // Save token and user data
    if (response.access_token) {
      tokenStorage.set(response.access_token);
      userStorage.set(response.user);
    }
    
    return response;
  },

  // Login user
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Save token and user data
    if (response.access_token) {
      tokenStorage.set(response.access_token);
      userStorage.set(response.user);
    }
    
    return response;
  },

  // Get current user profile
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    userStorage.set(response);
    return response;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await apiClient.put('/auth/profile', profileData);
    userStorage.set(response);
    return response;
  },

  // Logout user
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear local storage
      tokenStorage.remove();
      userStorage.remove();
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return tokenStorage.isValid() && userStorage.get() !== null;
  },

  // Get current user from storage
  getCurrentUser() {
    return userStorage.get();
  }
};

// Products API (placeholder for future implementation)
export const productsAPI = {
  async getAll(filters = {}) {
    const searchParams = new URLSearchParams(filters);
    return apiClient.get(`/products?${searchParams}`);
  },

  async getById(id) {
    return apiClient.get(`/products/${id}`);
  },

  async getFeatured() {
    return apiClient.get('/products/featured');
  }
};

// Categories API (placeholder for future implementation)
export const categoriesAPI = {
  async getAll() {
    return apiClient.get('/categories');
  }
};

// Export main client
export default apiClient;