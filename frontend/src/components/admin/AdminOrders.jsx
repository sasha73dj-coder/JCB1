import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  User,
  Package
} from 'lucide-react';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: 'Иван Петров',
      email: 'ivan.petrov@example.com',
      phone: '+7 (900) 123-45-67',
      total: 125000,
      status: 'Новый',
      items: 3,
      date: '2024-12-20 14:30',
      paymentMethod: 'Карта',
      deliveryMethod: 'Курьер'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Мария Сидорова',
      email: 'maria.sidorova@example.com',
      phone: '+7 (911) 234-56-78',
      total: 85000,
      status: 'Обрабатывается',
      items: 2,
      date: '2024-12-20 12:15',
      paymentMethod: 'Наличными',
      deliveryMethod: 'Самовывоз'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Алексей Кузнецов',
      email: 'alexey.kuznetsov@example.com',
      phone: '+7 (921) 345-67-89',
      total: 195000,
      status: 'Отправлен',
      items: 1,
      date: '2024-12-20 10:45',
      paymentMethod: 'Перевод',
      deliveryMethod: 'ТК'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Ольга Попова',
      email: 'olga.popova@example.com',
      phone: '+7 (931) 456-78-90',
      total: 67000,
      status: 'Доставлен',
      items: 4,
      date: '2024-12-19 16:20',
      paymentMethod: 'Карта',
      deliveryMethod: 'Курьер'
    },
    {
      id: 'ORD-2024-005',
      customer: 'Дмитрий Ковалев',
      email: 'dmitry.kovalev@example.com',
      phone: '+7 (941) 567-89-01',
      total: 34000,
      status: 'Отменен',
      items: 1,
      date: '2024-12-19 11:30',
      paymentMethod: 'Карта',
      deliveryMethod: 'Курьер'
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        return 'bg-purple-500/20 text-purple-400';
      case 'Доставлен':
        return 'bg-green-500/20 text-green-400';
      case 'Отменен':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Управление заказами</h1>
          <p className="text-gray-400">Всего заказов: {orders.length}</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            Отчет
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по номеру, клиенту или email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">Все статусы</SelectItem>
                <SelectItem value="Новый" className="text-white hover:bg-gray-600">Новые</SelectItem>
                <SelectItem value="Обрабатывается" className="text-white hover:bg-gray-600">Обрабатываются</SelectItem>
                <SelectItem value="Отправлен" className="text-white hover:bg-gray-600">Отправленные</SelectItem>
                <SelectItem value="Доставлен" className="text-white hover:bg-gray-600">Доставленные</SelectItem>
                <SelectItem value="Отменен" className="text-white hover:bg-gray-600">Отмененные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Список заказов ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Заказ</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Клиент</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Сумма</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Статус</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Дата</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Оплата</th>
                  <th className="text-right text-gray-400 font-medium py-3 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-white font-semibold">{order.id}</span>
                        <div className="flex items-center text-gray-400 text-xs mt-1">
                          <Package className="h-3 w-3 mr-1" />
                          {order.items} товаров
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center text-white font-medium">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {order.customer}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{order.email}</div>
                        <div className="text-gray-400 text-xs">{order.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-semibold">{formatPrice(order.total)} ₽</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300 text-sm">{order.date}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-300 text-sm">
                        <div>{order.paymentMethod}</div>
                        <div className="text-gray-400 text-xs">{order.deliveryMethod}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Заказы не найдены</h3>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;