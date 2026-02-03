
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PropertyAudit } from '../types';

interface ReportViewProps {
  audits: PropertyAudit[];
}

export const ReportView: React.FC<ReportViewProps> = ({ audits }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const audit = audits.find(a => a.id === id);

  if (!audit) return null;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="px-6 py-6 flex items-center justify-between mt-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-full glass-effect hover:bg-white/10"
          >
            <span className="material-icons-round">chevron_left</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white truncate max-w-[180px]">{audit.propertyName}</h1>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{audit.type}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/audit/${audit.id}`)}
          className="bg-emerald-500/10 text-emerald-500 p-2 rounded-xl flex items-center gap-2 px-4 border border-emerald-500/30"
        >
          <span className="material-icons-round text-lg">add_a_photo</span>
          <span className="text-xs font-bold">ADD</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="mb-6 space-y-2">
           <div className="flex items-center gap-2 text-slate-400 text-xs">
             <span className="material-icons-round text-sm">place</span>
             {audit.address}
           </div>
           <div className="flex items-center gap-2 text-slate-400 text-xs">
             <span className="material-icons-round text-sm">person</span>
             Landlord: {audit.landlordName || 'Not specified'}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {audit.photos.length === 0 ? (
            <div className="col-span-2 glass-effect p-12 text-center rounded-2xl border-dashed border-slate-700">
              <span className="material-icons-round text-4xl text-slate-700 mb-2">image_not_supported</span>
              <p className="text-slate-500 text-sm italic">No evidence captured yet.</p>
            </div>
          ) : (
            audit.photos.map((photo, index) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="relative aspect-square rounded-2xl overflow-hidden glass-effect group active:scale-95 transition-all"
              >
                <img src={photo.imageUrl} alt="Evidence" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 p-2 flex flex-col justify-end">
                  <div className="text-[8px] font-mono text-white/90 flex items-center gap-1">
                    <span className="material-icons-round text-[8px]">gps_fixed</span>
                    {photo.location.latitude.toFixed(4)}, {photo.location.longitude.toFixed(4)}
                  </div>
                  <div className="text-[8px] font-mono text-white/90 flex items-center gap-1">
                    <span className="material-icons-round text-[8px]">schedule</span>
                    {new Date(photo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/90 flex items-center justify-center text-white shadow-lg">
                  <span className="material-icons-round text-[14px]">verified</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Menu */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-effect rounded-2xl p-4 flex items-center justify-between border-emerald-500/20 shadow-2xl">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Evidence</div>
            <div className="text-xl font-black text-white">{audit.photos.length} Captured</div>
          </div>
          <button 
            className="bg-emerald-500 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 active:scale-95 transition-all"
            onClick={() => alert("RentAudit Pro required for PDF Export. High-resolution unalterable documents are generated server-side.")}
          >
            <span className="material-icons-round text-lg">description</span>
            <span>GENERATE PDF</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Photo Viewer */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col p-4">
          <header className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setSelectedPhotoIndex(null)}
              className="w-10 h-10 flex items-center justify-center rounded-full glass-effect"
            >
              <span className="material-icons-round">close</span>
            </button>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <span className="material-icons-round text-sm">verified</span>
              TAMPER-PROOF RECORD
            </div>
            <div className="w-10"></div>
          </header>
          
          <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10">
            <img 
              src={audit.photos[selectedPhotoIndex].imageUrl} 
              alt="Evidence Full" 
              className="w-full h-full object-contain bg-slate-950" 
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                    <span className="material-icons-round text-3xl">qr_code_2</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-emerald-500 font-bold tracking-tighter uppercase mb-1">Certificate #RA-{audit.photos[selectedPhotoIndex].id.slice(0,8).toUpperCase()}</div>
                    <div className="text-xs text-white/80 font-mono">TS: {new Date(audit.photos[selectedPhotoIndex].timestamp).toISOString()}</div>
                    <div className="text-xs text-white/80 font-mono">LAT: {audit.photos[selectedPhotoIndex].location.latitude.toFixed(6)}</div>
                    <div className="text-xs text-white/80 font-mono">LNG: {audit.photos[selectedPhotoIndex].location.longitude.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="py-6 flex justify-between gap-4">
            <button 
              disabled={selectedPhotoIndex === 0}
              onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
              className="flex-1 bg-white/10 text-white font-bold py-4 rounded-2xl disabled:opacity-30"
            >
              PREVIOUS
            </button>
            <button 
              disabled={selectedPhotoIndex === audit.photos.length - 1}
              onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
              className="flex-1 bg-white/10 text-white font-bold py-4 rounded-2xl disabled:opacity-30"
            >
              NEXT
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};
