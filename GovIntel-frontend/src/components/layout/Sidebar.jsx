// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Landmark, Network, Bot } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Manifesto Tracker', path: '/manifesto', icon: ListTodo },
  { label: 'Legislative Explorer', path: '/legislation', icon: Landmark },
  { label: 'Governance Network', path: '/network', icon: Network },
];

export default function Sidebar() {
  return (
    <aside className="w-[250px] flex-shrink-0 h-full bg-[#FFFFFF] border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="flex items-center gap-3 text-2xl font-extrabold text-[#00507A] tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-[#00507A] flex items-center justify-center text-white shadow-sm shrink-0">
                <Landmark size={22} strokeWidth={2.5} />
            </div>
            GovIntel
        </h1>
        <p className="text-xs text-[#966B9D] mt-1 font-semibold tracking-wider uppercase">
          Accountability Platform
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 text-[#00507A] font-semibold border-l-4 border-[#00507A] shadow-[0_0_12px_rgba(150,107,157,0.4)]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#00507A]'
              }
            `}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-purple-50 hover:text-[#966B9D] rounded-lg transition-colors">
          <Bot size={20} />
          <span className="font-medium">AI Chat Settings</span>
        </button>
      </div>
    </aside>
  );
}
// src/components/layout/Sidebar.jsx
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { LayoutDashboard, ListTodo, Landmark, Network } from 'lucide-react';

// const NAV_ITEMS = [
//   { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
//   { label: 'Manifesto Tracker', path: '/manifesto', icon: ListTodo },
//   { label: 'Legislative Explorer', path: '/legislation', icon: Landmark },
//   { label: 'Governance Network', path: '/network', icon: Network },
// ];

// export default function Sidebar() {
//   return (
//     <aside className="w-[250px] flex-shrink-0 h-full bg-[#FFFFFF] border-r border-gray-100 flex flex-col z-50 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
//       {/* PERFECTED LOGO SECTION */}
//       <div className="p-6 flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-[#00507A] flex items-center justify-center text-white shadow-sm shrink-0">
//           <Landmark size={22} strokeWidth={2.5} />
//         </div>
//         <h1 className="text-2xl font-extrabold text-[#00507A] tracking-tight">
//           GovIntel
//         </h1>
//       </div>

//       {/* NAVIGATION */}
//       <nav className="flex-1 px-4 space-y-2 mt-2">
//         {NAV_ITEMS.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             /* The destructured { isActive } goes right here: */
//             className={({ isActive }) => `
//               flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
//               ${isActive 
//                 ? 'bg-[#00507A] text-white font-semibold shadow-[0_4px_12px_rgba(0,80,122,0.2)]' 
//                 : 'text-gray-500 font-medium hover:bg-gray-50 hover:text-[#00507A]'
//               }
//             `}
//           >
//             {/* We also check isActive here to make the icon bolder when selected */}
//             {({ isActive }) => (
//               <>
//                 <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
//                 {item.label}
//               </>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* SYSTEM STATUS BOX */}
//       <div className="p-6 mt-auto">
//         <div className="border border-[#966B9D]/30 bg-purple-50/30 rounded-xl p-4 shadow-sm">
//           <p className="text-[10px] font-bold text-[#966B9D] uppercase tracking-wider mb-2">System Status</p>
//           <div className="flex items-center gap-2">
//             <span className="relative flex h-2.5 w-2.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#74AA78] opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#74AA78]"></span>
//             </span>
//             <span className="text-xs font-semibold text-gray-700">Live Analysis Active</span>
//           </div>
//         </div>
//       </div>
      
//     </aside>
//   );
// }