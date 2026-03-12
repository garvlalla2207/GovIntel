// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from '../ui/AIAssistant';

export default function MainLayout() {
    // 1. Initialize global term state
    const [selectedTerm, setSelectedTerm] = useState('All Terms');

    return (
        <div className="flex h-screen bg-[#FFFFFF] text-gray-800 font-sans overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* 2. Pass state to Header */}
                <Header selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />

                <main className="flex-1 overflow-y-auto p-6 bg-[#FFFFFF]">
                    {/* 3. Pass state to all child routes (Dashboard, etc.) via context */}
                    <Outlet context={{ selectedTerm }} />
                </main>
            </div>
            <AIAssistant />
        </div>
    );
}