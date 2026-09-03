import React from 'react';
import { FileText, MoreVertical, Trash2, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function DocumentList() {
  const queryClient = useQueryClient();
  
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await api.get('/documents');
      return data;
    },
    refetchInterval: (query) => {
      // Refetch every 3 seconds if there are documents still processing
      const hasProcessing = Array.isArray(query.state?.data) && query.state.data.some((d: any) => d.status === 'processing');
      return hasProcessing ? 3000 : false;
    }
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await api.delete(`/documents/${id}`);
        queryClient.invalidateQueries({ queryKey: ['documents'] });
      } catch (error) {
        console.error("Failed to delete document", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="h-6 w-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="w-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
        <FileText size={32} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3">
        {documents.map((doc: any, index: number) => (
          <motion.div 
            key={doc.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all hover:shadow-sm"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate text-foreground mb-1">
                  {doc.filename}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><HardDrive size={12} /> {(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {doc.status === 'processing' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  )}
                  <span className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    doc.status === 'ready' ? 'bg-green-500' : (doc.status === 'error' ? 'bg-destructive' : 'bg-amber-500')
                  )}></span>
                </span>
                <span className="text-xs font-medium capitalize text-muted-foreground">{doc.status}</span>
              </div>
              
              <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={doc.storage_url} target="_blank" rel="noreferrer" className="h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background rounded-md shadow-sm border border-transparent hover:border-border transition-all" title="View">
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => handleDelete(doc.id)} className="h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shadow-sm border border-transparent hover:border-destructive/20 transition-all" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
