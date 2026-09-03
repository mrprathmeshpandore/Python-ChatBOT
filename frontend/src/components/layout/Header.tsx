import React from 'react';
import { Menu, PanelRight, Moon, Sun, Monitor, LogOut } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Header() {
  const { toggleSidebar, toggleRightPanel, theme, setTheme, rightPanelOpen } = useUIStore();
  const { user, token, setAuth, logout } = useAuthStore();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        
        if (!res.ok) {
          throw new Error('Failed to authenticate with backend');
        }
        
        const data = await res.json();
        setAuth(data.access_token, data.user);
        toast.success(`Welcome, ${data.user.name}!`);
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Failed to log in');
      }
    },
    onError: () => {
      toast.error('Google login failed');
    }
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 bg-background/60 backdrop-blur-xl px-4 sm:px-6 shadow-sm transition-all duration-300">
      <button 
        onClick={toggleSidebar}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
      >
        <Menu size={20} />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
      
      <div className="flex-1 flex items-center justify-center gap-2">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-xs font-semibold text-foreground/80 shadow-sm border-white/10 dark:border-white/5"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Python AI Ready
        </motion.div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => {
            const chatElements = document.querySelectorAll('.custom-markdown');
            let mdContent = '# Chat Export\n\n';
            chatElements.forEach((el) => {
              mdContent += el.textContent + '\n\n---\n\n';
            });
            const blob = new Blob([mdContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-export-${new Date().toISOString().split('T')[0]}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
          title="Export as Markdown"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>

        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon size={16} /> : theme === 'light' ? <Sun size={16} /> : <Monitor size={16} />}
        </button>

        <button 
          onClick={toggleRightPanel}
          className={`h-9 w-9 inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${rightPanelOpen ? 'text-primary bg-primary/10 shadow-inner' : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
          title="Toggle Details"
        >
          <PanelRight size={18} />
        </button>

        {user ? (
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border/50">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={user.picture || ''} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
              }}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <Button variant="ghost" onClick={() => login()} className="text-sm font-medium rounded-full px-4 h-9">
              Log in
            </Button>
            <Button onClick={() => login()} className="text-sm font-medium rounded-full px-4 h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
              Sign up for free
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
