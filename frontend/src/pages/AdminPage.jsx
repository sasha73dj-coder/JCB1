import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSettings from '../components/admin/AdminSettings';
import { Shield } from 'lucide-react';

const AdminPage = () => {
  const location = useLocation();
  const path = location.pathname.replace('/admin', '') || '/';
  const [currentView, setCurrentView] = useState(path.substring(1) || 'dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        {/* Admin Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Панель администратора</h1>
                  <p className="text-gray-400 text-sm">Управление интернет-магазином NEXX</p>
                </div>
              </div>
              
              <div className="text-gray-400 text-sm">
                Админ: Иван Петров
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;