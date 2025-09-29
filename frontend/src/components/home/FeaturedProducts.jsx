import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { featuredProducts } from '../../data/mockData';

const FeaturedProducts = () => {
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

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Рекомендуемые товары
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Популярные и новые запчасти для вашей техники
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group bg-gray-900 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg bg-gray-800 h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
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
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Product Info */}
                  <div>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-white text-sm leading-tight hover:text-orange-400 transition-colors line-clamp-2">
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
                    
                    {/* Stock Status */}
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
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/catalog">
            <Button variant="outline" size="lg" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
              Посмотреть все товары
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;