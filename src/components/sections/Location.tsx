'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Car, Bus, Train, MapPin } from 'lucide-react';
import { NaverMapIcon, KakaoMapIcon, TmapIcon } from '@/components/icons/NavigationIcons';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Location() {
  const { venue, shuttle } = WEDDING_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
            Location
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
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
            <Image
              src="/images/map-preview.png"
              alt="지도"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Venue Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span
              className="text-base"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              {venue.name}
            </span>
          </div>
          <p
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {venue.roadAddress}
          </p>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10 flex justify-center gap-6"
        >
          <button
            onClick={openNaverMap}
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
              <NaverMapIcon className="h-6 w-6" />
            </div>
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-light)' }}
            >
              네이버
            </span>
          </button>
          <button
            onClick={openKakaoMap}
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
              <KakaoMapIcon className="h-6 w-6" />
            </div>
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-light)' }}
            >
              카카오
            </span>
          </button>
          <button
            onClick={openTmap}
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[var(--color-border)]">
              <TmapIcon className="h-6 w-6" />
            </div>
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-light)' }}
            >
              티맵
            </span>
          </button>
        </motion.div>

        {/* Divider */}
        <div
          className="mx-auto mb-10 h-px w-16"
          style={{ backgroundColor: 'var(--color-border)' }}
        />

        {/* Transportation Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4"
        >
          {/* Subway */}
          <div className="flex gap-4 p-4 bg-white rounded-sm border border-[var(--color-border-light)]">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-botanical-light)' }}
            >
              <Train className="h-5 w-5" style={{ color: 'var(--color-botanical)' }} />
            </div>
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                지하철
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-light)' }}
              >
                {venue.subway}
              </p>
            </div>
          </div>

          {/* Bus */}
          <div className="flex gap-4 p-4 bg-white rounded-sm border border-[var(--color-border-light)]">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-botanical-light)' }}
            >
              <Bus className="h-5 w-5" style={{ color: 'var(--color-botanical)' }} />
            </div>
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                버스
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-light)' }}
              >
                {venue.bus}
              </p>
            </div>
          </div>

          {/* Parking */}
          <div className="flex gap-4 p-4 bg-white rounded-sm border border-[var(--color-border-light)]">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-botanical-light)' }}
            >
              <Car className="h-5 w-5" style={{ color: 'var(--color-botanical)' }} />
            </div>
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                주차
              </p>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--color-text-light)' }}
              >
                {venue.parking}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Shuttle Info */}
        {shuttle.available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8"
          >
            <h3
              className="mb-4 text-center text-lg"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              셔틀버스 안내
            </h3>
            <div className="space-y-3">
              {shuttle.routes.map((route, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-sm border-l-2"
                  style={{ borderColor: 'var(--color-gold)' }}
                >
                  <p
                    className="text-sm font-medium mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {route.name}
                  </p>
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'var(--color-text-light)' }}
                  >
                    {route.departure}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {route.times.map((time, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: 'var(--color-secondary)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                  <p
                    className="mt-2 text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {route.duration}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  );
}
