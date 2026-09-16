import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { useUIStore } from '@/store/useUIStore';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { RAGSplashScreen } from '../common/RAGSplashScreen';
import { AnimatePresence } from 'framer-motion';

const AppLayout: React.FC = () => {
  const { theme } = useUIStore();
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen on first session load
    const hasSeenSplash = sessionStorage.getItem('rag_splash_seen');
    if (!hasSeenSplash) {
      sessionStorage.setItem('rag_splash_seen', 'true');
      return true;
    }
    return false;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent text-foreground transition-colors duration-300 relative z-0">
      <AnimatePresence>
        {showSplash && <RAGSplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Premium AI Background Layer */}
      <div className="ai-bg-container">
        <div className="ai-grid" />
        <div className="ai-glow-1" />
        <div className="ai-glow-2" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col relative h-full min-w-0 transition-all duration-300 bg-transparent">
        <Header />
        
        {/* Scrollable Outlet Area */}
        <div className="flex-1 overflow-auto relative z-0 custom-scrollbar">
          <Outlet />
        </div>
      </main>

      {/* Right Info Panel */}
      <RightPanel />
      
      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
};

export default AppLayout;
