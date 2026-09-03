import React, { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus('idle');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });
      
      setUploadStatus('success');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      setTimeout(() => {
        setFile(null);
        setUploadStatus('idle');
        setProgress(0);
      }, 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="space-y-4 relative w-full h-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div 
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={cn(
              "relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden",
              isDragging ? "border-primary bg-primary/5 scale-[1.02] shadow-sm" : "border-muted-foreground/25 hover:bg-muted/30 hover:border-muted-foreground/40"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt,.csv,.md,.pptx,.xlsx"
            />
            
            <div className={cn(
              "p-4 rounded-full mb-4 transition-colors", 
              isDragging ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <UploadCloud size={32} />
            </div>
            <p className="text-sm font-semibold mb-1 text-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground text-center max-w-[200px]">
              Supported: PDF, DOCX, TXT, CSV, MD, PPTX, XLSX (max. 50MB)
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border shadow-sm rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl shrink-0 flex items-center justify-center">
                  <FileIcon size={24} />
                </div>
                <div className="overflow-hidden text-sm">
                  <p className="font-semibold truncate text-foreground mb-0.5" title={file.name}>{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              {uploadStatus === 'idle' && (
                <button 
                  onClick={() => setFile(null)}
                  className="h-8 w-8 hover:bg-muted rounded-full flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              {uploadStatus === 'success' && <CheckCircle2 size={24} className="text-green-500 drop-shadow-sm" />}
              {uploadStatus === 'error' && <AlertCircle size={24} className="text-destructive drop-shadow-sm" />}
            </div>

            {uploadStatus === 'uploading' && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-primary animate-pulse">Uploading securely...</span>
                  <span className="text-muted-foreground font-mono">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
            )}

            {uploadStatus === 'idle' && (
              <button 
                onClick={handleUpload}
                className="w-full mt-4 inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-10 shadow-sm hover:shadow active:scale-[0.98]"
              >
                Upload Document
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
