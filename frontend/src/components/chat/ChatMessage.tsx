import React, { useState } from 'react';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: string;
  content: string;
  isStreaming?: boolean;
  metadata?: Record<string, any>;
}

export function ChatMessage({ role, content, isStreaming, metadata }: ChatMessageProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative flex gap-4 text-sm md:text-base px-5 py-6 rounded-3xl transition-all duration-300",
        isUser 
          ? "bg-primary/5 border border-primary/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.1)]" 
          : "bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_25px_rgba(0,0,0,0.2)] hover:border-black/10 dark:hover:border-white/20"
      )}>
      
      {/* Avatar */}
      <div className={cn(
        "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl border shadow-sm mt-0.5 transition-all duration-300",
        isUser ? "bg-background border-border/50" : "bg-gradient-to-br from-primary to-blue-500 text-white shadow-md shadow-primary/20 border-transparent"
      )}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden w-full">
        <div className="font-semibold text-sm flex items-center justify-between">
          <span>{isUser ? "You" : "Python AI"}</span>
        </div>
        
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words custom-markdown w-full">
          {content === '' && isStreaming ? (
            <div className="flex items-center space-x-1 h-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
            </div>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code(props) {
                  const {children, className, node, ref, ...rest} = props;
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !className?.includes('language-');
                  
                  return !isInline && match ? (
                    <div className="relative group/code mt-6 mb-6 rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                      <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm text-xs font-semibold text-white/70 border-b border-white/10">
                        <span className="uppercase tracking-wider">{match[1]}</span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                          className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                      <div className="overflow-x-auto custom-scrollbar">
                        <SyntaxHighlighter
                          {...rest}
                          PreTag="div"
                          children={String(children).replace(/\n$/, '')}
                          language={match[1]}
                          style={vscDarkPlus}
                          customStyle={{ margin: 0, background: 'transparent', padding: '1.25rem', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <code {...rest} className={cn("bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono", className)}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        
        {/* Sources Badges */}
        {metadata?.sources && metadata.sources.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {metadata.sources.map((source: any, i: number) => (
              <a
                key={i}
                href={source.metadata?.source || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                title={source.metadata?.source || 'Source Document'}
              >
                <span className="truncate max-w-[200px]">
                  {source.metadata?.source ? source.metadata.source.split('/').pop() : `Source ${i + 1}`}
                </span>
              </a>
            ))}
          </div>
        )}
        
        {/* Actions Menu */}
        {!isUser && !isStreaming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button onClick={handleCopy} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/80 transition-all active:scale-95" title="Copy">
              {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/80 transition-all active:scale-95" title="Good response">
              <ThumbsUp size={15} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/80 transition-all active:scale-95" title="Bad response">
              <ThumbsDown size={15} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/80 transition-all active:scale-95" title="Regenerate">
              <RotateCcw size={15} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
