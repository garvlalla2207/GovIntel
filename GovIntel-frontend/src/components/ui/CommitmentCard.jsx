import React from 'react';
import { ExternalLink, CheckCircle2, Clock, AlertTriangle, FileText, Activity } from 'lucide-react';

// 1. MUST HAVE 'onClick' IN THIS DESTRUCTURING
export default function CommitmentCard({ promise, onClick }) {
    const title = promise.title || "Unknown Commitment";
    const sector = promise.sector || "General";
    const status = promise.status || "In Progress";
    const summary = promise.summary || "No analysis available.";
    const link = promise.evidence_link;
    const year = promise.year || "Unknown Year";

    const config = {
        "Fulfilled": {
            bg: "bg-emerald-50 border-emerald-200",
            text: "text-emerald-700",
            progressBg: "bg-emerald-500",
            icon: <CheckCircle2 size={18} className="text-emerald-500" />,
            progress: 100
        },
        "Stalled": {
            bg: "bg-red-50 border-red-200",
            text: "text-red-700",
            progressBg: "bg-red-500",
            icon: <AlertTriangle size={18} className="text-red-500" />,
            progress: 15
        },
        "Partially Fulfilled": {
            bg: "bg-purple-50 border-purple-200",
            text: "text-purple-700",
            progressBg: "bg-purple-500",
            icon: <Clock size={18} className="text-purple-500" />,
            progress: 65
        },
        "In Progress": {
            bg: "bg-amber-50 border-amber-200",
            text: "text-amber-700",
            progressBg: "bg-amber-500",
            icon: <Activity size={18} className="text-amber-500" />,
            progress: 40
        },
        "default": {
            bg: "bg-white border-gray-200",
            text: "text-[#00507A]",
            progressBg: "bg-[#00507A]",
            icon: <Activity size={18} className="text-[#00507A]" />,
            progress: 0
        }
    };

    const style = config[status] || config.default;

    return (
        // 2. MUST HAVE 'onClick={onClick}' ON THIS MAIN DIV
        <div
            onClick={onClick}
            className={`flex flex-col p-6 rounded-2xl border transition-all hover:shadow-lg hover:ring-2 hover:ring-[#966B9D]/40 cursor-pointer ${style.bg}`}
        >
            <div className="flex justify-between items-start mb-4 gap-3">
                <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-[#966B9D]/10 text-[#966B9D] border border-[#966B9D]/20 rounded-md shadow-sm whitespace-nowrap">
            {sector}
          </span>
                    <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-[#966B9D]/10 text-[#966B9D] border border-[#966B9D]/20 rounded-md shadow-sm whitespace-nowrap">
            Term: {year}
          </span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border shadow-sm shrink-0 ${style.text}`}>
                    {style.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{status}</span>
                </div>
            </div>

            <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 line-clamp-2" title={title}>
                {title}
            </h3>
            <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">
                {summary}
            </p>

            <div className="mb-6">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    <span>Implementation Progress</span>
                    <span>{style.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${style.progressBg}`}
                        style={{ width: `${style.progress}%` }}
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <FileText size={14} />
                    Linked Legislation
                </div>
                {link && link !== "#" ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // 3. MUST HAVE THIS to prevent double-firing
                        className="flex items-center gap-1.5 text-xs font-bold text-[#00507A] hover:text-[#966B9D] transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:shadow"
                    >
                        View Evidence <ExternalLink size={12} />
                    </a>
                ) : (
                    <span className="text-xs font-bold text-gray-400 italic">Pending Documentation</span>
                )}
            </div>
        </div>
    );
}