'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, EffectCube, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

// Parallax Tilt
import Tilt from 'react-parallax-tilt';

// Page Flip
import HTMLFlipBook from 'react-pageflip';
import React from 'react';

export function Gallery() {
  const { gallery } = WEDDING_INFO;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Style 10용: 20장 이미지 (기존 6장을 복사)
  const extendedImages = [...gallery.images, ...gallery.images, ...gallery.images, ...gallery.images].slice(0, 20);

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
      setSelectedIndex(selectedIndex === 0 ? gallery.images.length - 1 : selectedIndex - 1);
    }
  }, [selectedIndex, gallery.images.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === gallery.images.length - 1 ? 0 : selectedIndex + 1);
    }
  }, [selectedIndex, gallery.images.length]);

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

        {/* Style 1-9: Original styles */}
        <StyleLabel number={1} title="Coverflow (아이튠즈 스타일)" />
        <CoverflowGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={2} title="3D Cube" />
        <CubeGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={3} title="Masonry (핀터레스트)" />
        <MasonryGallery images={gallery.images} onImageClick={openLightbox} isInView={isInView} />

        <StyleLabel number={4} title="캐러셀 슬라이더" />
        <CarouselGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={5} title="스택 카드 (Tinder 스타일)" />
        <StackCardsGallery images={gallery.images} />

        <StyleLabel number={6} title="메인 + 썸네일" />
        <MainThumbnailGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={7} title="필름 스트립" />
        <FilmStripGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={8} title="Parallax Tilt (3D 기울임)" />
        <ParallaxTiltGallery images={gallery.images} onImageClick={openLightbox} isInView={isInView} />

        <StyleLabel number={9} title="Flip Book (프리미엄 앨범)" />
        <FlipBookGallery images={gallery.images} onImageClick={openLightbox} />

        {/* Style 10-15: New unique styles */}
        <StyleLabel number={10} title="3D 원형 캐러셀 (20장)" />
        <CircularCarouselGallery images={extendedImages} onImageClick={openLightbox} />

        <StyleLabel number={11} title="폴라로이드 월" />
        <PolaroidWallGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={12} title="매거진 스프레드" />
        <MagazineSpreadGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={13} title="물결 효과 (Water Ripple)" />
        <WaterRippleGallery images={gallery.images} onImageClick={openLightbox} />

        <StyleLabel number={14} title="홀로그래픽 카드" />
        <HolographicGallery images={gallery.images} onImageClick={openLightbox} isInView={isInView} />

        <StyleLabel number={15} title="떠다니는 갤러리 (Floating)" />
        <FloatingGallery images={gallery.images} onImageClick={openLightbox} />

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              onClick={closeLightbox}
            >
              <button onClick={closeLightbox} className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white">
                <X className="h-6 w-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); goToPrev(); }} className="absolute left-4 top-1/2 z-50 -translate-y-1/2 text-white/80 hover:text-white">
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 top-1/2 z-50 -translate-y-1/2 text-white/80 hover:text-white">
                <ChevronRight className="h-8 w-8" />
              </button>
              <motion.div key={selectedIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                <Image src={gallery.images[selectedIndex % gallery.images.length].src} alt={gallery.images[selectedIndex % gallery.images.length].alt} width={800} height={1000} className="max-h-[85vh] w-auto object-contain" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="text-sm text-white/60">{(selectedIndex % gallery.images.length) + 1} / {gallery.images.length}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

// Style Label Component
function StyleLabel({ number, title }: { number: number; title: string }) {
  return (
    <div className="mt-16 mb-6 first:mt-0">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm">
        <span className="font-bold">Style {number}</span>
        <span className="opacity-80">|</span>
        <span>{title}</span>
      </div>
    </div>
  );
}

// ============================================
// STYLE 1: Coverflow Gallery
// ============================================
function CoverflowGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  return (
    <div className="relative py-8">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{ rotate: 20, stretch: 0, depth: 200, modifier: 1, slideShadows: true }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="coverflow-swiper"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i} className="!w-56 md:!w-72">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-2xl" onClick={() => onImageClick(i)}>
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .coverflow-swiper { padding: 40px 0 60px !important; }
        .coverflow-swiper .swiper-pagination-bullet { background: var(--color-primary); }
      `}</style>
    </div>
  );
}

// ============================================
// STYLE 2: Cube Gallery
// ============================================
function CubeGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  return (
    <div className="flex justify-center py-8">
      <div className="w-72 md:w-80">
        <Swiper
          effect="cube"
          grabCursor={true}
          cubeEffect={{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }}
          pagination={{ clickable: true }}
          modules={[EffectCube, Pagination]}
          className="cube-swiper"
        >
          {images.map((image, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer" onClick={() => onImageClick(i)}>
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .cube-swiper { padding-bottom: 50px !important; }
        .cube-swiper .swiper-pagination-bullet { background: var(--color-primary); }
      `}</style>
    </div>
  );
}

