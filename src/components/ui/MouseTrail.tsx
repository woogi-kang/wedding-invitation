'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type PetalType = 'sakura' | 'rose' | 'heart';

interface TrailPetal {
  id: number;
  x: number;
  y: number;
  size: number;
  type: PetalType;
  rotation: number;
  createdAt: number;
}

function PetalSVG({ type, size, rotation }: { type: PetalType; size: number; rotation: number }) {
  const style = { transform: `rotate(${rotation}deg)` };

  switch (type) {
    case 'sakura':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
          <path d="M16 2C14 6 10 8 16 14C22 8 18 6 16 2Z" fill="#FFB6C1" opacity="0.85" />
          <path d="M26 10C22 8 18 8 16 14C22 16 24 14 26 10Z" fill="#FFC0CB" opacity="0.8" />
          <path d="M24 22C22 18 20 16 16 14C18 20 20 22 24 22Z" fill="#FFB6C1" opacity="0.75" />
          <path d="M8 22C10 18 12 16 16 14C14 20 12 22 8 22Z" fill="#FFC0CB" opacity="0.8" />
          <path d="M6 10C10 8 14 8 16 14C10 16 8 14 6 10Z" fill="#FFB6C1" opacity="0.85" />
          <circle cx="16" cy="14" r="2" fill="#FFD1DC" opacity="0.9" />
        </svg>
      );
    case 'rose':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <ellipse cx="12" cy="10" rx="6" ry="9" fill="#FFB6C1" opacity="0.8" />
          <ellipse cx="12" cy="11" rx="4" ry="6" fill="#FFC0CB" opacity="0.65" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#FFB6C1" opacity="0.75" style={style}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
  }
}

export function MouseTrail() {
  const [petals, setPetals] = useState<TrailPetal[]>([]);
  const [isMobile, setIsMobile] = useState(true); // Default to true to prevent flash
  const [isMounted, setIsMounted] = useState(false);
  const petalIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const throttleRef = useRef(false);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track mount state for SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cleanup throttle timeout on unmount
  useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, []);

  // Check for mobile/touch device using CSS media queries for accuracy
  useEffect(() => {
    const checkMobile = () => {
      // Use pointer media query for more accurate input detection
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasNoFinePointer = !window.matchMedia('(pointer: fine)').matches;
      const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
      // Only disable for true mobile (coarse pointer without fine pointer) or small screens
      setIsMobile((isCoarsePointer && hasNoFinePointer) || isSmallScreen);
    };
    checkMobile();

    // Listen to both resize and pointer changes
    const mediaQuery = window.matchMedia('(pointer: fine)');
    mediaQuery.addEventListener('change', checkMobile);
    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', checkMobile);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Clean up old petals - only run when petals exist to avoid unnecessary re-renders
  useEffect(() => {
    if (isMobile || petals.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setPetals(prev => {
        const filtered = prev.filter(p => now - p.createdAt < 2000);
        // Return same reference if no change to prevent unnecessary re-renders
        return filtered.length === prev.length ? prev : filtered;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isMobile, petals.length > 0]);

  const createPetal = useCallback((x: number, y: number) => {
    const types: PetalType[] = ['sakura', 'rose', 'heart'];
    const newPetal: TrailPetal = {
      id: petalIdRef.current++,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: 12 + Math.random() * 14,
      type: types[Math.floor(Math.random() * 3)],
      rotation: Math.random() * 360,
      createdAt: Date.now(),
    };

    setPetals(prev => [...prev.slice(-15), newPetal]); // Keep max 15 petals
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    if (throttleRef.current) return;

    const dx = e.clientX - lastPositionRef.current.x;
    const dy = e.clientY - lastPositionRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only create petal if moved enough distance
    if (distance > 60) {
      createPetal(e.clientX, e.clientY);
      lastPositionRef.current = { x: e.clientX, y: e.clientY };

      throttleRef.current = true;
      throttleTimeoutRef.current = setTimeout(() => {
        throttleRef.current = false;
      }, 100);
    }
  }, [createPetal, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, isMobile]);

  // Don't render on mobile devices or before mount (SSR)
  if (!isMounted || isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true">
      {petals.map(petal => {
        const age = Date.now() - petal.createdAt;
        const progress = age / 2000; // 2 seconds lifetime
        const opacity = 1 - progress;
        const translateY = progress * 100; // Fall 100px over lifetime
        const scale = 1 - progress * 0.3;

        return (
          <div
            key={petal.id}
            className="absolute"
            style={{
              left: petal.x,
              top: petal.y,
              opacity,
              transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale}) rotate(${petal.rotation + progress * 180}deg)`,
              transition: 'transform 0.1s linear, opacity 0.1s linear',
              willChange: 'transform, opacity',
            }}
          >
            <PetalSVG type={petal.type} size={petal.size} rotation={0} />
          </div>
        );
      })}
    </div>
  );
}
