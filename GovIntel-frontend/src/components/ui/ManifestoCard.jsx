import React from 'react';

const ManifestoCard = ({ category, title, description, progress, linkedBills }) => {
  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#74AA78]"></div>
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {category}
        </span>
        <span className="text-xs font-bold text-[#74AA78] uppercase">{progress}% Complete</span>
      </div>
      
      <h3 className="text-xl font-bold text-[#00507A] mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2">{description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span>Implementation Progress</span>
          <span>{progress}/100 Units</span>
        </div>
        <progress className="progress progress-success w-full [&::-webkit-progress-value]:bg-[#74AA78]" value={progress} max="100"></progress>
      </div>

      {linkedBills && linkedBills.length > 0 && (
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Linked Bills:</span>
          <div className="flex gap-2">
            {linkedBills.map((bill, index) => (
              <span key={index} className="text-xs font-medium text-[#966B9D] bg-[#966B9D]/10 px-2 py-1 rounded-md">
                {bill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManifestoCard;