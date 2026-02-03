
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PropertyAudit, LocationData, PhotoRecord } from '../types';

interface CameraModeProps {
  audits: PropertyAudit[];
  updateAudit: (audit: PropertyAudit) => void;
}

export const CameraMode: React.FC<CameraModeProps> = ({ audits, updateAudit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const audit = audits.find(a => a.id === id);

  useEffect(() => {
    if (!audit) {
      navigate('/');
      return;
    }

    // Get Location
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.error("Location access denied", err)
    );

    // Initialize Camera
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    setupCamera();

    return () => {
      cameraStream?.getTracks().forEach(track => track.stop());
    };
  }, [id, audit, navigate]);

  const capturePhoto = () => {
    if (!videoRef.current || !audit) return;
    setIsCapturing(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    
    // In a real app, this blob would be uploaded or stored locally
    const imageUrl = canvas.toDataURL('image/jpeg');

    const newPhoto: PhotoRecord = {
      id: crypto.randomUUID(),
      imageUrl,
      timestamp: new Date().toISOString(),
      location: location || { latitude: 0, longitude: 0 },
      category: 'General',
    };

    const updatedAudit = {
      ...audit,
      photos: [...audit.photos, newPhoto]
    };

    updateAudit(updatedAudit);

    setTimeout(() => {
      setIsCapturing(false);
    }, 200);
  };

  if (!audit) return null;

  return (
    <div className="relative h-full bg-black overflow-hidden flex flex-col">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={() => {
            cameraStream?.getTracks().forEach(track => track.stop());
            navigate(`/report/${audit.id}`);
          }}
          className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white"
        >
          <span className="material-icons-round">close</span>
        </button>
        <div className="px-4 py-1.5 glass-effect rounded-full text-xs font-bold text-white uppercase tracking-widest border-emerald-500/50">
          Audit Mode: {audit.type}
        </div>
        <div className="w-10"></div>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />

        {/* HUD / Watermark Overlay */}
        <div className="absolute bottom-32 left-6 right-6 pointer-events-none">
          <div className="glass-effect p-3 rounded-lg border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-white/70 font-mono">
              <span className="material-icons-round text-[12px]">schedule</span>
              {new Date().toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/70 font-mono">
              <span className="material-icons-round text-[12px]">gps_fixed</span>
              {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'ACQUIRING GPS...'}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-2">
              <span className="material-icons-round text-[12px]">verified</span>
              RentAudit Unalterable Evidence
            </div>
          </div>
        </div>

        {/* Capture Flash */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white z-50 transition-opacity animate-pulse"></div>
        )}
      </div>

      {/* Camera Bottom Controls */}
      <div className="p-10 bg-black flex items-center justify-between gap-6 z-20">
        <button 
          onClick={() => navigate(`/report/${audit.id}`)}
          className="w-14 h-14 rounded-full glass-effect flex flex-col items-center justify-center text-white/60 hover:text-white"
        >
          <div className="relative">
            <span className="material-icons-round text-3xl">photo_library</span>
            {audit.photos.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-black">
                {audit.photos.length}
              </div>
            )}
          </div>
        </button>

        <button 
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white group-hover:scale-95 transition-transform"></div>
        </button>

        <div className="w-14 h-14"></div> {/* Spacer for symmetry */}
      </div>
    </div>
  );
};
