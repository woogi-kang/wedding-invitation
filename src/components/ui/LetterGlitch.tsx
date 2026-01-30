'use client';

import { useEffect, useRef, useState } from 'react';

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
}

export function LetterGlitch({
  glitchColors = ['#2d5a27', '#4a7c45', '#1a3d16'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [fontSize, setFontSize] = useState(0);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}|/\\';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Calculate font size based on screen width
      const calculatedFontSize = Math.max(10, Math.min(16, rect.width / 30));
      setFontSize(calculatedFontSize);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Grid of letters
    const cols = Math.ceil(canvas.width / (fontSize || 14));
    const rows = Math.ceil(canvas.height / (fontSize || 14));

    // Initialize letter grid with random letters and colors
    const grid: { char: string; color: string; opacity: number; glitching: boolean }[][] = [];
    for (let y = 0; y < rows; y++) {
      grid[y] = [];
      for (let x = 0; x < cols; x++) {
        grid[y][x] = {
          char: letters[Math.floor(Math.random() * letters.length)],
          color: glitchColors[Math.floor(Math.random() * glitchColors.length)],
          opacity: 0.1 + Math.random() * 0.3,
          glitching: false,
        };
      }
    }

    let lastTime = 0;
    const glitchInterval = glitchSpeed;

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const currentFontSize = fontSize || 14;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Update glitching letters
      if (currentTime - lastTime > glitchInterval) {
        lastTime = currentTime;

        // Randomly glitch some letters
        const glitchCount = Math.floor(cols * rows * 0.02); // 2% of letters glitch each frame
        for (let i = 0; i < glitchCount; i++) {
          const x = Math.floor(Math.random() * cols);
          const y = Math.floor(Math.random() * rows);
          if (grid[y] && grid[y][x]) {
            grid[y][x] = {
              char: letters[Math.floor(Math.random() * letters.length)],
              color: glitchColors[Math.floor(Math.random() * glitchColors.length)],
              opacity: 0.1 + Math.random() * 0.4,
              glitching: true,
            };
          }
        }
      }

      // Draw letters
      ctx.font = `${currentFontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < rows && y < grid.length; y++) {
        for (let x = 0; x < cols && grid[y] && x < grid[y].length; x++) {
          const letter = grid[y][x];
          if (!letter) continue;

          const posX = x * currentFontSize + currentFontSize / 2;
          const posY = y * currentFontSize + currentFontSize / 2;

          // Apply smooth transition for opacity
          if (smooth && letter.glitching) {
            letter.opacity = Math.max(0.1, letter.opacity - 0.02);
            if (letter.opacity <= 0.15) {
              letter.glitching = false;
            }
          }

          ctx.fillStyle = letter.color;
          ctx.globalAlpha = letter.opacity;
          ctx.fillText(letter.char, posX, posY);
        }
      }

      ctx.globalAlpha = 1;

      // Apply vignette effects
      if (outerVignette) {
        const gradient = ctx.createRadialGradient(
          rect.width / 2,
          rect.height / 2,
          0,
          rect.width / 2,
          rect.height / 2,
          Math.max(rect.width, rect.height) * 0.7
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      if (centerVignette) {
        const gradient = ctx.createRadialGradient(
          rect.width / 2,
          rect.height / 2,
          0,
          rect.width / 2,
          rect.height / 2,
          Math.max(rect.width, rect.height) * 0.4
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [fontSize, glitchColors, glitchSpeed, centerVignette, outerVignette, smooth, letters]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#000' }}
    />
  );
}
