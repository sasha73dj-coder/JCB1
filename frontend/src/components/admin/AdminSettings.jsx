import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Save, 
  Upload, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  CreditCard,
  Truck
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // General
    siteName: 'NEXX',
    siteDescription: 'Официальные запчасти JCB',
    contactEmail: 'info@nexx.ru',
    contactPhone: '+7 495 492-14-78',
    address: 'Москва, ул. Складочная, д. 1, стр. 18',
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    // Store
    storeOpen: true,
    maintenanceMode: false,
    showPrices: true,
    allowRegistration: true,
    // SEO
    metaTitle: 'NEXX - Оригинальные запчасти JCB',
    metaDescription: 'Купить оригинальные запчасти JCB по лучшим ценам'
  });
  
  const { toast } = useToast();

  const handleSave = (section) => {
    // Mock save functionality
    toast({
      title: 'Настройки сохранены',
      description: `Настройки раздела "${section}" успешно обновлены`
    });
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Настройки системы</h1>
        <p className="text-gray-400">Конфигурация интернет-магазина</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
          <TabsTrigger value="general" className="text-white data-[state=active]:bg-orange-500">
            <Globe className="h-4 w-4 mr-2" />
            Общие
          </TabsTrigger>
          <TabsTrigger value="store" className="text-white data-[state=active]:bg-orange-500">
            <Database className="h-4 w-4 mr-2" />
            Магазин
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-white data-[state=active]:bg-orange-500">
            <CreditCard className="h-4 w-4 mr-2" />
            Оплата
          </TabsTrigger>
          <TabsTrigger value="delivery" className="text-white data-[state=active]:bg-orange-500">
            <Truck className="h-4 w-4 mr-2" />
            Доставка
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-orange-500">
            <Bell className="h-4 w-4 mr-2" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-white data-[state=active]:bg-orange-500">
            <Shield className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Общие настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-white">Название сайта</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-white">Email для связи</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-white">Телефон</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-white">Описание сайта</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Адрес компании</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('Общие')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Настройки магазина</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Магазин открыт</Label>
                    <p className="text-gray-400 text-sm">Клиенты могут делать заказы</p>
                  </div>
                  <Switch
                    checked={settings.storeOpen}
                    onCheckedChange={(checked) => handleInputChange('storeOpen', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Режим обслуживания</Label>
                    <p className="text-gray-400 text-sm">Сайт недоступен для пользователей</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Показывать цены</Label>
                    <p className="text-gray-400 text-sm">Отображать цены товаров всем пользователям</p>
                  </div>
                  <Switch
                    checked={settings.showPrices}
                    onCheckedChange={(checked) => handleInputChange('showPrices', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Разрешить регистрацию</Label>
                    <p className="text-gray-400 text-sm">Новые пользователи могут создавать аккаунты</p>
                  </div>
                  <Switch
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('Магазин')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Настройки оплаты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 font-medium">Платежные системы</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  Настройка интеграции с платежными системами будет доступна после подключения соответствующих API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="delivery" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Настройки доставки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-medium">Службы доставки</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  Конфигурация служб доставки и расчет стоимости будет доступна после интеграции с API транспортных компаний.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Настройки уведомлений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Email уведомления</Label>
                    <p className="text-gray-400 text-sm">Отправлять уведомления по email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Уведомления о заказах</Label>
                    <p className="text-gray-400 text-sm">Получать уведомления о новых заказах</p>
                  </div>
                  <Switch
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => handleInputChange('orderNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Оповещения о низких остатках</Label>
                    <p className="text-gray-400 text-sm">Предупреждения о малом количестве товара</p>
                  </div>
                  <Switch
                    checked={settings.stockAlerts}
                    onCheckedChange={(checked) => handleInputChange('stockAlerts', checked)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('Уведомления')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">SEO настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-white">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-gray-400 text-xs">Рекомендуемая длина: 50-60 символов</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-white">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                />
                <p className="text-gray-400 text-xs">Рекомендуемая длина: 150-160 символов</p>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('SEO')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;