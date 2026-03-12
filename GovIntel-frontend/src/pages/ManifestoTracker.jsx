import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Filter, X, ExternalLink, Activity  } from 'lucide-react';
import api from '../utils/axiosInstance';
import CommitmentCard from '../components/ui/CommitmentCard';

export default function ManifestoTracker() {
    const { selectedTerm } = useOutletContext();
    const [commitments, setCommitments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Local filter for sector (doesn't hit the DB, just filters the fetched list)
    const [sectorFilter, setSectorFilter] = useState('All');

    const [selectedPromise, setSelectedPromise] = useState(null);

    useEffect(() => {
        const fetchCommitments = async () => {
            setLoading(true);
            try {
                const res = await api.get('/commitments', {
                    params: { term: selectedTerm, limit: 100 }
                });
                if (res.success) {
                    setCommitments(res.data);
                }
            } catch (error) {
                console.error("Failed to load commitments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommitments();
    }, [selectedTerm]);

    // Extract unique sectors from the data for the dropdown
    const uniqueSectors = ["All", ...new Set(commitments.map(c => c.sector).filter(Boolean))];

    // Apply local filtering
    const filteredCommitments = commitments.filter(c =>
        sectorFilter === 'All' ? true : c.sector === sectorFilter
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 relative">
            {/* ... keep your Header and Grid ... */}
            {/* Update the map function to pass the onClick handler: */}

            {!loading && filteredCommitments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCommitments.map(promise => (
                        <CommitmentCard
                            key={promise._id || promise.id}
                            promise={promise}
                            onClick={() => setSelectedPromise(promise)} // NEW: Trigger Modal
                        />
                    ))}
                </div>
            )}

            {/* NEW: The Deep Dive Modal */}
            {selectedPromise && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#00507A]/40 backdrop-blur-sm transition-all"
                    onClick={() => setSelectedPromise(null)} // Click background to close
                >
                    {/* Modal Container */}
                    <div
                        className="bg-white rounded-[32px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-2">
                <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-[#966B9D]/10 text-[#966B9D] border border-[#966B9D]/20 rounded-md">
                  {selectedPromise.sector || "General"}
                </span>
                                <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border 
                  ${selectedPromise.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    selectedPromise.status === 'Stalled' ? 'bg-red-50 text-red-600 border-red-200' :
                                        'bg-amber-50 text-amber-600 border-amber-200'}`}>
                  {selectedPromise.status}
                </span>
                            </div>
                            <button
                                onClick={() => setSelectedPromise(null)}
                                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <h2 className="text-2xl font-black text-[#00507A] mb-4 leading-tight">
                            {selectedPromise.title}
                        </h2>

                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Activity size={14} className="text-[#966B9D]" /> Agent Audit Summary
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                {selectedPromise.summary}
                            </p>
                        </div>

                        {selectedPromise.evidence_link && selectedPromise.evidence_link !== "#" && (
                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <a
                                    href={selectedPromise.evidence_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-[#00507A] hover:bg-[#003d5c] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md hover:shadow-lg"
                                >
                                    Read Source Document <ExternalLink size={16} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}