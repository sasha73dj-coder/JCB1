import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Users,
  Building,
  User
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    name: '',
    user_type: 'retail',
    role: 'user',
    // Для юридических лиц
    company_name: '',
    inn: '',
    kpp: '',
    ogrn: '',
    legal_address: '',
    postal_address: '',
    // Для физических лиц
    first_name: '',
    last_name: '',
    middle_name: '',
    passport_series: '',
    passport_number: '',
    birth_date: '',
    active: true
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (typeFilter) params.append('user_type', typeFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`${backendUrl}/api/admin/users?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers([...users, data.data]);
        setIsAddModalOpen(false);
        resetNewUser();
        alert('Пользователь создан');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
      alert('Ошибка создания пользователя');
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(users.map(u => u.id === editingUser.id ? data.data : u));
        setIsEditModalOpen(false);
        setEditingUser(null);
        alert('Пользователь обновлен');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      alert('Ошибка обновления пользователя');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Удалить пользователя?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(users.filter(u => u.id !== userId));
        alert('Пользователь удален');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      alert('Ошибка удаления пользователя');
    }
  };

  const resetNewUser = () => {
    setNewUser({
      username: '',
      email: '',
      phone: '',
      password: '',
      name: '',
      user_type: 'retail',
      role: 'user',
      company_name: '',
      inn: '',
      kpp: '',
      ogrn: '',
      legal_address: '',
      postal_address: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      passport_series: '',
      passport_number: '',
      birth_date: '',
      active: true
    });
  };

  const getStatusColor = (active) => {
    return active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-orange-500/20 text-orange-400';
      case 'manager':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getUserTypeIcon = (userType) => {
    return userType === 'legal' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, typeFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Управление пользователями</h1>
            <p className="text-gray-400">Всего пользователей: {users.length}</p>
          </div>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <UserPlus className="h-4 w-4 mr-2" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создание нового пользователя</DialogTitle>
            </DialogHeader>
            <UserForm user={newUser} setUser={setNewUser} onSave={createUser} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск пользователей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все роли</SelectItem>
                <SelectItem value="user">Пользователь</SelectItem>
                <SelectItem value="manager">Менеджер</SelectItem>
                <SelectItem value="admin">Администратор</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все типы</SelectItem>
                <SelectItem value="retail">Физ. лицо</SelectItem>
                <SelectItem value="legal">Юр. лицо</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setTypeFilter('');
              }}
              variant="outline"
              className="border-gray-600"
            >
              Сбросить
            </Button>
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
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Активные</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.active).length}</p>
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
                <p className="text-gray-400 text-sm">Физ. лица</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.user_type === 'retail').length}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <User className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Юр. лица</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.user_type === 'legal').length}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Building className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Список пользователей ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Загрузка пользователей...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Пользователь</th>
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Тип</th>
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Роль</th>
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Статус</th>
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Создан</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(user.name || user.username).split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name || user.username}</div>
                            <div className="flex items-center text-gray-400 text-sm mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center text-gray-400 text-sm">
                                <Phone className="h-3 w-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getUserTypeIcon(user.user_type)}
                          <span className="text-white">
                            {user.user_type === 'legal' ? 'Юр. лицо' : 'Физ. лицо'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === 'admin' ? 'Администратор' : 
                           user.role === 'manager' ? 'Менеджер' : 'Пользователь'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(user.active)}>
                          {user.active ? 'Активный' : 'Заблокирован'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-300 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '—'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-white"
                            onClick={() => {
                              setEditingUser(user);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Пользователи не найдены</h3>
                  <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование пользователя</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm 
              user={editingUser} 
              setUser={setEditingUser} 
              onSave={updateUser}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// User Form Component
const UserForm = ({ user, setUser, onSave, isEdit = false }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Основные данные</TabsTrigger>
          <TabsTrigger value="personal">Персональные данные</TabsTrigger>
          <TabsTrigger value="company">Данные организации</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин *</Label>
              <Input
                id="username"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                placeholder="Логин пользователя"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={user.phone || ''}
                onChange={(e) => setUser({...user, phone: e.target.value})}
                placeholder="+7 (900) 123-45-67"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Полное имя *</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                placeholder="Иван Иванов"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user_type">Тип пользователя</Label>
              <Select
                value={user.user_type}
                onValueChange={(value) => setUser({...user, user_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Физическое лицо</SelectItem>
                  <SelectItem value="legal">Юридическое лицо</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select
                value={user.role}
                onValueChange={(value) => setUser({...user, role: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Пользователь</SelectItem>
                  <SelectItem value="manager">Менеджер</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Пароль {!isEdit && '*'}</Label>
              <Input
                id="password"
                type="password"
                value={user.password || ''}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="Пароль пользователя"
                required={!isEdit}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Имя</Label>
              <Input
                id="first_name"
                value={user.first_name || ''}
                onChange={(e) => setUser({...user, first_name: e.target.value})}
                placeholder="Иван"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Фамилия</Label>
              <Input
                id="last_name"
                value={user.last_name || ''}
                onChange={(e) => setUser({...user, last_name: e.target.value})}
                placeholder="Иванов"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="middle_name">Отчество</Label>
              <Input
                id="middle_name"
                value={user.middle_name || ''}
                onChange={(e) => setUser({...user, middle_name: e.target.value})}
                placeholder="Иванович"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birth_date">Дата рождения</Label>
              <Input
                id="birth_date"
                type="date"
                value={user.birth_date || ''}
                onChange={(e) => setUser({...user, birth_date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passport_series">Серия паспорта</Label>
              <Input
                id="passport_series"
                value={user.passport_series || ''}
                onChange={(e) => setUser({...user, passport_series: e.target.value})}
                placeholder="1234"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passport_number">Номер паспорта</Label>
              <Input
                id="passport_number"
                value={user.passport_number || ''}
                onChange={(e) => setUser({...user, passport_number: e.target.value})}
                placeholder="567890"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="company" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Название организации</Label>
              <Input
                id="company_name"
                value={user.company_name || ''}
                onChange={(e) => setUser({...user, company_name: e.target.value})}
                placeholder="ООО «Рога и копыта»"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inn">ИНН</Label>
                <Input
                  id="inn"
                  value={user.inn || ''}
                  onChange={(e) => setUser({...user, inn: e.target.value})}
                  placeholder="7719876543"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpp">КПП</Label>
                <Input
                  id="kpp"
                  value={user.kpp || ''}
                  onChange={(e) => setUser({...user, kpp: e.target.value})}
                  placeholder="771901001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ogrn">ОГРН</Label>
                <Input
                  id="ogrn"
                  value={user.ogrn || ''}
                  onChange={(e) => setUser({...user, ogrn: e.target.value})}
                  placeholder="1027739876543"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legal_address">Юридический адрес</Label>
              <Input
                id="legal_address"
                value={user.legal_address || ''}
                onChange={(e) => setUser({...user, legal_address: e.target.value})}
                placeholder="123456, г. Москва, ул. Примерная, д. 1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postal_address">Почтовый адрес</Label>
              <Input
                id="postal_address"
                value={user.postal_address || ''}
                onChange={(e) => setUser({...user, postal_address: e.target.value})}
                placeholder="123456, г. Москва, ул. Примерная, д. 1"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={() => {}}>
          Отмена
        </Button>
        <Button onClick={onSave}>
          {isEdit ? 'Сохранить изменения' : 'Создать пользователя'}
        </Button>
      </div>
    </div>
  );
};

export default AdminUsers;