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

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getStockColor = (stockLevel) => {
    switch (stockLevel) {
      case 'много':
        return 'bg-green-500/20 text-green-400';
      case 'мало':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-red-500/20 text-red-400';
    }
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
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Button>
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
                {currentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 text-xs">Фото</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-gray-400 text-xs mt-1">
                            Рейтинг: {product.rating} ({product.reviewsCount})
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300 font-mono text-sm">{product.sku}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{product.brand}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-white font-semibold">{formatPrice(product.price)} ₽</span>
                        {product.originalPrice && (
                          <div className="text-gray-400 text-xs line-through">
                            {formatPrice(product.originalPrice)} ₽
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStockColor(product.stockLevel)}>
                        {product.availability}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500/20 text-green-400">
                        Активный
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-gray-400 text-sm">
                Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} из {filteredProducts.length} товаров
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-600 text-gray-300"
                >
                  Назад
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'border-gray-600 text-gray-300'
                    }
                  >
                    {page}
                  </Button>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-600 text-gray-300"
                >
                  Далее
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;