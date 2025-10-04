import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Clock, Package, Zap, TrendingUp, RotateCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { productsStorage, cartStorage } from '../utils/storage';
import { reviews } from '../data/mockData';

const ProductPage = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [supplierOffers, setSupplierOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [product, setProduct] = useState(null);
  
  // Load supplier offers
  useEffect(() => {
    if (product?.id) {
      fetchSupplierOffers(product.id);
    }
  }, [product?.id]);

  const fetchSupplierOffers = async (productId) => {
    try {
      setLoadingOffers(true);
      const response = await fetch(`${BACKEND_URL}/api/products/${productId}/offers`);
      if (response.ok) {
        const offers = await response.json();
        setSupplierOffers(offers);
      } else {
        console.log('No offers found or error fetching offers');
        setSupplierOffers([]);
      }
    } catch (error) {
      console.error('Error fetching supplier offers:', error);
      setSupplierOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      const userId = getCurrentUserId();
      
      const response = await fetch(`${BACKEND_URL}/api/cart/${userId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity
        })
      });
      
      if (response.ok) {
        // Show success message or update cart counter
        alert(`Товар "${product.name}" добавлен в корзину!`);
      } else {
        alert('Ошибка добавления в корзину');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Ошибка добавления в корзину');
    } finally {
      setAddingToCart(false);
    }
  };

  const addSupplierOfferToCart = async (offer) => {
    try {
      const userId = getCurrentUserId();
      
      const response = await fetch(`${BACKEND_URL}/api/cart/${userId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: offer.product_id,
          quantity: 1
        })
      });
      
      if (response.ok) {
        alert(`Предложение от "${offer.supplier_name}" добавлено в корзину!`);
      } else {
        alert('Ошибка добавления в корзину');
      }
    } catch (error) {
      console.error('Error adding supplier offer to cart:', error);
      alert('Ошибка добавления в корзину');
    }
  };

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
                    onClick={addToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {addingToCart ? (
                      <>
                        <RotateCw className="h-5 w-5 mr-2 animate-spin" />
                        Добавление...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Добавить в корзину
                      </>
                    )}
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

          {/* Supplier Offers Section */}
          <div className="mt-12">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Package className="h-5 w-5 mr-2 text-orange-500" />
                  Предложения поставщиков
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOffers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 animate-pulse text-orange-400" />
                      <span className="text-gray-400">Загрузка предложений поставщиков...</span>
                    </div>
                  </div>
                ) : supplierOffers.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">Предложения поставщиков не найдены</p>
                    <p className="text-gray-500 text-sm">Товар может быть добавлен по запросу</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      Найдено {supplierOffers.length} предложений от поставщиков
                    </div>
                    
                    <div className="grid gap-4">
                      {supplierOffers.map((offer) => (
                        <Card key={offer.id} className="bg-gray-700 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                                    {offer.supplier_name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-semibold">{offer.supplier_name}</h4>
                                    <div className="flex items-center space-x-2 text-xs">
                                      <div className="flex items-center">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                        <span className="text-gray-300">{offer.supplier_rating.toFixed(1)}</span>
                                      </div>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-gray-400">Артикул: {offer.part_number}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <div className="text-xs text-gray-400">Цена для вас</div>
                                    <div className="text-white font-bold text-lg">
                                      {formatPrice(offer.client_price)} ₽
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-xs text-gray-400">В наличии</div>
                                    <div className="text-green-400 font-semibold">
                                      {offer.stock_quantity} шт
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-xs text-gray-400">Доставка</div>
                                    <div className="text-white font-semibold">
                                      {offer.delivery_time_days === 0 ? 'Сегодня' : 
                                       offer.delivery_time_days === 1 ? '1 день' : 
                                       `${offer.delivery_time_days} дня`}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-xs text-gray-400">Обновлено</div>
                                    <div className="text-gray-300 text-sm">
                                      {new Date(offer.last_updated).toLocaleDateString('ru-RU')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="ml-4">
                                <Button 
                                  size="sm" 
                                  onClick={() => addSupplierOfferToCart(offer)}
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  В корзину
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Best offer highlight */}
                    {supplierOffers.length > 1 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-green-400" />
                          <span className="text-green-400 font-semibold">Лучшее предложение</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Самая низкая цена: <span className="text-white font-bold">
                            {formatPrice(Math.min(...supplierOffers.map(o => o.client_price)))} ₽
                          </span> от поставщика {supplierOffers.find(o => o.client_price === Math.min(...supplierOffers.map(s => s.client_price)))?.supplier_name}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
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