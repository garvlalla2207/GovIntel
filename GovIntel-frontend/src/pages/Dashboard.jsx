// src/pages/Dashboard.jsx
import React from 'react';
import { 
  Target, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ArrowRight,
  FileText,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* 1. Dynamic Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#00507A]/5 via-white to-[#966B9D]/10 rounded-3xl p-8 border border-[#00507A]/10 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00507A]/10 text-[#00507A] text-sm font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#74AA78] animate-pulse"></span>
              Live Intelligence Active
            </div>
            <h1 className="text-4xl font-extrabold text-[#00507A] tracking-tight">
              Platform Overview
            </h1>
            <p className="text-gray-500 mt-2 text-lg max-w-2xl">
              Real-time telemetry on election promises, legislative velocity, and governance outcomes.
            </p>
          </div>
          <button className="btn bg-[#00507A] hover:bg-[#00507A]/90 text-white border-none shadow-[0_4px_15px_rgba(0,80,122,0.3)] hover:shadow-[0_6px_20px_rgba(0,80,122,0.5)] transition-all flex items-center gap-2">
            <FileText size={18} /> Generate Briefing
          </button>
        </div>
      </div>

      {/* 2. Interactive Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgba(0,80,122,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-[#00507A] transition-colors duration-300">
              <Target className="text-[#00507A] group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="flex items-center text-sm font-bold text-[#74AA78] bg-[#74AA78]/10 px-2 py-1 rounded-lg">
              <TrendingUp size={16} className="mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Active Promises</h3>
          <p className="text-4xl font-black text-gray-800 mt-1">482</p>
        </div>

        {/* Card 2 */}
        <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgba(116,170,120,0.2)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-[#74AA78] transition-colors duration-300">
              <CheckCircle className="text-[#74AA78] group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="flex items-center text-sm font-bold text-[#74AA78] bg-[#74AA78]/10 px-2 py-1 rounded-lg">
              <TrendingUp size={16} className="mr-1" /> +5%
            </span>
          </div>
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Bills Enacted</h3>
          <p className="text-4xl font-black text-gray-800 mt-1">315</p>
        </div>

        {/* Card 3 */}
        <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgba(211,77,74,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-[#D34D4A] transition-colors duration-300">
              <AlertCircle className="text-[#D34D4A] group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="flex items-center text-sm font-bold text-[#D34D4A] bg-[#D34D4A]/10 px-2 py-1 rounded-lg">
              <TrendingDown size={16} className="mr-1" /> -2%
            </span>
          </div>
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Stalled Initiatives</h3>
          <p className="text-4xl font-black text-gray-800 mt-1">89</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Promise Implementation (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-[#00507A] flex items-center gap-2">
              <Activity size={20} className="text-[#966B9D]" /> High-Priority Implementations
            </h2>
            <button className="text-sm font-medium text-[#00507A] hover:text-[#966B9D] transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { text: "Universal Broadband Access", progress: 85, level: "Advanced", tags: ["Telecom Bill 2023"], color: "text-[#74AA78]", bg: "bg-[#74AA78]" },
              { text: "High-Speed Rail Network", progress: 45, level: "In Progress", tags: ["Infra Act '21", "Budget Allocation '22"], color: "text-[#00507A]", bg: "bg-[#00507A]" },
              { text: "Universal Basic Income Pilot", progress: 10, level: "Stalled", tags: ["No Active Legislation"], color: "text-[#D34D4A]", bg: "bg-[#D34D4A]" },
            ].map((item, idx) => (
              <div key={idx} className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                {/* Radial Progress */}
                <div 
                  className={`radial-progress ${item.color} font-bold text-sm bg-white shadow-inner`} 
                  style={{ "--value": item.progress, "--size": "3.5rem", "--thickness": "4px" }} 
                  role="progressbar"
                >
                  {item.progress}%
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#00507A] transition-colors">{item.text}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full text-white font-medium ${item.bg} shadow-sm`}>
                      {item.level}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs bg-white text-gray-500 font-medium px-2 py-1 rounded border border-gray-200 shadow-sm group-hover:border-[#966B9D]/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Live Intelligence Feed (Takes up 1 column) */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-[#00507A] mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
            <Clock size={20} className="text-[#C68080]" /> Intelligence Feed
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="relative pl-6 border-l-2 border-[#74AA78]">
              <div className="absolute w-3 h-3 bg-[#74AA78] rounded-full -left-[7px] top-1 shadow-[0_0_8px_#74AA78]"></div>
              <p className="text-xs text-gray-400 font-bold mb-1">10 MINS AGO</p>
              <p className="text-sm font-medium text-gray-800">Digital Data Protection Bill officially passed by Upper House.</p>
              <span className="inline-block mt-2 text-xs font-bold text-[#74AA78] bg-[#74AA78]/10 px-2 py-1 rounded">Status: Passed</span>
            </div>

            <div className="relative pl-6 border-l-2 border-[#00507A]">
              <div className="absolute w-3 h-3 bg-[#00507A] rounded-full -left-[7px] top-1 shadow-[0_0_8px_#00507A]"></div>
              <p className="text-xs text-gray-400 font-bold mb-1">2 HOURS AGO</p>
              <p className="text-sm font-medium text-gray-800">AI summary generated for newly introduced Infrastructure Act.</p>
            </div>

            <div className="relative pl-6 border-l-2 border-[#D34D4A]">
              <div className="absolute w-3 h-3 bg-[#D34D4A] rounded-full -left-[7px] top-1 shadow-[0_0_8px_#D34D4A]"></div>
              <p className="text-xs text-gray-400 font-bold mb-1">1 DAY AGO</p>
              <p className="text-sm font-medium text-gray-800">Healthcare Access Bill flagged by Intelligence as stalled in committee.</p>
              <span className="inline-block mt-2 text-xs font-bold text-[#D34D4A] bg-[#D34D4A]/10 px-2 py-1 rounded">Status: Warning</span>
            </div>

            <div className="relative pl-6 border-l-2 border-[#966B9D]">
              <div className="absolute w-3 h-3 bg-[#966B9D] rounded-full -left-[7px] top-1 shadow-[0_0_8px_#966B9D]"></div>
              <p className="text-xs text-gray-400 font-bold mb-1">2 DAYS AGO</p>
              <p className="text-sm font-medium text-gray-800">New connection mapped between Economy Sector and 2024 Manifesto.</p>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-medium hover:border-[#00507A] hover:text-[#00507A] transition-colors">
            Load More Events
          </button>
        </div>
      </div>
    </div>
  );
}