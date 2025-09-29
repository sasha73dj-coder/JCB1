import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

const CatalogFilters = ({ filters, onFiltersChange, products }) => {
  // Get unique brands from products
  const brands = [...new Set(products.map(p => p.brand))].sort();
  
  // Get unique availability options
  const availabilityOptions = [...new Set(products.map(p => p.availability))].sort();
  
  // Price range
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  const handleBrandChange = (brand, checked) => {
    const newBrands = checked 
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleAvailabilityChange = (availability, checked) => {
    const newAvailability = checked 
      ? [...filters.availability, availability]
      : filters.availability.filter(a => a !== availability);
    
    onFiltersChange({ ...filters, availability: newAvailability });
  };

  const handlePriceRangeChange = (newRange) => {
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, rating });
  };

  const clearFilters = () => {
    onFiltersChange({
      brands: [],
      priceRange: [minPrice, maxPrice],
      availability: [],
      rating: 0
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const hasActiveFilters = filters.brands.length > 0 || 
                          filters.availability.length > 0 || 
                          filters.rating > 0 || 
                          filters.priceRange[0] !== minPrice || 
                          filters.priceRange[1] !== maxPrice;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Фильтры</h2>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-orange-400 hover:text-orange-300"
          >
            Очистить
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {filters.brands.map(brand => (
                <Badge key={brand} variant="secondary" className="bg-orange-500 text-white">
                  {brand}
                  <button 
                    onClick={() => handleBrandChange(brand, false)}
                    className="ml-1 hover:bg-orange-600 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.availability.map(availability => (
                <Badge key={availability} variant="secondary" className="bg-green-500 text-white">
                  {availability}
                  <button 
                    onClick={() => handleAvailabilityChange(availability, false)}
                    className="ml-1 hover:bg-green-600 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="bg-yellow-500 text-white">
                  От {filters.rating} звезд
                  <button 
                    onClick={() => handleRatingChange(0)}
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Цена</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={maxPrice}
            min={minPrice}
            step={1000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{formatPrice(filters.priceRange[0])} ₽</span>
            <span>{formatPrice(filters.priceRange[1])} ₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Бренд</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked)}
              />
              <label 
                htmlFor={`brand-${brand}`} 
                className="text-gray-300 cursor-pointer flex-1"
              >
                {brand}
              </label>
              <span className="text-gray-500 text-xs">
                ({products.filter(p => p.brand === brand).length})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Наличие</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availabilityOptions.map(availability => (
            <div key={availability} className="flex items-center space-x-2">
              <Checkbox
                id={`availability-${availability}`}
                checked={filters.availability.includes(availability)}
                onCheckedChange={(checked) => handleAvailabilityChange(availability, checked)}
              />
              <label 
                htmlFor={`availability-${availability}`} 
                className="text-gray-300 cursor-pointer flex-1"
              >
                {availability}
              </label>
              <span className="text-gray-500 text-xs">
                ({products.filter(p => p.availability === availability).length})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Рейтинг</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating === filters.rating ? 0 : rating)}
              className={`w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition-colors ${
                filters.rating === rating ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`text-sm ${
                      i < rating ? 'text-orange-400' : 'text-gray-600'
                    }`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-300 text-sm">от {rating} звезд</span>
                <span className="text-gray-500 text-xs ml-auto">
                  ({products.filter(p => p.rating >= rating).length})
                </span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogFilters;