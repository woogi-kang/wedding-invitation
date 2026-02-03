'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

type TrickTheme = 'glitch' | '3d';

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

function selectTheme(preferred?: TrickTheme): TrickTheme {
  // If preferred theme is specified, use it
  if (preferred) {
    return preferred;
  }

  // Get last used theme to alternate
  const lastTheme = getLastTheme();

  // Time-based probability with alternation
  const isNight = isNightTime();
  const random = Math.random();

  let selectedTheme: TrickTheme;

  if (lastTheme) {
    // Alternate from last theme with some randomness
    if (isNight) {
      // Night: prefer glitch (80%), but if last was glitch, 50% chance to switch
      selectedTheme =
        lastTheme === 'glitch' ? (random < 0.5 ? '3d' : 'glitch') : random < 0.8 ? 'glitch' : '3d';
    } else {
      // Day: prefer 3D (80%), but if last was 3D, 50% chance to switch
      selectedTheme =
        lastTheme === '3d' ? (random < 0.5 ? 'glitch' : '3d') : random < 0.8 ? '3d' : 'glitch';
    }
  } else {
    // First time: pure time-based selection
    if (isNight) {
      selectedTheme = random < 0.8 ? 'glitch' : '3d';
    } else {
      selectedTheme = random < 0.8 ? '3d' : 'glitch';
    }
  }

  setLastTheme(selectedTheme);
  return selectedTheme;
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
    const path = theme === 'glitch' ? '/invitation/glitch' : '/invitation/3d';

    router.push(path);
  }, [router, options.preferredTheme]);

  const navigateToGlitch = useCallback(() => {
    markActivated();
    setLastTheme('glitch');
    router.push('/invitation/glitch');
  }, [router]);

  const navigateTo3D = useCallback(() => {
    markActivated();
    setLastTheme('3d');
    router.push('/invitation/3d');
  }, [router]);

  return {
    navigateToTrick,
    navigateToGlitch,
    navigateTo3D,
    hasActivated: hasActivatedThisSession,
  };
}

// Utility to check WebGL support for 3D page fallback
export function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}
