import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Clock, Package, Zap, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { products, reviews } from '../data/mockData';

const ProductPage = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [supplierOffers, setSupplierOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  
  const product = products.find(p => p.slug === slug);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            Товар не найден
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 fill-orange-400/50 text-orange-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-600" />);
    }
    
    return stars;
  };

  const productReviews = reviews.filter(r => r.productId === product.id);

  const breadcrumbItems = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: product.name, path: `/product/${product.slug}` }
  ];

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gray-800 rounded-lg aspect-square flex items-center justify-center">
                <span className="text-gray-500">Фото товара</span>
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((index) => (
                  <button
                    key={index}
                    className={`bg-gray-800 rounded-lg aspect-square flex items-center justify-center hover:bg-gray-700 transition-colors ${
                      selectedImage === index - 1 ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setSelectedImage(index - 1)}
                  >
                    <span className="text-gray-500 text-xs">{index}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.includes('новинка') && (
                  <Badge className="bg-green-500 text-white">Новинка</Badge>
                )}
                {product.tags.includes('хит') && (
                  <Badge className="bg-red-500 text-white">Хит</Badge>
                )}
                {product.discount > 0 && (
                  <Badge className="bg-orange-500 text-white">-{product.discount}%</Badge>
                )}
              </div>

              {/* Title and Rating */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-white font-semibold">{product.rating}</span>
                    <span className="text-gray-400">({product.reviewsCount} отзывов)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>Артикул: <span className="text-white">{product.sku}</span></div>
                  <div>Бренд: <span className="text-white">{product.brand}</span></div>
                  <div>Страна: <span className="text-white">{product.country}</span></div>
                  <div>Наличие: 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      product.stockLevel === 'много' 
                        ? 'bg-green-500/20 text-green-400' 
                        : product.stockLevel === 'мало'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.availability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(product.price)} ₽
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)} ₽
                    </span>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="text-green-400">
                    Экономия: {formatPrice(product.originalPrice - product.price)} ₽
                  </p>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-white">Количество:</label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="border-gray-600 text-white"
                    >
                      -
                    </Button>
                    <span className="text-white px-4">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="border-gray-600 text-white"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Добавить в корзину
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="border-gray-600">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" className="border-gray-600">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Truck className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-white text-sm font-semibold">Быстрая доставка</div>
                    <div className="text-gray-400 text-xs">По всей России</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-white text-sm font-semibold">Гарантия</div>
                    <div className="text-gray-400 text-xs">Официальная гарантия</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-white text-sm font-semibold">В наличии</div>
                    <div className="text-gray-400 text-xs">Отправка сегодня</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex bg-gray-800 border-gray-700">
                <TabsTrigger value="description" className="text-white data-[state=active]:bg-orange-500">
                  Описание
                </TabsTrigger>
                <TabsTrigger value="specifications" className="text-white data-[state=active]:bg-orange-500">
                  Характеристики
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-orange-500">
                  Отзывы ({productReviews.length})
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="description">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <p className="text-gray-300 leading-relaxed">{product.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="specifications">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700">
                            <span className="text-gray-400">{key}</span>
                            <span className="text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {productReviews.length === 0 ? (
                          <p className="text-gray-400 text-center py-8">
                            Пока нет отзывов о данном товаре
                          </p>
                        ) : (
                          productReviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-semibold">{review.name}</span>
                                  <div className="flex items-center">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <span className="text-gray-400 text-sm">{review.date}</span>
                              </div>
                              <p className="text-gray-300">{review.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;