import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/catalog/ProductCard';
import CatalogFilters from '../components/catalog/CatalogFilters';
import CatalogSort from '../components/catalog/CatalogSort';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { products, categories } from '../data/mockData';

const CatalogPage = () => {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 1000000],
    availability: [],
    rating: 0
  });

  // Find current category and subcategory
  const currentCategory = categories.find(cat => cat.slug === category);
  const currentSubcategory = currentCategory?.subcategories.find(sub => sub.slug === subcategory);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (currentCategory) {
      filtered = filtered.filter(product => product.categoryId === currentCategory.id);
    }

    // Filter by subcategory
    if (currentSubcategory) {
      filtered = filtered.filter(product => product.subcategoryId === currentSubcategory.id);
    }

    // Apply other filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }

    if (filters.availability.length > 0) {
      filtered = filtered.filter(product => filters.availability.includes(product.availability));
    }

    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // popularity - keep original order
        break;
    }

    return filtered;
  }, [currentCategory, currentSubcategory, filters, sortBy]);

  const breadcrumbItems = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' }
  ];

  if (currentCategory) {
    breadcrumbItems.push({
      name: currentCategory.name,
      path: `/catalog/${currentCategory.slug}`
    });
  }

  if (currentSubcategory) {
    breadcrumbItems.push({
      name: currentSubcategory.name,
      path: `/catalog/${currentCategory.slug}/${currentSubcategory.slug}`
    });
  }

  const pageTitle = currentSubcategory ? currentSubcategory.name : 
                   currentCategory ? currentCategory.name : 'Каталог товаров';

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <CatalogFilters 
                filters={filters} 
                onFiltersChange={setFilters}
                products={products}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {pageTitle}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span>Найдено: {filteredProducts.length} товаров</span>
                    {(filters.brands.length > 0 || filters.availability.length > 0 || filters.rating > 0) && (
                      <Badge variant="secondary">
                        Фильтры применены
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden border-gray-600 text-gray-300"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Фильтры
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-600 rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      className="border-0 rounded-none"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className="border-0 rounded-none border-l border-gray-600"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort */}
                  <CatalogSort sortBy={sortBy} onSortChange={setSortBy} />
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">
                    По вашему запросу ничего не найдено
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      brands: [],
                      priceRange: [0, 1000000],
                      availability: [],
                      rating: 0
                    })}
                  >
                    Очистить фильтры
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CatalogPage;