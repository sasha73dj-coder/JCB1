import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  FileText,
  Image,
  Palette,
  CreditCard,
  Link,
  Truck,
  MessageSquare,
  Database,
  Search
} from 'lucide-react';

const AdminSidebar = ({ currentView, onViewChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Панель управления',
      icon: <LayoutDashboard className="h-5 w-5" />,
      badge: null
    },
    {
      id: 'products',
      name: 'Товары',
      icon: <Package className="h-5 w-5" />,
      badge: '1,234'
    },
    {
      id: 'orders',
      name: 'Заказы',
      icon: <ShoppingCart className="h-5 w-5" />,
      badge: '23'
    },
    {
      id: 'suppliers',
      name: 'Поставщики',
      icon: <Truck className="h-5 w-5" />,
      badge: '3'
    },
    {
      id: 'integrations',
      name: 'Интеграции',
      icon: <Link className="h-5 w-5" />,
      badge: 'NEW'
    },
    {
      id: 'payments',
      name: 'Платежи',
      icon: <CreditCard className="h-5 w-5" />,
      badge: null
    },
    {
      id: 'api-integration',
      name: 'API интеграция',
      icon: <BarChart3 className="h-5 w-5" />,
      badge: null
    },
    {
      id: 'users',
      name: 'Пользователи',
      icon: <Users className="h-5 w-5" />,
      badge: '567'
    },
    {
      id: 'sms',
      name: 'SMS настройки',
      icon: <MessageSquare className="h-5 w-5" />,
      badge: null
    },
    {
      id: 'content',
      name: 'Контент',
      icon: <FileText className="h-5 w-5" />,
      badge: null
    },
    {
      id: 'analytics',
      name: 'Аналитика',
      icon: <BarChart3 className="h-5 w-5" />,
      badge: null
    },
    {
      id: '1c',
      name: '1C интеграция',
      icon: <Database className="h-5 w-5" />,
      badge: 'NEW'
    },
    {
      id: 'seo',
      name: 'SEO настройки',
      icon: <Search className="h-5 w-5" />,
      badge: null
    },
    {
      id: 'settings',
      name: 'Настройки сайта',
      icon: <Settings className="h-5 w-5" />,
      badge: null
    }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === item.id 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="bg-gray-600 text-gray-200">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default AdminSidebar;