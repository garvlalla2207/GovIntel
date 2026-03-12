// src/pages/GovernanceNetwork.jsx
import React, { useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize, TrendingUp, AlertTriangle, Award, X, FileText, Activity, Landmark } from 'lucide-react';

// --- MOCK DATA ---
const NODES = [
  { id: 'core', x: 400, y: 300, type: 'core', cluster: 'all', label: 'Manifesto 2024', details: 'Core platform promises for the current election cycle.', status: 'Active' },
  { id: 'p1', x: 200, y: 150, type: 'promise', cluster: 'digital', label: 'Digital Privacy', details: 'Ensure data sovereignty and citizen privacy.', status: 'In Progress' },
  { id: 'p2', x: 600, y: 150, type: 'promise', cluster: 'economy', label: 'Green Energy', details: 'Achieve 50% renewable energy grid integration.', status: 'On Track' },
  { id: 'p3', x: 200, y: 450, type: 'promise', cluster: 'healthcare', label: 'Rural Health', details: 'Build 1,000 new primary care centers.', status: 'Lagging' },
  { id: 'b1', x: 80, y: 50, type: 'passed', cluster: 'digital', label: 'DPDP Act', details: 'Digital Personal Data Protection Act.', status: 'Enacted' },
  { id: 'b2', x: 320, y: 50, type: 'stalled', cluster: 'digital', label: 'Data Local Act', details: 'Mandates local servers for foreign tech firms.', status: 'Stalled' },
  { id: 'b3', x: 720, y: 50, type: 'passed', cluster: 'economy', label: 'Solar Subsidy', details: 'National subsidies for residential rooftop solar.', status: 'Enacted' },
  { id: 'b4', x: 80, y: 550, type: 'passed', cluster: 'healthcare', label: 'Telemedicine', details: 'Legalized remote consultations.', status: 'Enacted' },
];

const EDGES = [
  { id: 'e1', source: 'core', target: 'p1' },
  { id: 'e2', source: 'core', target: 'p2' },
  { id: 'e3', source: 'core', target: 'p3' },
  { id: 'e5', source: 'p1', target: 'b1' },
  { id: 'e6', source: 'p1', target: 'b2' },
  { id: 'e7', source: 'p2', target: 'b3' },
  { id: 'e8', source: 'p3', target: 'b4' },
];

