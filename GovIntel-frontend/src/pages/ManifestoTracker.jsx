// src/pages/ManifestoTracker.jsx
import React, { useState } from 'react';

const MOCK_PROMISES = [
  { id: 1, text: "Deploy Nationwide 5G Infrastructure", sector: "Digital", year: "2019", progress: 100, bills: ["Telecom Act 2021"] },
  { id: 2, text: "Double Farmers' Income", sector: "Economy", year: "2014", progress: 40, bills: ["Agri-Market Bill 2020"] },
  { id: 3, text: "Construct 100 Smart Cities", sector: "Infrastructure", year: "2014", progress: 75, bills: ["Urban Dev Act"] },
  { id: 4, text: "Complete Tax Code Overhaul", sector: "Economy", year: "2024", progress: 0, bills: ["Pending"] },
];

export default function ManifestoTracker() {
  const [sectorFilter, setSectorFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-[#00507A]">Manifesto Tracker</h1>
        
        <div className="flex gap-4">
          <select 
            className="select select-bordered select-sm border-gray-300 text-gray-700 bg-white"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="All">All Sectors</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Digital">Digital</option>
            <option value="Economy">Economy</option>
          </select>
          
          <select 
            className="select select-bordered select-sm border-gray-300 text-gray-700 bg-white"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="All">All Years</option>
            <option value="2014">2014</option>
            <option value="2019">2019</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PROMISES.map(promise => {
          let ringColor = "ring-gray-100";
          let progressColor = "[&::-webkit-progress-value]:bg-[#00507A] [&::-moz-progress-bar]:bg-[#00507A]";
          
          if (promise.progress === 100) {
            ringColor = "ring-[#74AA78]/40 ring-2";
            progressColor = "[&::-webkit-progress-value]:bg-[#74AA78] [&::-moz-progress-bar]:bg-[#74AA78]";
          } else if (promise.progress === 0) {
            ringColor = "ring-[#D34D4A]/40 ring-2";
            progressColor = ""; // Will default or not show
          }

          return (
            <div key={promise.id} className={`bg-white border border-gray-200 p-6 rounded-2xl shadow-sm ${ringColor}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="badge bg-[#00507A]/10 text-[#00507A] border-none font-medium">{promise.sector}</span>
                  <span className="badge bg-[#966B9D]/10 text-[#966B9D] border-none font-medium">{promise.year}</span>
                </div>
                <span className="text-sm font-bold text-gray-500">{promise.progress}%</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-4">{promise.text}</h3>
              
              <div className="space-y-2 mb-4">
                <progress 
                  className={`progress w-full h-2 bg-gray-100 ${progressColor}`} 
                  value={promise.progress} 
                  max="100"
                ></progress>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Linked Legislation</p>
                <div className="flex flex-wrap gap-2">
                  {promise.bills.map(bill => (
                    <span key={bill} className="text-sm bg-gray-50 text-gray-700 px-3 py-1 rounded-md border border-gray-200">
                      {bill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}