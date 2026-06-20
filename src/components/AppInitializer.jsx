import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AppInitializer = ({ children }) => {
  const { isLoading } = useAuth();
  const [initComplete, setInitComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');

  const advanceProgress = useCallback(() => {
    setProgress(prev => {
      if (prev >= 90) return prev;
      const maxStep = 90 - prev;
      const step = Math.random() * Math.min(maxStep * 0.15, 8);
      return Math.min(prev + Math.max(step, 0.5), 90);
    });
  }, []);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(advanceProgress, 250);
    } else {
      if (interval) clearInterval(interval);
      setProgress(100);
      setPhase('complete');
      const t = setTimeout(() => setInitComplete(true), 600);
      return () => clearTimeout(t);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isLoading, advanceProgress]);

  if (initComplete) return children;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-950 transition-opacity duration-500">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-10">
          <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1 select-none">
            Rong<span className="text-maroon">Rani</span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-medium mt-2">
            Handcrafted with love
          </p>
        </div>

        {/* Progress */}
        <div className="w-56 mx-auto mb-4">
          <div className="h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-maroon rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtle dots */}
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-maroon/40"
              style={{
                animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default AppInitializer;