export default function GovernanceNetwork() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeCluster, setActiveCluster] = useState('all');
  const [zoom, setZoom] = useState(1);

  // --- INTERACTIVITY LOGIC ---
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const activeConnections = useMemo(() => {
    const activeId = hoveredNode || (selectedNode ? selectedNode.id : null);
    if (!activeId) return { nodes: new Set(), edges: new Set() };

    const connectedEdges = new Set();
    const connectedNodes = new Set([activeId]);

    EDGES.forEach(edge => {
      if (edge.source === activeId || edge.target === activeId) {
        connectedEdges.add(edge.id);
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      }
    });

    return { nodes: connectedNodes, edges: connectedEdges };
  }, [hoveredNode, selectedNode]);

  // --- RENDERING HELPERS ---
  const getNodeColor = (type) => {
    switch (type) {
      case 'core': return '#00507A';
      case 'promise': return '#966B9D';
      case 'passed': return '#74AA78';
      case 'stalled': return '#D34D4A';
      default: return '#00507A';
    }
  };

  const getNodeRadius = (type) => (type === 'core' ? 45 : type === 'promise' ? 25 : 18);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto pb-8 relative">
      <div className="mb-6">
        <h2 className="text-3xl font-black tracking-tight text-gray-900">Governance Network & Policy Clusters</h2>
        <p className="text-gray-500 mt-2 max-w-2xl text-sm leading-relaxed">
          Visualize the complex relationships between campaign manifesto promises and the actual legislative bills introduced. Track the impact of policy shifts across different terms.
        </p>
      </div>

      <div className="flex-1 relative bg-gray-50 rounded-[2rem] border border-gray-200 overflow-hidden shadow-inner flex items-center justify-center min-h-[500px]">
        
        {/* Architectural Background Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#00507A 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        ></div>

        {/* FLOATING FILTER PANEL (Left) */}
        <div className="absolute top-6 left-6 z-30 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 w-64">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">View By Cluster</p>
            <div className="space-y-2">
              <label onClick={() => setActiveCluster('all')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${activeCluster === 'all' ? 'bg-[#00507A]/5 border border-[#00507A]/10' : 'hover:bg-gray-50'}`}>
                <div className={`w-4 h-4 rounded ${activeCluster === 'all' ? 'bg-[#00507A]' : 'border-2 border-gray-300'}`}></div>
                <span className={`text-sm font-medium ${activeCluster === 'all' ? 'text-[#00507A] font-bold' : 'text-gray-700'}`}>All Policies</span>
                <span className="ml-auto text-[10px] font-bold text-[#00507A] bg-[#00507A]/10 px-1.5 py-0.5 rounded">44</span>
              </label>
              <label onClick={() => setActiveCluster('healthcare')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${activeCluster === 'healthcare' ? 'bg-[#966B9D]/5 border border-[#966B9D]/10' : 'hover:bg-gray-50'}`}>
                <div className={`w-4 h-4 rounded ${activeCluster === 'healthcare' ? 'bg-[#966B9D]' : 'border-2 border-[#966B9D] bg-[#966B9D]/10'}`}></div>
                <span className={`text-sm font-medium ${activeCluster === 'healthcare' ? 'text-[#966B9D] font-bold' : 'text-gray-700'}`}>Healthcare System</span>
                <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">12</span>
              </label>
              <label onClick={() => setActiveCluster('digital')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${activeCluster === 'digital' ? 'bg-[#00507A]/5 border border-[#00507A]/10' : 'hover:bg-gray-50'}`}>
                <div className={`w-4 h-4 rounded ${activeCluster === 'digital' ? 'bg-[#00507A]' : 'border-2 border-[#00507A] bg-[#00507A]/10'}`}></div>
                <span className={`text-sm font-medium ${activeCluster === 'digital' ? 'text-[#00507A] font-bold' : 'text-gray-700'}`}>Digital Transformation</span>
                <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">8</span>
              </label>
              <label onClick={() => setActiveCluster('economy')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${activeCluster === 'economy' ? 'bg-[#C68080]/5 border border-[#C68080]/10' : 'hover:bg-gray-50'}`}>
                <div className={`w-4 h-4 rounded ${activeCluster === 'economy' ? 'bg-[#C68080]' : 'border-2 border-[#C68080] bg-[#C68080]/10'}`}></div>
                <span className={`text-sm font-medium ${activeCluster === 'economy' ? 'text-[#C68080] font-bold' : 'text-gray-700'}`}>Economy & Trade</span>
                <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">24</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 w-64">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Legend</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00507A] shadow-[0_0_8px_rgba(0,80,122,0.4)]"></div>
                <span className="text-xs text-gray-600 font-medium">Manifesto Core</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#966B9D]"></div>
                <span className="text-xs text-gray-600 font-medium">Specific Promise</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#74AA78]"></div>
                <span className="text-xs text-gray-600 font-medium">Passed Bill</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#D34D4A]"></div>
                <span className="text-xs text-gray-600 font-medium">Pending / Stalled</span>
              </div>
            </div>
          </div>
        </div>

        {/* ZOOM CONTROLS */}
        <div className="absolute right-6 bottom-6 z-20 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg border border-gray-100">
          <button onClick={handleZoomIn} className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#00507A] rounded-lg transition-colors"><ZoomIn size={18} /></button>
          <button onClick={handleResetZoom} className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#00507A] rounded-lg transition-colors"><Maximize size={18} /></button>
          <button onClick={handleZoomOut} className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#00507A] rounded-lg transition-colors"><ZoomOut size={18} /></button>
        </div>

        {/* INTERACTIVE SVG GRAPH */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center">
          <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}>
            <svg width="800" height="600" className="overflow-visible drop-shadow-sm">
              
              {/* EDGES */}
              <g className="pointer-events-none">
                {EDGES.map(edge => {
                  const sourceNode = NODES.find(n => n.id === edge.source);
                  const targetNode = NODES.find(n => n.id === edge.target);
                  
                  const isDimmed = (activeCluster !== 'all' && sourceNode.cluster !== activeCluster && sourceNode.type !== 'core') || 
                                   ((hoveredNode || selectedNode) && !activeConnections.edges.has(edge.id));
                  const isActive = activeConnections.edges.has(edge.id);

                  return (
                    <line 
                      key={edge.id}
                      x1={sourceNode.x} y1={sourceNode.y} 
                      x2={targetNode.x} y2={targetNode.y} 
                      stroke={isActive ? '#00507A' : '#94a3b8'} 
                      strokeWidth={isActive ? 3 : 2} 
                      className="transition-all duration-700 ease-in-out"
                      style={{
                        opacity: isDimmed ? 0.15 : (isActive ? 1 : 0.4)
                      }}
                      strokeDasharray={isActive ? "6 6" : "none"}
                    />
                  );
                })}
              </g>

              {/* NODES */}
              {NODES.map(node => {
                const isDimmed = (activeCluster !== 'all' && node.cluster !== activeCluster && node.type !== 'core') || 
                                 ((hoveredNode || selectedNode) && !activeConnections.nodes.has(node.id));
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode === node.id;
                
                return (
                  // Outer Wrapper: Handles positional translation & dimming cleanly
                  <g 
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="transition-opacity duration-700 ease-in-out"
                    style={{ opacity: isDimmed ? 0.2 : 1 }}
                  >
                    {/* Inner Wrapper: Handles the buttery smooth spring scale interaction */}
                    <g
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer"
                      style={{
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                        transformOrigin: '0 0', // Crucial: Scales perfectly from the center of its local translated coords
                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring physics ease
                      }}
                    >
                      {/* 1. Large Invisible Hitbox (Prevents flickering when moving off text) */}
                      <circle r={getNodeRadius(node.type) + 25} fill="transparent" />

                      {/* 2. High-Performance CSS Glow (Replaces native SVG <filter>) */}
                      <circle 
                        r={getNodeRadius(node.type)} 
                        fill={getNodeColor(node.type)} 
                        className="blur-md pointer-events-none mix-blend-multiply"
                        style={{
                          opacity: (isHovered || isSelected) ? 0.6 : 0,
                          transform: (isHovered || isSelected) ? 'scale(1.4)' : 'scale(1)',
                          transformOrigin: '0 0',
                          transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                        }}
                      />

                      {/* 3. Main Visible Node */}
                      <circle 
                        r={getNodeRadius(node.type)} 
                        fill={getNodeColor(node.type)} 
                        className="pointer-events-none"
                      />
                      
                      {/* 4. Labels & Badges */}
                      {node.type === 'core' ? (
                        <g className="pointer-events-none">
                          <text y="4" textAnchor="middle" fill="white" fontSize="12" fontWeight="900" className="uppercase tracking-tighter drop-shadow-md">MANIFESTO</text>
                          <text y="18" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold" className="uppercase">Primary</text>
                        </g>
                      ) : (
                        <g className="pointer-events-none">
                          <rect x="-45" y={getNodeRadius(node.type) + 6} width="90" height="22" rx="11" fill="white" className="shadow-sm border border-gray-100 drop-shadow-sm" />
                          <text y={getNodeRadius(node.type) + 21} textAnchor="middle" fill="#475569" fontSize="10" fontWeight="700">{node.label}</text>
                        </g>
                      )}

                      {/* 5. Selected State Ring */}
                      <circle 
                        r={getNodeRadius(node.type) + 8} 
                        fill="none" 
                        stroke="#966B9D" 
                        strokeWidth="2" 
                        strokeDasharray="4 4" 
                        className="pointer-events-none transition-opacity duration-300"
                        style={{ opacity: isSelected ? 1 : 0 }}
                      />
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* INTELLIGENCE SLIDE-OUT PANEL */}
        <div className={`absolute top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-gray-200 transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) z-40 ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedNode && (
            <div className="flex flex-col h-full">
              <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-gray-200 uppercase tracking-wider text-gray-500 mb-2 inline-block shadow-sm">
                    {selectedNode.type} Node
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedNode.label}</h2>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[#D34D4A] hover:bg-red-50 hover:border-red-100 transition-all shadow-sm">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={14}/> Briefing</h3>
                  <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedNode.details}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Activity size={14}/> Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: getNodeColor(selectedNode.type) }}></div>
                    <span className="font-semibold text-gray-800 text-sm">{selectedNode.status}</span>
                  </div>
                </div>
                {selectedNode.type !== 'core' && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Landmark size={14}/> Connected Policies</h3>
                    <div className="space-y-2">
                      {Array.from(activeConnections.nodes).filter(id => id !== selectedNode.id && id !== 'core').map(id => {
                        const connectedNode = NODES.find(n => n.id === id);
                        return (
                          <div key={id} className="text-xs px-3 py-2 bg-white rounded-lg border border-gray-200 font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getNodeColor(connectedNode.type) }}></div>
                            {connectedNode.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 pb-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Bills</p>
          <p className="text-3xl font-black text-gray-900">142</p>
          <div className="mt-2 text-[10px] font-bold text-[#74AA78] flex items-center gap-1">
            <TrendingUp size={14} /> <span>+12 from last term</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Success Rate</p>
          <p className="text-3xl font-black text-gray-900">64%</p>
          <div className="mt-2 text-[10px] font-bold text-gray-500 flex items-center gap-1">
            <span>Manifesto Alignment</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Pending Review</p>
          <p className="text-3xl font-black text-gray-900">28</p>
          <div className="mt-2 text-[10px] font-bold text-[#D34D4A] flex items-center gap-1">
            <AlertTriangle size={14} /> <span>Awaiting Committee</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Impact Score</p>
          <p className="text-3xl font-black text-gray-900">8.4</p>
          <div className="mt-2 text-[10px] font-bold text-[#966B9D] flex items-center gap-1">
            <Award size={14} /> <span>High Sector Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}