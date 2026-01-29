'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioPlayerResult {
  isPlaying: boolean;
  isReady: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
}

// Dual audio system: quick-start + full quality
let quickAudio: HTMLAudioElement | null = null;
let fullAudio: HTMLAudioElement | null = null;
let isPreloaded = false;

const QUICK_SRC = '/music/bgm-quick.m4a';
const FULL_SRC = '/music/bgm.m4a';

// Preload both audio files as early as possible
export function preloadAudio() {
  if (typeof window === 'undefined' || isPreloaded) return;
  isPreloaded = true;

  // Quick audio - tiny file, loads almost instantly
  quickAudio = new Audio();
  quickAudio.preload = 'auto';
  quickAudio.src = QUICK_SRC;
  quickAudio.volume = 0.5;
  quickAudio.load();

  // Full audio - loads in background
  fullAudio = new Audio();
  fullAudio.preload = 'auto';
  fullAudio.src = FULL_SRC;
  fullAudio.loop = true;
  fullAudio.volume = 0.5;
  fullAudio.load();
}

export function useAudioPlayer(src: string, autoPlay: boolean = false): AudioPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const hasSwitchedRef = useRef(false);

  useEffect(() => {
    // Initialize if not preloaded
    if (!quickAudio || !fullAudio) {
      preloadAudio();
    }

    // Check if quick audio is ready
    const checkReady = () => {
      if (quickAudio && quickAudio.readyState >= 3) {
        setIsReady(true);
      }
    };

    if (quickAudio) {
      quickAudio.addEventListener('canplay', checkReady);
      checkReady(); // Check immediately
    }

    // Handle play/pause state sync
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (quickAudio) {
      quickAudio.addEventListener('play', handlePlay);
      quickAudio.addEventListener('pause', handlePause);
    }
    if (fullAudio) {
      fullAudio.addEventListener('play', handlePlay);
      fullAudio.addEventListener('pause', handlePause);
    }

    // Auto play on first user interaction
    if (autoPlay) {
      const handleUserInteraction = () => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        playAudio();

        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };

      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);

      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }

    return () => {
      if (quickAudio) {
        quickAudio.removeEventListener('canplay', checkReady);
        quickAudio.removeEventListener('play', handlePlay);
        quickAudio.removeEventListener('pause', handlePause);
      }
      if (fullAudio) {
        fullAudio.removeEventListener('play', handlePlay);
        fullAudio.removeEventListener('pause', handlePause);
      }
    };
  }, [autoPlay]);

  const playAudio = useCallback(() => {
    // If full audio is already ready, use it directly
    if (fullAudio && fullAudio.readyState >= 3) {
      currentAudioRef.current = fullAudio;
      fullAudio.play().catch(() => {});
      hasSwitchedRef.current = true;
      return;
    }

    // Otherwise, start with quick audio
    if (quickAudio && quickAudio.readyState >= 2) {
      currentAudioRef.current = quickAudio;
      quickAudio.play().catch(() => {});

      // Set up seamless switch to full audio
      if (fullAudio && !hasSwitchedRef.current) {
        const switchToFull = () => {
          if (hasSwitchedRef.current || !quickAudio || !fullAudio) return;

          // Get current time from quick audio
          const currentTime = quickAudio.currentTime;

          // Only switch if we're still playing and haven't looped
          if (currentTime < 19 && currentAudioRef.current === quickAudio) {
            fullAudio.currentTime = currentTime;
            fullAudio.play().then(() => {
              quickAudio?.pause();
              currentAudioRef.current = fullAudio;
              hasSwitchedRef.current = true;
            }).catch(() => {});
          }

          fullAudio.removeEventListener('canplaythrough', switchToFull);
        };

        if (fullAudio.readyState >= 4) {
          switchToFull();
        } else {
          fullAudio.addEventListener('canplaythrough', switchToFull);
        }

        // Fallback: if quick audio is about to end, try to switch or loop
        const handleTimeUpdate = () => {
          if (!quickAudio || !fullAudio) return;

          // Near the end of quick audio
          if (quickAudio.currentTime >= 18 && !hasSwitchedRef.current) {
            if (fullAudio.readyState >= 3) {
              // Switch to full
              fullAudio.currentTime = quickAudio.currentTime;
              fullAudio.play().then(() => {
                quickAudio?.pause();
                currentAudioRef.current = fullAudio;
                hasSwitchedRef.current = true;
              }).catch(() => {});
            } else {
              // Loop quick audio
              quickAudio.currentTime = 0;
            }
          }
        };

        quickAudio.addEventListener('timeupdate', handleTimeUpdate);
      }
    }
  }, []);

  const play = useCallback(() => {
    if (hasSwitchedRef.current && fullAudio) {
      fullAudio.play().catch(() => {});
    } else {
      playAudio();
    }
  }, [playAudio]);

  const pause = useCallback(() => {
    currentAudioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return { isPlaying, isReady, toggle, play, pause };
}
