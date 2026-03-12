import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, BookOpen, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
  // We use a strict text size (text-sm) to prevent the "blown up" look
  const navLinkClasses = ({ isActive }) => `
    group relative flex items-center gap-3 px-6 py-3.5 transition-all duration-200
    ${isActive 
      ? 'bg-blue-50/50 text-[#00507A] font-semibold' 
      : 'text-slate-500 hover:bg-slate-50 hover:text-[#00507A]'
    }
  `;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-slate-100 bg-white">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-7 py-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00507A] text-white shadow-md shadow-blue-900/20">
          <Shield size={20} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">GovIntel</span>
      </div>
      
      {/* Navigation - No global text scaling, strictly controlled */}
      <nav className="flex-1 space-y-1 text-sm">
        <div className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        </div>

        <NavLink to="/" className={navLinkClasses}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
          {/* RIGHT SIDE BORDER INDICATOR */}
          <div className="absolute right-0 h-full w-[3px] bg-[#00507A] opacity-0 transition-opacity group-hover:opacity-100 group-[.active]:opacity-100" />
        </NavLink>

        <NavLink to="/manifesto" className={navLinkClasses}>
          <BookOpen size={18} />
          <span>Manifesto Tracker</span>
          <div className="absolute right-0 h-full w-[3px] bg-[#00507A] opacity-0 transition-opacity group-hover:opacity-100 group-[.active]:opacity-100" />
        </NavLink>

        <NavLink to="/bills" className={navLinkClasses}>
          <FileText size={18} />
          <span>Legislative Bills</span>
          <div className="absolute right-0 h-full w-[3px] bg-[#00507A] opacity-0 transition-opacity group-hover:opacity-100 group-[.active]:opacity-100" />
        </NavLink>
      </nav>

      {/* Bottom Profile/Settings section */}
      <div className="border-t border-slate-100 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-50">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;