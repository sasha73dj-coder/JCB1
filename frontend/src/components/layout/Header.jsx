import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Phone, Mail, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { cartStorage } from '../../utils/storage';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  
  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const count = cartStorage.getItemCount();
      setCartItemsCount(count);
    };
    
    updateCartCount();
    
    // Listen for cart changes
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mainNavItems = [
    { name: 'О компании', path: '/about' },
    { name: 'Новости', path: '/news' },
    { name: 'Бренды', path: '/brands' },
    { name: 'Оплата и доставка', path: '/delivery' },
    { name: 'Контакты', path: '/contacts' }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@nexx.ru</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+7 495 492-14-78</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">NEXX</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 mx-8">
              <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pr-12 focus:border-orange-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Call Button */}
              <div className="hidden lg:flex items-center space-x-2 text-orange-400">
                <Phone className="h-5 w-5" />
                <div className="text-sm">
                  <div className="text-gray-300">Заказать</div>
                  <div className="font-semibold">обратный звонок</div>
                </div>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-2">
                {isAuthenticated() ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 hidden md:inline">
                      Привет, {user?.name}
                      {isAdmin() && (
                        <Link to="/admin" className="ml-2 text-orange-400 hover:underline">
                          [Админ]
                        </Link>
                      )}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-300 hover:text-red-400"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="hidden md:inline ml-2">Выйти</span>
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-orange-400">
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline ml-2">Войти</span>
                    </Button>
                  </Link>
                )}
                
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-orange-400">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-300"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pr-12 focus:border-orange-500"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-semibold">Меню</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-4">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-gray-300 hover:text-orange-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;