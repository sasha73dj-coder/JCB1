import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { AlertCircle, CreditCard, Settings, Plus, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const AdminPayments = () => {
  const [paymentSettings, setPaymentSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [newPaymentSystem, setNewPaymentSystem] = useState({
    provider: 'yoomoney',
    merchant_id: '',
    secret_key: '',
    webhook_url: '',
    active: true
  });

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/settings`);
      const data = await response.json();
      if (data.success) {
        setPaymentSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const handleAddPaymentSystem = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPaymentSystem),
      });

      const data = await response.json();
      if (data.success) {
        setPaymentSettings([...paymentSettings, data.data]);
        setNewPaymentSystem({
          provider: 'yoomoney',
          merchant_id: '',
          secret_key: '',
          webhook_url: '',
          active: true
        });
      }
    } catch (error) {
      console.error('Error adding payment system:', error);
    } finally {
      setLoading(false);
    }
  };

  const testPaymentConnection = async (systemId, provider) => {
    setTestResults(prev => ({ ...prev, [systemId]: { testing: true } }));

    try {
      // Симуляция тестирования подключения
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.2; // 80% успешных тестов
      setTestResults(prev => ({ 
        ...prev, 
        [systemId]: { 
          testing: false, 
          success,
          message: success ? 'Подключение успешно' : 'Ошибка подключения'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [systemId]: { 
          testing: false, 
          success: false,
          message: 'Ошибка тестирования'
        }
      }));
    }
  };

  const getProviderName = (provider) => {
    const names = {
      yoomoney: 'YooMoney (Яндекс.Деньги)',
      sberbank: 'Сбербанк Эквайринг',
      tinkoff: 'Тинькофф Эквайринг',
      qiwi: 'QIWI',
      cloudpayments: 'CloudPayments'
    };
    return names[provider] || provider;
  };

  const getProviderIcon = (provider) => {
    return <CreditCard className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Платежные системы</h2>
          <p className="text-gray-600 mt-2">Управление интеграциями с платежными системами</p>
        </div>
      </div>

      <Tabs defaultValue="systems" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="systems">Платежные системы</TabsTrigger>
          <TabsTrigger value="add-system">Добавить систему</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        {/* Список платежных систем */}
        <TabsContent value="systems" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paymentSettings.map((system) => (
              <Card key={system.id} className="relative">
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <div className="flex items-center space-x-2">
                    {getProviderIcon(system.provider)}
                    <div>
                      <CardTitle className="text-lg">
                        {getProviderName(system.provider)}
                      </CardTitle>
                      <CardDescription>
                        ID: {system.merchant_id}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Badge variant={system.active ? "default" : "secondary"}>
                      {system.active ? "Активна" : "Неактивна"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Webhook URL:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {system.webhook_url ? '✓ Настроен' : '✗ Не настроен'}
                    </span>
                  </div>

                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testPaymentConnection(system.id, system.provider)}
                      disabled={testResults[system.id]?.testing}
                      className="flex items-center space-x-1"
                    >
                      <TestTube className="w-3 h-3" />
                      <span>
                        {testResults[system.id]?.testing ? 'Тестирую...' : 'Тест'}
                      </span>
                    </Button>

                    {testResults[system.id] && !testResults[system.id].testing && (
                      <div className="flex items-center space-x-1">
                        {testResults[system.id].success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-xs ${
                          testResults[system.id].success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {testResults[system.id].message}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {paymentSettings.length === 0 && (
              <div className="col-span-full">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Платежные системы не настроены. Добавьте первую систему на вкладке "Добавить систему".
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Добавление новой платежной системы */}
        <TabsContent value="add-system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Добавить платежную систему</span>
              </CardTitle>
              <CardDescription>
                Настройте интеграцию с новой платежной системой
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleAddPaymentSystem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Платежная система</Label>
                    <select
                      id="provider"
                      value={newPaymentSystem.provider}
                      onChange={(e) => setNewPaymentSystem(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="yoomoney">YooMoney (Яндекс.Деньги)</option>
                      <option value="sberbank">Сбербанк Эквайринг</option>
                      <option value="tinkoff">Тинькофф Эквайринг</option>
                      <option value="qiwi">QIWI</option>
                      <option value="cloudpayments">CloudPayments</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="merchant_id">ID мерчанта / Shop ID</Label>
                    <Input
                      id="merchant_id"
                      value={newPaymentSystem.merchant_id}
                      onChange={(e) => setNewPaymentSystem(prev => ({ ...prev, merchant_id: e.target.value }))}
                      placeholder="Введите ID мерчанта"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret_key">Секретный ключ</Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={newPaymentSystem.secret_key}
                    onChange={(e) => setNewPaymentSystem(prev => ({ ...prev, secret_key: e.target.value }))}
                    placeholder="Введите секретный ключ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook_url">Webhook URL (опционально)</Label>
                  <Input
                    id="webhook_url"
                    value={newPaymentSystem.webhook_url}
                    onChange={(e) => setNewPaymentSystem(prev => ({ ...prev, webhook_url: e.target.value }))}
                    placeholder="https://your-site.com/webhooks/payment"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newPaymentSystem.active}
                    onCheckedChange={(checked) => setNewPaymentSystem(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Активировать сразу после добавления</Label>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>{loading ? 'Добавляю...' : 'Добавить систему'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Общие настройки */}
        <TabsContent value="settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Общие настройки</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Автоматическое подтверждение платежей</Label>
                    <p className="text-sm text-gray-600">Автоматически подтверждать успешные платежи</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Уведомления о платежах</Label>
                    <p className="text-sm text-gray-600">Отправлять email уведомления</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Валюта по умолчанию</Label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="RUB">Российский рубль (RUB)</option>
                    <option value="USD">Доллар США (USD)</option>
                    <option value="EUR">Евро (EUR)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Активных систем:</span>
                    <span className="font-semibold">{paymentSettings.filter(s => s.active).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Всего систем:</span>
                    <span className="font-semibold">{paymentSettings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Последнее обновление:</span>
                    <span className="font-semibold text-xs">Только что</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayments;