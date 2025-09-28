import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '../ui/toaster';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;