import React from 'react';
import { useUIStore } from '@/store/useUIStore';

export default function Settings() {
  const { theme, setTheme } = useUIStore();

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Theme
              </label>
              <p className="text-[13px] text-muted-foreground mb-3">
                Select the theme for the application.
              </p>
              
              <div className="grid grid-cols-3 gap-2 max-w-md">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center rounded-md border-2 p-3 bg-white text-slate-900 transition-all ${
                    theme === 'light' ? 'border-primary ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center rounded-md border-2 p-3 bg-slate-950 text-slate-50 transition-all ${
                    theme === 'dark' ? 'border-primary ring-1 ring-primary' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-medium text-sm">Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center rounded-md border-2 p-3 bg-slate-100 text-slate-900 transition-all ${
                    theme === 'system' ? 'border-primary ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium text-sm">System</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
