import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquarePlus, PanelLeftClose, Settings, FileText, MessageSquare, Search, Pin, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';
import { useChats } from '@/hooks/useChat';
import { isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [healthStatus, setHealthStatus] = useState<'checking' | 'running' | 'error'>('checking');

  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        if (mounted) {
          if (res.data.backend === 'healthy') setHealthStatus('running');
          else setHealthStatus('error');
        }
      } catch (e) {
        if (mounted) setHealthStatus('error');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const { data: chats = [] } = useChats();

  const deleteChat = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this chat?")) {
      await api.delete(`/chats/${id}`);
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      if (location.pathname === `/c/${id}`) navigate('/');
    }
  };

  const togglePin = async (id: string, currentPinned: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await api.put(`/chats/${id}`, { is_pinned: !currentPinned });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
  };

  // Group chats
  const groupedChats = useMemo(() => {
    const filtered = chats.filter((c: any) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const groups = {
      pinned: filtered.filter((c: any) => c.is_pinned),
      today: [] as any[],
      yesterday: [] as any[],
      last7Days: [] as any[],
      older: [] as any[]
    };

    filtered.filter((c: any) => !c.is_pinned).forEach((chat: any) => {
      const date = parseISO(chat.created_at || new Date().toISOString());
      if (isToday(date)) groups.today.push(chat);
      else if (isYesterday(date)) groups.yesterday.push(chat);
      else if (isThisWeek(date)) groups.last7Days.push(chat);
      else groups.older.push(chat);
    });

    return groups;
  }, [chats, searchQuery]);

  const renderChatGroup = (title: string, items: any[], icon?: React.ReactNode) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <div className="px-2 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          {icon} {title}
        </div>
        <div className="space-y-0.5">
          {items.map((chat) => (
            <Link
              key={chat.id}
              to={`/c/${chat.id}`}
              className={cn(
                "group flex w-full items-center justify-between gap-2.5 rounded-lg px-2 py-2 text-sm transition-all duration-200",
                location.pathname === `/c/${chat.id}`
                  ? "bg-primary/15 text-primary font-medium shadow-sm border border-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 overflow-hidden w-full">
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate flex-1 text-left">{chat.title}</span>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={(e) => togglePin(chat.id, chat.is_pinned, e)} className="p-1 hover:text-foreground">
                  <Pin size={12} className={chat.is_pinned ? "fill-current" : ""} />
                </button>
                <button onClick={(e) => deleteChat(chat.id, e)} className="p-1 hover:text-destructive">
                  <Trash size={12} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          />
          
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-50 md:relative h-full border-r border-border/50 glass-panel flex flex-col shrink-0 overflow-hidden bg-background md:bg-transparent"
          >
            {/* Header */}
          <div className="flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 font-semibold group">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-primary/30 transition-all duration-300">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <span className="truncate text-foreground font-medium tracking-tight">Python AI</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 inline-flex items-center justify-center rounded-xl hover:bg-muted/80 text-muted-foreground transition-all duration-200 active:scale-95"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <Link
              to="/c/new"
              className="flex w-full items-center justify-between gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2.5 text-sm font-semibold shadow-md hover:shadow-primary/25 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <MessageSquarePlus size={16} />
                New Chat
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="flex h-8 w-full rounded-md border border-input bg-background px-8 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
            {renderChatGroup("Pinned", groupedChats.pinned, <Pin size={10} />)}
            {renderChatGroup("Today", groupedChats.today)}
            {renderChatGroup("Yesterday", groupedChats.yesterday)}
            {renderChatGroup("Previous 7 Days", groupedChats.last7Days)}
            {renderChatGroup("Older", groupedChats.older)}
          </div>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border/50 bg-background/30 backdrop-blur-md space-y-1">
            <Link
              to="/documents"
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-200",
                location.pathname === '/documents'
                  ? "bg-primary/15 text-primary font-medium shadow-sm border border-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <FileText size={16} />
              Knowledge Base
            </Link>

            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-200",
                location.pathname === '/settings'
                  ? "bg-primary/15 text-primary font-medium shadow-sm border border-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Settings size={16} />
              Settings
            </Link>

            <div className="pt-2 mt-2 border-t">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Backend Status</span>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  {healthStatus === 'checking' && <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />}
                  {healthStatus === 'running' && <span className="h-2 w-2 rounded-full bg-green-500" />}
                  {healthStatus === 'error' && <span className="h-2 w-2 rounded-full bg-red-500" />}
                  <span className="text-xs text-slate-400 font-medium">
                    {healthStatus === 'checking' ? 'Connecting...' : healthStatus === 'running' ? 'Gemini API Online' : 'Gemini API Offline'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
