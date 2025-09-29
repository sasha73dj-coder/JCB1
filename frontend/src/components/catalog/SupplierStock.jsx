import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Clock, 
  Truck, 
  Star, 
  MapPin, 
  Package,
  CheckCircle
} from 'lucide-react';

const SupplierStock = ({ productId, onAddToCart }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // Mock supplier offers for a product
  const supplierOffers = [
    {
      supplierId: 1,
      supplierName: 'АвтоЗапчасти Москва',
      supplierCode: 'AZM',
      region: 'Москва',
      rating: 4.8,
      price: 185000,
      originalPrice: 195000,
      stock: 5,
      deliveryDays: 1,
      isVerified: true,
      orderCount: 1250,
      lastUpdate: '10 мин назад'
    },
    {
      supplierId: 2,
      supplierName: 'ЗапчастиПро СПб',
      supplierCode: 'ZPS',
      region: 'Санкт-Петербург',
      rating: 4.6,
      price: 189000,
      originalPrice: 198000,
      stock: 3,
      deliveryDays: 2,
      isVerified: true,
      orderCount: 890,
      lastUpdate: '15 мин назад'
    },
    {
      supplierId: 3,
      supplierName: 'ТракторЗапчасти',
      supplierCode: 'TZ',
      region: 'Екатеринбург',
      rating: 4.2,
      price: 192000,
      originalPrice: 205000,
      stock: 1,
      deliveryDays: 3,
      isVerified: false,
      orderCount: 320,
      lastUpdate: '1 час назад'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getStockColor = (stock) => {
    if (stock > 5) return 'text-green-400';
    if (stock > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDeliveryText = (days) => {
    if (days === 1) return '1 день';
    if (days < 5) return `${days} дня`;
    return `${days} дней`;
  };

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    onAddToCart?.({
      productId,
      supplierId: offer.supplierId,
      price: offer.price,
      deliveryDays: offer.deliveryDays,
      supplierName: offer.supplierName
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Предложения поставщиков</h3>
        <Badge className="bg-blue-500/20 text-blue-400">
          {supplierOffers.length} предложений
        </Badge>
      </div>
      
      <div className="space-y-3">
        {supplierOffers.map((offer) => (
          <Card 
            key={offer.supplierId} 
            className={`bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-all cursor-pointer ${
              selectedOffer?.supplierId === offer.supplierId ? 'border-orange-500 bg-gray-700' : ''
            }`}
            onClick={() => handleSelectOffer(offer)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Supplier Info */}
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                      {offer.supplierCode}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{offer.supplierName}</span>
                        {offer.isVerified && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{offer.region}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                          <span>{offer.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="h-3 w-3" />
                          <span>{offer.orderCount} заказов</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock and Delivery */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className={`font-medium ${getStockColor(offer.stock)}`}>
                        {offer.stock > 0 ? `${offer.stock} шт.` : 'Нет в наличии'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">
                        До склада: {getDeliveryText(offer.deliveryDays)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 text-xs">{offer.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-white mb-1">
                    {formatPrice(offer.price)} ₽
                  </div>
                  {offer.originalPrice > offer.price && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(offer.originalPrice)} ₽
                    </div>
                  )}
                  
                  {selectedOffer?.supplierId === offer.supplierId ? (
                    <Badge className="bg-orange-500 text-white mt-2">
                      Выбрано
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOffer(offer);
                      }}
                      disabled={offer.stock === 0}
                    >
                      Выбрать
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Summary */}
      {selectedOffer && (
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-400 font-medium mb-1">Выбранное предложение</div>
                <div className="text-white text-sm">
                  {selectedOffer.supplierName} • {formatPrice(selectedOffer.price)} ₽ • 
                  Доставка до склада: {getDeliveryText(selectedOffer.deliveryDays)}
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Clock className="h-4 w-4 text-blue-400 mt-0.5" />
          <div className="text-blue-300 text-sm">
            <div className="font-medium mb-1">Как работает система поставщиков:</div>
            <ul className="text-xs space-y-1 text-blue-200">
              <li>• Остатки обновляются каждые 10-15 минут</li>
              <li>• Цены включают наценку и доставку до нашего склада</li>
              <li>• После поступления на склад - доставка к вам 1-2 дня</li>
              <li>• Проверенные поставщики отмечены галочкой</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierStock;