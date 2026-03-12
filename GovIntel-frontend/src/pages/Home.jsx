import React from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import ManifestoCard from '../components/ui/ManifestoCard';
import Timeline from '../components/ui/Timeline';

const Home = () => {
  // Mock Data
  const timelineData = [
    { time: '2 HOURS AGO', title: 'Bill Passed: HR-602', description: 'Agricultural Subsidy reform passed 3rd reading.' },
    { time: 'YESTERDAY', title: 'Public Consultation', description: 'Energy Regulatory Commission hearing opened.' },
    { time: 'OCT 24, 2023', title: 'New Manifesto Item', description: 'Emergency Flood Relief added to tracking list.' }
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#00507A] mb-2">Governance Oversight</h1>
          <p className="text-gray-500 font-medium">Real-time legislative tracking and accountability mapping.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn bg-white border-gray-200 text-[#00507A] hover:bg-gray-50 rounded-xl px-6 font-bold shadow-sm">
            Generate Report
          </button>
          <button className="btn bg-[#00507A] text-white hover:bg-[#00507A]/90 border-none rounded-xl px-6 font-bold shadow-lg shadow-[#00507A]/30">
            + New Tracking
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Promises" 
          value="142" 
          subtext="^ 12 New this month" 
          type="primary" 
        />
        <StatCard 
          title="Bills Passed" 
          value="48" 
          subtext="+8% Performance" 
          type="success" 
        />
        <StatCard 
          title="No Progress" 
          value="22" 
          subtext="Immediate Attention Required" 
          type="danger" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Manifesto Items */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#00507A]">Active Manifesto Items</h2>
            <button className="text-sm font-bold text-[#00507A] hover:text-[#74AA78] transition-colors">
              View All →
            </button>
          </div>
          <div className="space-y-6">
            <ManifestoCard 
              category="Education"
              title="Universal Digital Literacy Program"
              description="Providing high-speed internet and digital devices to all public secondary schools across rural districts by end of fiscal year."
              progress={85}
              linkedBills={['SB-204: ICT Funding', 'HB-19 Rural Dev']}
            />
            <ManifestoCard 
              category="Infrastructure"
              title="Green Energy Grid Expansion"
              description="Modernizing the national power grid to integrate 40% renewable energy sources from solar and wind farms."
              progress={32}
              linkedBills={[]}
            />
          </div>
        </div>

        {/* Right Column: Milestones */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold text-[#00507A] mb-6">Milestones</h2>
          <Timeline items={timelineData} />
        </div>
        
      </div>
    </Layout>
  );
};

export default Home;