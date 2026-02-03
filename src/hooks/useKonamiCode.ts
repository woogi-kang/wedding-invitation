'use client';

import { useEffect, useCallback, useRef } from 'react';

type KeySequence = string[];

interface UseKonamiCodeOptions {
  onActivate: () => void;
  timeout?: number;
}

// Konami Code: Up Up Down Down Left Right Left Right B A
const KONAMI_CODE: KeySequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

// "dev" sequence
const DEV_CODE: KeySequence = ['KeyD', 'KeyE', 'KeyV'];

// All sequences to detect
const SEQUENCES = [KONAMI_CODE, DEV_CODE];

export function useKonamiCode({ onActivate, timeout = 3000 }: UseKonamiCodeOptions) {
  const inputRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activatedRef = useRef(false);

  const resetInput = useCallback(() => {
    inputRef.current = [];
  }, []);

  const checkSequences = useCallback(() => {
    const input = inputRef.current;

    for (const sequence of SEQUENCES) {
      // Check if input ends with the sequence
      if (input.length >= sequence.length) {
        const inputSlice = input.slice(-sequence.length);
        const matches = inputSlice.every((key, i) => key === sequence[i]);

        if (matches && !activatedRef.current) {
          activatedRef.current = true;
          onActivate();
          resetInput();
          return true;
        }
      }
    }
    return false;
  }, [onActivate, resetInput]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Add key to input sequence
      inputRef.current.push(event.code);

      // Keep only the last N keys (longest sequence length)
      const maxLength = Math.max(...SEQUENCES.map((s) => s.length));
      if (inputRef.current.length > maxLength) {
        inputRef.current = inputRef.current.slice(-maxLength);
      }

      // Reset timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(resetInput, timeout);

      // Check for matches
      checkSequences();
    },
    [checkSequences, resetInput, timeout]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  // Reset activation state when component unmounts
  useEffect(() => {
    return () => {
      activatedRef.current = false;
    };
  }, []);

  return {
    reset: () => {
      activatedRef.current = false;
      resetInput();
    },
  };
}

// Hook for mobile tap detection (triple tap on specific element)
export function useTripleTap(onTripleTap: () => void, timeout = 500) {
  const tapCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    tapCountRef.current += 1;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onTripleTap();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, timeout);
  }, [onTripleTap, timeout]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { handleTap };
}
