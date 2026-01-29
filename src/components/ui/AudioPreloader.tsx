'use client';

import { useEffect } from 'react';
import { preloadAudio } from '@/hooks';
import { WEDDING_INFO } from '@/lib/constants';

export function AudioPreloader() {
  useEffect(() => {
    // Start preloading audio immediately on mount
    if (WEDDING_INFO.music.enabled) {
      preloadAudio();
    }
  }, []);

  return null;
}
