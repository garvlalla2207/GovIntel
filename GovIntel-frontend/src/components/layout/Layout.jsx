import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Sidebar />
      <div className="ml-[250px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;