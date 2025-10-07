import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { MessageSquare, Settings, TestTube } from 'lucide-react';

const AdminSMS = () => {
  const [settings, setSettings] = useState({
    provider: 'smsc',
    login: '',
    password: '',
    api_key: '',
    sender: 'NEXX'
  });
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testResult, setTestResult] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  const loadSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/sms/settings`);
      const data = await response.json();
      if (data.provider) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек SMS:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/sms/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Настройки SMS сохранены');
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек SMS:', error);
      alert('Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  const testSMS = async () => {
    if (!testPhone) {
      alert('Введите номер телефона для теста');
      return;
    }

    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: testPhone }),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      console.error('Ошибка отправки тестового SMS:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            SMS Аутентификация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Настройки
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Тестирование
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4 mt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">SMS Провайдер</Label>
                  <Select
                    value={settings.provider}
                    onValueChange={(value) => setSettings({...settings, provider: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите провайдера" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smsc">SMSC.ru</SelectItem>
                      <SelectItem value="smsru">SMS.ru</SelectItem>
                      <SelectItem value="unifone">Unifone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender">Имя отправителя</Label>
                  <Input
                    id="sender"
                    value={settings.sender}
                    onChange={(e) => setSettings({...settings, sender: e.target.value})}
                    placeholder="NEXX"
                  />
                </div>

                {settings.provider === 'smsc' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="login">Логин SMSC</Label>
                      <Input
                        id="login"
                        value={settings.login}
                        onChange={(e) => setSettings({...settings, login: e.target.value})}
                        placeholder="Ваш логин в SMSC"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль SMSC</Label>
                      <Input
                        id="password"
                        type="password"
                        value={settings.password}
                        onChange={(e) => setSettings({...settings, password: e.target.value})}
                        placeholder="Ваш пароль в SMSC"
                      />
                    </div>
                  </>
                )}

                {settings.provider === 'smsru' && (
                  <div className="space-y-2">
                    <Label htmlFor="api_key">API ключ SMS.ru</Label>
                    <Input
                      id="api_key"
                      value={settings.api_key}
                      onChange={(e) => setSettings({...settings, api_key: e.target.value})}
                      placeholder="Ваш API ключ SMS.ru"
                    />
                  </div>
                )}

                <Button onClick={saveSettings} disabled={loading} className="w-full">
                  {loading ? 'Сохранение...' : 'Сохранить настройки'}
                </Button>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Инструкции по настройке:</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p><strong>SMSC.ru:</strong> Зарегистрируйтесь на smsc.ru, получите логин и пароль</p>
                    <p><strong>SMS.ru:</strong> Зарегистрируйтесь на sms.ru, получите API ключ</p>
                    <p><strong>Имя отправителя:</strong> Должно быть зарегистрировано у провайдера</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testPhone">Тестовый номер телефона</Label>
                  <Input
                    id="testPhone"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+7 (900) 123-45-67"
                  />
                  <p className="text-sm text-gray-500">
                    Введите номер для отправки тестового SMS кода
                  </p>
                </div>

                <Button 
                  onClick={testSMS} 
                  disabled={loading || !testPhone}
                  className="w-full"
                >
                  {loading ? 'Отправка...' : 'Отправить тестовый SMS'}
                </Button>

                {testResult && (
                  <Card className={`border-2 ${testResult.success ? 'border-green-200' : 'border-red-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={testResult.success ? 'default' : 'destructive'}>
                          {testResult.success ? 'Успешно' : 'Ошибка'}
                        </Badge>
                        {testResult.provider && (
                          <Badge variant="outline">{testResult.provider}</Badge>
                        )}
                      </div>
                      
                      {testResult.success ? (
                        <div className="space-y-1 text-sm">
                          <p><strong>Номер:</strong> {testResult.phone}</p>
                          {testResult.message_id && (
                            <p><strong>ID сообщения:</strong> {testResult.message_id}</p>
                          )}
                          <p className="text-green-600">SMS код отправлен успешно!</p>
                        </div>
                      ) : (
                        <p className="text-red-600 text-sm">{testResult.error || 'Неизвестная ошибка'}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Важно:</h4>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <p>• Если настройки не заданы, система работает в режиме имитации</p>
                    <p>• В тестовом режиме SMS не отправляется реально</p>
                    <p>• Для реальной отправки укажите корректные настройки провайдера</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSMS;