import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { 
  FileText, Download, Sparkles, 
  ChevronRight, Calendar, Info, Printer, 
  CheckCircle2 
} from 'lucide-react';

const MOCK_BILLS = [
  { 
    id: '2024-042', 
    title: "Telecommunications Reform Act", 
    date: "Oct 12, 2023", 
    status: "Passed", 
    color: "bg-emerald-500",
    desc: "A comprehensive framework to modernize digital infrastructure and foster competition."
  },
  { 
    id: '2024-015', 
    title: "Digital Services Security Act 2024", 
    date: "Sep 28, 2023", 
    status: "Pending", 
    color: "bg-amber-500",
    desc: "New protocols for securing cross-border digital transactions and service provider accountability."
  },
  { 
    id: '2024-008', 
    title: "Climate Resilience & Housing Bill", 
    date: "Aug 14, 2023", 
    status: "Amended", 
    color: "bg-[#00507A]",
    desc: "Legislative adjustments to urban planning mandates considering rising sea levels."
  },
];

export default function LegislativeExplorer() {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedBill, setSelectedBill] = useState(MOCK_BILLS[0]);

  return (
    <Layout>
      {/* This wrapper is the secret sauce:
        - h-[calc(100vh-140px)]: Subtracts the estimated height of your Header/Padding 
        - -m-8: Negates default Layout padding so the explorer hits the edges perfectly
      */}
      <div className="flex h-[calc(100vh-120px)] w-full bg-white overflow-hidden -m-8  border-slate-100">
        
        {/* 1. DOCUMENT REPOSITORY COLUMN (Left) */}
        <div className="w-80 flex-shrink-0 border-r border-slate-100 flex flex-col h-full bg-slate-50/30">
          <div className="p-6 flex-shrink-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Directory</h2>
              <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">120 Total</span>
            </div>
            <div className="flex gap-2">
              {['Passed', 'Pending'].map(s => (
                <button key={s} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-10 custom-scrollbar">
            {MOCK_BILLS.map((bill) => (
              <button 
                key={bill.id}
                onClick={() => setSelectedBill(bill)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedBill.id === bill.id 
                  ? 'border-blue-400 bg-white shadow-md ring-1 ring-blue-400/10' 
                  : 'border-transparent bg-transparent hover:bg-white/50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Bill #{bill.id}</span>
                  <div className={`w-2 h-2 rounded-full ${bill.color}`} />
                </div>
                <h3 className="font-bold text-sm text-slate-800 leading-tight mb-3">{bill.title}</h3>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {bill.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. EXPLORER CONTENT COLUMN (Right) */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-white overflow-hidden">
          
          {/* Header Section (Fixed) */}
          <div className="p-10 pb-6 flex-shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase mb-4">
              <span>Legislative Data</span> <ChevronRight size={10} /> 
              <span className="text-blue-500">{selectedBill.id}</span>
            </div>

            <div className="flex justify-between items-start mb-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{selectedBill.title}</h1>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{selectedBill.desc}</p>
              </div>
              <div className="flex gap-3">
                 <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20">
                   <CheckCircle2 size={16} /> Passed
                 </button>
              </div>
            </div>

            {/* Timeline Graphic */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 flex items-center justify-between px-12">
                {['Introduced', 'Committee', 'Debate', 'Passed'].map((label, i) => (
                  <React.Fragment key={label}>
                    <div className="text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-2 ${i < 3 ? 'bg-[#00507A] text-white' : 'bg-emerald-500 text-white shadow-lg'}`}>
                        {i === 3 ? <CheckCircle2 size={14}/> : i + 1}
                      </div>
                      <p className="text-[10px] font-bold text-slate-800">{label}</p>
                    </div>
                    {i < 3 && <div className="flex-1 h-[2px] bg-slate-200 mx-4 -mt-10" />}
                  </React.Fragment>
                ))}
            </div>
          </div>

          {/* Navigation Tabs (Fixed) */}
          <div className="px-10 flex gap-10 border-b border-slate-100 flex-shrink-0">
            {[{ id: 'summary', label: 'AI Simplified Summary' }, { id: 'text', label: 'Original Legal Text' }].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)}
                className={`py-4 text-xs font-bold border-b-2 transition-all -mb-[1px] ${activeTab === t.id ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
            <div className="max-w-4xl mx-auto pb-20">
              {activeTab === 'summary' ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Sparkles size={18}/></div>
                     <h2 className="font-bold text-slate-800">What does this bill mean for citizens?</h2>
                   </div>
                   <div className="space-y-8">
                     {[
                       { t: "Universal Broadband Access", c: "bg-emerald-500", d: "Mandates ISPs to extend 1Gbps service to rural areas." },
                       { t: "Market Competition", c: "bg-purple-500", d: "Prevents infrastructure lock-ins." }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-6">
                         <div className={`w-1 flex-shrink-0 rounded-full ${item.c}`} />
                         <div>
                           <p className="font-bold text-slate-800 text-sm mb-1">{item.t}</p>
                           <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.d}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm animate-in fade-in duration-500">
                  <div className="font-serif text-[16px] text-slate-700 leading-8 space-y-8">
                    <h2 className="text-2xl font-black text-slate-900 text-center uppercase">{selectedBill.title}</h2>
                    <p className="text-center text-slate-400 text-xs">Gazette Bill No. {selectedBill.id}</p>
                    <section className="pt-10">
                      <h4 className="font-bold text-slate-900 mb-3 text-sm">CHAPTER I: PRELIMINARY</h4>
                      <p>1. Short title and commencement.—(1) This Act may be called the {selectedBill.title}, 2024.</p>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}