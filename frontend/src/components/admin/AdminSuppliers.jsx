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
  RotateCw,
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
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testingConnections, setTestingConnections] = useState({});
  const { toast } = useToast();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Load suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/suppliers`);
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить список поставщиков',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте подключение к интернету',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.supported_brands && supplier.supported_brands.some(brand => 
      brand.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
      case 'testing':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const testSupplierConnection = async (supplierId) => {
    try {
      setTestingConnections(prev => ({ ...prev, [supplierId]: true }));
      
      const response = await fetch(`${BACKEND_URL}/api/suppliers/${supplierId}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        toast({
          title: 'Тест подключения успешен',
          description: `Время ответа: ${result.response_time_ms}ms`
        });
      } else {
        toast({
          title: 'Ошибка подключения',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка теста',
        description: 'Не удалось протестировать подключение',
        variant: 'destructive'
      });
    } finally {
      setTestingConnections(prev => ({ ...prev, [supplierId]: false }));
    }
  };

  const toggleSupplierStatus = async (supplierId) => {
    try {
      const supplier = suppliers.find(s => s.id === supplierId);
      const newStatus = supplier.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`${BACKEND_URL}/api/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const updatedSupplier = await response.json();
        setSuppliers(prev => prev.map(s => 
          s.id === supplierId ? updatedSupplier : s
        ));
        
        toast({
          title: 'Статус обновлен',
          description: `Поставщик ${newStatus === 'active' ? 'активирован' : 'деактивирован'}`
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус поставщика',
        variant: 'destructive'
      });
    }
  };

  const deleteSupplier = async (supplierId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого поставщика?')) {
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/suppliers/${supplierId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuppliers(prev => prev.filter(s => s.id !== supplierId));
        toast({
          title: 'Поставщик удален',
          description: 'Поставщик успешно удален из системы'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить поставщика',
        variant: 'destructive'
      });
    }
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
            <SupplierForm 
              onClose={() => setIsAddingSupplier(false)} 
              onSave={(newSupplier) => {
                setSuppliers(prev => [...prev, newSupplier]);
                setIsAddingSupplier(false);
              }}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Supplier Dialog */}
        <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Редактирование поставщика</DialogTitle>
            </DialogHeader>
            {selectedSupplier && (
              <SupplierForm 
                supplier={selectedSupplier}
                onClose={() => setSelectedSupplier(null)} 
                onSave={(updatedSupplier) => {
                  setSuppliers(prev => prev.map(s => 
                    s.id === updatedSupplier.id ? updatedSupplier : s
                  ));
                  setSelectedSupplier(null);
                }}
              />
            )}
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
                <p className="text-gray-400 text-sm">Всего брендов</p>
                <p className="text-2xl font-bold text-white">
                  {suppliers.reduce((total, s) => total + (s.supported_brands?.length || 0), 0)}
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
                  {suppliers.length > 0 ? Math.round(suppliers.reduce((total, s) => total + s.delivery_time_days, 0) / suppliers.length) : 0} дня
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
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <RotateCw className="h-5 w-5 animate-spin text-orange-400" />
                        <span className="text-gray-400">Загрузка поставщиков...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 px-4 text-center text-gray-400">
                      Поставщики не найдены
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {supplier.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{supplier.name}</div>
                            <div className="text-gray-400 text-sm flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              {supplier.api_config?.base_url?.split('/')[2] || 'API'}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {supplier.supported_brands?.length > 0 && (
                                <Badge className="bg-green-500/20 text-green-400 text-xs">
                                  {supplier.supported_brands.length} брендов
                                </Badge>
                              )}
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                {supplier.api_config?.api_type || 'REST'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(supplier.status)}>
                            {supplier.status === 'active' ? 'Активен' : 
                             supplier.status === 'testing' ? 'Тестирование' : 'Неактивен'}
                          </Badge>
                          <Switch
                            checked={supplier.status === 'active'}
                            onCheckedChange={() => toggleSupplierStatus(supplier.id)}
                            className="scale-75"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white font-semibold flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {supplier.rating.toFixed(1)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Наценка: {supplier.pricing_config?.markup_percentage || 0}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1 text-white">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{supplier.delivery_time_days} {supplier.delivery_time_days === 1 ? 'день' : supplier.delivery_time_days < 5 ? 'дня' : 'дней'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">+{supplier.pricing_config?.markup_percentage || 0}%</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-300 text-sm">
                          {supplier.updated_at ? new Date(supplier.updated_at).toLocaleString('ru-RU') : '-'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => testSupplierConnection(supplier.id)}
                            disabled={testingConnections[supplier.id]}
                          >
                            <TestTube className={`h-4 w-4 ${testingConnections[supplier.id] ? 'animate-pulse' : ''}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-yellow-400 hover:text-yellow-300"
                            onClick={() => setSelectedSupplier(supplier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteSupplier(supplier.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Form component for adding/editing suppliers
const SupplierForm = ({ supplier = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    description: supplier?.description || '',
    status: supplier?.status || 'active',
    rating: supplier?.rating || 5,
    api_config: {
      api_type: supplier?.api_config?.api_type || 'rest',  
      base_url: supplier?.api_config?.base_url || '',
      api_key: supplier?.api_config?.api_key || '',
      additional_headers: supplier?.api_config?.additional_headers || {},
      timeout: supplier?.api_config?.timeout || 30,
      rate_limit: supplier?.api_config?.rate_limit || 100
    },
    pricing_config: {
      markup_percentage: supplier?.pricing_config?.markup_percentage || 15,
      min_markup_amount: supplier?.pricing_config?.min_markup_amount || 0,
      currency: supplier?.pricing_config?.currency || 'RUB'
    },
    supported_brands: supplier?.supported_brands || [],
    delivery_time_days: supplier?.delivery_time_days || 1
  });
  
  const [loading, setLoading] = useState(false);
  const [brandInput, setBrandInput] = useState('');
  const { toast } = useToast();
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = supplier 
        ? `${BACKEND_URL}/api/suppliers/${supplier.id}`
        : `${BACKEND_URL}/api/suppliers`;
      
      const method = supplier ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const savedSupplier = await response.json();
        
        toast({
          title: supplier ? 'Поставщик обновлен' : 'Поставщик добавлен',
          description: 'Данные успешно сохранены'
        });
        
        if (onSave) {
          onSave(savedSupplier);
        }
        
        onClose();
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Ошибка сохранения');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addBrand = () => {
    if (brandInput.trim() && !formData.supported_brands.includes(brandInput.trim())) {
      setFormData(prev => ({
        ...prev,
        supported_brands: [...prev.supported_brands, brandInput.trim()]
      }));
      setBrandInput('');
    }
  };

  const removeBrand = (brandToRemove) => {
    setFormData(prev => ({
      ...prev,
      supported_brands: prev.supported_brands.filter(brand => brand !== brandToRemove)
    }));
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
              <Label htmlFor="status" className="text-white">Статус</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="inactive">Неактивен</SelectItem>
                  <SelectItem value="testing">Тестирование</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Описание</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Краткое описание поставщика..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating" className="text-white">Рейтинг (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Поддерживаемые бренды</Label>
            <div className="flex space-x-2">
              <Input
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBrand())}
                className="bg-gray-700 border-gray-600 text-white flex-1"
                placeholder="Введите бренд и нажмите Enter"
              />
              <Button type="button" onClick={addBrand} variant="outline" className="border-gray-600 text-gray-300">
                Добавить
              </Button>
            </div>
            {formData.supported_brands.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.supported_brands.map((brand, index) => (
                  <Badge key={index} className="bg-blue-500/20 text-blue-400 flex items-center space-x-1">
                    <span>{brand}</span>
                    <button 
                      type="button" 
                      onClick={() => removeBrand(brand)}
                      className="text-blue-400 hover:text-blue-300 ml-1"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiType" className="text-white">Тип API</Label>
              <Select 
                value={formData.api_config.api_type} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev, 
                  api_config: {...prev.api_config, api_type: value}
                }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="rest">REST API</SelectItem>
                  <SelectItem value="soap">SOAP</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeout" className="text-white">Таймаут (сек)</Label>
              <Input
                id="timeout"
                type="number"
                min="5"
                max="120"
                value={formData.api_config.timeout}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  api_config: {...prev.api_config, timeout: parseInt(e.target.value)}
                }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiUrl" className="text-white">URL API</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="apiUrl"
                value={formData.api_config.base_url}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  api_config: {...prev.api_config, base_url: e.target.value}
                }))}
                className="bg-gray-700 border-gray-600 text-white pl-10"
                placeholder="https://api.supplier.com/v1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-white">API ключ</Label>
            <Input
              id="apiKey"
              type="password"
              value={formData.api_config.api_key}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                api_config: {...prev.api_config, api_key: e.target.value}
              }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Введите API ключ"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rateLimit" className="text-white">Лимит запросов в минуту</Label>
            <Input
              id="rateLimit"
              type="number"
              min="1"
              value={formData.api_config.rate_limit || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                api_config: {...prev.api_config, rate_limit: e.target.value ? parseInt(e.target.value) : null}
              }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Необязательно"
            />
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
                value={formData.delivery_time_days}
                onChange={(e) => setFormData({...formData, delivery_time_days: parseInt(e.target.value)})}
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
                value={formData.pricing_config.markup_percentage}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing_config: {...prev.pricing_config, markup_percentage: parseFloat(e.target.value)}
                }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minMarkup" className="text-white">Минимальная наценка (₽)</Label>
              <Input
                id="minMarkup"
                type="number"
                min="0"
                value={formData.pricing_config.min_markup_amount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing_config: {...prev.pricing_config, min_markup_amount: parseFloat(e.target.value)}
                }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-white">Валюта</Label>
              <Select 
                value={formData.pricing_config.currency} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  pricing_config: {...prev.pricing_config, currency: value}
                }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="RUB">RUB (₽)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          disabled={loading}
        >
          {loading ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin mr-2" />
              Сохранение...
            </>
          ) : (
            <>
              {supplier ? 'Обновить' : 'Добавить'} поставщика
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AdminSuppliers;