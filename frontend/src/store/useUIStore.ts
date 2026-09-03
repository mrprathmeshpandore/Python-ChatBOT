import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: false,
  mobileMenuOpen: false,
  theme: (localStorage.getItem('vite-ui-theme') as 'light' | 'dark' | 'system') || 'system',
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  
  setTheme: (theme) => {
    localStorage.setItem('vite-ui-theme', theme);
    set({ theme });
  },
}));
