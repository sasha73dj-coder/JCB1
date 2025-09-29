import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const CatalogSort = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'popularity', label: 'По популярности' },
    { value: 'price-asc', label: 'Цена: по возрастанию' },
    { value: 'price-desc', label: 'Цена: по убыванию' },
    { value: 'rating', label: 'По рейтингу' },
    { value: 'name', label: 'По алфавиту' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-400 text-sm whitespace-nowrap">Сортировка:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-white hover:bg-gray-700 focus:bg-gray-700"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CatalogSort;