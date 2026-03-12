import React, { useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize, X, FileText, Activity, Landmark } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const TERM_DATA = {
    "2014": {
        nodes: [
            { id: 'core', x: 400, y: 300, type: 'core', cluster: 'all', label: 'Manifesto 2014', details: 'Focused on structural reforms and infrastructure growth.', status: 'Active' },
            { id: 'p1', x: 220, y: 140, type: 'promise', cluster: 'digital', label: 'E-Governance', details: 'Connecting 2.5 lakh gram panchayats with high-speed broadband.', status: 'Fulfilled' },
            { id: 'p2', x: 580, y: 140, type: 'promise', cluster: 'economy', label: 'Tax Simplification', details: 'Replacing multiple indirect taxes with GST for a single market.', status: 'Fulfilled' },
            { id: 'p3', x: 180, y: 300, type: 'promise', cluster: 'healthcare', label: 'Health for All', details: 'National Health Assurance Mission for affordable diagnostics.', status: 'In Progress' },
            { id: 'p4', x: 620, y: 300, type: 'promise', cluster: 'social', label: 'Housing for All', details: 'Construction of 2 crore houses for urban and rural poor.', status: 'Fulfilled' },
            { id: 'p5', x: 400, y: 120, type: 'promise', cluster: 'economy', label: 'Labor Reform', details: 'Reforming complex labor laws to improve Ease of Doing Business.', status: 'Stalled' },
            { id: 'b1', x: 80, y: 60, type: 'passed', cluster: 'digital', label: 'Digital India Act', details: 'Framework for digital services and electronic governance.', status: 'Enacted' },
            { id: 'b2', x: 720, y: 60, type: 'passed', cluster: 'economy', label: 'GST Act 2017', details: 'The most significant tax reform in Indian history.', status: 'Enacted' },
            { id: 'b3', x: 40, y: 300, type: 'passed', cluster: 'healthcare', label: 'Indradhanush Bill', details: 'Universal immunization protecting against 7 major diseases.', status: 'Enacted' },
            { id: 'b4', x: 760, y: 300, type: 'passed', cluster: 'social', label: 'PMAY-Gramin', details: 'Executing the legal framework for subsidized rural housing.', status: 'Enacted' },
            { id: 'b5', x: 400, y: 30, type: 'stalled', cluster: 'economy', label: 'Labor Code Bill', details: 'Draft bill stalled due to industrial stakeholder pushback.', status: 'Stalled' },
        ],
        edges: [
            { id: 'e1', source: 'core', target: 'p1' }, { id: 'e2', source: 'core', target: 'p2' },
            { id: 'e3', source: 'core', target: 'p3' }, { id: 'e4', source: 'core', target: 'p4' },
            { id: 'e5', source: 'core', target: 'p5' }, { id: 'e6', source: 'p1', target: 'b1' },
            { id: 'e7', source: 'p2', target: 'b2' }, { id: 'e8', source: 'p3', target: 'b3' },
            { id: 'e9', source: 'p4', target: 'b4' }, { id: 'e10', source: 'p5', target: 'b5' }
        ]
    },
    "2019": {
        nodes: [
            { id: 'core', x: 400, y: 300, type: 'core', cluster: 'all', label: 'Manifesto 2019', details: 'Sankalp Patra: National security and welfare-led development.', status: 'Active' },
            { id: 'p1', x: 250, y: 150, type: 'promise', cluster: 'security', label: 'Article 370', details: 'Abrogation to ensure full legal integration of J&K.', status: 'Fulfilled' },
            { id: 'p2', x: 550, y: 150, type: 'promise', cluster: 'digital', label: 'Data Sovereignty', details: 'Protecting citizen data from unauthorized foreign access.', status: 'Fulfilled' },
            { id: 'p3', x: 250, y: 450, type: 'promise', cluster: 'social', label: 'Triple Talaq', details: 'Criminalizing instant triple talaq for gender justice.', status: 'Fulfilled' },
            { id: 'p4', x: 550, y: 450, type: 'promise', cluster: 'economy', label: 'Privatization', details: 'Strategic sale of loss-making public sector enterprises.', status: 'In Progress' },
            { id: 'p5', x: 400, y: 480, type: 'promise', cluster: 'social', label: 'Uniform Civil Code', details: 'Implementing a common set of laws for every citizen.', status: 'Stalled' },
            { id: 'b1', x: 100, y: 50, type: 'passed', cluster: 'security', label: 'J&K Reorg Act', details: 'Redrawing the map into Union Territories.', status: 'Enacted' },
            { id: 'b2', x: 700, y: 50, type: 'passed', cluster: 'digital', label: 'DPDP Act 2023', details: 'The cornerstone of modern Indian digital privacy.', status: 'Enacted' },
            { id: 'b3', x: 100, y: 550, type: 'passed', cluster: 'social', label: 'Muslim Women Act', details: 'Legal ban on instant divorce practices.', status: 'Enacted' },
            { id: 'b4', x: 700, y: 550, type: 'passed', cluster: 'economy', label: 'Air India Sale', details: 'First successful major strategic disinvestment.', status: 'Enacted' },
            { id: 'b5', x: 400, y: 580, type: 'stalled', cluster: 'social', label: 'UCC Draft', details: 'Currently under review by the Law Commission.', status: 'Stalled' },
        ],
        edges: [
            { id: 'e1', source: 'core', target: 'p1' }, { id: 'e2', source: 'core', target: 'p2' },
            { id: 'e3', source: 'core', target: 'p3' }, { id: 'e4', source: 'core', target: 'p4' },
            { id: 'e5', source: 'core', target: 'p5' }, { id: 'e6', source: 'p1', target: 'b1' },
            { id: 'e7', source: 'p2', target: 'b2' }, { id: 'e8', source: 'p3', target: 'b3' },
            { id: 'e9', source: 'p4', target: 'b4' }, { id: 'e10', source: 'p5', target: 'b5' }
        ]
    },
    "2024": {
        nodes: [
            { id: 'core', x: 400, y: 300, type: 'core', cluster: 'all', label: 'Manifesto 2024', details: 'Modi Ki Guarantee: Towards a Developed India by 2047.', status: 'Active' },
            { id: 'p1', x: 220, y: 150, type: 'promise', cluster: 'digital', label: 'AI Mission', details: 'Making India a global hub for Agentic AI innovation.', status: 'Fulfilled' },
            { id: 'p2', x: 580, y: 150, type: 'promise', cluster: 'economy', label: 'Semi-Conductors', details: 'Local chip design and manufacturing ecosystem.', status: 'Fulfilled' },
            { id: 'p3', x: 220, y: 450, type: 'promise', cluster: 'social', label: '6G Rollout', details: 'Leading the global standard in 6G wireless tech.', status: 'In Progress' },
            { id: 'p4', x: 580, y: 450, type: 'promise', cluster: 'environment', label: 'Net Zero 2070', details: 'Decarbonizing the heavy industry and energy sectors.', status: 'In Progress' },
            { id: 'p5', x: 400, y: 120, type: 'promise', cluster: 'economy', label: 'Global Rupee', details: 'Internationalization of the INR for global trade.', status: 'Stalled' },
            { id: 'b1', x: 80, y: 50, type: 'passed', cluster: 'digital', label: 'Compute Act', details: 'Subsidy for sovereign AI compute clusters.', status: 'Enacted' },
            { id: 'b2', x: 720, y: 50, type: 'passed', cluster: 'economy', label: 'Fab Incentive Bill', details: 'Funding for 12nm and below semiconductor fabs.', status: 'Enacted' },
            { id: 'b3', x: 80, y: 550, type: 'passed', cluster: 'social', label: 'Telecom Act 2024', details: 'Spectrum allocation for future 6G satellite services.', status: 'Enacted' },
            { id: 'b4', x: 720, y: 550, type: 'passed', cluster: 'environment', label: 'Carbon Credit Bill', details: 'Trading framework for industrial carbon credits.', status: 'Enacted' },
            { id: 'b5', x: 400, y: 20, type: 'stalled', cluster: 'economy', label: 'Rupee Trade Act', details: 'Cross-border payment bill awaiting RBI/Global clearance.', status: 'Stalled' },
        ],
        edges: [
            { id: 'e1', source: 'core', target: 'p1' }, { id: 'e2', source: 'core', target: 'p2' },
            { id: 'e3', source: 'core', target: 'p3' }, { id: 'e4', source: 'core', target: 'p4' },
            { id: 'e5', source: 'core', target: 'p5' }, { id: 'e6', source: 'p1', target: 'b1' },
            { id: 'e7', source: 'p2', target: 'b2' }, { id: 'e8', source: 'p3', target: 'b3' },
            { id: 'e9', source: 'p4', target: 'b4' }, { id: 'e10', source: 'p5', target: 'b5' }
        ]
    }
};

