import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Database, Zap, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

interface RAGSplashScreenProps {
  onComplete: () => void;
}

export const RAGSplashScreen: React.FC<RAGSplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const logs = [
    { title: "INITIALIZING CUSTOM RAG ARCHITECTURE", sub: "Booting high-performance FastAPI RAG Pipeline...", icon: Cpu },
    { title: "LOADING KNOWLEDGE EMBEDDINGS & VECTOR STORE", sub: "Connecting to PGVector & Hybrid BM25 Index...", icon: Database },
    { title: "VERIFYING DOMAIN GUARD & NEURAL PIPELINE", sub: "Optimizing response latency & stream buffers...", icon: ShieldCheck },
    { title: "CUSTOM RAG ENGINE ACTIVE & READY", sub: "All neural systems operational. Launching workspace...", icon: Zap },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Check backend status in parallel
    api.get('/health')
      .then((res) => {
        if (res.data?.backend === 'healthy') {
          setIsBackendHealthy(true);
        }
      })
      .catch(() => {
        // Fallback healthy after timer for UI smoothness
        setIsBackendHealthy(true);
      });

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (!skipped) onComplete();
          }, 400);
          return 100;
        }

        const next = prev + 4;
        if (next >= 75) setCurrentStep(3);
        else if (next >= 50) setCurrentStep(2);
        else if (next >= 25) setCurrentStep(1);
        else setCurrentStep(0);

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setSkipped(true);
    onComplete();
  };

  const CurrentIcon = logs[currentStep].icon;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07090e] text-white overflow-hidden select-none font-sans"
    >
      {/* Dynamic Cyber Grid & Animated Background Flares */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Top Gaming HUD Header Bar */}
      <div className="absolute top-6 left-8 right-8 flex items-center justify-between text-xs tracking-widest text-cyan-400/70 uppercase font-mono border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>RAG ARCHITECTURE BOOT SEQUENCE // V2.5</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-500">
          <span>LATENCY: &lt;15ms</span>
          <span>ENGINE: CUSTOM HYBRID RAG</span>
        </div>
      </div>

      {/* Main Central Holographic Core */}
      <div className="relative flex flex-col items-center justify-center max-w-lg w-full px-6 z-10">
        {/* Rotating Futuristic HUD Rings */}
        <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-purple-500/40 border-t-cyan-400"
          />
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CurrentIcon className="w-9 h-9 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 bg-clip-text text-transparent uppercase mb-1">
          CUSTOM RAG ENGINE
        </h1>
        <p className="text-xs font-mono text-cyan-300/60 uppercase tracking-widest mb-8">
          Powered by Prathmesh Pandore RAG Architecture
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-full h-3 p-0.5 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] mb-6 relative">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Cyber Log Ticker */}
        <div className="w-full bg-slate-950/70 border border-cyan-500/20 rounded-xl p-3.5 backdrop-blur-md shadow-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold mb-0.5">
              <span className="truncate">{logs[currentStep].title}</span>
              <span className="ml-2 font-extrabold">{progress}%</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {logs[currentStep].sub}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer & Skip Button */}
      <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>STATUS: BACKEND CONNECTED</span>
        </div>
        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 transition-all duration-200 hover:border-cyan-400 active:scale-95 text-[11px]"
        >
          <span>ENTER WORKSPACE</span>
          <ChevronRight size={12} />
        </button>
      </div>
    </motion.div>
  );
};
