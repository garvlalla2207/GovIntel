import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-20">
      <div className="flex-1 max-w-2xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search manifestos, bills, or representatives..." 
          className="w-full pl-12 pr-4 py-3 rounded-xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00507A]/20 transition-all outline-none text-sm font-medium text-[#00507A]"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-[#00507A] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#D34D4A] rounded-full border-2 border-white"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-[#966B9D] text-white flex items-center justify-center font-bold shadow-md shadow-[#966B9D]/30 cursor-pointer">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;