import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Filter, X, ExternalLink, Activity, ChevronDown, Check } from 'lucide-react';
import api from '../utils/axiosInstance';
import CommitmentCard from '../components/ui/CommitmentCard';

export default function ManifestoTracker() {
    const { selectedTerm } = useOutletContext();
    const [commitments, setCommitments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Pagination & Filter State
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sectorFilter, setSectorFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedPromise, setSelectedPromise] = useState(null);

    const filterRef = useRef(null);
    const LIMIT = 12;

    // Initial Fetch: Resets everything when the term changes
    useEffect(() => {
        setCommitments([]);
        setSkip(0);
        setHasMore(true);
        fetchData(0, true); // Pass 0 directly for initial load
    }, [selectedTerm]);

    // Consistently use 'api' and the passed 'currentSkip' value
    const fetchData = async (currentSkip, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const response = await api.get('/commitments', {
                params: {
                    term: selectedTerm,
                    limit: LIMIT,
                    skip: currentSkip // Use the value passed as an argument, NOT the state
                }
            });

            // Handle your specific API response structure { success: true, data: [...] }
            if (response.success) {
                const newData = response.data;
                setCommitments(prev => isInitial ? newData : [...prev, ...newData]);

                // If the backend returns less than the limit, we've reached the end
                if (newData.length < LIMIT) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("❌ ManifestoTracker Fetch Error:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextSkip = skip + LIMIT; // Calculate the NEW skip locally
        setSkip(nextSkip);            // Update state for the next cycle
        fetchData(nextSkip);          // Pass the NEW value directly to the API call
    };

    // Filter Logic
    const uniqueSectors = ["All", ...new Set(commitments.map(c => c.sector).filter(Boolean))];
    const filteredCommitments = commitments.filter(c =>
        sectorFilter === 'All' ? true : c.sector === sectorFilter
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 relative pb-20">
            {/* Custom Header & Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-[#00507A] tracking-tight">Manifesto Audit Trail</h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Tracking <span className="text-[#966B9D] font-bold">{commitments.length}</span> verified promises.
                    </p>
                </div>

                {/* Custom Dropdown Filter */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-sm text-[#00507A] hover:bg-white transition-all"
                    >
                        <Filter size={18} className="text-gray-400" />
                        <span>{sectorFilter === 'All' ? 'Filter by Ministry' : sectorFilter}</span>
                        <ChevronDown size={18} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-[24px] shadow-2xl z-50 py-3">
                            {uniqueSectors.map((sector) => (
                                <button
                                    key={sector}
                                    onClick={() => {
                                        setSectorFilter(sector);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                                        sectorFilter === sector ? 'bg-[#00507A] text-white' : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    {sector}
                                    {sectorFilter === sector && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#00507A]" size={48} /></div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCommitments.map(promise => (
                            <CommitmentCard
                                key={promise.id}
                                promise={promise}
                                onClick={() => setSelectedPromise(promise)}
                            />
                        ))}
                    </div>

                    {/* Pagination Trigger */}
                    {hasMore && (
                        <div className="flex justify-center pt-12">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="bg-[#00507A] text-white px-10 py-4 rounded-[20px] font-black text-sm hover:scale-105 transition-all disabled:opacity-50"
                            >
                                {loadingMore ? <Loader2 className="animate-spin" size={20} /> : "Load More Intelligence"}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal Logic (Using the structure you shared previously) */}
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