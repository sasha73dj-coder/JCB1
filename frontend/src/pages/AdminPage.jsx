import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSettings from '../components/admin/AdminSettings';
import AdminSuppliers from '../components/admin/AdminSuppliers';
import AdminSupplierIntegration from '../components/admin/AdminSupplierIntegration';
import AdminPayments from '../components/admin/AdminPayments';
import AdminIntegrations from '../components/admin/AdminIntegrations';
import AdminSMS from '../components/admin/AdminSMS';
import AdminContent from '../components/admin/AdminContent';
import Admin1C from '../components/admin/Admin1C';
import AdminSEO from '../components/admin/AdminSEO';
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
      case 'suppliers':
        return <AdminSuppliers />;
      case 'api-integration':
        return <AdminSupplierIntegration />;
      case 'integrations':
        return <AdminIntegrations />;
      case 'payments':
        return <AdminPayments />;
      case 'users':
        return <AdminUsers />;
      case 'sms':
        return <AdminSMS />;
      case 'content':
        return <AdminContent />;
      case '1c':
        return <Admin1C />;
      case 'seo':
        return <AdminSEO />;
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
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">NEXX Admin Panel</h1>
                  <p className="text-gray-400 text-sm">Панель администрирования интернет-магазина</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">Администратор</span>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AdminSidebar 
                currentView={currentView} 
                onViewChange={setCurrentView} 
              />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-4">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;