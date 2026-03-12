import React, { useState } from 'react';
import { Calendar, ChevronDown, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Header({ selectedTerm, setSelectedTerm }) {
    const terms = ["All Terms", "2014", "2019", "2024"];
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
            {/* 1. Platform Identity & Live Status */}
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            Live Agent Auditing Active
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <h1 className="text-lg font-black text-[#00507A] tracking-tight">
                            GOVINTEL <span className="text-[#966B9D] font-medium ml-1">OSINT</span>
                        </h1>
                    </div>
                </div>

                {/* System Telemetry (Interesting UI Elements) */}
                <div className="hidden lg:flex items-center gap-6 border-l border-gray-100 pl-6 ml-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">API Latency</span>
                        <span className="text-xs font-bold text-[#00507A] flex items-center gap-1">
                            <Zap size={10} className="text-amber-400" /> 142ms
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Active Nodes</span>
                        <span className="text-xs font-bold text-[#00507A] flex items-center gap-1">
                            <Activity size={10} className="text-[#966B9D]" /> 12 Clusters
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Custom Term Selection Engine */}
            <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Selection Engine</span>

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-44 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00507A] font-bold text-sm hover:border-[#00507A]/30 transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#966B9D]" />
                            {selectedTerm}
                        </div>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Custom Styled Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            {/* Backdrop to close dropdown */}
                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />

                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-3 bg-gray-50/50 border-b border-gray-100">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">
                                        Choose Election Term
                                    </span>
                                </div>
                                {terms.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => {
                                            setSelectedTerm(term);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center justify-between
                                            ${selectedTerm === term
                                            ? 'bg-[#00507A] text-white'
                                            : 'text-[#00507A] hover:bg-gray-50 hover:pl-6'
                                        }`}
                                    >
                                        {term}
                                        {selectedTerm === term && <ShieldCheck size={14} className="text-white opacity-60" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}