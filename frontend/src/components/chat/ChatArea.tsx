import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Bot, MessagesSquare } from 'lucide-react';
import { useMessages, useCreateChat } from '@/hooks/useChat';
import { useChatStore } from '@/store/useChatStore';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ChatAreaProps {
  chatId?: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  metadata_?: Record<string, any>;
}

export function ChatArea({ chatId }: ChatAreaProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: historyMessages, isLoading } = useMessages(chatId);
  const { mutateAsync: createChat } = useCreateChat();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const { isStreaming, setIsStreaming } = useChatStore();
  const { sidebarOpen } = useUIStore();
  const { user, setAuth } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        if (!res.ok) throw new Error('Failed to authenticate');
        const data = await res.json();
        setAuth(data.access_token, data.user);
        toast.success(`Welcome, ${data.user.name}!`);
      } catch (error) {
        toast.error('Failed to log in');
      }
    },
    onError: () => toast.error('Google login failed')
  });
  
  const prevChatIdRef = useRef<string | undefined>(chatId);

  // Log history loaded from React Query
  useEffect(() => {
    if (historyMessages) {
      console.log('[HISTORY_LOADED] History loaded for chatId:', chatId, historyMessages);
    }
  }, [historyMessages, chatId]);

  // Main state synchronization effect
  useEffect(() => {
    console.log('[USE_EFFECT] Fired for chatId:', chatId, '| isStreaming:', isStreaming, '| messagesCount:', messages.length, '| historyCount:', historyMessages?.length);

    const isChatIdChanged = chatId !== prevChatIdRef.current;
    
    if (isChatIdChanged) {
      console.log(`[USE_EFFECT] ChatId changed from ${prevChatIdRef.current} to ${chatId}`);
      prevChatIdRef.current = chatId;

      if (chatId === 'new') {
        console.log('[SET_MESSAGES] Source: CLEAR (New chat)');
        setMessages([]);
        return;
      }
    }

    // Do NOT overwrite local messages while streaming is active
    if (isStreaming) {
      console.log('[USE_EFFECT] Skipping history sync because streaming is active');
      return;
    }

    // Only set messages from history on chat switch OR when local state is empty
    if (historyMessages && (isChatIdChanged || messages.length === 0)) {
      console.log('[SET_MESSAGES] Source: HISTORY for chatId:', chatId);
      setMessages(historyMessages);
    }
  }, [historyMessages, chatId, isStreaming]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSendMessage = async (content: string) => {
    const { setAbortController, setActiveSources } = useChatStore.getState();
    
    // 1. Synchronous & Immediate Optimistic UI rendering
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content };
    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantMsgId, role: 'assistant', content: '' };

    console.log('[SET_MESSAGES] Source: OPTIMISTIC (User message + Assistant placeholder)');
    setMessages(prev => [...prev, newUserMsg, assistantMsg]);
    setIsStreaming(true);
    setActiveSources([]); // Clear previous sources

    let currentChatId = chatId;
    
    if (!currentChatId || currentChatId === 'new') {
      try {
        console.log('[CREATE_CHAT] Initiating createChat for title:', content.slice(0, 40));
        const newChat = await createChat(content.slice(0, 40) + '...');
        currentChatId = newChat.id;
        console.log('[CREATE_CHAT] Created new chat:', currentChatId);

        console.log('[NAVIGATE] Navigating to:', `/c/${currentChatId}`);
        navigate(`/c/${currentChatId}`, { replace: true });
      } catch (e) {
        console.error("[CREATE_CHAT] Failed to create chat", e);
        setIsStreaming(false);
        setMessages(prev => prev.filter(msg => msg.id !== newUserMsg.id && msg.id !== assistantMsgId));
        return;
      }
    }

    const abortController = new AbortController();
    setAbortController(abortController);

    try {
      console.log('[STREAM_STARTED] Streaming started for chatId:', currentChatId);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/rag/chat/${currentChatId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(useAuthStore.getState().token ? { 'Authorization': `Bearer ${useAuthStore.getState().token}` } : {})
        },
        body: JSON.stringify({ role: 'user', content, chat_id: currentChatId }),
        signal: abortController.signal
      });

      console.log("response.ok", response.ok);
      console.log("status", response.status);
      console.log("content-type", response.headers.get("content-type"));

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/event-stream")) {
        const text = await response.text();
        console.log("NON-SSE RESPONSE TEXT", text);
        try {
          const parsed = JSON.parse(text);
          const contentText = parsed.text || parsed.content || text;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMsgId ? { ...msg, content: contentText } : msg
          ));
        } catch (e) {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMsgId ? { ...msg, content: text } : msg
          ));
        }
        return;
      }

      if (!response.body) throw new Error("No response body");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let aiContent = "";
      let buffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        console.log("reader.read()", { done, bytes: value?.length });

        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        console.log("RAW BUFFER", buffer);
        
        // Parse SSE lines
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ""; // Keep incomplete trailing chunk in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            
            console.log("SSE EVENT", dataStr);
            
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'sources') {
                setActiveSources(data.data);
              } else if (data.type === 'content') {
                aiContent += data.text;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId ? { ...msg, content: aiContent } : msg
                ));
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch (e) {
              console.warn("Failed to parse SSE JSON", e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        console.error("Streaming error:", error);
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId && msg.content === '' 
            ? { ...msg, content: "Sorry, I encountered an error while processing your request. Please try again." } 
            : msg
        ));
      }
    } finally {
      console.log('[STREAM_FINISHED] Streaming finished for chatId:', currentChatId);
      setIsStreaming(false);
      setAbortController(null);

      // Refetch history in background ONLY after stream finishes
      if (currentChatId && currentChatId !== 'new') {
        queryClient.invalidateQueries({ queryKey: ['messages', currentChatId] });
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      }
    }
  };

  if (isLoading && chatId !== 'new') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-sm font-medium">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-6 pb-4 relative">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
            className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-8 shadow-lg shadow-primary/10 border border-primary/20 backdrop-blur-xl relative group"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <MessagesSquare size={44} className="text-primary drop-shadow-md relative z-10" />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl font-bold mb-4 tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
          >
            How can I help you today?
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-muted-foreground/90 max-w-md text-base leading-relaxed"
          >
            Ask a question, upload a document to your knowledge base, or explore advanced AI-driven search capabilities.
          </motion.p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pt-8 pb-32 space-y-6 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <ChatMessage 
                key={msg.id} 
                role={msg.role} 
                content={msg.content} 
                isStreaming={isStreaming && index === messages.length - 1 && msg.role === 'assistant'}
                metadata={msg.metadata_}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}
      
      <div 
        className="fixed bottom-0 right-0 z-10 transition-all duration-300 bg-gradient-to-t from-background via-background/90 to-transparent pt-12 pb-6 px-4 pointer-events-none"
        style={{ left: sidebarOpen ? '260px' : '0' }}
      >
        <div className="max-w-4xl mx-auto w-full pointer-events-auto flex flex-col gap-3">
          <ChatInput onSend={handleSendMessage} isStreaming={isStreaming} />
          <div className="text-center text-[11px] font-medium text-muted-foreground/60 tracking-wide">
            Python AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
}
