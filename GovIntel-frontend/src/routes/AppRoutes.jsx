// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import ManifestoTracker from '../pages/ManifestoTracker';
import LegislativeExplorer from '../pages/LegislativeExplorer';
import GovernanceNetwork from '../pages/GovernanceNetwork';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manifesto" element={<ManifestoTracker />} />
        <Route path="/legislation" element={<LegislativeExplorer />} />
        <Route path="/network" element={<GovernanceNetwork />} />
      </Route>
    </Routes>
  );
}