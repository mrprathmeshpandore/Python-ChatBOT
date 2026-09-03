import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/useChatStore';
import { useNavigate } from 'react-router-dom';

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isStreaming = false, disabled = false }: ChatInputProps) {
  const { inputText, setInputText, dragActive } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isStreaming) {
        onSend(inputText);
        setInputText('');
      }
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12"
          >
            <button 
              onClick={() => useChatStore.getState().stopGeneration()}
              className="flex items-center gap-2 px-4 py-2 bg-background border rounded-full text-sm font-medium hover:bg-muted transition-colors shadow-sm"
            >
              <Square size={14} className="fill-current" />
              Stop generating
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={cn(
          "relative flex items-end w-full glass-input rounded-3xl p-2",
          dragActive && "border-primary border-dashed bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
        )}
      >
        {/* Left Actions */}
        <div className="flex pb-1 pl-1">
          <button 
            onClick={() => navigate('/documents')}
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-2xl transition-all duration-200 active:scale-95"
            title="Attach file (Redirects to Knowledge Base)"
          >
            <Paperclip size={20} />
          </button>
        </div>
        
        {/* Input */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isStreaming}
          placeholder="Message Python AI..."
          className="flex-1 max-h-[200px] min-h-[44px] bg-transparent px-3 py-3 text-base resize-none focus:outline-none custom-scrollbar disabled:opacity-50"
          rows={1}
        />
        
        {/* Right Actions */}
        <div className="flex items-center pb-1 pr-1 gap-1">
          {!inputText.trim() ? (
            <button 
              className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-2xl transition-all duration-200 active:scale-95"
              title="Voice Input"
            >
              <Mic size={20} />
            </button>
          ) : (
            <button 
              className={cn(
                "p-3 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center",
                !isStreaming && !disabled
                  ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/30"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              disabled={isStreaming || disabled}
              onClick={() => {
                if (inputText.trim() && !isStreaming) {
                  onSend(inputText);
                  setInputText('');
                }
              }}
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Character Counter (visible only when typing) */}
      <AnimatePresence>
        {inputText.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-6 right-2 text-xs text-muted-foreground font-mono"
          >
            {inputText.length} chars
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
