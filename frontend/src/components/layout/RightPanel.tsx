import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, Moon, Sun, Monitor, Type, Trash2, AlertCircle, Download, FileCode, Copy, Sparkles, Zap, RotateCcw } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useChatStore } from '@/store/useChatStore';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export function RightPanel() {
  const { rightPanelOpen, toggleRightPanel, theme, setTheme } = useUIStore();
  const { currentChatId } = useChatStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load persisted settings
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(
    (localStorage.getItem('setting-font-size') as any) || 'medium'
  );
  const [animations, setAnimations] = useState<'on' | 'off'>(
    (localStorage.getItem('setting-animations') as any) || 'on'
  );

  // Persist settings on change
  useEffect(() => { localStorage.setItem('setting-font-size', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('setting-animations', animations); }, [animations]);

  const getSettingsCSS = () => {
    let css = '';
    if (fontSize === 'small') css += '.custom-markdown, .prose { font-size: 0.875rem !important; }\n';
    if (fontSize === 'large') css += '.custom-markdown, .prose { font-size: 1.125rem !important; }\n';
    
    if (animations === 'off') {
      css += `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
    }
    return css;
  };

  const handleExport = (type: string) => {
    if (type === 'copy') {
      const chatElements = document.querySelectorAll('.custom-markdown');
      let text = '';
      chatElements.forEach((el) => { text += el.textContent + '\n\n'; });
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (type === 'md') {
      const chatElements = document.querySelectorAll('.custom-markdown');
      let mdContent = '# Chat Export\n\n';
      chatElements.forEach((el) => { mdContent += el.textContent + '\n\n---\n\n'; });
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleClearCurrentChat = async () => {
    setShowClearConfirm(false);
    if (currentChatId && currentChatId !== 'new') {
      try {
        await api.delete(`/chats/${currentChatId}`);
        queryClient.invalidateQueries({ queryKey: ['chats'] });
        navigate('/');
      } catch (e) {
        console.error("Failed to clear current chat", e);
      }
    }
  };

  const handleClearAllChats = async () => {
    setShowClearAllConfirm(false);
    try {
      const chats = queryClient.getQueryData<any[]>(['chats']) || [];
      for (const chat of chats) {
        await api.delete(`/chats/${chat.id}`);
      }
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      navigate('/');
    } catch (e) {
      console.error("Failed to clear all chats", e);
    }
  };

  const handleResetSettings = () => {
    localStorage.removeItem('setting-font-size');
    localStorage.removeItem('setting-animations');
    localStorage.removeItem('vite-ui-theme');
    window.location.reload();
  };

  return (
    <AnimatePresence mode="wait">
      <style>{getSettingsCSS()}</style>
      {rightPanelOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full border-l border-white/5 glass-panel flex flex-col shrink-0 overflow-hidden z-30 shadow-2xl"
        >
          <div className="flex h-14 items-center justify-between px-4 border-b border-border/50 bg-background/40 backdrop-blur-md">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Settings2 size={16} className="text-primary" />
              Settings
            </h3>
            <button
              onClick={toggleRightPanel}
              className="h-8 w-8 inline-flex items-center justify-center rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            
            {/* APPEARANCE SECTION */}
            <div>
              <div className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Appearance</div>
              
              {/* Theme Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                  <Monitor size={14} className="text-muted-foreground" /> Theme
                </label>
                <div className="grid grid-cols-3 gap-2 bg-muted/20 p-1.5 rounded-2xl border border-white/5">
                  {[
                    { id: 'light', icon: Sun, label: 'Light' },
                    { id: 'dark', icon: Moon, label: 'Dark' },
                    { id: 'system', icon: Monitor, label: 'System' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={cn(
                        "relative flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-medium transition-all duration-200 z-10",
                        theme === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      {theme === t.id && (
                        <motion.div
                          layoutId="theme-active"
                          className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <t.icon size={16} className="mb-1" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                  <Type size={14} className="text-muted-foreground" /> Font Size
                </label>
                <div className="grid grid-cols-3 gap-2 bg-muted/20 p-1.5 rounded-2xl border border-white/5">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size as any)}
                      className={cn(
                        "relative flex items-center justify-center py-2 rounded-xl text-xs font-medium transition-all duration-200 z-10 capitalize",
                        fontSize === size ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      {fontSize === size && (
                        <motion.div
                          layoutId="font-active"
                          className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className={size === 'small' ? 'text-[10px]' : size === 'large' ? 'text-sm' : 'text-xs'}>
                        Aa
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Animations Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                  <Zap size={14} className="text-muted-foreground" /> Animations
                </label>
                <div className="grid grid-cols-2 gap-2 bg-muted/20 p-1.5 rounded-2xl border border-white/5">
                  {['on', 'off'].map((anim) => (
                    <button
                      key={anim}
                      onClick={() => setAnimations(anim as any)}
                      className={cn(
                        "relative flex items-center justify-center py-2 rounded-xl text-xs font-medium transition-all duration-200 z-10 capitalize",
                        animations === anim ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      {animations === anim && (
                        <motion.div
                          layoutId="anim-active"
                          className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      {anim}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-border/40" />

            {/* CHAT SECTION */}
            <div>
              <div className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Chat</div>
              <div className="space-y-2">
                <button
                  onClick={() => handleExport('copy')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-muted/20 hover:bg-muted/40 transition-all text-sm group"
                >
                  <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    <Copy size={16} /> Copy Conversation
                  </span>
                  {copied && <span className="text-[10px] text-green-500 font-medium">Copied!</span>}
                </button>
                <button
                  onClick={() => handleExport('md')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-muted/20 hover:bg-muted/40 transition-all text-sm group"
                >
                  <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    <FileCode size={16} /> Export Chat (.md)
                  </span>
                </button>
                
                <AnimatePresence mode="wait">
                  {!showClearConfirm ? (
                    <motion.button
                      key="clear-current"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowClearConfirm(true)}
                      disabled={!currentChatId || currentChatId === 'new'}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl border border-white/5 bg-muted/20 hover:bg-muted/40 transition-all text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} /> Clear Current Chat
                    </motion.button>
                  ) : (
                    <motion.div
                      key="clear-current-confirm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl bg-muted/40 border border-white/5 space-y-3"
                    >
                      <p className="text-xs text-foreground/90 font-medium">Clear current chat?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="flex-1 py-1.5 rounded-lg bg-background text-foreground text-xs font-medium hover:bg-muted transition-colors border shadow-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleClearCurrentChat}
                          className="flex-1 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90 transition-colors shadow-sm"
                        >
                          Clear
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full h-px bg-border/40" />

            {/* DANGER ZONE */}
            <div>
              <div className="mb-3 text-[10px] font-bold tracking-widest text-destructive uppercase">Danger Zone</div>
              <div className="space-y-2">
                <AnimatePresence mode="wait">
                  {!showClearAllConfirm ? (
                    <motion.button
                      key="clear-all"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowClearAllConfirm(true)}
                      className="w-full py-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-semibold transition-all duration-200 active:scale-95 border border-destructive/20 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Clear All Conversations
                    </motion.button>
                  ) : (
                    <motion.div
                      key="clear-all-confirm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-3"
                    >
                      <p className="text-xs text-destructive/90 font-medium flex gap-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        Are you sure you want to clear all conversations? This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowClearAllConfirm(false)}
                          className="flex-1 py-1.5 rounded-lg bg-background text-foreground text-xs font-medium hover:bg-muted transition-colors border shadow-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleClearAllChats}
                          className="flex-1 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90 transition-colors shadow-sm"
                        >
                          Clear All
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleResetSettings}
                  className="w-full py-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 text-foreground text-sm font-semibold transition-all duration-200 active:scale-95 border border-white/5 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} className="text-muted-foreground" /> Reset All Settings
                </button>
              </div>
            </div>

            {/* ABOUT CARD */}
            <div className="relative overflow-hidden rounded-2xl glass-card border-white/10 p-5 mt-8 group">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20 mb-1">
                  <Sparkles className="text-white h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base tracking-tight">Python AI</h4>
                  <p className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">Application Version 1.0</p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {['React', 'TypeScript', 'Tailwind', 'FastAPI', 'Gemini', 'PostgreSQL', 'LangChain'].map(tech => (
                    <span key={tech} className="text-[9px] font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-white/5">{tech}</span>
                  ))}
                </div>

                <div className="pt-3 pb-1 border-t border-border/50 w-full mt-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Created & Developed by</p>
                  <p className="text-sm font-medium text-foreground">Prathmesh Pandore</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
