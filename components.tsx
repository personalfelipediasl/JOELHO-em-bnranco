import React, { useState, useRef, useEffect } from 'react';
import { 
  MoveVertical, 
  Activity, 
  Archive, 
  TrendingUp, 
  AlignHorizontalSpaceAround, 
  ChevronsUp, 
  MoveHorizontal, 
  Layers, 
  ArrowDownUp,
  PlayCircle,
  ChevronLeft,
  Heart,
  FileText,
  CheckCircle,
  Info,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const getIcon = (iconName: string, className?: string) => {
  const props = { className: className || "w-6 h-6" };
  switch (iconName) {
    case 'MoveVertical': return <MoveVertical {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Archive': return <Archive {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'AlignHorizontalSpaceAround': return <AlignHorizontalSpaceAround {...props} />;
    case 'ChevronsUp': return <ChevronsUp {...props} />;
    case 'MoveHorizontal': return <MoveHorizontal {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'ArrowDownUp': return <ArrowDownUp {...props} />;
    default: return <Activity {...props} />;
  }
};

export const Timer: React.FC<{ title: string; hint: string }> = ({ hint }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);

  const toggleTimer = () => setIsActive(!isActive);

  const handleStartReset = () => {
    longPressTimer.current = window.setTimeout(() => {
      setTime(0);
      setIsActive(false);
    }, 800);
  };

  const handleEndReset = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => setTime((t) => t + 10), 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000).toString().padStart(2, '0');
    const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const msec = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${min}:${sec}.${msec}`;
  };

  return (
    <div className="flex flex-col items-center gap-1 my-2">
      <div 
        onClick={toggleTimer}
        onMouseDown={handleStartReset}
        onMouseUp={handleEndReset}
        onTouchStart={handleStartReset}
        onTouchEnd={handleEndReset}
        className="bg-surface border border-primary-500/30 rounded-full px-4 py-1.5 flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md"
      >
        <Clock className={`w-4 h-4 mr-2 ${isActive ? 'text-primary-500 animate-pulse' : 'text-neutral-500'}`} />
        <span className="text-lg font-mono font-bold text-primary-500 tabular-nums">{formatTime(time)}</span>
      </div>
      <p className="text-[8px] uppercase tracking-widest text-neutral-600 font-bold">{hint}</p>
    </div>
  );
};

export const SetCard: React.FC<{ 
  index: number; 
  reps: string; 
  restLabel: string; 
  serieLabel: string;
  repLabel: string;
  cargaLabel: string;
}> = ({ index, reps, restLabel, serieLabel, repLabel, cargaLabel }) => {
  const [isDone, setIsDone] = useState(false);
  const [weight, setWeight] = useState('');

  return (
    <div 
      onClick={() => setIsDone(!isDone)}
      className={`p-3 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col gap-1 ${
        isDone ? 'bg-primary-500 border-primary-500 shadow-md' : 'bg-surface border-neutral-800'
      }`}
    >
      <div className="flex justify-center items-center">
        <span className={`text-[11px] font-black uppercase text-center ${isDone ? 'text-white' : 'text-primary-500'}`}>
          {serieLabel} {index + 1}
        </span>
      </div>
      <div className="flex flex-col items-center text-center">
        <span className={`text-xs font-bold ${isDone ? 'text-white' : 'text-neutral-400'}`}>{repLabel}: {reps}</span>
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 mt-0.5">
          <span className={`text-sm font-bold ${isDone ? 'text-white' : 'text-neutral-500'}`}>{cargaLabel}:</span>
          <input 
            type="text" 
            placeholder="--" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`bg-transparent border-none outline-none text-xs font-bold w-10 p-0 text-center ${isDone ? 'text-white placeholder-white/50' : 'text-white placeholder-neutral-700'}`}
          />
        </div>
        <span className={`text-[10px] ${isDone ? 'text-white/80' : 'text-neutral-500'}`}>{restLabel}</span>
      </div>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline'; fullWidth?: boolean }> = ({ 
  children, variant = 'primary', fullWidth = false, className = '', ...props 
}) => {
  const base = "inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold transition-all active:scale-95 focus:outline-none";
  const variants = {
    primary: "bg-primary-500 text-white shadow-lg shadow-primary-500/30",
    secondary: "bg-surface text-white border border-neutral-700 shadow-md",
    outline: "border-2 border-neutral-700 text-neutral-400 bg-transparent",
  };
  return (
    <button className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const VideoPlayer: React.FC<{ videoUrl?: string; labels: any }> = ({ videoUrl, labels }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  if (!videoUrl) return <div className="w-full aspect-video bg-surface rounded-xl flex items-center justify-center text-neutral-600 border-2 border-dashed border-neutral-800">Video Placeholder</div>;
  
  let embedUrl = videoUrl.replace(/\/watch.*/, '/view?embed').replace(/\/edit.*/, '/view?embed');

  if (isPlaying) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800 relative">
        <iframe width="100%" height="100%" src={embedUrl} frameBorder="0" allow="autoplay; encrypted-media" className="w-full h-full object-cover"></iframe>
      </div>
    );
  }
  return (
    <div className="w-full aspect-video bg-neutral-900 rounded-xl flex flex-col items-center justify-center border-2 border-neutral-800 relative overflow-hidden group">
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <button onClick={() => setIsPlaying(true)} className="z-20 flex flex-col items-center">
        <PlayCircle className="w-16 h-16 text-primary-500 mb-2" />
        <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">{labels.tapToWatch}</span>
      </button>
    </div>
  );
};

export const ScreenWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`min-h-screen max-w-md mx-auto bg-black shadow-2xl overflow-hidden flex flex-col relative ${className}`}>
    {children}
  </div>
);

export const Header: React.FC<{ title?: string; onBack?: () => void }> = ({ title, onBack }) => (
  <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800 px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {title && <h1 className="text-lg font-bold text-white truncate">{title}</h1>}
    </div>
  </div>
);