// ============================================
// STYLE 3: Masonry Gallery
// ============================================
function MasonryGallery({ images, onImageClick, isInView }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void; isInView: boolean }) {
  const leftColumn = images.filter((_, i) => i % 2 === 0);
  const rightColumn = images.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex gap-3">
      <div className="flex-1 flex flex-col gap-3">
        {leftColumn.map((image, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative cursor-pointer overflow-hidden rounded-lg ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} onClick={() => onImageClick(i * 2)}>
            <Image src={image.src} alt={image.alt} fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-3 mt-8">
        {rightColumn.map((image, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 + 0.05 }}
            className={`relative cursor-pointer overflow-hidden rounded-lg ${i % 2 === 0 ? 'aspect-square' : 'aspect-[3/4]'}`} onClick={() => onImageClick(i * 2 + 1)}>
            <Image src={image.src} alt={image.alt} fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STYLE 4: Carousel Gallery
// ============================================
function CarouselGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}
            className="absolute inset-0 cursor-pointer" onClick={() => onImageClick(currentIndex)}>
            <Image src={images[currentIndex].src} alt={images[currentIndex].alt} fill className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white">
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white">
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-[var(--color-primary)] w-6' : 'bg-[var(--color-primary)]/30'}`} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// STYLE 5: Stack Cards Gallery
// ============================================
function StackCardsGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [stack, setStack] = useState(images.map((_, i) => i));
  const handleSwipe = () => {
    setStack((prev) => { const newStack = [...prev]; const first = newStack.shift()!; newStack.push(first); return newStack; });
  };

  return (
    <div className="relative h-[400px] flex items-center justify-center">
      {stack.slice(0, 4).reverse().map((imageIndex, stackPos) => {
        const actualPos = 3 - stackPos;
        return (
          <motion.div key={imageIndex} className="absolute w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-xl cursor-pointer" style={{ zIndex: 4 - actualPos }}
            animate={{ scale: 1 - actualPos * 0.05, y: actualPos * 8, rotateZ: actualPos * 2 - 3 }}
            onClick={() => actualPos === 0 && handleSwipe()} drag={actualPos === 0 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 100) handleSwipe(); }}>
            <Image src={images[imageIndex].src} alt={images[imageIndex].alt} fill className="object-cover" />
            {actualPos === 0 && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
          </motion.div>
        );
      })}
      <p className="absolute bottom-0 text-sm text-[var(--color-text-muted)]">스와이프하거나 클릭하세요</p>
    </div>
  );
}

// ============================================
// STYLE 6: Main + Thumbnail Gallery
// ============================================
function MainThumbnailGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  const [mainIndex, setMainIndex] = useState(0);

  return (
    <div className="space-y-3">
      <motion.div key={mainIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer" onClick={() => onImageClick(mainIndex)}>
        <Image src={images[mainIndex].src} alt={images[mainIndex].alt} fill className="object-cover" />
      </motion.div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, i) => (
          <button key={i} onClick={() => setMainIndex(i)} className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${i === mainIndex ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : 'opacity-60 hover:opacity-100'}`}>
            <Image src={image.src} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STYLE 7: Film Strip Gallery
// ============================================
function FilmStripGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-0 h-4 bg-[#1a1a1a] flex items-center justify-around px-2 rounded-t-lg">
        {Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-2 h-2 rounded-sm bg-[#333]" />)}
      </div>
      <div className="absolute left-0 right-0 bottom-0 h-4 bg-[#1a1a1a] flex items-center justify-around px-2 rounded-b-lg">
        {Array.from({ length: 20 }).map((_, i) => <div key={i} className="w-2 h-2 rounded-sm bg-[#333]" />)}
      </div>
      <div className="flex gap-3 overflow-x-auto py-6 px-2 bg-[#1a1a1a] scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
        {images.map((image, i) => (
          <motion.div key={i} className="relative flex-shrink-0 w-48 aspect-[3/4] rounded-sm overflow-hidden cursor-pointer bg-white p-1" style={{ scrollSnapAlign: 'center' }} whileHover={{ scale: 1.02 }} onClick={() => onImageClick(i)}>
            <div className="relative w-full h-full"><Image src={image.src} alt={image.alt} fill className="object-cover" /></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono">{String(i + 1).padStart(2, '0')}</div>
          </motion.div>
        ))}
      </div>
      <p className="text-center mt-3 text-sm text-[var(--color-text-muted)]">좌우로 스크롤하세요</p>
    </div>
  );
}

// ============================================
// STYLE 8: Parallax Tilt Gallery
// ============================================
function ParallaxTiltGallery({ images, onImageClick, isInView }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void; isInView: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {images.map((image, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}>
          <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} glareEnable={true} glareMaxOpacity={0.3} glareColor="#ffffff" glarePosition="all" glareBorderRadius="12px" scale={1.02} transitionSpeed={400} className="rounded-xl overflow-hidden">
            <div className="relative aspect-[3/4] cursor-pointer" onClick={() => onImageClick(i)}>
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
            </div>
          </Tilt>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// STYLE 9: Premium Flip Book Gallery
// ============================================
const FlipPage = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(({ children, className = '' }, ref) => <div ref={ref} className={className}>{children}</div>);
FlipPage.displayName = 'FlipPage';

function FlipBookGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) return <div className="flex justify-center items-center h-[500px]"><div className="text-[var(--color-text-muted)]">Loading...</div></div>;

  const bookImages = images.length % 2 === 1 ? [...images, images[0]] : images;

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-gradient-to-r from-black/20 via-black/40 to-black/20 z-10 pointer-events-none" />
        <HTMLFlipBook width={300} height={400} size="stretch" minWidth={280} maxWidth={400} minHeight={380} maxHeight={500} showCover={true} mobileScrollSupport={true} className="flipbook-premium" style={{}} startPage={0} drawShadow={true} flippingTime={1000} usePortrait={true} startZIndex={0} autoSize={true} maxShadowOpacity={0.5} showPageCorners={true} disableFlipByClick={false} swipeDistance={30} clickEventForward={true} useMouseEvents={true}>
          <FlipPage className="relative overflow-hidden">
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43573a 0%, #2f3d29 50%, #43573a 100%)' }}>
              <div className="absolute top-3 left-3 w-12 h-12 border-l-2 border-t-2 border-[#b7a989]" />
              <div className="absolute top-3 right-3 w-12 h-12 border-r-2 border-t-2 border-[#b7a989]" />
              <div className="absolute bottom-3 left-3 w-12 h-12 border-l-2 border-b-2 border-[#b7a989]" />
              <div className="absolute bottom-3 right-3 w-12 h-12 border-r-2 border-b-2 border-[#b7a989]" />
              <div className="text-center text-white p-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6"><div className="w-16 h-px bg-[#b7a989]" /><div className="w-2 h-2 rotate-45 border border-[#b7a989]" /><div className="w-16 h-px bg-[#b7a989]" /></div>
                <p className="text-xs tracking-[0.5em] text-[#b7a989] mb-4" style={{ fontFamily: 'var(--font-accent)' }}>WEDDING ALBUM</p>
                <h3 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>우리의 이야기</h3>
                <p className="text-sm text-white/70 mt-2">Our Precious Moments</p>
                <div className="flex items-center justify-center gap-3 mt-8"><div className="w-8 h-px bg-[#b7a989]" /><svg className="w-4 h-4 text-[#b7a989]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><div className="w-8 h-px bg-[#b7a989]" /></div>
                <p className="mt-8 text-xs text-white/50 tracking-wider">펼쳐보세요</p>
              </div>
            </div>
          </FlipPage>
          {bookImages.map((image, i) => (
            <FlipPage key={i} className="relative bg-[#faf8f5]">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-[#faf8f5] to-[#f0ede5]" />
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="relative w-full h-full p-3 bg-white shadow-lg">
                  <div className="absolute inset-2 border border-[#b7a989]/30" />
                  <div className="relative w-full h-full cursor-pointer overflow-hidden" onClick={() => onImageClick(i % images.length)}><Image src={image.src} alt={image.alt} fill className="object-cover" /></div>
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-[#999] font-serif italic">{i + 1}</div>
            </FlipPage>
          ))}
          <FlipPage className="relative overflow-hidden">
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43573a 0%, #2f3d29 50%, #43573a 100%)' }}>
              <div className="absolute top-3 left-3 w-12 h-12 border-l-2 border-t-2 border-[#b7a989]" />
              <div className="absolute top-3 right-3 w-12 h-12 border-r-2 border-t-2 border-[#b7a989]" />
              <div className="absolute bottom-3 left-3 w-12 h-12 border-l-2 border-b-2 border-[#b7a989]" />
              <div className="absolute bottom-3 right-3 w-12 h-12 border-r-2 border-b-2 border-[#b7a989]" />
              <div className="text-center text-white p-8">
                <div className="flex items-center justify-center gap-2 mb-4"><div className="w-8 h-px bg-[#b7a989]" /><svg className="w-4 h-4 text-[#b7a989]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><div className="w-8 h-px bg-[#b7a989]" /></div>
                <p className="text-xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>감사합니다</p>
                <p className="text-xs text-white/60 tracking-widest">THANK YOU</p>
                <div className="mt-8 text-xs text-white/40">태욱 ♥ 선경</div>
              </div>
            </div>
          </FlipPage>
        </HTMLFlipBook>
      </div>
      <p className="mt-6 text-sm text-[var(--color-text-muted)]">페이지 모서리를 드래그하여 넘겨보세요</p>
    </div>
  );
}

// ============================================
// STYLE 10: 3D Circular Carousel (20장)
// ============================================
function CircularCarouselGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  const [rotation, setRotation] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const anglePerImage = 360 / images.length;
  // 20장 이미지를 위한 반경 계산
  const radius = 380;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => setRotation((prev) => prev - anglePerImage), 2500);
    return () => clearInterval(interval);
  }, [anglePerImage, isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setRotation((prev) => prev + anglePerImage);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setRotation((prev) => prev - anglePerImage);
  };

  return (
    <div className="relative">
      {/* 3D Scene Container */}
      <div className="relative h-[500px] overflow-hidden" style={{ perspective: '1000px' }}>
        {/* Carousel */}
        <div
          className="absolute left-1/2 top-1/2 w-0 h-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateX(-50%) translateY(-50%) rotateY(${rotation}deg)`,
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {images.map((image, i) => {
            const angle = anglePerImage * i;
            return (
              <div
                key={i}
                className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                  left: '-50px',
                  top: '-70px',
                }}
                onClick={() => onImageClick(i % 6)}
              >
                <div className="relative w-[100px] h-[140px] rounded-lg overflow-hidden shadow-2xl bg-white p-1">
                  <div className="relative w-full h-full rounded overflow-hidden">
                    <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="100px" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center decoration */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-white border border-[var(--color-border-light)] shadow-inner flex items-center justify-center z-10">
          <div className="text-center">
            <p className="text-lg font-light text-[var(--color-primary)]">{images.length}</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">photos</p>
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-secondary)] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-secondary)] to-transparent pointer-events-none z-20" />
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button onClick={handlePrev} className="w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all">
          <ChevronLeft className="w-5 h-5 text-[var(--color-text)]" />
        </button>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`px-4 py-2 rounded-full text-sm transition-all ${isAutoPlaying ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text)]'} shadow-md`}
        >
          {isAutoPlaying ? '자동 회전 중' : '자동 회전'}
        </button>
        <button onClick={handleNext} className="w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all">
          <ChevronRight className="w-5 h-5 text-[var(--color-text)]" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// STYLE 11: Polaroid Wall Gallery
