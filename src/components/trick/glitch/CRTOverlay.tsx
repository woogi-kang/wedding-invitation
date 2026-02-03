'use client';

import { useReducedMotion } from 'framer-motion';

interface CRTOverlayProps {
  scanlineOpacity?: number;
  flickerIntensity?: number;
  vignetteStrength?: number;
}

export function CRTOverlay({
  scanlineOpacity = 0.03,
  flickerIntensity = 0.02,
  vignetteStrength = 0.4,
}: CRTOverlayProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <>
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 1px,
            rgba(0, 255, 65, ${scanlineOpacity}) 1px,
            rgba(0, 255, 65, ${scanlineOpacity}) 2px
          )`,
        }}
      />

      {/* Horizontal scan line animation */}
      <div
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      >
        <div
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff41]/20 to-transparent animate-scan-line"
          style={{
            animation: 'scanLine 8s linear infinite',
          }}
        />
      </div>

      {/* Flicker effect */}
      <div
        className="fixed inset-0 pointer-events-none z-40 animate-flicker"
        style={{
          background: `rgba(0, 255, 65, ${flickerIntensity})`,
          animation: 'flicker 0.15s infinite',
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, ${vignetteStrength}) 100%
          )`,
        }}
      />

      {/* RGB Chromatic Aberration on edges */}
      <div
        className="fixed inset-0 pointer-events-none z-40 mix-blend-screen opacity-30"
        style={{
          background: `
            linear-gradient(90deg, rgba(255, 0, 128, 0.1) 0%, transparent 5%, transparent 95%, rgba(0, 255, 255, 0.1) 100%),
            linear-gradient(0deg, rgba(255, 0, 128, 0.1) 0%, transparent 5%, transparent 95%, rgba(0, 255, 255, 0.1) 100%)
          `,
        }}
      />

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes scanLine {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes flicker {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
