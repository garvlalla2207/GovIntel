import React from 'react';

const TimelineItem = ({ time, title, description, isLast }) => (
  <div className="relative pl-6 pb-6">
    {!isLast && <div className="absolute left-[7px] top-2 bottom-0 w-px bg-gray-200"></div>}
    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#74AA78] z-10"></div>
    <div className="text-xs font-bold text-gray-400 uppercase mb-1">{time}</div>
    <h4 className="text-sm font-bold text-[#00507A]">{title}</h4>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

const Timeline = ({ items }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {items.map((item, index) => (
        <TimelineItem 
          key={index}
          time={item.time}
          title={item.title}
          description={item.description}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};

export default Timeline;