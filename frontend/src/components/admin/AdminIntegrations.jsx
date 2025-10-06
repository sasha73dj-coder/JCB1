import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { AlertCircle, Package, Settings, Plus, TestTube, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const AdminIntegrations = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [abcpSettings, setAbcpSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    api_type: 'abcp',
    api_credentials: {
      username: '',
      password: '',
      host: 'api.abcp.ru'
    },
    markup_percentage: 10.0,
    delivery_days: 3,
    min_order_amount: 0,
    active: true
  });

  useEffect(() => {
    fetchSuppliers();
    fetchAbcpSettings();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/suppliers`);
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchAbcpSettings = async () => {
    try {
      // API endpoint для получения настроек ABCP
      setAbcpSettings({
        configured: false,
        username: '',
        host: 'api.abcp.ru'
      });
    } catch (error) {
      console.error('Error fetching ABCP settings:', error);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSupplier),
      });

      const data = await response.json();
      if (data.success) {
        setSuppliers([...suppliers, data.data]);
        setNewSupplier({
          name: '',
          api_type: 'abcp',
          api_credentials: {
            username: '',
            password: '',
            host: 'api.abcp.ru'
          },
          markup_percentage: 10.0,
          delivery_days: 3,
          min_order_amount: 0,
          active: true
        });
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSupplierConnection = async (supplierId, apiType) => {
    setTestResults(prev => ({ ...prev, [supplierId]: { testing: true } }));

    try {
      let endpoint = '';
      if (apiType === 'abcp') {
        endpoint = '/api/suppliers/abcp/test';
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`);
      const data = await response.json();
      
      setTestResults(prev => ({ 
        ...prev, 
        [supplierId]: { 
          testing: false, 
          success: data.success,
          message: data.data?.message || 'Тест завершен',
          responseTime: data.data?.response_time_ms || 0
        }
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [supplierId]: { 
          testing: false, 
          success: false,
          message: 'Ошибка тестирования'
        }
      }));
    }
  };

  const handleAbcpSetup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/suppliers/abcp/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: abcpSettings.username,
          password: abcpSettings.password,
          host: abcpSettings.host || 'api.abcp.ru',
          active: true
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAbcpSettings(prev => ({ ...prev, configured: true }));
      }
    } catch (error) {
      console.error('Error configuring ABCP:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApiTypeName = (apiType) => {
    const names = {
      abcp: 'ABCP.ru',
      exist: 'Exist.ru',
      emex: 'Emex.ru',
      favorit: 'Favorit Motors',
      berg: 'Berg.ru'
    };
    return names[apiType] || apiType;
  };

  const getApiTypeIcon = () => {
    return <Package className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Интеграции с поставщиками</h2>
          <p className="text-gray-600 mt-2">Управление API интеграциями с поставщиками автозапчастей</p>
        </div>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suppliers">Поставщики</TabsTrigger>
          <TabsTrigger value="abcp-setup">Настройка ABCP</TabsTrigger>
          <TabsTrigger value="add-supplier">Добавить поставщика</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        {/* Список поставщиков */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="relative">
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <div className="flex items-center space-x-2">
                    {getApiTypeIcon()}
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription>
                        {getApiTypeName(supplier.api_type)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Badge variant={supplier.active ? "default" : "secondary"}>
                      {supplier.active ? "Активен" : "Неактивен"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Наценка:</span>
                      <span className="font-medium ml-1">{supplier.markup_percentage}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Доставка:</span>
                      <span className="font-medium ml-1">{supplier.delivery_days} дн.</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Мин. заказ:</span>
                      <span className="font-medium ml-1">{supplier.min_order_amount.toLocaleString()} ₽</span>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSupplierConnection(supplier.id, supplier.api_type)}
                      disabled={testResults[supplier.id]?.testing}
                      className="flex items-center space-x-1"
                    >
                      <TestTube className="w-3 h-3" />
                      <span>
                        {testResults[supplier.id]?.testing ? 'Тестирую...' : 'Тест'}
                      </span>
                    </Button>

                    {testResults[supplier.id] && !testResults[supplier.id].testing && (
                      <div className="flex items-center space-x-1">
                        {testResults[supplier.id].success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-xs ${
                          testResults[supplier.id].success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {testResults[supplier.id].message}
                        </span>
                      </div>
                    )}
                  </div>

                  {testResults[supplier.id]?.responseTime && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Ответ: {testResults[supplier.id].responseTime}мс
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {suppliers.length === 0 && (
              <div className="col-span-full">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Поставщики не настроены. Добавьте первого поставщика на вкладке "Добавить поставщика".
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Настройка ABCP */}
        <TabsContent value="abcp-setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Настройка ABCP.ru API</span>
              </CardTitle>
              <CardDescription>
                ABCP.ru - крупнейшая российская B2B система поставок автозапчастей
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!abcpSettings.configured ? (
                <form onSubmit={handleAbcpSetup} className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Для работы с ABCP.ru необходимо зарегистрироваться на их сайте и получить API доступ.
                      <a href="https://www.abcp.ru" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        Перейти на ABCP.ru
                      </a>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="abcp_username">Имя пользователя ABCP</Label>
                      <Input
                        id="abcp_username"
                        value={abcpSettings.username || ''}
                        onChange={(e) => setAbcpSettings(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Введите логин от ABCP"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="abcp_password">Пароль ABCP</Label>
                      <Input
                        id="abcp_password"
                        type="password"
                        value={abcpSettings.password || ''}
                        onChange={(e) => setAbcpSettings(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Введите пароль"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abcp_host">API Host (по умолчанию: api.abcp.ru)</Label>
                    <Input
                      id="abcp_host"
                      value={abcpSettings.host || 'api.abcp.ru'}
                      onChange={(e) => setAbcpSettings(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="api.abcp.ru"
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>{loading ? 'Настраиваю...' : 'Настроить ABCP'}</span>
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">ABCP.ru настроен успешно</h3>
                  <p className="text-gray-600 mb-4">
                    Интеграция с ABCP.ru активна. Теперь можно добавлять поставщиков ABCP.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setAbcpSettings(prev => ({ ...prev, configured: false }))}
                  >
                    Изменить настройки
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Добавление нового поставщика */}
        <TabsContent value="add-supplier">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Добавить поставщика</span>
              </CardTitle>
              <CardDescription>
                Настройте интеграцию с новым поставщиком автозапчастей
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier_name">Название поставщика</Label>
                    <Input
                      id="supplier_name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="ООО Автозапчасти Плюс"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_type">Тип API</Label>
                    <select
                      id="api_type"
                      value={newSupplier.api_type}
                      onChange={(e) => setNewSupplier(prev => ({ 
                        ...prev, 
                        api_type: e.target.value,
                        api_credentials: { username: '', password: '', host: 'api.abcp.ru' }
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="abcp">ABCP.ru</option>
                      <option value="exist">Exist.ru</option>
                      <option value="emex">Emex.ru</option>
                      <option value="favorit">Favorit Motors</option>
                      <option value="berg">Berg.ru</option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Данные для API</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api_username">Логин API</Label>
                      <Input
                        id="api_username"
                        value={newSupplier.api_credentials.username}
                        onChange={(e) => setNewSupplier(prev => ({ 
                          ...prev, 
                          api_credentials: { ...prev.api_credentials, username: e.target.value }
                        }))}
                        placeholder="Логин от API поставщика"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api_password">Пароль API</Label>
                      <Input
                        id="api_password"
                        type="password"
                        value={newSupplier.api_credentials.password}
                        onChange={(e) => setNewSupplier(prev => ({ 
                          ...prev, 
                          api_credentials: { ...prev.api_credentials, password: e.target.value }
                        }))}
                        placeholder="Пароль от API"
                        required
                      />
                    </div>
                  </div>

                  {newSupplier.api_type === 'abcp' && (
                    <div className="space-y-2">
                      <Label htmlFor="api_host">API Host</Label>
                      <Input
                        id="api_host"
                        value={newSupplier.api_credentials.host}
                        onChange={(e) => setNewSupplier(prev => ({ 
                          ...prev, 
                          api_credentials: { ...prev.api_credentials, host: e.target.value }
                        }))}
                        placeholder="api.abcp.ru"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Настройки поставщика</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="markup_percentage">Наценка (%)</Label>
                      <Input
                        id="markup_percentage"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={newSupplier.markup_percentage}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, markup_percentage: parseFloat(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery_days">Срок доставки (дни)</Label>
                      <Input
                        id="delivery_days"
                        type="number"
                        min="1"
                        max="30"
                        value={newSupplier.delivery_days}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, delivery_days: parseInt(e.target.value) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min_order_amount">Мин. сумма заказа (₽)</Label>
                      <Input
                        id="min_order_amount"
                        type="number"
                        min="0"
                        value={newSupplier.min_order_amount}
                        onChange={(e) => setNewSupplier(prev => ({ ...prev, min_order_amount: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="supplier_active"
                    checked={newSupplier.active}
                    onCheckedChange={(checked) => setNewSupplier(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="supplier_active">Активировать поставщика сразу</Label>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>{loading ? 'Добавляю...' : 'Добавить поставщика'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Аналитика */}
        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего поставщиков</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Активных: {suppliers.filter(s => s.active).length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средняя наценка</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {suppliers.length > 0 
                    ? (suppliers.reduce((acc, s) => acc + s.markup_percentage, 0) / suppliers.length).toFixed(1)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  По всем поставщикам
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний срок доставки</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {suppliers.length > 0 
                    ? Math.round(suppliers.reduce((acc, s) => acc + s.delivery_days, 0) / suppliers.length)
                    : 0} дн.
                </div>
                <p className="text-xs text-muted-foreground">
                  По всем поставщикам
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminIntegrations;