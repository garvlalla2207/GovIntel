import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, History, Zap, Loader2, ExternalLink } from 'lucide-react';
import api from '../utils/axiosInstance';

export default function LegislativeExplorer() {
    const [activeTab, setActiveTab] = useState('summary');
    const [bills, setBills] = useState([]);
    const [activeBill, setActiveBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            console.log("🚀 LegislativeExplorer: Initiating data fetch...");
            setLoading(true);
            try {
                // Direct call without term parameters
                const response = await api.get('/legislation');

                // Log the response to your browser console to verify connection
                console.log("📥 API Response:", response);

                if (response.status === 'success' || response.success) {
                    const billsData = response.data || [];
                    setBills(billsData);
                    if (billsData.length > 0) {
                        setActiveBill(billsData[0]);
                    }
                }
            } catch (error) {
                console.error("❌ OSINT Axios Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []); // Empty dependency array = Runs exactly once on page load

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-8rem)] text-[#00507A] gap-4">
                <Loader2 className="animate-spin text-[#00507A]" size={40} />
                <p className="font-bold tracking-tight">Synchronizing Legislative Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="flex gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-500">
            {/* Left Pane: Document Repository */}
            <div className="w-[30%] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-[#00507A]">Document Repository</h2>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono font-bold">
                        {bills.length} Records
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {bills.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm italic">No records found in database.</div>
                    ) : (
                        bills.map((bill) => {
                            const isActive = activeBill?._id === bill._id;
                            return (
                                <button
                                    key={bill._id}
                                    onClick={() => setActiveBill(bill)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                        isActive ? 'bg-blue-50 border-[#00507A]/40 shadow-sm' : 'border-transparent hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold text-white ${
                                            bill.status === 'Passed' ? 'bg-[#74AA78]' : 'bg-[#00507A]'
                                        }`}>
                                            {bill.status}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono font-bold">{bill.introduced_date}</span>
                                    </div>
                                    <h3 className={`font-bold text-sm leading-tight ${isActive ? 'text-[#00507A]' : 'text-gray-700'}`}>
                                        {bill.title}
                                    </h3>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Pane: Intel Detail View */}
            {activeBill ? (
                <div className="w-[70%] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold ${
                                activeBill.status === 'Passed' ? 'bg-[#74AA78]' : 'bg-[#00507A]'
                            }`}>
                                {activeBill.status}
                            </span>
                            <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                <History size={14} />
                                <span>Introduced: {activeBill.introduced_date}</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">{activeBill.title}</h1>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-200 px-6 pt-4 bg-gray-50/50 gap-8">
                        <TabButton
                            active={activeTab === 'summary'}
                            onClick={() => setActiveTab('summary')}
                            icon={<Zap size={16} />}
                            label="AI Simplified Summary"
                            activeColor="text-[#966B9D] border-[#966B9D]"
                        />
                        <TabButton
                            active={activeTab === 'timeline'}
                            onClick={() => setActiveTab('timeline')}
                            icon={<History size={16} />}
                            label="Legislative Evolution"
                            activeColor="text-[#00507A] border-[#00507A]"
                        />
                        <TabButton
                            active={activeTab === 'text'}
                            onClick={() => setActiveTab('text')}
                            icon={<FileText size={16} />}
                            label="Metadata & Source"
                            activeColor="text-[#00507A] border-[#00507A]"
                        />
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === 'summary' && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-purple-50/50 border-l-4 border-[#966B9D] p-5 rounded-r-xl">
                                    <p className="text-sm text-[#00507A] leading-relaxed font-medium italic">
                                        {activeBill.ai_analysis?.simplified_summary}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <ChevronRight size={16} className="text-[#966B9D]" />
                                        Key Provisions
                                    </h3>
                                    <div className="grid gap-3">
                                        {activeBill.ai_analysis?.key_provisions?.map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#966B9D] mt-2 shrink-0" />
                                                <p className="text-sm text-gray-700 font-medium">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="py-10 animate-in fade-in duration-500">
                                <div className="relative flex items-center justify-between">
                                    <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-100 -z-0" />

                                    {activeBill.evolution_timeline?.map((event, idx) => (
                                        <div key={idx} className="relative z-10 flex flex-col items-center group w-32">
                                            <div className={`w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center font-bold text-white transition-transform group-hover:scale-110 duration-200 ${
                                                event.status === 'completed' ? 'bg-[#74AA78]' : 'bg-[#00507A]'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p className="text-[11px] font-black text-gray-800 uppercase tracking-tighter leading-tight">
                                                    {event.stage}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold font-mono mt-1">{event.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'text' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                                    <p className="text-gray-500 mb-4">// ARCHIVAL SOURCE DATA</p>
                                    <p className="mb-2 uppercase"><span className="text-white">TITLE:</span> {activeBill.title}</p>
                                    <p className="mb-2 uppercase"><span className="text-white">STATUS:</span> {activeBill.status}</p>

                                    {/* Clickable Source Link */}
                                    <p className="mb-4 uppercase flex items-center gap-2">
                                        <span className="text-white">SOURCE:</span>
                                        <a
                                            href={activeBill.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#00D4FF] hover:underline flex items-center gap-1 group"
                                        >
                                            {activeBill.source_url}
                                            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </p>

                                    <div className="h-px bg-gray-800 my-4" />
                                    <p className="text-gray-500 mb-2">RAW_METADATA_EXTRACT:</p>
                                    <p className="mt-2 whitespace-pre-wrap text-gray-300">{activeBill.original_text}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 italic">
                    Select a document to view intelligence briefing
                </div>
            )}
        </div>
    );
}

function TabButton({ active, onClick, icon, label, activeColor }) {
    return (
        <button
            onClick={onClick}
            className={`pb-4 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 ${
                active ? activeColor : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
        >
            {icon} {label}
        </button>
    );
}