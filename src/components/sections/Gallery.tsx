'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Heart } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

// Polaroid-style photo card component
function PolaroidPhoto({
  src,
  alt,
  index,
  onClick,
  rotation,
}: {
  src: string;
  alt: string;
  index: number;
  onClick: () => void;
  rotation: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Staggered animation delay based on index
  const delay = 0.1 + (index % 3) * 0.15;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: rotation * 0.5 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: rotation } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative cursor-pointer"
      style={{ transformOrigin: 'center bottom' }}
    >
      {/* Polaroid frame */}
      <div
        className="relative bg-white p-2 min-[375px]:p-2.5 pb-10 min-[375px]:pb-12 rounded-sm shadow-lg transition-shadow duration-300 group-hover:shadow-2xl"
        style={{
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(200, 164, 165, 0.1)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Photo container with developing effect */}
        <div className="relative aspect-square overflow-hidden bg-[#f5f0eb]">
          {/* Film grain overlay */}
          <div
            className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Developing photo effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView && isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.5, delay: delay + 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 25vw"
              onLoad={() => setIsLoaded(true)}
            />
          </motion.div>

          {/* Sepia developing overlay */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={isInView && isLoaded ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 2, delay: delay + 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-[#e8ddd4] via-[#f2e8e0] to-[#d9cfc5]"
          />

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-[var(--color-primary)]/20 flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-white drop-shadow-lg" fill="white" />
          </motion.div>
        </div>

        {/* Handwritten caption area */}
        <div className="absolute bottom-2 min-[375px]:bottom-3 left-0 right-0 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.8 }}
            className="text-[10px] min-[375px]:text-xs tracking-wider"
            style={{
              fontFamily: 'var(--font-calligraphy)',
              color: 'var(--color-text-light)',
            }}
          >
            {index === 0 && '첫 만남'}
            {index === 1 && '설렘'}
            {index === 2 && '행복'}
            {index === 3 && '약속'}
            {index === 4 && '영원히'}
            {index === 5 && '함께'}
          </motion.span>
        </div>
      </div>

      {/* Tape decoration */}
      {index % 2 === 0 && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 min-[375px]:w-10 h-3 min-[375px]:h-4 opacity-40"
          style={{
            background: 'linear-gradient(to bottom, #e8ddd4, #d4c8bc)',
            transform: 'translateX(-50%) rotate(-2deg)',
          }}
        />
      )}
    </motion.div>
  );
}

export function Gallery() {
  const { gallery } = WEDDING_INFO;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deterministic rotations for polaroid effect (seeded by index to avoid hydration mismatch)
  const rotations = gallery.images.map((_, index) => {
    // Use a simple seeded pseudo-random based on index
    const seed = (index * 9301 + 49297) % 233280;
    return ((seed / 233280) - 0.5) * 8;
  });

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const goToPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === 0 ? gallery.images.length - 1 : selectedIndex - 1
      );
    }
  }, [selectedIndex, gallery.images.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === gallery.images.length - 1 ? 0 : selectedIndex + 1
      );
    }
  }, [selectedIndex, gallery.images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, goToPrev, goToNext]);

  // Touch/gesture handling for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventGestureStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('gesturestart', preventGestureStart);
    document.addEventListener('gesturechange', preventGestureStart);
    document.addEventListener('gestureend', preventGestureStart);

    return () => {
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('gesturestart', preventGestureStart);
      document.removeEventListener('gesturechange', preventGestureStart);
      document.removeEventListener('gestureend', preventGestureStart);
    };
  }, [selectedIndex]);

  return (
    <Section id="gallery" background="secondary">
      {/* Custom title with brush accent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 min-[375px]:mb-12 text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-4 h-[2px] w-12 origin-center"
          style={{
            background: 'linear-gradient(to right, transparent, var(--color-primary), transparent)',
          }}
        />
        <h2
          className="text-3xl min-[375px]:text-4xl mb-2"
          style={{
            fontFamily: 'var(--font-calligraphy)',
            color: 'var(--color-text)',
          }}
        >
          우리의 순간
        </h2>
        <p
          className="text-[10px] min-[375px]:text-xs tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-elegant)',
            color: 'var(--color-text-muted)',
          }}
        >
          Our Moments
        </p>
      </motion.div>

      {/* Polaroid Grid - Scattered Layout */}
      <div
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-[375px]:gap-5 sm:gap-6 lg:gap-8"
      >
        {gallery.images.map((image, index) => (
          <PolaroidPhoto
            key={index}
            src={image.src}
            alt={image.alt}
            index={index}
            onClick={() => openLightbox(index)}
            rotation={rotations[index]}
          />
        ))}
      </div>

      {/* Film strip decoration at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-10 min-[375px]:mt-12 flex items-center justify-center gap-2"
      >
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-3 rounded-sm"
              style={{ background: 'var(--color-border)' }}
            />
          ))}
        </div>
        <span
          className="px-4 text-xs tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-elegant)',
            color: 'var(--color-text-muted)',
          }}
        >
          MEMORIES
        </span>
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-3 rounded-sm"
              style={{ background: 'var(--color-border)' }}
            />
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center touch-none"
            style={{ background: 'rgba(26, 29, 27, 0.95)' }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              aria-label="닫기"
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Navigation */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 min-[375px]:left-4 top-1/2 z-50 flex h-12 w-12 min-[375px]:h-14 min-[375px]:w-14 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              aria-label="이전 사진"
            >
              <ChevronLeft className="h-6 w-6 min-[375px]:h-7 min-[375px]:w-7" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 min-[375px]:right-4 top-1/2 z-50 flex h-12 w-12 min-[375px]:h-14 min-[375px]:w-14 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              aria-label="다음 사진"
            >
              <ChevronRight className="h-6 w-6 min-[375px]:h-7 min-[375px]:w-7" />
            </motion.button>

            {/* Polaroid style image in lightbox */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Polaroid frame */}
              <div className="bg-white p-3 min-[375px]:p-4 pb-14 min-[375px]:pb-16 rounded-sm shadow-2xl">
                <Image
                  src={gallery.images[selectedIndex].src}
                  alt={gallery.images[selectedIndex].alt}
                  width={800}
                  height={1000}
                  className="max-h-[70vh] w-auto object-contain"
                />
                {/* Caption */}
                <div className="absolute bottom-3 min-[375px]:bottom-4 left-0 right-0 text-center">
                  <span
                    className="text-sm min-[375px]:text-base"
                    style={{
                      fontFamily: 'var(--font-calligraphy)',
                      color: 'var(--color-text-light)',
                    }}
                  >
                    {selectedIndex + 1} / {gallery.images.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