// ============================================
function PolaroidWallGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  const rotations = [-8, 5, -3, 7, -6, 4, -2, 8, -5, 3];
  const tapeColors = ['bg-yellow-200/80', 'bg-pink-200/80', 'bg-blue-200/80', 'bg-green-200/80'];

  return (
    <div className="relative min-h-[500px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 overflow-hidden">
      {/* Cork board texture */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E")' }} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
        {images.map((image, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8, rotate: rotations[i % rotations.length] }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
            transition={{ duration: 0.4 }} className="relative cursor-pointer" style={{ rotate: `${rotations[i % rotations.length]}deg` }} onClick={() => onImageClick(i)}>
            {/* Tape */}
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 ${tapeColors[i % tapeColors.length]} rounded-sm z-10`} style={{ transform: 'rotate(-2deg)' }} />
            {/* Polaroid frame */}
            <div className="bg-white p-2 pb-12 shadow-xl rounded-sm">
              <div className="relative aspect-square overflow-hidden">
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-500" style={{ fontFamily: 'var(--font-handwriting, cursive)' }}>
                {`#${i + 1}`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STYLE 12: Magazine Spread Gallery
// ============================================
function MagazineSpreadGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const spreads = [];
  for (let i = 0; i < images.length; i += 2) {
    spreads.push(images.slice(i, i + 2));
  }

  return (
    <div className="relative">
      <div className="bg-[#1a1a1a] rounded-xl p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={currentSpread} initial={{ opacity: 0, rotateY: -10 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 10 }} transition={{ duration: 0.5 }}
            className="flex gap-1 md:gap-2" style={{ perspective: '1000px' }}>
            {spreads[currentSpread]?.map((image, i) => (
              <div key={i} className="flex-1 relative" onClick={() => onImageClick(currentSpread * 2 + i)}>
                <div className="relative aspect-[3/4] rounded overflow-hidden cursor-pointer">
                  <Image src={image.src} alt={image.alt} fill className="object-cover" />
                  {/* Magazine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-70">Photo {currentSpread * 2 + i + 1}</p>
                    <p className="text-lg font-light mt-1" style={{ fontFamily: 'var(--font-heading)' }}>Our Moment</p>
                  </div>
                </div>
                {/* Page fold effect */}
                {i === 0 && <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/20 to-transparent" />}
                {i === 1 && <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent" />}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        {/* Page indicator */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setCurrentSpread((prev) => Math.max(0, prev - 1))} disabled={currentSpread === 0} className="text-white/60 hover:text-white disabled:opacity-30">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-white/60 text-sm">{currentSpread + 1} / {spreads.length}</span>
          <button onClick={() => setCurrentSpread((prev) => Math.min(spreads.length - 1, prev + 1))} disabled={currentSpread === spreads.length - 1} className="text-white/60 hover:text-white disabled:opacity-30">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLE 13: Water Ripple Gallery
// ============================================
function WaterRippleGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, i) => (
        <motion.div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group" onClick={() => onImageClick(i)}
          whileHover="hover" initial="rest">
          <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
          {/* Water ripple overlay */}
          <motion.div className="absolute inset-0 pointer-events-none"
            variants={{
              rest: { background: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)' },
              hover: { background: ['radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 0%)', 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)', 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 80%)', 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)'] }
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          {/* Blur wave effect */}
          <motion.div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-[1px] transition-all duration-500" style={{ mask: 'radial-gradient(circle, transparent 30%, black 70%)' }} />
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'translateX(-100%)', animation: 'shimmer 1.5s ease-in-out' }} />
        </motion.div>
      ))}
      <style jsx global>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

// ============================================
// STYLE 14: Holographic Cards Gallery
// ============================================
function HolographicGallery({ images, onImageClick, isInView }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void; isInView: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {images.map((image, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}
          className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group" onClick={() => onImageClick(i)}>
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
          {/* Holographic overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(125deg, rgba(255,0,0,0.1) 0%, rgba(255,154,0,0.1) 10%, rgba(208,222,33,0.1) 20%, rgba(79,220,74,0.1) 30%, rgba(63,218,216,0.1) 40%, rgba(47,201,226,0.1) 50%, rgba(28,127,238,0.1) 60%, rgba(95,21,242,0.1) 70%, rgba(186,12,248,0.1) 80%, rgba(251,7,217,0.1) 90%, rgba(255,0,0,0.1) 100%)',
              backgroundSize: '200% 200%',
              animation: 'holographic 3s ease infinite',
              mixBlendMode: 'overlay',
            }}
          />
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 55%, transparent 60%)',
              backgroundSize: '200% 200%',
              animation: 'shine 2s ease infinite',
            }}
          />
          {/* Border glow */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5), 0 0 20px rgba(147,51,234,0.3)' }}
          />
        </motion.div>
      ))}
      <style jsx global>{`
        @keyframes holographic { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes shine { 0% { background-position: 200% 50%; } 100% { background-position: -200% 50%; } }
      `}</style>
    </div>
  );
}

// ============================================
// STYLE 15: Floating Gallery
// ============================================
function FloatingGallery({ images, onImageClick }: { images: { src: string; alt: string }[]; onImageClick: (index: number) => void }) {
  return (
    <div className="relative min-h-[500px] bg-gradient-to-b from-[#f5f3ed] via-[#e8e4db] to-[#f5f3ed] rounded-2xl overflow-hidden">
      {/* Dreamy background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-[var(--color-primary)]/10"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 p-8 min-h-[500px]">
        {images.map((image, i) => (
          <motion.div key={i} className="relative w-36 md:w-44 cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{ y: [0, -10 - Math.random() * 10, 0], rotate: [-2 + Math.random() * 4, 2 - Math.random() * 4, -2 + Math.random() * 4] }}
            transition={{ y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.6, delay: i * 0.1 } }}
            whileHover={{ scale: 1.1, zIndex: 10, y: -20 }}
            onClick={() => onImageClick(i)}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
              {/* Soft glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
            {/* Shadow underneath */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/10 rounded-full blur-md" />
          </motion.div>
        ))}
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-[var(--color-text-muted)]">
        사진 위에 마우스를 올려보세요
      </p>
    </div>
  );
}
