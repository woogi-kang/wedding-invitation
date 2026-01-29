'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Gallery() {
  const { gallery } = WEDDING_INFO;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Show only first 4 images initially, or all if showAll is true
  const visibleImages = showAll ? gallery.images : gallery.images.slice(0, 4);

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

  return (
    <Section id="gallery" background="secondary">
      <div ref={sectionRef} className="max-w-2xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            Gallery
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            우리의 순간
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 min-[375px]:gap-4"
        >
          {visibleImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-sm bg-[var(--color-border-light)]"
              onClick={() => openLightbox(showAll ? index : index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 50vw, 300px"
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Show More Button */}
        {!showAll && gallery.images.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wider transition-all hover:opacity-70"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-primary)',
                border: `1px solid var(--color-primary)`,
              }}
            >
              <Grid3X3 className="w-4 h-4" />
              더보기 ({gallery.images.length - 4}장)
            </button>
          </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white transition-colors"
                aria-label="닫기"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:text-white transition-colors"
                aria-label="이전 사진"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:text-white transition-colors"
                aria-label="다음 사진"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image */}
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-h-[85vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={gallery.images[selectedIndex].src}
                  alt={gallery.images[selectedIndex].alt}
                  width={800}
                  height={1000}
                  className="max-h-[85vh] w-auto object-contain"
                />
                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="text-sm text-white/60">
                    {selectedIndex + 1} / {gallery.images.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
