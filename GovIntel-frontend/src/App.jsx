import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Home from './pages/Home';
import ManifestoTracker from './pages/ManifestoTracker';
import LegislativeExplorer from './pages/LegislativeExplorer';

function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/30">
      <Sidebar />

      {/* Main Wrapper: Fixed margin to match Sidebar width */}
        {/* Main content area fills remaining height and handles overflow */}
        <main className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manifesto" element={<ManifestoTracker />} />
            <Route path="/bills" element={<LegislativeExplorer />} />
          </Routes>
        </main>
    </div>
  );
}

export default App;