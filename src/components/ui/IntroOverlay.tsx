'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Vara from 'vara';

// Floating petal types
type PetalType = 'sakura' | 'rose' | 'heart';

interface PetalProps {
  delay: number;
  duration: number;
  left: string;
  size: number;
  type: PetalType;
  rotation: number;
  swayDuration: number;
}

function FloatingPetal({
  delay,
  duration,
  left,
  size,
  type,
  rotation,
  swayDuration,
}: PetalProps) {
  const renderPetal = () => {
    const swayStyle = {
      transform: `rotate(${rotation}deg)`,
      animation: `petal-sway ${swayDuration}s ease-in-out ${delay}s infinite alternate`,
    };

    switch (type) {
      case 'sakura':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={swayStyle}>
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
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={swayStyle}>
            <ellipse cx="12" cy="10" rx="6" ry="9" fill="#FFB6C1" opacity="0.8" />
            <ellipse cx="12" cy="11" rx="4" ry="6" fill="#FFC0CB" opacity="0.65" />
          </svg>
        );
      case 'heart':
        return (
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#FFB6C1" opacity="0.75" style={swayStyle}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
    }
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left,
        top: '-40px',
        animation: `petal-fall ${duration}s ease-in-out ${delay}s infinite`,
        opacity: 0,
      }}
    >
      {renderPetal()}
    </div>
  );
}

export function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [varaComplete, setVaraComplete] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showNames, setShowNames] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const varaContainerRef = useRef<HTMLDivElement>(null);
  const varaInstanceRef = useRef<Vara | null>(null);

  // Generate petals with variety (100 petals for rich effect)
  const petals = useMemo(() => {
    const types: PetalType[] = ['sakura', 'rose', 'heart'];
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      left: `${Math.random() * 100}%`,
      size: 14 + Math.random() * 20,
      type: types[Math.floor(Math.random() * 3)],
      rotation: Math.random() * 360,
      swayDuration: 2 + Math.random() * 3,
    }));
  }, []);

  // Check sessionStorage on mount and manage body classes
  useEffect(() => {
    setIsMounted(true);
    const hasSeenIntro = sessionStorage.getItem('wedding-intro-seen');

    // Remove pending class as we're now mounted
    document.body.classList.remove('intro-pending');

    if (!hasSeenIntro) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      // Add active class to keep main content hidden
      document.body.classList.add('intro-active');
    }
    // If already seen, main content will be visible (no intro-pending or intro-active)
  }, []);

  // Initialize Vara.js for handwriting animation
  useEffect(() => {
    if (!isVisible || !varaContainerRef.current || varaInstanceRef.current) return;

    const timer = setTimeout(() => {
      if (!varaContainerRef.current) return;

      try {
        varaInstanceRef.current = new Vara(
          '#vara-container',
          'https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json',
          [
            {
              text: "We're getting married",
              fontSize: 36,
              strokeWidth: 1.2,
              color: '#FFFFFF',
              duration: 2500,
              textAlign: 'center',
            },
          ],
          {
            strokeWidth: 1.2,
            color: '#FFFFFF',
          }
        );

        varaInstanceRef.current.ready(() => {
          setVaraComplete(true);
          // Sequence the other elements after Vara completes
          setTimeout(() => setShowHeart(true), 400);
          setTimeout(() => setShowNames(true), 1000);
          setTimeout(() => setShowDate(true), 1600);
          setTimeout(() => setShowButton(true), 2200);
        });
      } catch (error) {
        console.error('Vara.js error:', error);
        // Fallback if Vara fails
        setVaraComplete(true);
        setTimeout(() => setShowHeart(true), 400);
        setTimeout(() => setShowNames(true), 1000);
        setTimeout(() => setShowDate(true), 1600);
        setTimeout(() => setShowButton(true), 2200);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleEnter = useCallback(() => {
    setIsExiting(true);
    sessionStorage.setItem('wedding-intro-seen', 'true');

    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      // Remove active class to show main content
      document.body.classList.remove('intro-active');
    }, 800);
  }, []);

  if (!isMounted || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="intro-overlay fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      >
        {/* Background image with dim overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/intro-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dim overlay for better text visibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.4) 100%)',
          }}
        />
        {/* Soft vignette effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.3) 100%)',
          }}
        />

        {/* Central glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 200, 200, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Floating petals */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {petals.map((petal) => (
            <FloatingPetal key={petal.id} {...petal} />
          ))}
        </div>

        {/* Corner decorations */}
        <CornerDecoration position="top-left" />
        <CornerDecoration position="top-right" />
        <CornerDecoration position="bottom-left" />
        <CornerDecoration position="bottom-right" />

        {/* Main content */}
        <motion.div
          initial={{ scale: 1 }}
          animate={isExiting ? { scale: 0.95, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-8 max-w-md w-full"
        >
          {/* Top brush stroke */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-8 h-[2px] w-16 origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.7), transparent)',
            }}
          />

          {/* Vara.js handwriting container */}
          <div
            id="vara-container"
            ref={varaContainerRef}
            className="vara-container mb-8 min-h-[60px] flex items-center justify-center"
            style={{ width: '100%' }}
          />

          {/* Heart divider */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={showHeart ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            className="mb-8"
          >
            <motion.span
              animate={showHeart ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block text-3xl sm:text-4xl"
              style={{ color: '#F8B4B4' }}
            >
              &#10084;
            </motion.span>
          </motion.div>

          {/* Names */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showNames ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <p
              style={{
                fontFamily: 'var(--font-elegant)',
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                color: '#FFFFFF',
                letterSpacing: '0.2em',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span style={{ color: '#FFFFFF' }}>태욱</span>
              <span
                className="mx-3 sm:mx-5"
                style={{
                  fontFamily: 'var(--font-calligraphy)',
                  color: '#F8B4B4',
                  fontSize: '1.1em',
                }}
              >
                &amp;
              </span>
              <span style={{ color: '#FFFFFF' }}>선경</span>
            </p>
          </motion.div>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={showDate ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
            style={{
              fontFamily: 'var(--font-elegant)',
              fontSize: 'clamp(0.875rem, 3vw, 1rem)',
              color: 'rgba(255, 255, 255, 0.85)',
              letterSpacing: '0.35em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            2026. 04. 05
          </motion.p>

          {/* Enter button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showButton ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={handleEnter}
              className="group relative px-10 py-4 sm:px-12 sm:py-5 overflow-hidden transition-all duration-500 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                letterSpacing: '0.15em',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '2px',
                outlineColor: '#FFFFFF',
              }}
              aria-label="청첩장 보기"
            >
              <span
                className="relative z-10 text-sm sm:text-base transition-colors duration-500 group-hover:text-white"
                style={{ fontFamily: 'var(--font-elegant)' }}
              >
                청첩장 보기
              </span>
              <div
                className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            </button>
          </motion.div>

          {/* Subtle instruction */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={showButton ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-[10px] tracking-[0.2em] uppercase"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Click to enter
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Corner decoration component
function CornerDecoration({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positionClasses = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6 -scale-x-100',
    'bottom-left': 'bottom-6 left-6 -scale-y-100',
    'bottom-right': 'bottom-6 right-6 scale-[-1]',
  };

  return (
    <div className={`absolute w-16 h-16 sm:w-20 sm:h-20 ${positionClasses[position]}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
        <path d="M0 40 Q0 0 40 0" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1" fill="none" />
        <circle cx="40" cy="0" r="2" fill="rgba(255, 255, 255, 0.8)" />
        <path d="M0 60 Q0 20 20 10" stroke="rgba(248, 180, 180, 0.6)" strokeWidth="0.5" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}

export default IntroOverlay;
