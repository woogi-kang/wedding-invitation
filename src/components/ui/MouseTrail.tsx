'use client';

import { useEffect, useRef, useCallback } from 'react';

type PetalType = 'sakura' | 'rose' | 'heart';

interface Particle {
  x: number;
  y: number;
  size: number;
  type: PetalType;
  rotation: number;
  createdAt: number;
  vx: number;
  vy: number;
  rotationSpeed: number;
}

// Pre-render petal shapes to offscreen canvases for GPU-accelerated blitting
const PETAL_CACHE_SIZE = 32;
const PETAL_TYPES: PetalType[] = ['sakura', 'rose', 'heart'];

function createPetalCache(): Map<string, HTMLCanvasElement> {
  const cache = new Map<string, HTMLCanvasElement>();

  if (typeof document === 'undefined') return cache;

  PETAL_TYPES.forEach(type => {
    const canvas = document.createElement('canvas');
    canvas.width = PETAL_CACHE_SIZE;
    canvas.height = PETAL_CACHE_SIZE;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const cx = PETAL_CACHE_SIZE / 2;
    const cy = PETAL_CACHE_SIZE / 2;
    const scale = PETAL_CACHE_SIZE / 32;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-16, -16);

    switch (type) {
      case 'sakura':
        // 5 petals
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(16, 2);
        ctx.bezierCurveTo(14, 6, 10, 8, 16, 14);
        ctx.bezierCurveTo(22, 8, 18, 6, 16, 2);
        ctx.fill();

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#FFC0CB';
        ctx.beginPath();
        ctx.moveTo(26, 10);
        ctx.bezierCurveTo(22, 8, 18, 8, 16, 14);
        ctx.bezierCurveTo(22, 16, 24, 14, 26, 10);
        ctx.fill();

        ctx.globalAlpha = 0.75;
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(24, 22);
        ctx.bezierCurveTo(22, 18, 20, 16, 16, 14);
        ctx.bezierCurveTo(18, 20, 20, 22, 24, 22);
        ctx.fill();

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#FFC0CB';
        ctx.beginPath();
        ctx.moveTo(8, 22);
        ctx.bezierCurveTo(10, 18, 12, 16, 16, 14);
        ctx.bezierCurveTo(14, 20, 12, 22, 8, 22);
        ctx.fill();

        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(6, 10);
        ctx.bezierCurveTo(10, 8, 14, 8, 16, 14);
        ctx.bezierCurveTo(10, 16, 8, 14, 6, 10);
        ctx.fill();

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#FFD1DC';
        ctx.beginPath();
        ctx.arc(16, 14, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'rose':
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(12, 10, 6, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.65;
        ctx.fillStyle = '#FFC0CB';
        ctx.beginPath();
        ctx.ellipse(12, 11, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'heart':
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(12, 21.35);
        ctx.lineTo(10.55, 20.03);
        ctx.bezierCurveTo(5.4, 15.36, 2, 12.28, 2, 8.5);
        ctx.bezierCurveTo(2, 5.42, 4.42, 3, 7.5, 3);
        ctx.bezierCurveTo(9.24, 3, 10.91, 3.81, 12, 5.09);
        ctx.bezierCurveTo(13.09, 3.81, 14.76, 3, 16.5, 3);
        ctx.bezierCurveTo(19.58, 3, 22, 5.42, 22, 8.5);
        ctx.bezierCurveTo(22, 12.28, 18.6, 15.36, 13.45, 20.03);
        ctx.lineTo(12, 21.35);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
    cache.set(type, canvas);
  });

  return cache;
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const throttleRef = useRef(false);
  const petalCacheRef = useRef<Map<string, HTMLCanvasElement> | null>(null);
  const isMobileRef = useRef(true);
  const isRunningRef = useRef(false);

  // Initialize petal cache
  useEffect(() => {
    petalCacheRef.current = createPetalCache();

    // Check for mobile/touch device
    const checkMobile = () => {
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasNoFinePointer = !window.matchMedia('(pointer: fine)').matches;
      const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
      isMobileRef.current = (isCoarsePointer && hasNoFinePointer) || isSmallScreen;
    };

    checkMobile();

    const mediaQuery = window.matchMedia('(pointer: fine)');
    mediaQuery.addEventListener('change', checkMobile);
    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', checkMobile);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Resize canvas to match window
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: false });
    const petalCache = petalCacheRef.current;

    if (!canvas || !ctx || !petalCache || isMobileRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const now = performance.now();
    const particles = particlesRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = now - p.createdAt;
      const lifetime = 2000;

      if (age >= lifetime) {
        particles.splice(i, 1);
        continue;
      }

      const progress = age / lifetime;
      const opacity = 1 - progress;
      const scale = (1 - progress * 0.3) * (p.size / PETAL_CACHE_SIZE);

      // Update position with physics
      p.x += p.vx;
      p.y += p.vy + progress * 2; // Gravity effect
      p.rotation += p.rotationSpeed;
      p.vx *= 0.98; // Air resistance
      p.vy *= 0.98;

      // Draw particle
      const petalImage = petalCache.get(p.type);
      if (petalImage) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(
          petalImage,
          -PETAL_CACHE_SIZE / 2,
          -PETAL_CACHE_SIZE / 2,
          PETAL_CACHE_SIZE,
          PETAL_CACHE_SIZE
        );
        ctx.restore();
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Start animation loop
  useEffect(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [animate]);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileRef.current || throttleRef.current) return;

      const dx = e.clientX - lastPositionRef.current.x;
      const dy = e.clientY - lastPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 38) {
        const types: PetalType[] = ['sakura', 'rose', 'heart'];
        const particle: Particle = {
          x: e.clientX + (Math.random() - 0.5) * 24,
          y: e.clientY + (Math.random() - 0.5) * 24,
          size: 14 + Math.random() * 16,
          type: types[Math.floor(Math.random() * 3)],
          rotation: Math.random() * 360,
          createdAt: performance.now(),
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          rotationSpeed: (Math.random() - 0.5) * 4,
        };

        particlesRef.current.push(particle);

        // Limit particles
        if (particlesRef.current.length > 28) {
          particlesRef.current.shift();
        }

        lastPositionRef.current = { x: e.clientX, y: e.clientY };

        throttleRef.current = true;
        setTimeout(() => {
          throttleRef.current = false;
        }, 60);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden="true"
      style={{
        willChange: 'contents',
      }}
    />
  );
}
