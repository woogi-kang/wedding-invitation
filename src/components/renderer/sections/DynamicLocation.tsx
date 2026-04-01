'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Car, Bus, Train, MapPin, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Section } from '@/components/common/Section';
import { copyToClipboard } from '@/lib/utils';
import type { DynamicLocationProps } from '../types';

export function DynamicLocation({ venue, shuttle }: DynamicLocationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(venue.roadAddress);
    if (success) {
      setCopied(true);
      toast.success('주소가 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('복사에 실패했습니다');
    }
  };

  const openNaverMap = () => {
    window.open(venue.navigation?.naver || 'https://map.naver.com', '_blank');
  };

  const openKakaoMap = () => {
    window.open(venue.navigation?.kakao || 'https://map.kakao.com', '_blank');
  };

  const openTmap = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tmap://route?goalname=${encodeURIComponent(venue.name)}&goalx=${venue.coordinates.lng}&goaly=${venue.coordinates.lat}`;
    } else {
      window.open('https://www.tmap.co.kr/', '_blank');
    }
  };

  return (
    <Section id="location" background="secondary">
      <div ref={sectionRef} className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-primary)' }}>
            Location
          </p>
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            오시는 길
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 overflow-hidden rounded-sm cursor-pointer"
          onClick={openNaverMap}
        >
          <div className="relative aspect-[4/3] bg-[var(--color-border-light)]">
            <Image src="/images/map-preview.png" alt="지도" fill className="object-cover" priority />
          </div>
        </motion.div>

        {/* Venue Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span className="text-base" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              {venue.name}
            </span>
          </div>
          <p className="text-sm mb-2 text-center" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {venue.hall}
          </p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className="text-sm" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)' }}>
              {venue.roadAddress}
            </p>
            <button onClick={handleCopyAddress} className="p-1.5 rounded-full transition-colors hover:bg-[var(--color-secondary)]" aria-label="주소 복사">
              {copied ? (
                <Check className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              ) : (
                <Copy className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
              )}
            </button>
          </div>
          {venue.tel && (
            <p className="text-sm mt-2 text-center" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)' }}>
              Tel. {venue.tel}
            </p>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10 flex justify-center gap-6"
        >
          <button onClick={openNaverMap} className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl">
              <Image src="/images/icons/navermap.webp" alt="네이버지도" fill className="object-cover" />
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>네이버맵</span>
          </button>
          <button onClick={openKakaoMap} className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl">
              <Image src="/images/icons/kakaonavi.png" alt="카카오내비" fill className="object-cover" />
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>카카오내비</span>
          </button>
          <button onClick={openTmap} className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl">
              <Image src="/images/icons/tmap.webp" alt="티맵" fill className="object-cover" />
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>티맵</span>
          </button>
        </motion.div>

        <div className="mx-auto mb-10 h-px w-16" style={{ backgroundColor: 'var(--color-border)' }} />

        {/* Transportation Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4"
        >
          {venue.subway && (
            <div className="flex gap-4 p-4 bg-white rounded-sm border border-[var(--color-border-light)]">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-botanical-light)' }}>
                <Train className="h-5 w-5" style={{ color: 'var(--color-botanical)' }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>지하철</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-light)' }}>{venue.subway}</p>
              </div>
            </div>
          )}

          {venue.bus && (
            <div className="flex gap-4 p-4 bg-white rounded-sm border border-[var(--color-border-light)]">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-botanical-light)' }}>
                <Bus className="h-5 w-5" style={{ color: 'var(--color-botanical)' }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>버스</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-light)' }}>{venue.bus}</p>
              </div>
            </div>
          )}

          {venue.parking && (
            <div className="p-4 bg-white rounded-sm border border-[var(--color-border-light)]">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-botanical-light)' }}>
                  <Car className="h-5 w-5" style={{ color: 'var(--color-botanical)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>주차</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-light)' }}>{venue.parking}</p>
                </div>
              </div>
              {venue.parkingNotice && (
                <p className="text-xs leading-relaxed whitespace-pre-line text-center mt-3 pt-3 border-t border-[var(--color-border-light)]" style={{ color: 'var(--color-text-muted)' }}>
                  {venue.parkingNotice}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Shuttle Info */}
        {shuttle?.available && shuttle.routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8"
          >
            <div className="text-center mb-6">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-primary)' }}>
                Shuttle Bus
              </p>
              <h3 className="text-lg" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                셔틀버스 안내
              </h3>
            </div>
            <div className="space-y-4">
              {shuttle.routes.map((route, index) => (
                <div
                  key={index}
                  className="relative p-6 bg-white rounded-sm overflow-hidden"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid var(--color-border-light)' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-gold))' }} />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-xl tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>{route.timeStart}</span>
                      <span className="text-sm" style={{ color: 'var(--color-gold)' }}>―</span>
                      <span className="text-xl tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>{route.timeEnd}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                      {route.departure} | {route.interval} 간격 | {route.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  );
}
