/**
 * useScrollAnimation Hook
 * Provides scroll-triggered fade-in-up animations using Intersection Observer
 * Respects prefers-reduced-motion and supports staggered child animations
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Browser environment check for SSR
const isBrowser = typeof window !== 'undefined';

interface UseScrollAnimationOptions {
  /** Threshold for triggering animation (0-1, default: 0.15) */
  threshold?: number;
  /** Root margin for earlier/later triggering (default: '-10%') */
  rootMargin?: string;
  /** Whether to trigger animation only once (default: true) */
  triggerOnce?: boolean;
  /** Delay before animation starts in ms (default: 0) */
  delay?: number;
  /** Duration of animation in ms (default: 700) */
  duration?: number;
  /** Whether the element is disabled from animating */
  disabled?: boolean;
}

interface UseScrollAnimationReturn<T extends HTMLElement> {
  /** Ref to attach to the animated element */
  ref: React.RefObject<T | null>;
  /** Whether the element is in view */
  isInView: boolean;
  /** Whether the animation has been triggered */
  hasAnimated: boolean;
  /** Style object to apply to the element */
  style: React.CSSProperties;
  /** CSS class name for the animation state */
  className: string;
}

/**
 * Check if user prefers reduced motion
 */
function getPrefersReducedMotion(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook for scroll-triggered fade-in-up animations
 * Uses Intersection Observer for performance
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn<T> {
  const {
    threshold = 0.15,
    rootMargin = '-10%',
    triggerOnce = true,
    delay = 0,
    duration = 700,
    disabled = false,
  } = options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion);

  // Listen for reduced motion preference changes
  useEffect(() => {
    if (!isBrowser) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set up Intersection Observer
  useEffect(() => {
    if (!isBrowser || disabled) return;

    const element = ref.current;
    if (!element) return;

    // If animation already triggered and triggerOnce is true, skip
    if (hasAnimated && triggerOnce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Use setTimeout for delay
            if (delay > 0) {
              setTimeout(() => {
                setIsInView(true);
                setHasAnimated(true);
              }, delay);
            } else {
              setIsInView(true);
              setHasAnimated(true);
            }

            // Unobserve if triggerOnce
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated, disabled]);

  // Check if element is already visible on mount (above fold)
  useEffect(() => {
    if (!isBrowser || disabled || hasAnimated) return;

    const element = ref.current;
    if (!element) return;

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const isAboveFold = rect.top < window.innerHeight * 0.8;

    // If already visible, animate immediately (with small delay for paint)
    if (isAboveFold) {
      requestAnimationFrame(() => {
        setIsInView(true);
        setHasAnimated(true);
      });
    }
  }, [disabled, hasAnimated]);

  // Generate style based on animation state
  const style: React.CSSProperties = prefersReducedMotion
    ? {
        // Reduced motion: just fade
        opacity: isInView || hasAnimated ? 1 : 0,
        transition: `opacity ${duration * 0.5}ms ease`,
      }
    : {
        // Full animation: fade + slide up
        opacity: isInView || hasAnimated ? 1 : 0,
        transform: isInView || hasAnimated ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };

  // Generate className for CSS-based fallback
  const className = isInView || hasAnimated ? 'scroll-animated scroll-in-view' : 'scroll-animated';

  return {
    ref,
    isInView,
    hasAnimated,
    style,
    className,
  };
}

/**
 * Hook for staggered child animations
 * Returns animation delays for each child based on index
 */
export function useStaggeredAnimation(
  childCount: number,
  options: {
    /** Base delay before first child animates (ms) */
    baseDelay?: number;
    /** Delay between each child (ms) */
    staggerDelay?: number;
    /** Whether animations are triggered */
    isTriggered?: boolean;
  } = {}
): { getChildDelay: (index: number) => number; getChildStyle: (index: number) => React.CSSProperties } {
  const { baseDelay = 0, staggerDelay = 100, isTriggered = false } = options;

  const prefersReducedMotion = getPrefersReducedMotion();

  const getChildDelay = useCallback(
    (index: number): number => {
      if (prefersReducedMotion) return 0;
      return baseDelay + index * staggerDelay;
    },
    [baseDelay, staggerDelay, prefersReducedMotion]
  );

  const getChildStyle = useCallback(
    (index: number): React.CSSProperties => {
      const delay = getChildDelay(index);

      if (prefersReducedMotion) {
        return {
          opacity: isTriggered ? 1 : 0,
          transition: `opacity 300ms ease ${delay}ms`,
        };
      }

      return {
        opacity: isTriggered ? 1 : 0,
        transform: isTriggered ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 600ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 600ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      };
    },
    [getChildDelay, isTriggered, prefersReducedMotion]
  );

  return { getChildDelay, getChildStyle };
}

/**
 * Combined hook for parent with staggered children
 */
export function useScrollAnimationWithStagger<T extends HTMLElement = HTMLDivElement>(
  childCount: number,
  options: UseScrollAnimationOptions & {
    /** Delay between each child (ms) */
    staggerDelay?: number;
  } = {}
) {
  const { staggerDelay = 100, ...scrollOptions } = options;

  const scrollAnimation = useScrollAnimation<T>({
    ...scrollOptions,
  });

  const staggeredAnimation = useStaggeredAnimation(childCount, {
    baseDelay: 0,
    staggerDelay,
    isTriggered: scrollAnimation.isInView || scrollAnimation.hasAnimated,
  });

  return {
    ...scrollAnimation,
    ...staggeredAnimation,
  };
}

export default useScrollAnimation;
