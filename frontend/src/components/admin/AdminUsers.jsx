import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Shield
} from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock users data
  const users = [
    {
      id: 1,
      name: 'Иван Петров',
      email: 'ivan.petrov@example.com',
      phone: '+7 (900) 123-45-67',
      role: 'Клиент',
      status: 'Активный',
      orders: 12,
      totalSpent: 450000,
      lastLogin: '2024-12-20 15:30',
      registered: '2024-01-15'
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      email: 'maria.sidorova@example.com',
      phone: '+7 (911) 234-56-78',
      role: 'Клиент',
      status: 'Активный',
      orders: 8,
      totalSpent: 320000,
      lastLogin: '2024-12-19 12:45',
      registered: '2024-03-22'
    },
    {
      id: 3,
      name: 'Алексей Кузнецов',
      email: 'alexey.kuznetsov@example.com',
      phone: '+7 (921) 345-67-89',
      role: 'Клиент',
      status: 'Заблокирован',
      orders: 3,
      totalSpent: 95000,
      lastLogin: '2024-12-10 09:20',
      registered: '2024-06-10'
    },
    {
      id: 4,
      name: 'Ольга Попова',
      email: 'olga.popova@example.com',
      phone: '+7 (931) 456-78-90',
      role: 'Клиент',
      status: 'Активный',
      orders: 15,
      totalSpent: 680000,
      lastLogin: '2024-12-20 11:15',
      registered: '2023-11-08'
    },
    {
      id: 5,
      name: 'Анна Администратор',
      email: 'admin@nexx.ru',
      phone: '+7 (495) 492-14-78',
      role: 'Администратор',
      status: 'Активный',
      orders: 0,
      totalSpent: 0,
      lastLogin: '2024-12-20 16:00',
      registered: '2023-01-01'
    }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Активный':
        return 'bg-green-500/20 text-green-400';
      case 'Заблокирован':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Администратор':
        return 'bg-orange-500/20 text-orange-400';
      case 'Менеджер':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Управление пользователями</h1>
          <p className="text-gray-400">Всего пользователей: {users.length}</p>
        </div>
        
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Добавить пользователя
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по имени, email или телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Всего пользователей</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Активные</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'Активный').length}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Клиенты</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'Клиент').length}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Администраторы</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'Администратор').length}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Список пользователей ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Пользователь</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Роль</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Статус</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Заказы</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Общая сумма</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Последний вход</th>
                  <th className="text-right text-gray-400 font-medium py-3 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{user.orders}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-semibold">
                        {user.totalSpent > 0 ? `${formatPrice(user.totalSpent)} ₽` : '—'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-300 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {user.lastLogin}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          Рег.: {user.registered}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Пользователи не найдены</h3>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;