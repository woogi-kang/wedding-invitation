'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Section } from '@/components/common/Section';
import type { GalleryImage } from '@/lib/gallery';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

interface GalleryProps {
  images: GalleryImage[];
}

// Skeleton component
function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[var(--color-primary)]/10 ${className || ''}`} />
  );
}

export function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Return null if no images
  if (!images || images.length === 0) {
    return null;
  }

  const openDialog = useCallback((index: number) => {
    setSelectedIndex(index);
    dialogRef.current?.showModal();
    document.body.style.overflow = 'hidden';
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Handle swiper initialization and slide sync
  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    if (selectedIndex !== null) {
      swiper.slideToLoop(selectedIndex, 0);
    }
  }, [selectedIndex]);

  // 키보드 & 줌 비활성화
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialog();
      if (e.key === 'ArrowLeft') swiperRef.current?.slidePrev();
      if (e.key === 'ArrowRight') swiperRef.current?.slideNext();
    };

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchmove', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchmove', preventZoom);
    };
  }, [selectedIndex, closeDialog]);

  return (
    <Section id="gallery" background="secondary">
      <div ref={sectionRef} className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-primary)' }}>
            Gallery
          </p>
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            우리의 순간
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Main + Thumbnail Gallery */}
        <MainThumbnailGallery images={images} onImageClick={openDialog} isInView={isInView} />

        {/* Dialog */}
        <dialog
          ref={dialogRef}
          className="fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-black/95 backdrop:bg-black/95"
          onClick={(e) => {
            if (e.target === dialogRef.current) closeDialog();
          }}
        >
          {selectedIndex !== null && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Close button */}
              <button
                onClick={closeDialog}
                className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation buttons - Desktop */}
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-4 top-1/2 z-50 -translate-y-1/2 text-white/80 hover:text-white hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-4 top-1/2 z-50 -translate-y-1/2 text-white/80 hover:text-white hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Swiper for sliding */}
              <Swiper
                key={selectedIndex}
                onSwiper={handleSwiperInit}
                onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)}
                initialSlide={selectedIndex}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                className="w-full h-full"
              >
                {images.map((image, i) => (
                  <SwiperSlide key={image.src} className="flex items-center justify-center">
                    <div className="flex items-center justify-center w-full h-full px-2 py-16 md:p-16">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={1600}
                        height={Math.round(1600 * (image.height / image.width))}
                        className="max-h-[80vh] max-w-[96vw] md:max-h-[80vh] md:max-w-[90vw] w-auto h-auto object-contain select-none"
                        draggable={false}
                        priority={i === selectedIndex}
                        sizes="(max-width: 768px) 96vw, 90vw"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Page indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                <span className="text-sm text-white/60 bg-black/30 px-4 py-2 rounded-full">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          )}
        </dialog>
      </div>
    </Section>
  );
}

// ============================================
// Main + Thumbnail Gallery with Skeleton
// ============================================
function MainThumbnailGallery({ images, onImageClick, isInView }: { images: GalleryImage[]; onImageClick: (index: number) => void; isInView: boolean }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<number>>(new Set());

  // Reset loaded state when main index changes
  useEffect(() => {
    setMainLoaded(false);
  }, [mainIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  const handleThumbnailLoad = (index: number) => {
    setLoadedThumbnails(prev => new Set(prev).add(index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Main Image */}
      <div className="mx-auto max-w-[280px] md:max-w-xs">
        <motion.div
          key={mainIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
          onClick={() => onImageClick(mainIndex)}
        >
          {/* Skeleton */}
          {!mainLoaded && (
            <ImageSkeleton className="absolute inset-0 rounded-xl" />
          )}
          <Image
            src={images[mainIndex].src}
            alt={images[mainIndex].alt}
            fill
            sizes="280px"
            className={`object-cover transition-opacity duration-300 ${mainLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="eager"
            onLoad={() => setMainLoaded(true)}
          />
        </motion.div>
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
          사진을 터치하면 크게 볼 수 있어요
        </p>
      </div>

      {/* Thumbnails - Centered */}
      <div className="relative max-w-[280px] md:max-w-xs mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 thumbnail-scrollbar">
          {images.map((image, i) => (
            <button
              key={image.src}
              onClick={() => setMainIndex(i)}
              className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                i === mainIndex
                  ? 'scale-105'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              {/* Skeleton */}
              {!loadedThumbnails.has(i) && (
                <ImageSkeleton className="absolute inset-0" />
              )}
              <Image
                src={image.src}
                alt={image.alt}
                width={64}
                height={64}
                className={`object-cover transition-opacity duration-300 ${loadedThumbnails.has(i) ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => handleThumbnailLoad(i)}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .thumbnail-scrollbar::-webkit-scrollbar {
          height: 3px;
        }
        .thumbnail-scrollbar::-webkit-scrollbar-track {
          background: #e5e5e5;
          border-radius: 10px;
        }
        .thumbnail-scrollbar::-webkit-scrollbar-thumb {
          background: #999;
          border-radius: 10px;
        }
        .thumbnail-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #999 #e5e5e5;
        }
      `}</style>
    </motion.div>
  );
}
