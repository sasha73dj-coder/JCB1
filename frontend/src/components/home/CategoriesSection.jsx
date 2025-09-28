import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { categories } from '../../data/mockData';

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Популярные категории
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Выберите нужную категорию запчастей для вашей спецтехники
          </p>
          <Link 
            to="/catalog" 
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mt-4"
          >
            Все категории <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/catalog/${category.slug}`}>
              <Card className="group bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-orange-500">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {category.subcategories.slice(0, 4).map((subcategory) => (
                      <div key={subcategory.id} className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
                        {subcategory.name}
                      </div>
                    ))}
                    {category.subcategories.length > 4 && (
                      <div className="text-gray-500 text-xs">
                        +{category.subcategories.length - 4} еще...
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {category.subcategories.length} подкатегорий
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;