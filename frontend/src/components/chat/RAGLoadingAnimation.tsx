import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Cpu, Search, Sparkles, Layers } from 'lucide-react';

export function RAGLoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Search,
      label: "Querying PgVector & Knowledge Base...",
      subLabel: "Scanning uploaded documents & vector store",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Layers,
      label: "Retrieving Hybrid Context & BM25 Reranking...",
      subLabel: "Filtering highest similarity chunks",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Cpu,
      label: "Knowledge AI Pipeline Active...",
      subLabel: "Synthesizing customized response",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = steps[currentStep].icon;

  return (
    <div className="py-2 px-1 w-full max-w-lg">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-background/40 backdrop-blur-xl p-4 shadow-xl shadow-primary/5">
        {/* Animated Background Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        
        <div className="relative z-10 flex items-center gap-3.5">
          {/* Animated Glowing Icon Container */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 shadow-inner">
            <span className="absolute inset-0 rounded-xl bg-primary/20 blur-md animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 text-primary"
              >
                <ActiveIcon size={20} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-1 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-primary flex items-center gap-1">
                <Sparkles size={11} className="animate-spin text-primary" />
                Custom RAG Engine Active
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/70">FastAPI + PgVector</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-0.5"
              >
                <p className="text-xs font-semibold text-foreground tracking-tight truncate">
                  {steps[currentStep].label}
                </p>
                <p className="text-[11px] text-muted-foreground/80 truncate">
                  {steps[currentStep].subLabel}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Dots / Bar */}
        <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-border/30">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentStep
                  ? 'flex-1 bg-gradient-to-r from-primary to-blue-500 shadow-sm shadow-primary/30'
                  : idx < currentStep
                  ? 'w-3 bg-primary/40'
                  : 'w-3 bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
