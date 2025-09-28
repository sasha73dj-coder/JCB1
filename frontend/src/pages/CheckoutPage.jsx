import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Truck, CreditCard, Shield, ArrowLeft } from 'lucide-react';
import { deliveryMethods, paymentMethods, products } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const CheckoutPage = () => {
  // Mock cart items
  const cartItems = [
    { id: 1, product: products[0], quantity: 2 },
    { id: 2, product: products[1], quantity: 1 }
  ];
  
  const [formData, setFormData] = useState({
    // Customer info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Delivery
    deliveryMethod: '1',
    address: '',
    city: '',
    postalCode: '',
    // Payment
    paymentMethod: '1',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    // Other
    comment: '',
    subscribe: false,
    agreeToTerms: false
  });
  
  const { toast } = useToast();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryPrice = () => {
    const method = deliveryMethods.find(m => m.id.toString() === formData.deliveryMethod);
    return method ? method.price : 0;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryPrice();
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо согласиться с условиями',
        variant: 'destructive'
      });
      return;
    }
    
    // Mock order processing
    toast({
      title: 'Заказ оформлен!',
      description: 'Мы свяжемся с вами в ближайшее время'
    });
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-orange-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад в корзину
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Оформление заказа</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      Контактная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">Имя *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Фамилия *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Телефон *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="+7 (900) 123-45-67"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      <Truck className="h-5 w-5" />
                      Доставка
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={formData.deliveryMethod} 
                      onValueChange={(value) => handleInputChange('deliveryMethod', value)}
                      className="space-y-4"
                    >
                      {deliveryMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                          <RadioGroupItem value={method.id.toString()} id={`delivery-${method.id}`} />
                          <label htmlFor={`delivery-${method.id}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">{method.name}</div>
                                <div className="text-gray-400 text-sm">{method.description}</div>
                                <div className="text-gray-400 text-sm">Срок: {method.time}</div>
                              </div>
                              <div className="text-white font-semibold">
                                {method.price === 0 ? 'Бесплатно' : `${formatPrice(method.price)} ₽`}
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {formData.deliveryMethod !== '2' && (
                      <div className="mt-4 space-y-4">
                        <Separator className="bg-gray-700" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-white">Город *</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="postalCode" className="text-white">Почтовый индекс</Label>
                            <Input
                              id="postalCode"
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-white">Адрес доставки *</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Улица, дом, квартира"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                      <CreditCard className="h-5 w-5" />
                      Оплата
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      className="space-y-4"
                    >
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                          <RadioGroupItem value={method.id.toString()} id={`payment-${method.id}`} />
                          <label htmlFor={`payment-${method.id}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{method.icon}</span>
                              <div>
                                <div className="text-white font-medium">{method.name}</div>
                                <div className="text-gray-400 text-sm">{method.description}</div>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {formData.paymentMethod === '1' && (
                      <div className="mt-4 space-y-4">
                        <Separator className="bg-gray-700" />
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber" className="text-white">Номер карты *</Label>
                            <Input
                              id="cardNumber"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry" className="text-white">Срок *</Label>
                              <Input
                                id="cardExpiry"
                                value={formData.cardExpiry}
                                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="cardCvc" className="text-white">CVC *</Label>
                              <Input
                                id="cardCvc"
                                value={formData.cardCvc}
                                onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardName" className="text-white">Имя на карте *</Label>
                            <Input
                              id="cardName"
                              value={formData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="IVAN PETROV"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Комментарий к заказу</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => handleInputChange('comment', e.target.value)}
                      className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 resize-none"
                      placeholder="Особые пожелания к заказу..."
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-800 border-gray-700 sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-white">Ваш заказ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm line-clamp-2">{item.product.name}</h4>
                            <p className="text-gray-400 text-xs">Количество: {item.quantity}</p>
                          </div>
                          <div className="text-white font-medium text-sm ml-2">
                            {formatPrice(item.product.price * item.quantity)} ₽
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    {/* Order Summary */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Товары ({getTotalItems()})</span>
                        <span className="text-white">{formatPrice(getTotalPrice())} ₽</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Доставка</span>
                        <span className="text-white">
                          {getDeliveryPrice() === 0 ? 'Бесплатно' : `${formatPrice(getDeliveryPrice())} ₽`}
                        </span>
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span className="text-white">К оплате</span>
                        <span className="text-white">{formatPrice(getFinalTotal())} ₽</span>
                      </div>
                    </div>
                    
                    {/* Checkboxes */}
                    <div className="space-y-3 pt-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="subscribe"
                          checked={formData.subscribe}
                          onCheckedChange={(checked) => handleInputChange('subscribe', checked)}
                        />
                        <label htmlFor="subscribe" className="text-gray-300 text-sm leading-tight cursor-pointer">
                          Подписаться на новости и акции
                        </label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                          required
                        />
                        <label htmlFor="agreeToTerms" className="text-gray-300 text-sm leading-tight cursor-pointer">
                          Я соглашаюсь с {' '}
                          <Link to="/terms" className="text-orange-400 hover:underline">
                            пользовательским соглашением
                          </Link> *
                        </label>
                      </div>
                    </div>
                    
                    {/* Order Button */}
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      size="lg"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Оформить заказ
                    </Button>
                    
                    <div className="text-xs text-gray-400 text-center">
                      Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;