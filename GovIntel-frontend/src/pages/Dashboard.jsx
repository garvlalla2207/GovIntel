import React, { useEffect, useState } from 'react';
import {
    Activity,
    ArrowRight,
    Sparkles,
    Clock,
    Loader2,
    Bot,
    X,
    ExternalLink
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import ReactMarkdown from 'react-markdown';
import api from '../utils/axiosInstance';
import { useOutletContext } from 'react-router-dom';

export default function Dashboard() {
    // 1. Unified State Management
    const [stats, setStats] = useState(null);
    const [priorityItems, setPriorityItems] = useState([]);
    const [feedItems, setFeedItems] = useState([]);
    const [briefing, setBriefing] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);

    const { selectedTerm } = useOutletContext();

    // 2. Single Consolidated Data Fetcher
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const params = { term: selectedTerm };

                // Fetch everything in parallel to match your backend endpoints
                const [statsRes, priorityRes, feedRes] = await Promise.all([
                    api.get('/dashboard/stats', { params }),
                    api.get('/dashboard/high-priority', { params }),
                    api.get('/dashboard/feed', { params })
                ]);

                // Update states using your API's 'success' property
                if (statsRes.success) setStats(statsRes.data);
                if (priorityRes.success) setPriorityItems(priorityRes.data);
                if (feedRes.success) setFeedItems(feedRes.data);

            } catch (error) {
                console.error("❌ Dashboard Data Sync Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedTerm]); // Re-runs perfectly when selection engine changes

    // 3. Helper Functions (Unchanged)
    const getRelativeTime = (index, status) => {
        if (index === 0) return "10 MINS AGO";
        if (index === 1) return "2 HOURS AGO";
        if (status === "Stalled") return "URGENT UPDATE";
        return `${index + 1} DAYS AGO`;
    };

    const handleGenerateBriefing = async () => {
        setIsGenerating(true);
        try {
            const response = await api.get('/dashboard/briefing', { params: { term: selectedTerm } });
            if (response.success) {
                setBriefing(response.data.briefing_markdown);
            }
        } catch (error) {
            console.error("Failed to generate briefing", error);
            setBriefing("### ⚠️ Connection Error\nFailed to reach the GovIntel AI Analyst.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getLevelStyles = (level) => {
        if (level === "Advanced") return { color: "text-[#6A9A6B]", bg: "bg-[#6A9A6B]" };
        if (level === "In Progress") return { color: "text-[#143B5A]", bg: "bg-[#143B5A]" };
        return { color: "text-[#C55650]", bg: "bg-[#C55650]" };
    };

    const getStatusColor = (status) => {
        if (status === "Fulfilled") return "border-[#74AA78] bg-[#74AA78]";
        if (status === "Stalled") return "border-[#D34D4A] bg-[#D34D4A]";
        return "border-[#00507A] bg-[#00507A]";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#00507A]/5 via-white to-[#966B9D]/10 rounded-3xl p-8 border border-[#00507A]/10 shadow-sm transition-all">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00507A]/10 text-[#00507A] text-sm font-bold mb-4">
                            <span className="w-2 h-2 rounded-full bg-[#74AA78] animate-pulse"></span>
                            Live Intelligence Active
                        </div>
                        <h1 className="text-4xl font-extrabold text-[#00507A] tracking-tight">Platform Overview</h1>
                        <p className="text-gray-500 mt-2 text-lg max-w-2xl">
                            Real-time telemetry on election promises, legislative velocity, and governance outcomes.
                        </p>
                    </div>

                    <button
                        onClick={handleGenerateBriefing}
                        disabled={isGenerating}
                        className="btn bg-[#00507A] hover:bg-[#00507A]/90 text-white border-none shadow-[0_4px_15px_rgba(0,80,122,0.3)] transition-all flex items-center px-6 py-3 rounded-xl font-semibold gap-2"
                    >
                        {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : <><Sparkles size={18} /> Generate Briefing</>}
                    </button>
                </div>
            </div>

            {/* AI Briefing */}
            {briefing && (
                <div className="relative overflow-hidden bg-[#0A1118] border border-[#1A2E44] rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between items-start mb-6 border-b border-[#1A2E44] pb-5">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-xl text-[#00D4FF]">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-wide">Executive Analyst Briefing</h2>
                                <p className="text-[11px] text-[#00D4FF] font-bold uppercase tracking-[0.2em]">Generated by GovIntel Agentic AI</p>
                            </div>
                        </div>
                        <button onClick={() => setBriefing(null)} className="p-2 text-slate-400 hover:text-white transition-all"><X size={20} /></button>
                    </div>
                    <div className="prose max-w-none text-slate-300 [&>h3]:text-[#00D4FF] [&>h3]:mt-6 [&>p]:mb-4">
                        <ReactMarkdown>{briefing}</ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Metric Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-[160px]"><Loader2 className="animate-spin text-[#00507A]" size={40} /></div>
            ) : stats ? (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard variant="blue" title="Total Tracked" value={stats.total_active} subtext="Agent Audited" />
                    <StatCard variant="green" title="Fulfilled" value={stats.fulfilled} subtext="Verified Execution" />
                    <StatCard variant="amber" title="In Progress" value={stats.in_progress} subtext="Active Legislation" />
                    <StatCard variant="purple" title="Partial" value={stats.partially_fulfilled} subtext="Compromised Bill" />
                    <StatCard variant="red" title="Stalled" value={stats.stalled} subtext="No Action Taken" />
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Priority List */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-[#143B5A] flex items-center gap-2 mb-6 border-b pb-5">
                        <Activity size={20} className="text-[#966B9D]" /> High-Priority Implementations
                    </h2>
                    <div className="space-y-6">
                        {priorityItems.map((item) => {
                            const styles = getLevelStyles(item.level);
                            return (
                                <div key={item.id} className="group flex items-center gap-6 p-2 rounded-2xl hover:bg-slate-50 transition-all">
                                    <div className={`radial-progress ${styles.color} font-bold text-sm bg-white shadow-inner`} style={{ "--value": item.progress, "--size": "4rem", "--thickness": "4px" }}>
                                        {item.progress}%
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-[#202E39] text-lg truncate pr-4">{item.title}</h3>
                                            <span className={`text-[11px] px-3 py-1 rounded-full text-white font-bold ${styles.bg}`}>{item.level}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            {item.tags.map((tag, i) => (
                                                <span key={i} className="text-[11px] bg-white text-slate-500 font-semibold px-2 py-1 rounded-md border border-slate-200">{tag}</span>
                                            ))}
                                            {item.evidence_link && item.evidence_link !== "None" && (
                                                <a href={item.evidence_link} target="_blank" rel="noopener noreferrer" className="ml-auto text-[11px] bg-[#143B5A]/5 text-[#143B5A] px-3 py-1.5 rounded-md border flex items-center gap-1.5 font-bold">
                                                    View Evidence <ExternalLink size={12} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Intelligence Feed */}
                <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm flex flex-col h-full">
                    <h2 className="text-xl font-bold text-[#00507A] mb-6 border-b pb-4 flex items-center gap-2">
                        <Clock size={20} className="text-[#C68080]" /> Intelligence Feed
                    </h2>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-8">
                        {feedItems.slice(0, visibleCount).map((item, index) => {
                            const statusColor = getStatusColor(item.status);
                            return (
                                <div key={item.id} className={`relative pl-6 border-l-2 ${statusColor.split(' ')[0]}`}>
                                    <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1 ${statusColor.split(' ')[1]}`}></div>
                                    <p className="text-[10px] text-gray-400 font-black mb-1 uppercase">{getRelativeTime(index, item.status)}</p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight mb-1">{item.title}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100">
                                        Status: {item.status === "Fulfilled" ? "Passed" : item.status === "Stalled" ? "Warning" : "Active"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {visibleCount < feedItems.length && (
                        <button onClick={() => setVisibleCount(v => v + 3)} className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-xl hover:border-[#00507A] transition-all">
                            Load More Events
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}