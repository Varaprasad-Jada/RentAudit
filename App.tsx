
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { NewAudit } from './pages/NewAudit';
import { CameraMode } from './pages/CameraMode';
import { ReportView } from './pages/ReportView';
import { PropertyAudit } from './types';

const STORAGE_KEY = 'rentaudit_data_v1';

const App: React.FC = () => {
  const [audits, setAudits] = useState<PropertyAudit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audits));
  }, [audits]);

  const addAudit = (audit: PropertyAudit) => {
    setAudits(prev => [audit, ...prev]);
  };

  const updateAudit = (updatedAudit: PropertyAudit) => {
    setAudits(prev => prev.map(a => a.id === updatedAudit.id ? updatedAudit : a));
  };

  const deleteAudit = (id: string) => {
    setAudits(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="w-full max-w-md mx-auto h-full bg-slate-900 shadow-2xl overflow-hidden relative border-x border-slate-800">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard audits={audits} deleteAudit={deleteAudit} />} />
          <Route path="/new" element={<NewAudit addAudit={addAudit} />} />
          <Route path="/audit/:id" element={<CameraMode audits={audits} updateAudit={updateAudit} />} />
          <Route path="/report/:id" element={<ReportView audits={audits} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
