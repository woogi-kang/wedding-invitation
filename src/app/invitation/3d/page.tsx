'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { WEDDING_INFO } from '@/lib/constants';
import { checkWebGLSupport } from '@/hooks/useTrickRouter';

// Dynamic import for the journey scene
const JourneyScene = dynamic(
  () => import('@/components/trick/3d-journey/JourneyScene').then((mod) => mod.JourneyScene),
  { ssr: false }
);

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0f] z-50">
      <div className="text-center max-w-md px-8">
        {/* Terminal style loading */}
        <div className="font-mono text-left mb-8">
          <div className="text-[#00ff41] text-sm mb-2">$ initializing love-story.git</div>
          <div className="text-gray-500 text-xs space-y-1">
            <div className="text-[#00d4ff]">{'>'} Loading 3D environment...</div>
            <div className="text-[#00d4ff]">{'>'} Compiling memories...</div>
            <div className="text-[#00d4ff]">{'>'} Rendering emotions...</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00ff41] via-[#00d4ff] to-[#ff0080]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="font-mono text-[#00ff41] text-sm">
          {progress < 100 ? `${Math.round(progress)}%` : 'Ready!'}
        </div>
      </div>
    </div>
  );
}

function WebGLFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      <div className="text-center max-w-md font-mono">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-[#ff0080] text-xl mb-4">
          WebGL Not Supported
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Your browser doesn&apos;t support WebGL.
          <br />
          Try the Glitch version instead!
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/invitation/glitch"
            className="px-6 py-3 text-sm bg-[#00ff41]/20 text-[#00ff41] rounded border border-[#00ff41]/50 hover:bg-[#00ff41]/30 transition-colors"
          >
            [GLITCH VERSION]
          </Link>
          <Link
            href="/invitation"
            className="px-6 py-3 text-sm bg-transparent text-gray-400 rounded border border-gray-600 hover:border-gray-400 transition-colors"
          >
            [NORMAL VERSION]
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="flex flex-col items-center font-mono text-[#00d4ff]">
            <span className="text-xs mb-2">SCROLL TO EXPLORE</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl"
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-30">
      <div
        className="h-full bg-gradient-to-r from-[#00ff41] via-[#00d4ff] to-[#ff0080] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function ThreeDJourneyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    const supported = checkWebGLSupport();
    setWebGLSupported(supported);

    if (!supported) return;

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (!webGLSupported) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LoadingScreen progress={loadProgress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {!isLoading && <ProgressBar />}

      {/* Navigation Header */}
      {!isLoading && (
        <div className="fixed top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="font-mono">
              <span className="text-[#00ff41] text-sm">
                {WEDDING_INFO.groom.name}
              </span>
              <span className="text-[#ff0080] text-sm mx-2">♥</span>
              <span className="text-[#00d4ff] text-sm">
                {WEDDING_INFO.bride.name}
              </span>
            </div>
            <div className="text-gray-500 text-xs font-mono">
              // 3D Journey Experience
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <Link
              href="/invitation/glitch"
              className="px-3 py-1.5 font-mono text-xs text-[#00ff41] border border-[#00ff41]/30 rounded hover:bg-[#00ff41]/10 transition-colors backdrop-blur-sm bg-black/30"
            >
              [GLITCH]
            </Link>
            <Link
              href="/invitation"
              className="px-3 py-1.5 font-mono text-xs text-gray-400 border border-gray-600 rounded hover:bg-gray-800 transition-colors backdrop-blur-sm bg-black/30"
            >
              [NORMAL]
            </Link>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      {!isLoading && (
        <div className="fixed inset-0 bg-[#0a0a0f]">
          <Canvas
            camera={{ position: [0, 50, 15], fov: 60 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <JourneyScene />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Scroll Indicator */}
      {!isLoading && <ScrollIndicator />}

      {/* Scroll spacer for ScrollControls */}
      {!isLoading && <div style={{ height: '500vh' }} />}
    </div>
  );
}