export default function GovernanceNetwork() {
    const { selectedTerm } = useOutletContext();
    const currentData = TERM_DATA[selectedTerm] || TERM_DATA["2014"];
    const nodes = currentData.nodes;
    const edges = currentData.edges;

    const [hoveredNode, setHoveredNode] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [zoom, setZoom] = useState(1);

    const activeConnections = useMemo(() => {
        const activeId = hoveredNode || (selectedNode ? selectedNode.id : null);
        if (!activeId) return { nodes: new Set(), edges: new Set() };
        const connectedEdges = new Set();
        const connectedNodes = new Set([activeId]);
        edges.forEach(edge => {
            if (edge.source === activeId || edge.target === activeId) {
                connectedEdges.add(edge.id);
                connectedNodes.add(edge.source);
                connectedNodes.add(edge.target);
            }
        });
        return { nodes: connectedNodes, edges: connectedEdges };
    }, [hoveredNode, selectedNode, edges]);

    const getNodeColor = (type, status) => {
        if (type === 'core') return '#00507A';
        if (type === 'promise') return '#966B9D';
        return status === 'Stalled' ? '#D34D4A' : '#74AA78';
    };

    const getNodeRadius = (type) => (type === 'core' ? 45 : type === 'promise' ? 25 : 18);

    return (
        <div className="flex flex-col h-full max-w-7xl mx-auto pb-8 relative animate-in fade-in duration-700">
            {/* OSINT Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-[#00507A] flex items-center gap-3">
                        GOVINTEL OSINT Intelligence
                        <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
                    </h2>
                    <p className="text-gray-500 mt-2 max-w-2xl text-sm font-medium italic">
                        Visualizing high-impact policy lineages for the {selectedTerm} administration.
                    </p>
                </div>

                {/* Dynamic Legend */}
                <div className="flex gap-4 bg-white p-3 px-5 rounded-2xl border border-gray-100 shadow-sm">
                    <LegendItem color="#00507A" label="Manifesto" />
                    <LegendItem color="#966B9D" label="Promise" />
                    <LegendItem color="#74AA78" label="Enacted Bill" />
                    <LegendItem color="#D34D4A" label="Stalled Bill" />
                </div>
            </div>

            <div className="flex-1 relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center min-h-[600px]">
                {/* Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                     style={{ backgroundImage: 'radial-gradient(#00507A 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                {/* Zoom Engine */}
                <div className="absolute right-6 bottom-6 z-20 flex flex-col gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/50">
                    <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-2 text-gray-400 hover:text-[#00507A] transition-colors"><ZoomIn size={18}/></button>
                    <button onClick={() => setZoom(1)} className="p-2 text-gray-400 hover:text-[#00507A] transition-colors"><Maximize size={18}/></button>
                    <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-2 text-gray-400 hover:text-[#00507A] transition-colors"><ZoomOut size={18}/></button>
                </div>

                {/* SVG GRAPH */}
                <div className="w-full h-full overflow-hidden flex items-center justify-center">
                    <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)' }}>
                        <svg width="800" height="600" className="overflow-visible">
                            <g>
                                {edges.map(edge => {
                                    const src = nodes.find(n => n.id === edge.source);
                                    const tar = nodes.find(n => n.id === edge.target);
                                    if (!src || !tar) return null;
                                    const isActive = activeConnections.edges.has(edge.id);
                                    return (
                                        <line key={edge.id} x1={src.x} y1={src.y} x2={tar.x} y2={tar.y}
                                              stroke={isActive ? '#00507A' : '#e2e8f0'}
                                              strokeWidth={isActive ? 3 : 1.5} strokeDasharray={isActive ? "none" : "4 4"}
                                              className="transition-all duration-300" />
                                    );
                                })}
                            </g>

                            {nodes.map(node => {
                                const isSelected = selectedNode?.id === node.id;
                                const isHovered = hoveredNode === node.id;
                                const isDimmed = (hoveredNode || selectedNode) && !activeConnections.nodes.has(node.id);

                                return (
                                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`} style={{ opacity: isDimmed ? 0.2 : 1 }} className="transition-all duration-500">
                                        <g onMouseEnter={() => setHoveredNode(node.id)}
                                           onMouseLeave={() => setHoveredNode(null)}
                                           onClick={() => setSelectedNode(node)} className="cursor-pointer">
                                            <circle r={getNodeRadius(node.type)} fill={getNodeColor(node.type, node.status)} className="shadow-lg" />

                                            {node.type === 'core' ? (
                                                <text y="5" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" className="uppercase tracking-tighter">Manifesto</text>
                                            ) : (
                                                <g>
                                                    <rect x="-40" y={getNodeRadius(node.type) + 8} width="80" height="20" rx="10" fill="white" className="shadow-sm border border-gray-100" />
                                                    <text y={getNodeRadius(node.type) + 21} textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="900">{node.label}</text>
                                                </g>
                                            )}

                                            {isSelected && <circle r={getNodeRadius(node.type) + 10} fill="none" stroke="#966B9D" strokeWidth="2" strokeDasharray="4 4" />}
                                        </g>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* Intelligence Side-out */}
                <div className={`absolute top-0 right-0 h-full w-85 bg-white shadow-2xl border-l p-8 transition-transform duration-500 ease-out z-40 ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedNode && (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-[#00507A] uppercase tracking-widest px-2 py-1 bg-[#00507A]/5 rounded w-fit">OSINT Node: {selectedNode.type}</span>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedNode.label}</h3>
                                </div>
                                <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                            </div>

                            <div className="space-y-8 overflow-y-auto pr-2">
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText size={14} className="text-[#966B9D]" />
                                        Intelligence Briefing
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed font-semibold">{selectedNode.details}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={14} className="text-[#74AA78]" />
                                        Governance Status
                                    </h4>
                                    <div className="flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor(selectedNode.type, selectedNode.status) }}></div>
                                        <span className="text-xs font-black text-gray-800 uppercase tracking-wider">{selectedNode.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}