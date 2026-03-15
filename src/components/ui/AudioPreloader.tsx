'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { preloadAudio } from '@/hooks';
import { WEDDING_INFO } from '@/lib/constants';

export function AudioPreloader() {
  const pathname = usePathname();
  const isGuestSnapRoute = pathname.startsWith('/guestsnap');

  useEffect(() => {
    // Start preloading audio immediately on mount
    if (WEDDING_INFO.music.enabled && !isGuestSnapRoute) {
      preloadAudio();
    }
  }, [isGuestSnapRoute]);

  return null;
}
