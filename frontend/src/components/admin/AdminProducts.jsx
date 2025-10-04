import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Download,
  RotateCw,
  Package
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { productsStorage } from '../../utils/storage';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = productsStorage.getAll();
    setProducts(allProducts);
  };

  const deleteProduct = (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }
    
    const success = productsStorage.delete(productId);
    
    if (success) {
      loadProducts();
      toast({
        title: 'Товар удален',
        description: 'Товар успешно удален из каталога'
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Управление товарами</h1>
          <p className="text-gray-400">Всего товаров: {products.length}</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Upload className="h-4 w-4 mr-2" />
            Импорт
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Plus className="h-4 w-4 mr-2" />
                Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Добавить новый товар</DialogTitle>
              </DialogHeader>
              <ProductForm 
                onClose={() => setIsAddingProduct(false)} 
                onSave={() => {
                  loadProducts();
                  setIsAddingProduct(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию, артикулу или бренду..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                />
              </div>
            </div>
            
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Список товаров ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Товар</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Артикул</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Бренд</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Цена</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Наличие</th>
                  <th className="text-left text-gray-400 font-medium py-3 px-4">Статус</th>
                  <th className="text-right text-gray-400 font-medium py-3 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <RotateCw className="h-5 w-5 animate-spin text-orange-400" />
                        <span className="text-gray-400">Загрузка товаров...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 px-4 text-center text-gray-400">
                      Товары не найдены
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                            ) : (
                              <Package className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white font-medium text-sm line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">
                              {product.description ? product.description.substring(0, 50) + '...' : 'Без описания'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300 font-mono text-sm">{product.part_number}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">{product.brand}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className="text-white font-semibold">
                            {product.base_price ? formatPrice(product.base_price) + ' ₽' : 'Не указана'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {product.category || 'Общая'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-green-500/20 text-green-400">
                          Активен
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-yellow-400 hover:text-yellow-300"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteProduct(product.id)}
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
      
      {/* Edit Product Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Редактирование товара</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)} 
              onSave={() => {
                loadProducts();
                setSelectedProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ product = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    part_number: product?.part_number || '',
    brand: product?.brand || '',
    category: product?.category || '',
    base_price: product?.base_price || '',
    image_url: product?.image_url || ''
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      try {
        // Prepare data
        const productData = {
          ...formData,
          base_price: formData.base_price ? parseFloat(formData.base_price) : null,
          slug: generateSlug(formData.name)
        };
        
        let savedProduct;
        
        if (product) {
          // Update existing product
          savedProduct = productsStorage.update(product.id, productData);
        } else {
          // Create new product
          savedProduct = productsStorage.create(productData);
        }
        
        if (savedProduct) {
          toast({
            title: product ? 'Товар обновлен' : 'Товар добавлен',
            description: 'Данные успешно сохранены'
          });
          
          if (onSave) {
            onSave(savedProduct);
          }
          
          onClose();
        } else {
          throw new Error('Ошибка сохранения товара');
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
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Название товара</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="part_number" className="text-white">Артикул</Label>
          <Input
            id="part_number"
            value={formData.part_number}
            onChange={(e) => setFormData({...formData, part_number: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="bg-gray-700 border-gray-600 text-white"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-white">Бренд</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white">Категория</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="base_price" className="text-white">Цена (₽)</Label>
          <Input
            id="base_price"
            type="number"
            value={formData.base_price}
            onChange={(e) => setFormData({...formData, base_price: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url" className="text-white">URL изображения</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="border-gray-600 text-gray-300"
        >
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
              {product ? 'Обновить' : 'Добавить'} товар
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AdminProducts;