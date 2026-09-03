import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useChats } from '@/hooks/useChat';
import { MessageSquare, Settings, FileText, Search } from 'lucide-react';
import './command.css';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: chats } = useChats();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-card border shadow-2xl rounded-xl overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <Command label="Global Command Menu" className="w-full">
          <div className="flex items-center px-4 border-b" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input 
              autoFocus
              placeholder="Type a command or search..." 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>

            <Command.Group heading="Suggestions" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/c/new'))}
                className="flex items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>New Chat</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/documents'))}
                className="flex items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Knowledge Base</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-border my-1" />

            <Command.Group heading="Chats" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              {chats?.slice(0, 5).map((chat: any) => (
                <Command.Item 
                  key={chat.id}
                  onSelect={() => runCommand(() => navigate(`/c/${chat.id}`))}
                  className="flex items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <MessageSquare className="mr-2 h-4 w-4 opacity-50" />
                  <span>{chat.title}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="h-px bg-border my-1" />

            <Command.Group heading="Settings" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/settings'))}
                className="flex items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
