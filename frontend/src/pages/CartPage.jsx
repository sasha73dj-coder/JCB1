import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Trash2, Plus, Minus, ShoppingBag, RotateCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { cartStorage } from '../utils/storage';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});
  const navigate = useNavigate();

  // Load cart items on component mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const items = cartStorage.getItems();
    setCartItems(items);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    setTimeout(() => {
      cartStorage.updateItem(itemId, newQuantity);
      loadCartItems();
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }, 200);
  };

  const removeItem = (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    setTimeout(() => {
      cartStorage.removeItem(itemId);
      loadCartItems();
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }, 200);
  };

  const clearCart = () => {
    cartStorage.clear();
    loadCartItems();
  };

  const getItemTotal = (item) => {
    return item.product_price * item.quantity;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <RotateCw className="h-12 w-12 text-orange-400 mx-auto mb-4 animate-spin" />
              <p className="text-white">Загрузка корзины...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-4">Корзина пуста</h1>
              <p className="text-gray-400 mb-8">
                Добавьте товары в корзину, чтобы оформить заказ
              </p>
              <Link to="/catalog">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Перейти в каталог
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Корзина ({getTotalItems()} товаров)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 text-xs">Фото</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product_id}`}>
                          <h3 className="font-semibold text-white hover:text-orange-400 transition-colors line-clamp-2">
                            {item.product_name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span>ID: {item.product_id.slice(0, 8)}...</span>
                          <span>Цена за шт: {formatPrice(item.product_price)} ₽</span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updating[item.id]}
                              className="border-gray-600 text-white w-8 h-8 p-0"
                            >
                              {updating[item.id] ? (
                                <RotateCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="text-white px-3 py-1 bg-gray-700 rounded">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating[item.id]}
                              className="border-gray-600 text-white w-8 h-8 p-0"
                            >
                              {updating[item.id] ? (
                                <RotateCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {formatPrice(getItemTotal(item))} ₽
                              </div>
                              <div className="text-sm text-gray-400">
                                {formatPrice(item.product_price)} ₽ за шт.
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              disabled={updating[item.id]}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              {updating[item.id] ? (
                                <RotateCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Оформление заказа</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Товары ({getTotalItems()})</span>
                      <span className="text-white">{formatPrice(getTotalPrice())} ₽</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Доставка</span>
                      <span className="text-white">Бесплатно</span>
                    </div>
                    
                    <hr className="border-gray-700" />
                    
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-white">К оплате</span>
                      <span className="text-white">{formatPrice(getTotalPrice())} ₽</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to="/checkout" className="block">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                        Оформить заказ
                      </Button>
                    </Link>
                    
                    <Link to="/catalog">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                        Продолжить покупки
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Гарантия качества</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Бесплатная доставка от 5000 ₽</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span>Возврат в течение 14 дней</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;