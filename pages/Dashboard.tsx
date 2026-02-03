
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyAudit, AuditType } from '../types';

interface DashboardProps {
  audits: PropertyAudit[];
  deleteAudit: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ audits, deleteAudit }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="px-6 pt-12 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">RentAudit</h1>
          <p className="text-slate-400 text-sm">Your Evidence Portal</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
          <span className="material-icons-round">verified_user</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 space-y-6 pb-24">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-200">Recent Audits</h2>
            <button 
              onClick={() => navigate('/new')}
              className="text-primary text-sm font-bold flex items-center gap-1"
            >
              <span className="material-icons-round text-lg">add</span>
              NEW
            </button>
          </div>

          {audits.length === 0 ? (
            <div className="glass-effect rounded-2xl p-8 text-center space-y-4 border-dashed border-slate-700">
              <span className="material-icons-round text-5xl text-slate-600">domain_disabled</span>
              <p className="text-slate-500 text-sm">No property audits yet. Start one to protect your security deposit.</p>
              <button 
                onClick={() => navigate('/new')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                START FIRST AUDIT
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {audits.map(audit => (
                <div 
                  key={audit.id}
                  className="glass-effect rounded-2xl p-4 flex items-center gap-4 active:bg-white/10 transition-colors"
                  onClick={() => navigate(`/report/${audit.id}`)}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    audit.type === AuditType.MOVE_IN ? 'bg-blue-500/10 text-blue-500' : 
                    audit.type === AuditType.MOVE_OUT ? 'bg-orange-500/10 text-orange-500' : 
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    <span className="material-icons-round text-3xl">
                      {audit.type === AuditType.MOVE_IN ? 'login' : 
                       audit.type === AuditType.MOVE_OUT ? 'logout' : 'build'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{audit.propertyName}</h3>
                    <p className="text-xs text-slate-400 truncate">{audit.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                        {audit.photos.length} PHOTOS
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteAudit(audit.id); }}
                    className="p-2 text-slate-600 hover:text-red-400"
                  >
                    <span className="material-icons-round text-xl">delete_outline</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {audits.length > 0 && (
          <div className="glass-effect bg-emerald-500/10 border-emerald-500/30 rounded-2xl p-4 flex gap-3">
            <span className="material-icons-round text-emerald-500">security</span>
            <div className="text-xs text-emerald-100 leading-relaxed">
              <strong>Tip:</strong> Always capture natural light photos of floors, ceilings, and windows to show existing marks.
            </div>
          </div>
        )}
      </main>

      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)]">
         <button 
           onClick={() => navigate('/new')}
           className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
         >
           <span className="material-icons-round">add_circle</span>
           <span>NEW PROPERTY AUDIT</span>
         </button>
      </footer>
    </div>
  );
};
