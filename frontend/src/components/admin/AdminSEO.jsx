import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  Settings, 
  BarChart3, 
  FileText,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';

const AdminSEO = () => {
  const [seoSettings, setSeoSettings] = useState({
    robots_txt: '',
    sitemap_enabled: true,
    google_analytics: '',
    yandex_metrika: '',
    google_search_console: '',
    yandex_webmaster: '',
    structured_data: true,
    open_graph: true
  });
  const [loading, setLoading] = useState(false);
  const [robotsPreview, setRobotsPreview] = useState('');
  const [sitemapPreview, setSitemapPreview] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  const loadSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/seo/settings`);
      const data = await response.json();
      if (data.success && data.data) {
        setSeoSettings({
          robots_txt: '',
          sitemap_enabled: true,
          google_analytics: '',
          yandex_metrika: '',
          google_search_console: '',
          yandex_webmaster: '',
          structured_data: true,
          open_graph: true,
          ...data.data
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки SEO настроек:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/seo/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seoSettings),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('SEO настройки сохранены');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка сохранения SEO настроек:', error);
      alert('Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  const previewRobots = async () => {
    try {
      const response = await fetch(`${backendUrl}/robots.txt`);
      if (response.ok) {
        const robotsContent = await response.text();
        setRobotsPreview(robotsContent);
      }
    } catch (error) {
      console.error('Ошибка получения robots.txt:', error);
    }
  };

  const previewSitemap = async () => {
    try {
      const response = await fetch(`${backendUrl}/sitemap.xml`);
      if (response.ok) {
        const sitemapContent = await response.text();
        setSitemapPreview(sitemapContent);
      }
    } catch (error) {
      console.error('Ошибка получения sitemap.xml:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Скопировано в буфер обмена');
  };

  const getDefaultRobots = () => {
    return `User-agent: *
Allow: /

# Запрет индексации административных разделов
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${window.location.origin}/sitemap.xml`;
  };

  useEffect(() => {
    loadSettings();
    previewRobots();
    previewSitemap();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-green-500/20 p-3 rounded-lg">
          <Search className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">SEO Настройки</h1>
          <p className="text-gray-400">Поисковая оптимизация и аналитика</p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="robots" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Robots & Sitemap
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Настройки
          </TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Коды аналитики и вебмастеров</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Google сервисы</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="google_analytics">Google Analytics ID</Label>
                    <Input
                      id="google_analytics"
                      value={seoSettings.google_analytics}
                      onChange={(e) => setSeoSettings({...seoSettings, google_analytics: e.target.value})}
                      placeholder="G-XXXXXXXXXX или UA-XXXXXXXX-X"
                    />
                    <p className="text-xs text-gray-400">
                      Измерение ID из Google Analytics 4 или Universal Analytics
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="google_search_console">Google Search Console</Label>
                    <Input
                      id="google_search_console"
                      value={seoSettings.google_search_console}
                      onChange={(e) => setSeoSettings({...seoSettings, google_search_console: e.target.value})}
                      placeholder="google-site-verification=xxxxxx"
                    />
                    <p className="text-xs text-gray-400">
                      Meta-тег для верификации Search Console
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Яндекс сервисы</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yandex_metrika">Яндекс.Метрика ID</Label>
                    <Input
                      id="yandex_metrika"
                      value={seoSettings.yandex_metrika}
                      onChange={(e) => setSeoSettings({...seoSettings, yandex_metrika: e.target.value})}
                      placeholder="12345678"
                    />
                    <p className="text-xs text-gray-400">
                      Номер счетчика Яндекс.Метрики
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yandex_webmaster">Яндекс.Вебмастер</Label>
                    <Input
                      id="yandex_webmaster"
                      value={seoSettings.yandex_webmaster}
                      onChange={(e) => setSeoSettings({...seoSettings, yandex_webmaster: e.target.value})}
                      placeholder="yandex-verification=xxxxxx"
                    />
                    <p className="text-xs text-gray-400">
                      Meta-тег для верификации Яндекс.Вебмастера
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-4">Статус интеграции</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <Badge className={seoSettings.google_analytics ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {seoSettings.google_analytics ? 'Подключено' : 'Не настроено'}
                    </Badge>
                    <p className="text-gray-300 text-sm mt-1">Google Analytics</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <Badge className={seoSettings.yandex_metrika ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {seoSettings.yandex_metrika ? 'Подключено' : 'Не настроено'}
                    </Badge>
                    <p className="text-gray-300 text-sm mt-1">Яндекс.Метрика</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <Badge className={seoSettings.google_search_console ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {seoSettings.google_search_console ? 'Подключено' : 'Не настроено'}
                    </Badge>
                    <p className="text-gray-300 text-sm mt-1">Search Console</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <Badge className={seoSettings.yandex_webmaster ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {seoSettings.yandex_webmaster ? 'Подключено' : 'Не настроено'}
                    </Badge>
                    <p className="text-gray-300 text-sm mt-1">Яндекс.Вебмастер</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Robots & Sitemap Tab */}
        <TabsContent value="robots">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Robots.txt */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Robots.txt</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={previewRobots}
                    >
                      Обновить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(robotsPreview)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="robots_txt">Содержимое robots.txt</Label>
                    <Textarea
                      id="robots_txt"
                      value={seoSettings.robots_txt || getDefaultRobots()}
                      onChange={(e) => setSeoSettings({...seoSettings, robots_txt: e.target.value})}
                      placeholder={getDefaultRobots()}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    <a
                      href="/robots.txt"
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Посмотреть текущий robots.txt
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sitemap */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Sitemap.xml</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={previewSitemap}
                    >
                      Обновить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(sitemapPreview)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sitemap_enabled"
                      checked={seoSettings.sitemap_enabled}
                      onChange={(e) => setSeoSettings({...seoSettings, sitemap_enabled: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="sitemap_enabled">Включить генерацию sitemap.xml</Label>
                  </div>
                  
                  {sitemapPreview && (
                    <div className="space-y-2">
                      <Label>Предварительный просмотр</Label>
                      <Textarea
                        value={sitemapPreview.substring(0, 500) + (sitemapPreview.length > 500 ? '...' : '')}
                        readOnly
                        rows={8}
                        className="font-mono text-sm bg-gray-700"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Посмотреть текущий sitemap.xml
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Дополнительные SEO настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium">Структурированные данные</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="structured_data"
                      checked={seoSettings.structured_data}
                      onChange={(e) => setSeoSettings({...seoSettings, structured_data: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="structured_data">Включить микроразметку Schema.org</Label>
                  </div>
                  <p className="text-gray-400 text-sm ml-6">
                    Автоматическое добавление структурированных данных для товаров и организации
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="open_graph"
                      checked={seoSettings.open_graph}
                      onChange={(e) => setSeoSettings({...seoSettings, open_graph: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="open_graph">Включить Open Graph метатеги</Label>
                  </div>
                  <p className="text-gray-400 text-sm ml-6">
                    Оптимизация для социальных сетей (Facebook, VK, и др.)
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-4">Статус SEO функций</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Sitemap.xml</span>
                    <Badge className={seoSettings.sitemap_enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {seoSettings.sitemap_enabled ? 'Включен' : 'Отключен'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Структурированные данные</span>
                    <Badge className={seoSettings.structured_data ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                      {seoSettings.structured_data ? 'Включены' : 'Отключены'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Open Graph</span>
                    <Badge className={seoSettings.open_graph ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                      {seoSettings.open_graph ? 'Включен' : 'Отключен'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Robots.txt</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Активен
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Рекомендации по SEO:</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>• Обязательно настройте Google Analytics и Яндекс.Метрику для отслеживания трафика</p>
                    <p>• Подтвердите права на сайт в Google Search Console и Яндекс.Вебмастере</p>
                    <p>• Включите структурированные данные для лучшего понимания контента поисковиками</p>
                    <p>• Регулярно проверяйте sitemap.xml на актуальность</p>
                    <p>• Используйте Open Graph для оптимизации отображения в социальных сетях</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
          {loading ? 'Сохранение...' : 'Сохранить все настройки'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSEO;