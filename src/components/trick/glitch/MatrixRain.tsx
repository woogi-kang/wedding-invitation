'use client';

import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  colors?: string[];
  speed?: number;
  density?: number;
}

export function MatrixRain({
  colors = ['#00ff41', '#ff0080', '#00d4ff'],
  speed = 33,
  density = 0.98,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Characters: Katakana + numbers + symbols + couple names
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01234567890♥태욱선경LOVE';
    const charArray = chars.split('');

    let columns: number[] = [];
    let drops: number[] = [];
    let charColors: string[] = [];
    let fontSize = 14;

    const initCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Responsive font size
      fontSize = Math.max(12, Math.min(16, rect.width / 40));

      // Calculate columns
      const colCount = Math.ceil(rect.width / fontSize);
      columns = Array(colCount).fill(0);
      drops = columns.map(() => Math.random() * -100);
      charColors = columns.map(() => colors[Math.floor(Math.random() * colors.length)]);
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);

    let lastTime = 0;

    const draw = (currentTime: number) => {
      if (currentTime - lastTime < speed) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();

      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Color with glow
        const isHead = Math.random() > 0.9;
        if (isHead) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = charColors[i];
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = charColors[i];
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 0.8 - (drops[i] * fontSize / rect.height) * 0.5;
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Reset drop
        if (y > rect.height && Math.random() > density) {
          drops[i] = 0;
          charColors[i] = colors[Math.floor(Math.random() * colors.length)];
        }

        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [colors, speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: '#000' }}
    />
  );
}
