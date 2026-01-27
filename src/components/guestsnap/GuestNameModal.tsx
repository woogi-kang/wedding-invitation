'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { useHapticFeedback, usePrefersReducedMotion } from '@/hooks/useHapticFeedback';

interface GuestNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
}

/**
 * GuestNameModal - FIRST STEP in the upload flow
 * User enters their name before selecting files
 */
export function GuestNameModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
}: GuestNameModalProps) {
  const { messages } = GUEST_SNAP_CONFIG;
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Haptic feedback and accessibility
  const haptic = useHapticFeedback();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError(null);
    }
  }, [isOpen, initialName]);

  // Prevent body scroll when modal is open
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

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Validate name
  const validateName = useCallback((value: string): boolean => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError('존함을 입력해주세요');
      return false;
    }

    if (trimmed.length < 2) {
      setError('2글자 이상 입력해주세요');
      return false;
    }

    if (trimmed.length > 20) {
      setError('20글자 이하로 입력해주세요');
      return false;
    }

    // Allow only Korean, English, numbers, and spaces
    const validPattern = /^[\p{L}\p{N}\s-]+$/u;
    if (!validPattern.test(trimmed)) {
      setError('한글, 영문, 숫자만 입력 가능해요');
      return false;
    }

    setError(null);
    return true;
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (validateName(name)) {
        haptic.medium();
        onSubmit(name.trim());
      } else {
        haptic.error();
      }
    },
    [name, validateName, onSubmit, haptic]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setName(value);

      // Clear error on typing
      if (error) {
        setError(null);
      }
    },
    [error]
  );

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
            aria-labelledby="name-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2',
              'rounded-2xl bg-white p-6 shadow-xl'
            )}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-[var(--color-secondary)] transition-colors"
              aria-label="닫기"
            >
              <X className="h-5 w-5 text-[var(--color-text-light)]" />
            </button>

            {/* Icon */}
            <div className="mb-6 flex justify-center" aria-hidden="true">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                <User className="h-8 w-8 text-[var(--color-primary)]" />
              </div>
            </div>

            {/* Title */}
            <h3
              id="name-modal-title"
              className="mb-6 text-center font-serif text-lg font-medium text-[var(--color-text)] leading-relaxed"
            >
              {messages.nameModalTitle}
            </h3>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Input field */}
              <div className="mb-4">
                <label htmlFor="guest-name-input" className="sr-only">
                  존함 입력
                </label>
                <input
                  id="guest-name-input"
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={handleInputChange}
                  placeholder={messages.nameModalPlaceholder}
                  maxLength={20}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'name-error' : undefined}
                  className={cn(
                    'w-full rounded-xl border-2 px-4 py-3 text-center text-base',
                    'transition-colors duration-200',
                    'placeholder:text-[var(--color-text-light)]/60',
                    'focus:outline-none focus:ring-0',
                    error
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-[var(--color-botanical-light)] focus:border-[var(--color-primary)]'
                  )}
                />
                {/* Error message */}
                {error && (
                  <motion.p
                    id="name-error"
                    role="alert"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-center text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                className={cn(
                  'w-full rounded-xl py-3.5 font-medium',
                  'flex items-center justify-center gap-2',
                  'bg-[var(--color-primary)] text-white',
                  'hover:bg-[var(--color-primary-dark)] transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                disabled={!name.trim()}
              >
                {messages.nameModalSubmit}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </form>

            {/* Helper text */}
            <p className="mt-4 text-center text-xs text-[var(--color-text-light)]">
              입력하신 존함으로 사진이 정리됩니다
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
