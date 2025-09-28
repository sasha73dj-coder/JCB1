import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { User, Package, Heart, Settings, Eye, Truck } from 'lucide-react';
import { products } from '../data/mockData';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 (900) 123-45-67',
    address: 'Москва, ул. Ленина, д. 1, кв. 10',
    city: 'Москва',
    postalCode: '101000'
  });

  // Mock data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-12-20',
      status: 'В обработке',
      total: 125000,
      items: [
        { product: products[0], quantity: 1 },
        { product: products[1], quantity: 2 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-12-15',
      status: 'Доставлен',
      total: 95000,
      items: [
        { product: products[2], quantity: 1 }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-12-10',
      status: 'Отменен',
      total: 45000,
      items: [
        { product: products[3], quantity: 1 }
      ]
    }
  ];

  const favorites = products.slice(0, 4);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'В обработке':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Доставлен':
        return 'bg-green-500/20 text-green-400';
      case 'Отменен':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Mock profile update
    console.log('Profile updated:', profileData);
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-gray-400">{profileData.email}</p>
            </div>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex bg-gray-800 border-gray-700">
              <TabsTrigger value="orders" className="text-white data-[state=active]:bg-orange-500">
                <Package className="h-4 w-4 mr-2" />
                Заказы
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-white data-[state=active]:bg-orange-500">
                <Heart className="h-4 w-4 mr-2" />
                Избранное
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-white data-[state=active]:bg-orange-500">
                <Settings className="h-4 w-4 mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="addresses" className="text-white data-[state=active]:bg-orange-500">
                <Truck className="h-4 w-4 mr-2" />
                Адреса
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Мои заказы</h2>
                
                {orders.length === 0 ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">У вас пока нет заказов</h3>
                      <p className="text-gray-400 mb-4">Оформите свой первый заказ в нашем магазине</p>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Перейти в каталог
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white">Заказ #{order.id}</h3>
                              <p className="text-gray-400 text-sm">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <div className="text-white font-semibold mt-1">
                                {formatPrice(order.total)} ₽
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">
                                  {item.product.name} x{item.quantity}
                                </span>
                                <span className="text-gray-400">
                                  {formatPrice(item.product.price * item.quantity)} ₽
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                              <Eye className="h-4 w-4 mr-2" />
                              Подробнее
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Избранные товары</h2>
                
                {favorites.length === 0 ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Список избранного пуст</h3>
                      <p className="text-gray-400 mb-4">Добавьте товары в избранное, чтобы они появились здесь</p>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Перейти в каталог
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((product) => (
                      <Card key={product.id} className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Фото</span>
                          </div>
                          
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">
                              {formatPrice(product.price)} ₽
                            </span>
                            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                              В корзину
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-white mb-6">Личные данные</h2>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-white">Имя</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-white">Фамилия</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-white">Телефон</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Сохранить изменения
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="mt-6">
              <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Адреса доставки</h2>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Добавить адрес
                  </Button>
                </div>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Основной адрес</span>
                      <Badge className="bg-green-500/20 text-green-400">По умолчанию</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-white">Город</Label>
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="postalCode" className="text-white">Почтовый индекс</Label>
                          <Input
                            id="postalCode"
                            value={profileData.postalCode}
                            onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-white">Адрес</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Обновить адрес
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;