import React from 'react';
import { 
  Filter, 
  Search, 
  ChevronDown, 
  Link2, 
  ExternalLink,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const ManifestoTracker = () => {
  // Mock data for the 2-column grid
  const promises = [
    {
      id: 1,
      title: "Nationwide rollout of 5G fiber optic backbone connectivity across all tier-2 cities.",
      sector: "Digital Economy",
      year: "2019",
      progress: 100,
      status: "COMPLETED",
      bills: ["Telecommunications Act B-42", "Urban Dev. Grant 2021"]
    },
    {
      id: 2,
      title: "Establishment of a Sovereign Wealth Fund dedicated to rural infrastructure development.",
      sector: "Economy",
      year: "2024",
      progress: 0,
      status: "STALLED",
      bills: ["Pending: SWF Bill 2024"]
    },
    {
      id: 3,
      title: "Construction of the East-West Expressway connecting coastal ports to industrial hubs.",
      sector: "Infrastructure",
      year: "2014",
      progress: 65,
      status: "IN PROGRESS",
      bills: ["Land Acquisition Act", "Port Connectivity P-09"]
    },
    {
      id: 4,
      title: "Subsidy program for small-scale tech startups to reduce initial operational costs.",
      sector: "Digital",
      year: "2019",
      progress: 40,
      status: "PARTIAL",
      bills: ["MSME Support Act"]
    }
  ];

  return (
    <div className="ml-[260px] bg-white min-h-screen font-sans">
      
      {/* 1. TOP HEADER (Matches Home Page) */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search promises, bills, or sectors..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00507A]/20 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 cursor-pointer">
            <span className="text-[12px] font-bold text-slate-600">All Terms</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#00507A] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            JD
          </div>
        </div>
      </header>

      <main className="p-10 max-w-[1400px] mx-auto">
        {/* 2. PAGE TITLE */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#00507A] tracking-tight">Manifesto & Accountability Repository</h1>
          <p className="text-slate-500 mt-2 text-[15px]">Comprehensive tracking of governing commitments and legislative follow-through.</p>
        </div>

        {/* 3. DUAL FILTER SYSTEM (Pills with fixed padding) */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 w-16">Sectors</span>
            <div className="flex gap-2">
              {['All Sectors', 'Infrastructure', 'Digital Economy', 'Education & Health'].map((tab, i) => (
                <button 
                  key={tab}
                  className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${i === 0 ? 'bg-[#00507A] text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 w-16">Cycles</span>
            <div className="flex gap-2">
              {['All Years', '2014 Manifesto', '2019 Manifesto', '2024 Manifesto'].map((tab, i) => (
                <button 
                  key={tab}
                  className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${i === 0 ? 'bg-slate-100 text-[#00507A] font-bold border border-[#00507A]/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. PROMISE GRID (2-Column Desktop View) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promises.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.year}</span>
                  <span className="px-2.5 py-1 bg-purple-50 text-[#966B9D] rounded text-[10px] font-bold uppercase tracking-tight">{item.sector}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                  item.progress === 100 ? 'bg-emerald-50 text-[#74AA78] border-emerald-100' : 
                  item.progress === 0 ? 'bg-rose-50 text-[#D34D4A] border-rose-100' : 
                  'bg-blue-50 text-[#00507A] border-blue-100'
                }`}>
                  {item.status}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-[17px] font-bold text-slate-800 leading-snug mb-6">
                {item.title}
              </h3>

              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Implementation Progress</span>
                  <span className={`text-sm font-bold ${item.progress === 0 ? 'text-rose-500' : 'text-slate-700'}`}>{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      item.progress === 100 ? 'bg-[#74AA78]' : 
                      item.progress === 0 ? 'bg-[#D34D4A]' : 'bg-[#00507A]'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Linked Actions */}
              <div className="pt-6 border-t border-slate-50">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                  <Link2 size={12} /> Linked Legislative Actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.bills.map((bill, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-medium text-slate-600 hover:border-[#00507A]/30 transition-colors cursor-pointer group/bill">
                      <div className="w-4 h-4 rounded bg-white border border-slate-200 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00507A]" />
                      </div>
                      {bill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side Hover Indicator (Matching your Sidebar preference) */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#00507A] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManifestoTracker;