import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/catalog/ProductCard';
import CatalogFilters from '../components/catalog/CatalogFilters';
import CatalogSort from '../components/catalog/CatalogSort';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { products } from '../data/mockData';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 1000000],
    availability: [],
    rating: 0
  });

  // Search and filter products
  const searchResults = useMemo(() => {
    if (!query) return [];
    
    let filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase())
    );

    // Apply filters
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

    // Sort results
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
        // relevance - keep search order
        break;
    }

    return filtered;
  }, [query, filters, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {query ? `Результаты поиска: "${query}"` : 'Поиск товаров'}
            </h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pr-12 h-12 text-lg"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600 h-10"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          {query && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <CatalogFilters 
                  filters={filters} 
                  onFiltersChange={setFilters}
                  products={products}
                />
              </div>

              {/* Search Results */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-gray-400">
                      Найдено: {searchResults.length} товаров
                    </p>
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

                {/* Results Grid */}
                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Ничего не найдено
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {query 
                        ? `По запросу "${query}" ничего не найдено. Попробуйте изменить запрос или очистить фильтры.`
                        : 'Введите запрос для поиска товаров'
                      }
                    </p>
                    {query && (
                      <div className="space-y-3">
                        <p className="text-gray-400 text-sm">Попробуйте:</p>
                        <ul className="text-gray-400 text-sm space-y-1">
                          <li>• Проверить правильность написания</li>
                          <li>• Использовать другие ключевые слова</li>
                          <li>• Очистить фильтры</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {searchResults.map((product) => (
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;