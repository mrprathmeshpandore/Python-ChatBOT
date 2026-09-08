import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteChatModalProps {
  isOpen: boolean;
  chatTitle?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  isOpen,
  chatTitle,
  onCancel,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);

    // Sequence timing: 500ms for glitch/dissolve animation before completing deletion
    setTimeout(async () => {
      try {
        await onConfirm();
      } finally {
        setIsDeleting(false);
      }
    }, 550);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop Smooth Darkening & Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-md"
          onClick={isDeleting ? undefined : onCancel}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={
            isDeleting
              ? {
                  scale: [1, 1.03, 0.97, 1, 0.92],
                  x: [0, -5, 5, -3, 3, 0],
                  opacity: [1, 0.95, 0.8, 0.4, 0],
                  filter: [
                    'blur(0px)',
                    'blur(1px)',
                    'blur(3px)',
                    'blur(8px)',
                  ],
                }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={
            isDeleting
              ? { duration: 0.55, ease: 'easeInOut' }
              : { type: 'spring', damping: 25, stiffness: 350 }
          }
          className="relative w-full max-w-sm rounded-2xl border border-destructive/30 bg-card/90 backdrop-blur-2xl p-6 shadow-2xl glass-card overflow-hidden text-center z-10"
        >
          {/* Digital Scan Line Animation on Delete */}
          {isDeleting && (
            <>
              <motion.div
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 0.5, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-90 shadow-[0_0_20px_#ef4444] z-20 pointer-events-none"
              />
              {/* Particle Burst Dissolve Accents */}
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0.9,
                      scale: Math.random() * 1.5 + 0.5,
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 160,
                      y: (Math.random() - 0.5) * 160,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-destructive shadow-[0_0_8px_#ef4444]"
                  />
                ))}
              </div>
            </>
          )}

          {/* Futuristic Glowing Trash Icon */}
          <div className="mx-auto mb-4 relative flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/30 shadow-lg shadow-destructive/20">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-2xl bg-destructive/20 blur-md pointer-events-none"
            />
            <Trash2 size={26} className="text-destructive relative z-10 drop-shadow-md" />
            
            {/* Minimal Digital Accents */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
            Delete This Chat?
          </h3>
          <p className="text-xs text-muted-foreground/90 leading-relaxed mb-3">
            This Conversation Will Be Permanently Removed.
          </p>

          {/* Chat Title Badge */}
          {chatTitle && (
            <div className="mb-5 inline-block max-w-full truncate rounded-lg bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground/80 border border-border/40">
              "{chatTitle}"
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-xl text-xs font-medium h-9 border-border/60 hover:bg-muted/80 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-xl text-xs font-semibold h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/25 transition-all duration-200"
            >
              {isDeleting ? 'Deleting...' : 'Delete Chat'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
