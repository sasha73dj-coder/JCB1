import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Plus, 
  Search, 
  Settings, 
  Globe, 
  Clock, 
  Truck, 
  CheckCircle,
  XCircle,
  Sync,
  Eye,
  Edit,
  Trash2,
  Link,
  Star,
  TestTube
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const AdminSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const { toast } = useToast();
  
  // Mock suppliers data
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'АвтоЗапчасти Москва',
      code: 'AZM',
      status: 'active',
      apiUrl: 'https://api.azm.ru/v2',
      apiKey: 'azm_key_****',
      lastSync: '2024-12-20 16:30',
      deliveryDays: 1,
      stockCount: 12540,
      priceMarkup: 15,
      priority: 1,
      isOnlineOrdering: true,
      hasStatusSync: true,
      region: 'Москва',
      rating: 4.8,
      ordersCount: 1250
    },
    {
      id: 2,
      name: 'ЗапчастиПро СПб',
      code: 'ZPS',
      status: 'active',
      apiUrl: 'https://zapchastipro.spb.ru/api',
      apiKey: 'zps_key_****',
      lastSync: '2024-12-20 16:25',
      deliveryDays: 2,
      stockCount: 8920,
      priceMarkup: 12,
      priority: 2,
      isOnlineOrdering: true,
      hasStatusSync: false,
      region: 'Санкт-Петербург',
      rating: 4.6,
      ordersCount: 890
    },
    {
      id: 3,
      name: 'ТракторЗапчасти',
      code: 'TZ',
      status: 'inactive',
      apiUrl: 'https://traktorzapchasti.ru/api/v1',
      apiKey: 'tz_key_****',
      lastSync: '2024-12-19 10:15',
      deliveryDays: 3,
      stockCount: 0,
      priceMarkup: 20,
      priority: 3,
      isOnlineOrdering: false,
      hasStatusSync: true,
      region: 'Екатеринбург',
      rating: 4.2,
      ordersCount: 320
    }
  ]);

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
      case 'syncing':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const syncSupplier = (supplierId) => {
    setSuppliers(prev => prev.map(s => 
      s.id === supplierId 
        ? { ...s, status: 'syncing', lastSync: new Date().toLocaleString('ru-RU') }
        : s
    ));
    
    setTimeout(() => {
      setSuppliers(prev => prev.map(s => 
        s.id === supplierId 
          ? { ...s, status: 'active', stockCount: s.stockCount + Math.floor(Math.random() * 100) }
          : s
      ));
      
      toast({
        title: 'Синхронизация завершена',
        description: 'Данные поставщика успешно обновлены'
      });
    }, 3000);
  };

  const toggleSupplierStatus = (supplierId) => {
    setSuppliers(prev => prev.map(s => 
      s.id === supplierId 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Управление поставщиками</h1>
          <p className="text-gray-400">Интеграция с поставщиками через API</p>
        </div>
        
        <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Plus className="h-4 w-4 mr-2" />
              Добавить поставщика
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Добавление нового поставщика</DialogTitle>
            </DialogHeader>
            <SupplierForm onClose={() => setIsAddingSupplier(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Всего поставщиков</p>
                <p className="text-2xl font-bold text-white">{suppliers.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Активных</p>
                <p className="text-2xl font-bold text-white">
                  {suppliers.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Всего товаров</p>
                <p className="text-2xl font-bold text-white">
                  {suppliers.reduce((total, s) => total + s.stockCount, 0).toLocaleString()}
                </p>
              </div>
              <Truck className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Средний срок</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(suppliers.reduce((total, s) => total + s.deliveryDays, 0) / suppliers.length)} дня
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по названию, коду или региону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Список поставщиков ({filteredSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Поставщик</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Статус</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Остатки</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Доставка</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Наценка</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Последняя синхронизация</th>
                  <th className="text-right text-gray-400 font-medium py-3 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {supplier.code}
                        </div>
                        <div>
                          <div className="text-white font-medium">{supplier.name}</div>
                          <div className="text-gray-400 text-sm flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {supplier.region}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {supplier.isOnlineOrdering && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">Онлайн заказ</Badge>
                            )}
                            {supplier.hasStatusSync && (
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">Статусы</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(supplier.status)}>
                          {supplier.status === 'active' ? 'Активен' : 
                           supplier.status === 'syncing' ? 'Синхронизация' : 'Неактивен'}
                        </Badge>
                        <Switch
                          checked={supplier.status === 'active'}
                          onCheckedChange={() => toggleSupplierStatus(supplier.id)}
                          className="scale-75"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white font-semibold">
                        {supplier.stockCount.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Рейтинг: {supplier.rating}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1 text-white">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{supplier.deliveryDays} {supplier.deliveryDays === 1 ? 'день' : supplier.deliveryDays < 5 ? 'дня' : 'дней'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">+{supplier.priceMarkup}%</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-300 text-sm">{supplier.lastSync}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => syncSupplier(supplier.id)}
                          disabled={supplier.status === 'syncing'}
                        >
                          <Sync className={`h-4 w-4 ${supplier.status === 'syncing' ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Settings className="h-4 w-4" />
                        </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};

// Form component for adding/editing suppliers
const SupplierForm = ({ supplier = null, onClose }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    code: supplier?.code || '',
    apiUrl: supplier?.apiUrl || '',
    apiKey: supplier?.apiKey || '',
    deliveryDays: supplier?.deliveryDays || 1,
    priceMarkup: supplier?.priceMarkup || 15,
    priority: supplier?.priority || 1,
    region: supplier?.region || '',
    isOnlineOrdering: supplier?.isOnlineOrdering || true,
    hasStatusSync: supplier?.hasStatusSync || true
  });
  
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock save
    toast({
      title: supplier ? 'Поставщик обновлен' : 'Поставщик добавлен',
      description: 'Данные успешно сохранены'
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="basic" className="text-white data-[state=active]:bg-orange-500">Основные</TabsTrigger>
          <TabsTrigger value="api" className="text-white data-[state=active]:bg-orange-500">API</TabsTrigger>
          <TabsTrigger value="settings" className="text-white data-[state=active]:bg-orange-500">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Название поставщика</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-white">Код поставщика</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region" className="text-white">Регион</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Москва, Санкт-Петербург..."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="apiUrl" className="text-white">URL API</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="apiUrl"
                value={formData.apiUrl}
                onChange={(e) => setFormData({...formData, apiUrl: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white pl-10"
                placeholder="https://api.supplier.com/v1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-white">API ключ</Label>
            <Input
              id="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Введите API ключ"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Онлайн заказы</Label>
                <p className="text-gray-400 text-sm">Автоматическая отправка заказов через API</p>
              </div>
              <Switch
                checked={formData.isOnlineOrdering}
                onCheckedChange={(checked) => setFormData({...formData, isOnlineOrdering: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white font-medium">Синхронизация статусов</Label>
                <p className="text-gray-400 text-sm">Автоматическое обновление статусов заказов</p>
              </div>
              <Switch
                checked={formData.hasStatusSync}
                onCheckedChange={(checked) => setFormData({...formData, hasStatusSync: checked})}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryDays" className="text-white">Срок доставки (дни)</Label>
              <Input
                id="deliveryDays"
                type="number"
                min="1"
                value={formData.deliveryDays}
                onChange={(e) => setFormData({...formData, deliveryDays: parseInt(e.target.value)})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceMarkup" className="text-white">Наценка (%)</Label>
              <Input
                id="priceMarkup"
                type="number"
                min="0"
                step="0.1"
                value={formData.priceMarkup}
                onChange={(e) => setFormData({...formData, priceMarkup: parseFloat(e.target.value)})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white">Приоритет (1-10)</Label>
            <Input
              id="priority"
              type="number"
              min="1"
              max="10"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <p className="text-gray-400 text-xs">1 - высший приоритет, 10 - низший</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
          Отмена
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {supplier ? 'Обновить' : 'Добавить'} поставщика
        </Button>
      </div>
    </form>
  );
};

export default AdminSuppliers;