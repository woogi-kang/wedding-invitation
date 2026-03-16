'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hideHeader?: boolean;
  showCloseButton?: boolean;
  closeButtonLabel?: string;
  ariaLabelledBy?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
  hideHeader = false,
  showCloseButton = true,
  closeButtonLabel = '닫기',
  ariaLabelledBy,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2',
              'rounded-2xl bg-white p-6 shadow-xl',
              className
            )}
          >
            {/* Header */}
            {!hideHeader && (
              <div className="mb-4 flex items-center justify-between">
                {title && (
                  <h3 className="font-serif text-lg font-medium text-[var(--color-text)]">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-auto rounded-full p-1 transition-colors hover:bg-[var(--color-secondary)]"
                    aria-label={closeButtonLabel}
                  >
                    <X className="h-5 w-5 text-[var(--color-text-light)]" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={contentClassName}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
