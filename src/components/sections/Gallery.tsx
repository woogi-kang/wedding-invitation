'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Gallery() {
  const { gallery } = WEDDING_INFO;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('gesturestart', preventGestureStart);
    document.addEventListener('gesturechange', preventGestureStart);
    document.addEventListener('gestureend', preventGestureStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('gesturestart', preventGestureStart);
      document.removeEventListener('gesturechange', preventGestureStart);
      document.removeEventListener('gestureend', preventGestureStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  const goToPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === 0 ? gallery.images.length - 1 : selectedIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === gallery.images.length - 1 ? 0 : selectedIndex + 1
      );
    }
  };

  return (
    <Section id="gallery" background="secondary">
      <SectionTitle title="우리의 순간" subtitle="갤러리" />

      {/* Main Carousel */}
      <div className="relative -mx-5 min-[375px]:-mx-6 sm:-mx-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {gallery.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="relative min-w-[80%] min-[375px]:min-w-[75%] px-1.5 min-[375px]:px-2 sm:min-w-[55%] sm:px-3"
              >
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 75vw, 55vw"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[var(--color-primary-dark)]/0 transition-all duration-300 group-hover:bg-[var(--color-primary-dark)]/30" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <Expand className="h-5 w-5 text-[var(--color-primary)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollPrev}
          className="absolute left-2 min-[375px]:left-3 sm:left-4 top-1/2 z-10 flex h-9 w-9 min-[375px]:h-10 min-[375px]:w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 sm:bg-white shadow-lg transition-shadow hover:shadow-xl"
          aria-label="이전 사진"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-text)]" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollNext}
          className="absolute right-2 min-[375px]:right-3 sm:right-4 top-1/2 z-10 flex h-9 w-9 min-[375px]:h-10 min-[375px]:w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 sm:bg-white shadow-lg transition-shadow hover:shadow-xl"
          aria-label="다음 사진"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-text)]" />
        </motion.button>
      </div>

      {/* Slide Indicators */}
      <div className="mt-4 min-[375px]:mt-5 sm:mt-6 flex justify-center gap-1.5 min-[375px]:gap-2">
        {gallery.images.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'w-6 min-[375px]:w-8 bg-[var(--color-primary)]'
                : 'w-1.5 bg-[var(--color-botanical-light)]'
            }`}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          />
        ))}
      </div>

      {/* Thumbnail Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-6 min-[375px]:mt-7 sm:mt-8 grid grid-cols-6 gap-1 min-[375px]:gap-1.5 sm:gap-2"
      >
        {gallery.images.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLightbox(index)}
            className={`relative aspect-square overflow-hidden rounded min-[375px]:rounded-md transition-all duration-300 ${
              currentSlide === index
                ? 'ring-1 min-[375px]:ring-2 ring-[var(--color-primary)] ring-offset-1 min-[375px]:ring-offset-2'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 375px) 45px, 60px"
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1d1b]/95 touch-none"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
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
              className="absolute left-2 min-[375px]:left-3 sm:left-4 top-1/2 z-50 flex h-10 w-10 min-[375px]:h-12 min-[375px]:w-12 sm:h-14 sm:w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="이전 사진"
            >
              <ChevronLeft className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 sm:h-7 sm:w-7" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 min-[375px]:right-3 sm:right-4 top-1/2 z-50 flex h-10 w-10 min-[375px]:h-12 min-[375px]:w-12 sm:h-14 sm:w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="다음 사진"
            >
              <ChevronRight className="h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 sm:h-7 sm:w-7" />
            </motion.button>

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
                className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
              />
            </motion.div>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 backdrop-blur-sm">
                <span className="font-serif text-lg text-white">
                  {selectedIndex + 1}
                </span>
                <span className="text-white/40">/</span>
                <span className="text-sm text-white/60">
                  {gallery.images.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
