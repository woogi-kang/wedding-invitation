'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

type TrickTheme = 'glitch' | 'arcade';

interface UseTrickRouterOptions {
  preferredTheme?: TrickTheme;
}

const STORAGE_KEY = 'wedding_trick_last_theme';
const SESSION_KEY = 'wedding_trick_activated';

function getHour(): number {
  return new Date().getHours();
}

function isNightTime(): boolean {
  const hour = getHour();
  return hour >= 20 || hour < 6;
}

function getLastTheme(): TrickTheme | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY) as TrickTheme | null;
  } catch {
    return null;
  }
}

function setLastTheme(theme: TrickTheme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

function hasActivatedThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function markActivated(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
}

const ALL_THEMES: TrickTheme[] = ['glitch', 'arcade'];

function selectTheme(preferred?: TrickTheme): TrickTheme {
  if (preferred) {
    return preferred;
  }

  const lastTheme = getLastTheme();
  const random = Math.random();

  // Rotate through themes, weighted by time of day
  if (lastTheme) {
    const otherThemes = ALL_THEMES.filter((t) => t !== lastTheme);
    // Pick randomly from the other two themes
    return otherThemes[Math.floor(random * otherThemes.length)];
  }

  // First time: time-based selection
  const isNight = isNightTime();
  if (isNight) {
    // Night: glitch 60%, arcade 40%
    if (random < 0.6) return 'glitch';
    return 'arcade';
  }
  // Day: arcade 55%, glitch 45%
  if (random < 0.55) return 'arcade';
  return 'glitch';
}

export function useTrickRouter(options: UseTrickRouterOptions = {}) {
  const router = useRouter();

  const navigateToTrick = useCallback(() => {
    // Prevent multiple activations in same session
    if (hasActivatedThisSession()) {
      return;
    }

    markActivated();

    const theme = selectTheme(options.preferredTheme);
    const pathMap: Record<TrickTheme, string> = {
      glitch: '/invitation/glitch',
      arcade: '/invitation/arcade',
    };
    const path = pathMap[theme];

    router.push(path);
  }, [router, options.preferredTheme]);

  const navigateToGlitch = useCallback(() => {
    markActivated();
    setLastTheme('glitch');
    router.push('/invitation/glitch');
  }, [router]);

  const navigateToArcade = useCallback(() => {
    markActivated();
    setLastTheme('arcade');
    router.push('/invitation/arcade');
  }, [router]);

  return {
    navigateToTrick,
    navigateToGlitch,
    navigateToArcade,
    hasActivated: hasActivatedThisSession,
  };
}