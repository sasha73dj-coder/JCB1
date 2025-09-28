import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-orange-400/50 text-orange-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-600" />);
    }
    
    return stars;
  };

  if (viewMode === 'list') {
    return (
      <Card className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-500 text-xs">Фото</span>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags.includes('новинка') && (
                      <Badge className="bg-green-500 text-white text-xs">Новинка</Badge>
                    )}
                    {product.tags.includes('хит') && (
                      <Badge className="bg-red-500 text-white text-xs">Хит</Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge className="bg-orange-500 text-white text-xs">-{product.discount}%</Badge>
                    )}
                  </div>

                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-white text-lg hover:text-orange-400 transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                    <span>Артикул: {product.sku}</span>
                    <span>Бренд: {product.brand}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stockLevel === 'много' 
                        ? 'bg-green-500/20 text-green-400' 
                        : product.stockLevel === 'мало'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.availability}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-gray-400 text-sm">({product.reviewsCount})</span>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Price and Actions */}
                <div className="text-right ml-4">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatPrice(product.price)} ₽
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)} ₽
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      В корзину
                    </Button>
                    
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="border-gray-600">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg bg-gray-700 h-48">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Фото товара</span>
          </div>
          
          {/* Product Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.tags.includes('новинка') && (
              <Badge className="bg-green-500 text-white text-xs">Новинка</Badge>
            )}
            {product.tags.includes('хит') && (
              <Badge className="bg-red-500 text-white text-xs">Хит</Badge>
            )}
            {product.discount > 0 && (
              <Badge className="bg-orange-500 text-white text-xs">-{product.discount}%</Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
            <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Product Info */}
          <div>
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-semibold text-white text-sm leading-tight hover:text-orange-400 transition-colors line-clamp-2 min-h-[40px]">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-400 text-xs mt-1">Артикул: {product.sku}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-400 text-xs">({product.reviewsCount})</span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-white">
                {formatPrice(product.price)} ₽
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)} ₽
                </span>
              )}
            </div>
            
            {/* Stock Status and Brand */}
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.stockLevel === 'много' 
                  ? 'bg-green-500/20 text-green-400' 
                  : product.stockLevel === 'мало'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {product.availability}
              </span>
              <span className="text-gray-400 text-xs">{product.brand}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            В корзину
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;