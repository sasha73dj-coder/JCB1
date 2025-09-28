import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Eye,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Общая выручка',
      value: '2,847,500 ₽',
      change: '+12.5%',
      changeType: 'increase',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-500'
    },
    {
      title: 'Заказы',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'text-blue-500'
    },
    {
      title: 'Пользователи',
      value: '5,678',
      change: '+15.3%',
      changeType: 'increase',
      icon: <Users className="h-6 w-6" />,
      color: 'text-purple-500'
    },
    {
      title: 'Товары',
      value: '10,456',
      change: '-2.1%',
      changeType: 'decrease',
      icon: <Package className="h-6 w-6" />,
      color: 'text-orange-500'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'Иван Петров',
      amount: 125000,
      status: 'Новый',
      date: '2024-12-20 14:30'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Мария Сидорова',
      amount: 85000,
      status: 'Обрабатывается',
      date: '2024-12-20 12:15'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Алексей Кузнецов',
      amount: 195000,
      status: 'Отправлен',
      date: '2024-12-20 10:45'
    }
  ];

  const lowStockProducts = [
    { name: 'ТНВД 320/06924 JCB', stock: 2, sku: '320/06924' },
    { name: 'Коленвал 320/03336 JCB', stock: 1, sku: '320/03336' },
    { name: 'Фильтр масляный 02/100284', stock: 3, sku: '02/100284' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Новый':
        return 'bg-blue-500/20 text-blue-400';
      case 'Обрабатывается':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Отправлен':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Панель управления</h1>
        <p className="text-gray-400">Обзор работы интернет-магазина</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
                <span className="text-gray-400 text-sm ml-1">за месяц</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Последние заказы</span>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Eye className="h-4 w-4 mr-2" />
                Все заказы
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">{order.customer}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white font-medium">{formatPrice(order.amount)} ₽</span>
                      <span className="text-gray-400 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {order.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Мало товаров на складе</span>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Package className="h-4 w-4 mr-2" />
                Управление
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">Артикул: {product.sku}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge className="bg-red-500/20 text-red-400">
                      {product.stock} шт.
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-400 font-medium">Внимание!</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">
                Необходимо пополнить запасы для популярных товаров
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Package className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Новый заказ
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Users className="h-4 w-4 mr-2" />
              Добавить клиента
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Отчеты
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;