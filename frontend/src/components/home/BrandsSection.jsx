import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { brands } from '../../data/mockData';

const BrandsSection = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Наши бренды
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Мы работаем только с проверенными производителями
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} to={`/catalog/${brand.slug}`}>
              <Card className="group bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-600 transition-colors">
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white">
                      {brand.name.substring(0, 3)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                    {brand.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;