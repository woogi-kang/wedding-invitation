/**
 * useHapticFeedback Hook
 * Provides haptic feedback for mobile devices and respects reduced motion preferences
 * Based on SPEC-GUESTSNAP-001 M4.3 and M4.4
 */

'use client';

import { useCallback, useEffect, useState } from 'react';

interface HapticPattern {
  /** Pattern for success feedback */
  success: number[];
  /** Pattern for error feedback */
  error: number[];
  /** Pattern for subtle feedback (button press) */
  light: number[];
  /** Pattern for medium feedback */
  medium: number[];
}

const HAPTIC_PATTERNS: HapticPattern = {
  success: [50, 50, 100], // Short, pause, long
  error: [100, 50, 100, 50, 100], // Three pulses
  light: [10], // Very short
  medium: [30], // Short
};

interface UseHapticFeedbackReturn {
  /** Whether haptic feedback is supported */
  isSupported: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Trigger success haptic feedback */
  success: () => void;
  /** Trigger error haptic feedback */
  error: () => void;
  /** Trigger light haptic feedback (button press) */
  light: () => void;
  /** Trigger medium haptic feedback */
  medium: () => void;
  /** Trigger custom haptic pattern */
  vibrate: (pattern: number | number[]) => void;
}

/**
 * Hook for providing haptic feedback on mobile devices
 * Automatically respects user's reduced motion preference
 */
export function useHapticFeedback(): UseHapticFeedbackReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for support and user preferences on mount
  useEffect(() => {
    // Check if vibration API is supported
    setIsSupported('vibrate' in navigator);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to reduced motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Core vibrate function that respects user preferences
  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!isSupported || prefersReducedMotion) return;

      try {
        navigator.vibrate(pattern);
      } catch {
        // Silently fail if vibration fails
      }
    },
    [isSupported, prefersReducedMotion]
  );

  // Pre-defined feedback patterns
  const success = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.success);
  }, [vibrate]);

  const error = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.error);
  }, [vibrate]);

  const light = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.light);
  }, [vibrate]);

  const medium = useCallback(() => {
    vibrate(HAPTIC_PATTERNS.medium);
  }, [vibrate]);

  return {
    isSupported,
    prefersReducedMotion,
    success,
    error,
    light,
    medium,
    vibrate,
  };
}

/**
 * Hook for detecting reduced motion preference only
 * Useful when you don't need haptic feedback
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Animation variants that respect reduced motion preference
 */
export const getMotionVariants = (prefersReducedMotion: boolean) => ({
  // Fade only (used when reduced motion is preferred)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  // Full animation with scale
  scaleIn: prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
      },
  // Slide up animation
  slideUp: prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      },
  // Slide down animation
  slideDown: prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      },
});

/**
 * Stagger animation configuration for lists
 */
export const getStaggerConfig = (prefersReducedMotion: boolean) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  },
  item: prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.95 },
      },
});
