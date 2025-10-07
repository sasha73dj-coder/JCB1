import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Database, 
  Settings, 
  Sync, 
  History,
  Play,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const Admin1C = () => {
  const [settings, setSettings] = useState({
    server_url: '',
    database: '',
    username: '',
    password: '',
    sync_products: true,
    sync_prices: true,
    sync_orders: true,
    active: true
  });
  const [syncHistory, setSyncHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  const loadSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/1c/settings`);
      const data = await response.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек 1C:', error);
    }
  };

  const loadSyncHistory = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/1c/sync/history`);
      const data = await response.json();
      if (data.success && data.data) {
        setSyncHistory(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки истории синхронизации:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/1c/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Настройки 1C сохранены');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек 1C:', error);
      alert('Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  const startSync = async (syncType) => {
    setSyncing(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/1c/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sync_type: syncType,
          force: false
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Синхронизация ${syncType} завершена`);
        loadSyncHistory(); // Обновляем историю
      } else {
        alert(`Ошибка синхронизации: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
      alert('Ошибка синхронизации');
    } finally {
      setSyncing(false);
    }
  };

  const getSyncTypeLabel = (type) => {
    switch (type) {
      case 'products': return 'Товары';
      case 'prices': return 'Цены';
      case 'orders': return 'Заказы';
      case 'all': return 'Полная';
      default: return type;
    }
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSyncStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'running': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  useEffect(() => {
    loadSettings();
    loadSyncHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-indigo-500/20 p-3 rounded-lg">
          <Database className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">1C Интеграция</h1>
          <p className="text-gray-400">Настройка подключения и синхронизации с 1С</p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Настройки
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <Sync className="w-4 h-4" />
            Синхронизация
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            История ({syncHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Настройки подключения к 1С</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="server_url">Адрес сервера 1С *</Label>
                  <Input
                    id="server_url"
                    value={settings.server_url}
                    onChange={(e) => setSettings({...settings, server_url: e.target.value})}
                    placeholder="http://1c-server:1540/trade"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="database">Название базы данных *</Label>
                  <Input
                    id="database"
                    value={settings.database}
                    onChange={(e) => setSettings({...settings, database: e.target.value})}
                    placeholder="trade"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя *</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => setSettings({...settings, username: e.target.value})}
                    placeholder="admin"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={settings.password}
                    onChange={(e) => setSettings({...settings, password: e.target.value})}
                    placeholder="Пароль от 1С"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium">Параметры синхронизации</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sync_products"
                      checked={settings.sync_products}
                      onChange={(e) => setSettings({...settings, sync_products: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="sync_products">Синхронизировать товары</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sync_prices"
                      checked={settings.sync_prices}
                      onChange={(e) => setSettings({...settings, sync_prices: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="sync_prices">Синхронизировать цены</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sync_orders"
                      checked={settings.sync_orders}
                      onChange={(e) => setSettings({...settings, sync_orders: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="sync_orders">Передавать заказы в 1С</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={settings.active}
                      onChange={(e) => setSettings({...settings, active: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="active">Включить интеграцию</Label>
                  </div>
                </div>
              </div>

              <Button onClick={saveSettings} disabled={loading} className="w-full">
                {loading ? 'Сохранение...' : 'Сохранить настройки'}
              </Button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Инструкции по настройке:</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>• Убедитесь, что на сервере 1С включена веб-служба</p>
                  <p>• Проверьте доступность сервера по указанному адресу</p>
                  <p>• Пользователь должен иметь права на чтение справочников и документов</p>
                  <p>• Для передачи заказов необходимы права на запись</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Tab */}
        <TabsContent value="sync">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Управление синхронизацией</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Типы синхронизации</h4>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => startSync('products')}
                      disabled={syncing || !settings.active}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {syncing ? 'Синхронизация...' : 'Синхронизировать товары'}
                    </Button>
                    
                    <Button
                      onClick={() => startSync('prices')}
                      disabled={syncing || !settings.active}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {syncing ? 'Синхронизация...' : 'Синхронизировать цены'}
                    </Button>
                    
                    <Button
                      onClick={() => startSync('orders')}
                      disabled={syncing || !settings.active}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {syncing ? 'Синхронизация...' : 'Передать заказы'}
                    </Button>
                    
                    <Button
                      onClick={() => startSync('all')}
                      disabled={syncing || !settings.active}
                      className="w-full justify-start bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    >
                      <Sync className="w-4 h-4 mr-2" />
                      {syncing ? 'Полная синхронизация...' : 'Полная синхронизация'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Статус интеграции</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Подключение к 1С</span>
                      <Badge className={settings.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {settings.active ? 'Активно' : 'Отключено'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Синхронизация товаров</span>
                      <Badge className={settings.sync_products ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                        {settings.sync_products ? 'Включена' : 'Отключена'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Синхронизация цен</span>
                      <Badge className={settings.sync_prices ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                        {settings.sync_prices ? 'Включена' : 'Отключена'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Передача заказов</span>
                      <Badge className={settings.sync_orders ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                        {settings.sync_orders ? 'Включена' : 'Отключена'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {!settings.active && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Внимание:</h4>
                  <p className="text-sm text-yellow-700">
                    Интеграция с 1С отключена. Включите её в настройках для начала синхронизации.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">История синхронизации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncHistory.length > 0 ? (
                  syncHistory.map((sync, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getSyncStatusIcon(sync.status)}
                          <div>
                            <h4 className="text-white font-medium">
                              {getSyncTypeLabel(sync.sync_type)} синхронизация
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {new Date(sync.started_at).toLocaleString('ru-RU')}
                            </p>
                          </div>
                        </div>
                        <Badge className={getSyncStatusColor(sync.status)}>
                          {sync.status === 'completed' ? 'Завершена' : 
                           sync.status === 'failed' ? 'Ошибка' : 'Выполняется'}
                        </Badge>
                      </div>
                      
                      {sync.results && (
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-700">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">
                              {sync.results.products_synced || 0}
                            </p>
                            <p className="text-gray-400 text-sm">Товары</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">
                              {sync.results.prices_updated || 0}
                            </p>
                            <p className="text-gray-400 text-sm">Цены</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">
                              {sync.results.orders_sent || 0}
                            </p>
                            <p className="text-gray-400 text-sm">Заказы</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">История пуста</h3>
                    <p className="text-gray-400">Здесь будет отображаться история синхронизаций</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin1C;