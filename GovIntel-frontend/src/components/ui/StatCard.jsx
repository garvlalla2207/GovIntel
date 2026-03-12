import React from 'react';

const StatCard = ({ title, value, subtext, type = 'default' }) => {
  const styles = {
    primary: 'bg-[#00507A] text-white shadow-lg shadow-[#00507A]/20',
    success: 'bg-white border-2 border-[#74AA78] text-[#00507A]',
    danger: 'bg-white border-2 border-[#D34D4A] text-[#D34D4A]',
    default: 'bg-white border border-gray-200 text-[#00507A]',
  };

  const subtextStyles = {
    primary: 'text-white/80',
    success: 'text-[#74AA78] font-medium',
    danger: 'text-[#D34D4A] font-medium',
    default: 'text-gray-500',
  };

  return (
    <div className={`rounded-2xl p-6 flex flex-col justify-between h-40 ${styles[type]}`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${type === 'primary' ? 'text-white/90' : 'text-gray-500'}`}>
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <span className="text-5xl font-extrabold">{value}</span>
      </div>
      <p className={`text-sm mt-2 ${subtextStyles[type]}`}>{subtext}</p>
    </div>
  );
};

export default StatCard;