import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { products } from '../data/mockData';

const CartPage = () => {
  // Mock cart items
  const [cartItems, setCartItems] = useState([
    { id: 1, product: products[0], quantity: 2 },
    { id: 2, product: products[1], quantity: 1 },
    { id: 3, product: products[2], quantity: 3 }
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const getItemTotal = (item) => {
    return item.product.price * item.quantity;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

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
                        <Link to={`/product/${item.product.slug}`}>
                          <h3 className="font-semibold text-white hover:text-orange-400 transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span>Артикул: {item.product.sku}</span>
                          <span>Бренд: {item.product.brand}</span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="border-gray-600 text-white w-8 h-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-white px-3 py-1 bg-gray-700 rounded">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="border-gray-600 text-white w-8 h-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {formatPrice(getItemTotal(item))} ₽
                              </div>
                              <div className="text-sm text-gray-400">
                                {formatPrice(item.product.price)} ₽ за шт.
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
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