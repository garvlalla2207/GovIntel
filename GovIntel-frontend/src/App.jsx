import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import ManifestoTracker from './pages/ManifestoTracker';

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50/30">
      <Sidebar />
      <div className="flex-1">
        {/* Notice: No <BrowserRouter> here anymore! */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manifesto" element={<ManifestoTracker />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;