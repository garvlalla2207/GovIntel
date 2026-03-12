// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from '../ui/AIAssistant';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#FFFFFF] text-gray-800 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-[#FFFFFF]">
          <Outlet />
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}