import React, {useEffect, useState} from 'react';
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

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const [briefing, setBriefing] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateBriefing = async () => {
        setIsGenerating(true);
        try {
            // Calls the Flask endpoint we built
            const response = await api.get('/dashboard/briefing');
            if (response.success) {
                setBriefing(response.data.briefing_markdown);
            }
        } catch (error) {
            console.error("Failed to generate briefing", error);
            // Fallback for hackathon demo purposes if API fails
            setBriefing("### ⚠️ Connection Error\nFailed to reach the GovIntel AI Analyst. Please ensure the Flask server is running.");
        } finally {
            setIsGenerating(false);
        }
    };

    const [priorityItems, setPriorityItems] = useState([]); // NEW STATE
    const [loadingPriority, setLoadingPriority] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Top Stats
                const statsRes = await api.get('/dashboard/stats');
                if (statsRes.success) setStats(statsRes.data);

                // Fetch High Priority List
                const priorityRes = await api.get('/dashboard/high-priority');
                if (priorityRes.success) setPriorityItems(priorityRes.data);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
                setLoadingPriority(false);
            }
        };
        fetchDashboardData();
    }, []);

    const getLevelStyles = (level) => {
        if (level === "Advanced") return { color: "text-[#6A9A6B]", bg: "bg-[#6A9A6B]" };
        if (level === "In Progress") return { color: "text-[#143B5A]", bg: "bg-[#143B5A]" };
        return { color: "text-[#C55650]", bg: "bg-[#C55650]" }; // Stalled
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">

            {/* 1. Dynamic Hero Section */}
            {/* 1. Dynamic Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#00507A]/5 via-white to-[#966B9D]/10 rounded-3xl p-8 border border-[#00507A]/10 shadow-sm transition-all">
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

                    <button
                        onClick={handleGenerateBriefing}
                        disabled={isGenerating}
                        className="btn bg-[#00507A] hover:bg-[#00507A]/90 text-white border-none shadow-[0_4px_15px_rgba(0,80,122,0.3)] hover:shadow-[0_6px_20px_rgba(0,80,122,0.5)] transition-all flex items-center px-6 py-3 rounded-xl font-semibold gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Analyzing Data...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} /> Generate Briefing
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 2. AI Executive Briefing Display (Only shows when briefing exists) */}
            {briefing && (
                <div className="relative overflow-hidden bg-[#0A1118] border border-[#1A2E44] rounded-3xl shadow-[0_0_40px_rgba(0,195,255,0.05)] animate-in fade-in slide-in-from-top-4 duration-500">

                    {/* Animated Neon Glow Effects */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00D4FF] opacity-20 blur-[80px] rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#B829EA] opacity-20 blur-[80px] rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent opacity-50"></div>

                    <div className="relative z-10 p-8">
                        <div className="flex justify-between items-start mb-6 border-b border-[#1A2E44] pb-5">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-xl text-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white tracking-wide">Executive Analyst Briefing</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-[#B829EA] animate-pulse"></span>
                                        <p className="text-[11px] text-[#00D4FF] font-bold uppercase tracking-[0.2em]">Generated by GovIntel Agentic AI</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setBriefing(null)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Custom Markdown Styling for Dark Mode */}
                        <div className="prose max-w-none
              [&>h3]:text-[#00D4FF] [&>h3]:text-lg [&>h3]:font-bold [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2 [&>h3]:mt-6 [&>h3]:mb-3
              [&>p]:text-slate-300 [&>p]:leading-relaxed [&>p]:text-[15px] [&>p]:mb-4
              [&>ul]:text-slate-300 [&>ul]:list-disc [&>ul]:pl-5
              [&>li]:mb-2 marker:text-[#B829EA]">
                            <ReactMarkdown>{briefing}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {/* Dynamic Metric Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-[160px]">
                    <Loader2 className="animate-spin text-[#00507A]" size={40} />
                </div>
            ) : stats ? (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard variant="blue" title="Total Tracked" value={stats.total_active} subtext="Agent Audited" />
                    <StatCard variant="green" title="Fulfilled" value={stats.fulfilled} subtext="Verified Execution" />
                    <StatCard variant="amber" title="In Progress" value={stats.in_progress} subtext="Active Legislation" />
                    <StatCard variant="purple" title="Partial" value={stats.partially_fulfilled} subtext="Compromised Bill" />
                    <StatCard variant="red" title="Stalled" value={stats.stalled} subtext="No Action Taken" />
                </div>
            ) : (
                <div className="text-center text-red-500 font-bold p-4">Failed to load statistics from API.</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3. Promise Implementation (Takes up 2 columns) */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-5">
                        <h2 className="text-xl font-bold text-[#143B5A] flex items-center gap-2">
                            <Activity size={20} className="text-[#966B9D]" /> High-Priority Implementations
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {loadingPriority ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#143B5A]" /></div>
                        ) : (
                            priorityItems.map((item) => {
                                const styles = getLevelStyles(item.level);
                                return (
                                    <div key={item.id} className="group flex items-center gap-6 p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">

                                        {/* Radial Progress */}
                                        <div
                                            className={`radial-progress ${styles.color} font-bold text-sm bg-white shadow-inner flex-shrink-0`}
                                            style={{ "--value": item.progress, "--size": "4rem", "--thickness": "4px" }}
                                            role="progressbar"
                                        >
                                            {item.progress}%
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                                <h3 className="font-bold text-[#202E39] text-lg group-hover:text-[#143B5A] transition-colors truncate pr-4">
                                                    {item.title}
                                                </h3>
                                                <span className={`text-[11px] px-3 py-1 rounded-full text-white font-bold ${styles.bg} shadow-sm shrink-0 w-max`}>
                          {item.level}
                        </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-2 w-full">
                                                {item.tags.map((tag, i) => (
                                                    <span key={i} className="text-[11px] bg-white text-slate-500 font-semibold px-2 py-1 rounded-md border border-slate-200 shadow-sm group-hover:border-[#966B9D]/30 transition-colors">
                                        {tag}
                                    </span>
                                                ))}

                                                {/* NEW: Clickable Evidence Link */}
                                                {item.evidence_link && item.evidence_link !== "None" && (
                                                    <a
                                                        href={item.evidence_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-auto text-[10px] sm:text-[11px] bg-[#143B5A]/5 text-[#143B5A] hover:bg-[#143B5A]/10 hover:text-[#00D4FF] font-bold px-3 py-1.5 rounded-md border border-[#143B5A]/10 flex items-center gap-1.5 transition-all"
                                                        onClick={(e) => e.stopPropagation()} // Prevents clicking the row if you add row clicks later
                                                    >
                                                        View Evidence <ExternalLink size={12} strokeWidth={2.5} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
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
                    </div>

                    <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-medium hover:border-[#00507A] hover:text-[#00507A] transition-colors">
                        Load More Events
                    </button>
                </div>
            </div>
        </div>
    );
}