'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IntroPage } from '@/components/ui/IntroPage';
import { startGlobalAudio } from '@/hooks/useAudioPlayer';

export default function Home() {
  const router = useRouter();

  // Prefetch invitation page for instant navigation
  useEffect(() => {
    router.prefetch('/invitation');
  }, [router]);

  // Check if user has already seen intro
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('wedding-intro-seen');
    if (hasSeenIntro) {
      router.replace('/invitation');
    }
  }, [router]);

  const handleEnter = () => {
    sessionStorage.setItem('wedding-intro-seen', 'true');
    // Start music on button click (user interaction)
    startGlobalAudio();
    router.push('/invitation');
  };

  return <IntroPage onEnter={handleEnter} />;
}
