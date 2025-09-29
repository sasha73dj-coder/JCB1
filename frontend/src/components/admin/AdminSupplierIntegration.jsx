import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Code, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database,
  Zap,
  Settings,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const AdminSupplierIntegration = () => {
  const [apiEndpoint, setApiEndpoint] = useState('https://api.nexx.ru/suppliers/v1');
  const [testResult, setTestResult] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const { toast } = useToast();
  
  // Sample API methods
  const apiMethods = [
    {
      method: 'GET',
      endpoint: '/products/search',
      description: 'Поиск товаров по артикулу или названию',
      params: 'article, brand, limit, offset',
      response: 'Список товаров с остатками и ценами'
    },
    {
      method: 'GET',
      endpoint: '/products/{id}/stock',
      description: 'Получение остатков конкретного товара',
      params: 'product_id',
      response: 'Остатки по складам и цены'
    },
    {
      method: 'POST',
      endpoint: '/orders',
      description: 'Создание нового заказа',
      params: 'customer_data, items[], delivery_address',
      response: 'ID заказа и статус'
    },
    {
      method: 'GET',
      endpoint: '/orders/{id}/status',
      description: 'Получение статуса заказа',
      params: 'order_id',
      response: 'Текущий статус и история изменений'
    },
    {
      method: 'PUT',
      endpoint: '/products/{id}/stock',
      description: 'Обновление остатков товара',
      params: 'product_id, quantity, price',
      response: 'Подтверждение обновления'
    }
  ];
  
  const integrationStats = [
    { label: 'Всего API вызовов', value: '24,587', icon: <Zap className="h-5 w-5" /> },
    { label: 'Активных подключений', value: '3', icon: <Database className="h-5 w-5" /> },
    { label: 'Среднее время ответа', value: '245ms', icon: <Clock className="h-5 w-5" /> },
    { label: 'Успешных запросов', value: '99.8%', icon: <CheckCircle className="h-5 w-5" /> }
  ];
  
  const sampleApiKey = 'nexx_sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz';
  
  const testApiConnection = async () => {
    setIsTestingApi(true);
    
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      setTestResult({
        success,
        timestamp: new Date().toLocaleString('ru-RU'),
        responseTime: Math.floor(Math.random() * 500) + 100,
        message: success 
          ? 'Подключение успешно установлено' 
          : 'Ошибка подключения к API'
      });
      setIsTestingApi(false);
      
      toast({
        title: success ? 'Тест успешен' : 'Ошибка теста',
        description: success 
          ? 'API интеграция работает корректно' 
          : 'Проверьте настройки подключения',
        variant: success ? 'default' : 'destructive'
      });
    }, 2000);
  };
  
  const exportApiDocs = () => {
    // Mock export
    toast({
      title: 'Документация экспортирована',
      description: 'API документация сохранена в Downloads/nexx-api-docs.json'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API интеграция</h1>
          <p className="text-gray-400">Настройка API для интеграции с внешними поставщиками</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300" onClick={exportApiDocs}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт документации
          </Button>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={testApiConnection}
            disabled={isTestingApi}
          >
            <Play className={`h-4 w-4 mr-2 ${isTestingApi ? 'animate-spin' : ''}`} />
            {isTestingApi ? 'Тестирование...' : 'Тест API'}
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {integrationStats.map((stat, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-orange-400">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="endpoints" className="text-white data-[state=active]:bg-orange-500">
            <Code className="h-4 w-4 mr-2" />
            API методы
          </TabsTrigger>
          <TabsTrigger value="webhook" className="text-white data-[state=active]:bg-orange-500">
            <Zap className="h-4 w-4 mr-2" />
            Webhook
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-white data-[state=active]:bg-orange-500">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-white data-[state=active]:bg-orange-500">
            <Database className="h-4 w-4 mr-2" />
            Логи
          </TabsTrigger>
        </TabsList>
        
        {/* API Endpoints */}
        <TabsContent value="endpoints" className="mt-6">
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Базовый URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Input
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    readOnly
                  />
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Копировать
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">API ключ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Input
                      value={sampleApiKey}
                      className="bg-gray-700 border-gray-600 text-white flex-1 font-mono text-sm"
                      readOnly
                    />
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      Копировать
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      Обновить
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Используйте этот ключ в заголовке Authorization: Bearer {'{API_KEY}'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Test Result */}
            {testResult && (
              <Card className={`border ${testResult.success ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <div>
                      <p className={`font-medium ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                        {testResult.message}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testResult.timestamp} • Время ответа: {testResult.responseTime}ms
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* API Methods */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Доступные методы API</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiMethods.map((method, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${
                            method.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                            method.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                            method.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {method.method}
                          </Badge>
                          <code className="text-orange-400 font-mono text-sm">{method.endpoint}</code>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2">{method.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Параметры:</span>
                          <code className="text-gray-300 ml-2">{method.params}</code>
                        </div>
                        <div>
                          <span className="text-gray-400">Ответ:</span>
                          <span className="text-gray-300 ml-2">{method.response}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Webhook */}
        <TabsContent value="webhook" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Настройка Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl" className="text-white">URL для уведомлений</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-domain.com/webhook/supplier-updates"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookSecret" className="text-white">Секретный ключ</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  placeholder="Введите секретный ключ для подписи"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">События для уведомлений</Label>
                <div className="space-y-2">
                  {[
                    'Обновление остатков',
                    'Изменение цен',
                    'Новые товары',
                    'Статус заказа',
                    'Подтверждение заказа'
                  ].map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-gray-300">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Сохранить настройки Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings */}
        <TabsContent value="settings" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Настройки интеграции</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="syncInterval" className="text-white">Интервал синхронизации (минуты)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    defaultValue="15"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeout" className="text-white">Таймаут запроса (секунды)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    defaultValue="30"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retryAttempts" className="text-white">Количество повторов</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    defaultValue="3"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rateLimitPerMin" className="text-white">Лимит запросов в минуту</Label>
                  <Input
                    id="rateLimitPerMin"
                    type="number"
                    defaultValue="100"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Logs */}
        <TabsContent value="logs" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Логи API запросов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[
                  { time: '16:45:23', method: 'GET', endpoint: '/products/search', status: 200, duration: '245ms' },
                  { time: '16:45:18', method: 'POST', endpoint: '/orders', status: 201, duration: '189ms' },
                  { time: '16:45:12', method: 'GET', endpoint: '/products/12345/stock', status: 200, duration: '167ms' },
                  { time: '16:45:07', method: 'PUT', endpoint: '/products/67890/stock', status: 200, duration: '234ms' },
                  { time: '16:45:01', method: 'GET', endpoint: '/orders/ORD-123/status', status: 404, duration: '156ms' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg font-mono text-sm">
                    <span className="text-gray-400">{log.time}</span>
                    <Badge className={`${
                      log.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      log.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {log.method}
                    </Badge>
                    <span className="text-gray-300 flex-1">{log.endpoint}</span>
                    <Badge className={log.status === 200 || log.status === 201 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {log.status}
                    </Badge>
                    <span className="text-gray-400">{log.duration}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSupplierIntegration;