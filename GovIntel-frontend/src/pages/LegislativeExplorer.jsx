// src/pages/LegislativeExplorer.jsx
import React, { useState } from 'react';
import { FileText, ChevronRight, History, Zap } from 'lucide-react';

const MOCK_BILLS = [
  { id: 1, title: "Personal Data Protection Bill", date: "2023-08-03", status: "Passed" },
  { id: 2, title: "Infrastructure Development Auth", date: "2024-01-15", status: "Committee" },
  { id: 3, title: "National Health Registry Act", date: "2023-11-20", status: "Introduced" },
];

export default function LegislativeExplorer() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left Pane (30%) */}
      <div className="w-[30%] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-[#00507A]">Document Repository</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {MOCK_BILLS.map((bill, idx) => (
            <button 
              key={bill.id} 
              className={`w-full text-left p-4 rounded-lg border transition-all ${idx === 0 ? 'bg-blue-50 border-[#00507A]/30' : 'border-transparent hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-0.5 rounded text-white ${bill.status === 'Passed' ? 'bg-[#74AA78]' : 'bg-[#00507A]'}`}>
                  {bill.status}
                </span>
                <span className="text-xs text-gray-500">{bill.date}</span>
              </div>
              <h3 className={`font-semibold text-sm ${idx === 0 ? 'text-[#00507A]' : 'text-gray-700'}`}>{bill.title}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane (70%) */}
      <div className="w-[70%] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#74AA78] text-white text-xs px-3 py-1 rounded-full font-medium">Passed</span>
            <span className="text-gray-500 text-sm">Introduced: Aug 03, 2023</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Personal Data Protection Bill</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-4 bg-gray-50 gap-6">
          <button 
            onClick={() => setActiveTab('text')}
            className={`pb-3 font-medium flex items-center gap-2 ${activeTab === 'text' ? 'text-[#00507A] border-b-2 border-[#00507A]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={18} /> Original Legal Text
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`pb-3 font-medium flex items-center gap-2 ${activeTab === 'summary' ? 'text-[#966B9D] border-b-2 border-[#966B9D]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Zap size={18} /> AI Simplified Summary
          </button>
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 font-medium flex items-center gap-2 ${activeTab === 'timeline' ? 'text-[#00507A] border-b-2 border-[#00507A]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <History size={18} /> Legislative Evolution
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-700 leading-relaxed">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-[#966B9D]/20 p-4 rounded-xl text-sm text-[#00507A]">
                <strong>AI Note:</strong> This text simplifies the 84-page legal document into core actionable points for public understanding.
              </div>
              <h3 className="text-lg font-bold text-gray-800">Key Provisions</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Establishes the Data Protection Board to oversee compliance.</li>
                <li>Requires explicit consent from citizens before data processing.</li>
                <li>Imposes penalties up to ₹250 crore for data breaches.</li>
              </ul>
            </div>
          )}
          {activeTab === 'timeline' && (
            <div className="flex items-center justify-between px-10 py-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#00507A] text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-md">1</div>
                <p className="text-sm font-semibold">Introduced</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 relative"><div className="absolute top-0 left-0 h-full bg-[#00507A] w-full"></div></div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#00507A] text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-md">2</div>
                <p className="text-sm font-semibold">Committee</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 relative"><div className="absolute top-0 left-0 h-full bg-[#00507A] w-full"></div></div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#00507A] text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-md">3</div>
                <p className="text-sm font-semibold">Amended</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 relative"><div className="absolute top-0 left-0 h-full bg-[#74AA78] w-full"></div></div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#74AA78] text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-md">4</div>
                <p className="text-sm font-semibold text-[#74AA78]">Passed</p>
              </div>
            </div>
          )}
          {activeTab === 'text' && (
            <div className="font-mono text-sm bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-line">
              {`CHAPTER I
PRELIMINARY

1. Short title and commencement.—(1) This Act may be called the Digital Personal Data Protection Act, 2023.
(2) It shall come into force on such date as the Central Government may, by notification in the Official Gazette...`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}