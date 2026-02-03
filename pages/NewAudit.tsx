
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditType, PropertyAudit } from '../types';

interface NewAuditProps {
  addAudit: (audit: PropertyAudit) => void;
}

export const NewAudit: React.FC<NewAuditProps> = ({ addAudit }) => {
  const navigate = useNavigate();
  const [type, setType] = useState<AuditType>(AuditType.MOVE_IN);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [landlord, setLandlord] = useState('');

  const handleStart = () => {
    if (!name || !address) {
      alert('Please fill in at least property name and address');
      return;
    }

    const newAudit: PropertyAudit = {
      id: crypto.randomUUID(),
      type,
      propertyName: name,
      address,
      landlordName: landlord,
      createdAt: new Date().toISOString(),
      photos: [],
      isCompleted: false
    };

    addAudit(newAudit);
    navigate(`/audit/${newAudit.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="px-6 py-6 flex items-center gap-4 mt-8">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full glass-effect hover:bg-white/10"
        >
          <span className="material-icons-round">chevron_left</span>
        </button>
        <h1 class="text-xl font-bold">New Property Audit</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-24">
        <section className="mb-8">
          <label className="block text-sm font-medium mb-3 text-slate-400 ml-1 uppercase tracking-wider text-[10px]">Audit Type</label>
          <div className="flex flex-wrap gap-2">
            {[AuditType.MOVE_IN, AuditType.MOVE_OUT, AuditType.GENERAL_REPAIR].map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  type === t 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'glass-effect text-slate-300 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400 ml-1 uppercase tracking-wider text-[10px]">Property Name</label>
            <div className="glass-effect rounded-2xl flex items-center px-4 py-3.5 focus-within:ring-2 ring-emerald-500/50 transition-all">
              <span className="material-icons-round text-emerald-500 mr-3">home</span>
              <input 
                className="bg-transparent border-none p-0 w-full text-base focus:ring-0 placeholder:text-slate-600 text-white" 
                placeholder="e.g. Sunset Apartments #402" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400 ml-1 uppercase tracking-wider text-[10px]">Address</label>
            <div className="glass-effect rounded-2xl flex items-start px-4 py-3.5 focus-within:ring-2 ring-emerald-500/50 transition-all">
              <span className="material-icons-round text-emerald-500 mr-3 mt-0.5">place</span>
              <textarea 
                className="bg-transparent border-none p-0 w-full text-base focus:ring-0 placeholder:text-slate-600 text-white resize-none" 
                placeholder="123 Orchard Lane, Manhattan, NY" 
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400 ml-1 uppercase tracking-wider text-[10px]">Landlord / Contact Name</label>
            <div className="glass-effect rounded-2xl flex items-center px-4 py-3.5 focus-within:ring-2 ring-emerald-500/50 transition-all">
              <span className="material-icons-round text-emerald-500 mr-3">person</span>
              <input 
                className="bg-transparent border-none p-0 w-full text-base focus:ring-0 placeholder:text-slate-600 text-white" 
                placeholder="John Doe Properties" 
                type="text"
                value={landlord}
                onChange={(e) => setLandlord(e.target.value)}
              />
            </div>
          </div>

          <div className="glass-effect bg-blue-500/10 border-blue-500/30 rounded-2xl p-4 flex gap-3">
            <span className="material-icons-round text-blue-500">info</span>
            <p className="text-xs text-blue-300 leading-relaxed">
              All photos captured will be embedded with an <strong className="text-white">unalterable timestamp</strong> and <strong className="text-white">GPS coordinates</strong> to ensure maximum legal validity.
            </p>
          </div>
        </div>
      </main>

      <footer className="p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
        <button 
          onClick={handleStart}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>START AUDIT</span>
          <span className="material-icons-round">play_arrow</span>
        </button>
      </footer>
    </div>
  );
};
