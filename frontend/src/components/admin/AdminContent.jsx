import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Image,
  File,
  Video,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminContent = () => {
  const [pages, setPages] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    active: true
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  const loadPages = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/pages`);
      const data = await response.json();
      if (data.success) {
        setPages(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки страниц:', error);
    }
  };

  const loadMediaFiles = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/media`);
      const data = await response.json();
      if (data.success) {
        setMediaFiles(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки медиафайлов:', error);
    }
  };

  const createPage = async () => {
    try {
      // Генерируем slug из title если не задан
      if (!newPage.slug) {
        newPage.slug = newPage.title
          .toLowerCase()
          .replace(/[^a-zа-я0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }

      const response = await fetch(`${backendUrl}/api/admin/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPage),
      });

      const data = await response.json();
      
      if (data.success) {
        setPages([...pages, data.data]);
        setIsAddPageOpen(false);
        resetNewPage();
        alert('Страница создана');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка создания страницы:', error);
      alert('Ошибка создания страницы');
    }
  };

  const updatePage = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPage),
      });

      const data = await response.json();
      
      if (data.success) {
        setPages(pages.map(p => p.id === editingPage.id ? data.data : p));
        setIsEditPageOpen(false);
        setEditingPage(null);
        alert('Страница обновлена');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка обновления страницы:', error);
      alert('Ошибка обновления страницы');
    }
  };

  const deletePage = async (pageId) => {
    if (!confirm('Удалить страницу?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setPages(pages.filter(p => p.id !== pageId));
        alert('Страница удалена');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка удаления страницы:', error);
      alert('Ошибка удаления страницы');
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${backendUrl}/api/admin/media/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setMediaFiles([...mediaFiles, data.data]);
        alert('Файл загружен');
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      alert('Ошибка загрузки файла');
    }
  };

  const resetNewPage = () => {
    setNewPage({
      title: '',
      slug: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      active: true
    });
  };

  const getFileIcon = (contentType) => {
    if (contentType?.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (contentType?.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadPages(), loadMediaFiles()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Управление контентом</h1>
            <p className="text-gray-400">Страницы и медиафайлы</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Страницы ({pages.length})
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Медиафайлы ({mediaFiles.length})
          </TabsTrigger>
        </TabsList>

        {/* Pages Tab */}
        <TabsContent value="pages">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Страницы сайта</CardTitle>
                <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить страницу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Создание новой страницы</DialogTitle>
                    </DialogHeader>
                    <PageForm page={newPage} setPage={setNewPage} onSave={createPage} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pages.map((page) => (
                  <div key={page.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{page.title}</h3>
                          <Badge variant={page.active ? 'default' : 'secondary'}>
                            {page.active ? 'Активна' : 'Скрыта'}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">/{page.slug}</p>
                        {page.meta_description && (
                          <p className="text-gray-500 text-sm">{page.meta_description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => {
                            setEditingPage(page);
                            setIsEditPageOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => deletePage(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {pages.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">Страницы не найдены</h3>
                    <p className="text-gray-400">Создайте первую страницу</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Медиафайлы</CardTitle>
                <div>
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) uploadFile(file);
                    }}
                  />
                  <Button
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    onClick={() => document.getElementById('fileUpload').click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Загрузить файл
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaFiles.map((file) => (
                  <div key={file.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getFileIcon(file.content_type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {file.original_filename}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    
                    {file.content_type?.startsWith('image/') && (
                      <div className="mb-3">
                        <img
                          src={file.url}
                          alt={file.original_filename}
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <p className="text-gray-400 text-xs font-mono bg-gray-700 p-2 rounded">
                        {file.url}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Загружен: {new Date(file.uploaded_at).toLocaleDateString('ru-RU')}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => navigator.clipboard.writeText(file.url)}
                        >
                          Копировать URL
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {mediaFiles.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Upload className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">Файлы не найдены</h3>
                    <p className="text-gray-400">Загрузите первый файл</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Page Modal */}
      <Dialog open={isEditPageOpen} onOpenChange={setIsEditPageOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование страницы</DialogTitle>
          </DialogHeader>
          {editingPage && (
            <PageForm 
              page={editingPage} 
              setPage={setEditingPage} 
              onSave={updatePage}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Page Form Component
const PageForm = ({ page, setPage, onSave, isEdit = false }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Содержание</TabsTrigger>
          <TabsTrigger value="seo">SEO настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок *</Label>
              <Input
                id="title"
                value={page.title}
                onChange={(e) => setPage({...page, title: e.target.value})}
                placeholder="Заголовок страницы"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL (slug) *</Label>
              <Input
                id="slug"
                value={page.slug}
                onChange={(e) => setPage({...page, slug: e.target.value})}
                placeholder="page-url"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Содержание *</Label>
            <Textarea
              id="content"
              value={page.content}
              onChange={(e) => setPage({...page, content: e.target.value})}
              placeholder="Содержание страницы..."
              rows={10}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              checked={page.active}
              onChange={(e) => setPage({...page, active: e.target.checked})}
              className="rounded"
            />
            <Label htmlFor="active">Опубликовать страницу</Label>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={page.meta_title || ''}
              onChange={(e) => setPage({...page, meta_title: e.target.value})}
              placeholder="SEO заголовок страницы"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={page.meta_description || ''}
              onChange={(e) => setPage({...page, meta_description: e.target.value})}
              placeholder="SEO описание страницы"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input
              id="meta_keywords"
              value={page.meta_keywords || ''}
              onChange={(e) => setPage({...page, meta_keywords: e.target.value})}
              placeholder="Ключевые слова, разделенные запятыми"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline">
          Отмена
        </Button>
        <Button onClick={onSave}>
          {isEdit ? 'Сохранить изменения' : 'Создать страницу'}
        </Button>
      </div>
    </div>
  );
};

export default AdminContent;