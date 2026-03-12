// src/components/layout/Header.jsx
import React from 'react';
import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 bg-[#FFFFFF] border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-[#00507A]" />
        </div>
        <input
          type="text"
          placeholder="Intelligent search: Try 'What is the status of the Digital Data Protection Bill?'"
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#00507A]/20 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#966B9D]/50 focus:border-[#00507A] transition-all text-gray-800 placeholder-gray-400"
        />
      </div>

      <div className="ml-6 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500">Term:</span>
        <select className="select select-bordered border-[#00507A]/30 text-[#00507A] bg-white hover:border-[#00507A] focus:outline-none h-10 min-h-10">
          <option>All Terms</option>
          <option>2014</option>
          <option>2019</option>
          <option>2024</option>
        </select>
      </div>
    </header>
  );
}
