import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

const HeroSection = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Гарантия качества",
      description: "Только оригинальные запчасти"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Быстрая доставка",
      description: "По всей России"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "В наличии",
      description: "Более 10 000 позиций"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.1'/></svg>")`
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <span className="text-orange-400 text-sm font-medium">Официальный дилер JCB</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Оригинальные
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  запчасти JCB
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Прямые поставки от производителя. Гарантия качества и надежности 
                для вашей спецтехники.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3">
                  Перейти в каталог
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                Подобрать запчасть
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-orange-500 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                        <p className="text-gray-400 text-xs mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">10K+</div>
                  <div className="text-gray-300 text-sm">Товаров в наличии</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">5K+</div>
                  <div className="text-gray-300 text-sm">Довольных клиентов</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">10+</div>
                  <div className="text-gray-300 text-sm">Лет опыта</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                  <div className="text-gray-300 text-sm">Поддержка</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;