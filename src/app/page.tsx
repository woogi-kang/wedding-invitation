'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TerminalIntro } from '@/components/ui/TerminalIntro';
import { startGlobalAudio } from '@/hooks/useAudioPlayer';

export default function Home() {
  const router = useRouter();

  // Prefetch invitation page for instant navigation
  useEffect(() => {
    router.prefetch('/invitation');
  }, [router]);

  // Check if user has already seen intro (skip if navigated back)
  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation');
    const navEntry = navEntries[0] as PerformanceNavigationTiming;

    // If user navigated back, clear the flag and show intro
    if (navEntry?.type === 'back_forward') {
      sessionStorage.removeItem('wedding-intro-seen');
      return;
    }

    const hasSeenIntro = sessionStorage.getItem('wedding-intro-seen');
    if (hasSeenIntro) {
      router.replace('/invitation');
    }
  }, [router]);

  const handleEnter = async () => {
    sessionStorage.setItem('wedding-intro-seen', 'true');
    // Start music first (user can hear it before page transition)
    startGlobalAudio();
    // Small delay so user hears music start on intro screen
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/invitation');
  };

  return <TerminalIntro onEnter={handleEnter} />;
}
