'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Bus } from 'lucide-react';
import Image from 'next/image';
import { WEDDING_INFO } from '@/lib/constants';

const STORAGE_KEY_SKIP = 'wedding_info_popup_skip_today';

export function WeddingInfoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { venue, dateDisplay, shuttle } = WEDDING_INFO;

  useEffect(() => {
    const skipToday = localStorage.getItem(STORAGE_KEY_SKIP);
    if (skipToday) {
      const today = new Date().toDateString();
      if (skipToday === today) return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleSkipToday = () => {
    localStorage.setItem(STORAGE_KEY_SKIP, new Date().toDateString());
    setIsOpen(false);
  };

  const dDay = (() => {
    const wedding = new Date(WEDDING_INFO.date);
    const now = new Date();
    const diff = Math.ceil((wedding.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'D-Day';
    if (diff > 0) return `D-${diff}`;
    return null;
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* 헤더 - 커플 이름 강조 */}
            <div
              className="relative px-6 pt-7 pb-5 text-center"
              style={{ background: 'var(--color-primary)' }}
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              {dDay && (
                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1 mb-3 text-[11px] font-bold tracking-wider rounded-full border border-white/30"
                  style={{ color: 'white', background: 'rgba(255,255,255,0.15)' }}
                >
                  {dDay}
                </motion.span>
              )}

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-[22px] font-semibold tracking-wide text-white mb-1.5"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {WEDDING_INFO.groom.name} & {WEDDING_INFO.bride.name}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[13px] text-white/75"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                이번 주 일요일이에요!
              </motion.p>

              {/* 하단 웨이브 장식 */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 360 20" fill="none" className="w-full block">
                  <path d="M0 20V8C60 20 120 0 180 8C240 16 300 0 360 8V20H0Z" fill="white" />
                </svg>
              </div>
            </div>

            {/* 본문 */}
            <div className="px-6 pt-2 pb-4 space-y-3.5">
              {/* 날짜/시간 */}
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: 'var(--color-botanical-light, #e8ede6)' }}
                >
                  <Clock className="w-[18px] h-[18px]" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium tracking-wide uppercase mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    일시
                  </p>
                  <p className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
                    {dateDisplay.month}월 {dateDisplay.day}일 {dateDisplay.dayOfWeek}
                  </p>
                  <p className="text-[14px] mt-0.5" style={{ color: 'var(--color-primary)' }}>
                    {dateDisplay.time}
                  </p>
                </div>
              </div>

              {/* 장소 */}
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: 'var(--color-botanical-light, #e8ede6)' }}
                >
                  <MapPin className="w-[18px] h-[18px]" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium tracking-wide uppercase mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    장소
                  </p>
                  <p className="text-[15px] font-semibold" style={{ color: 'var(--color-text)' }}>
                    {venue.name}
                  </p>
                  <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-light)' }}>
                    {venue.hall}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {venue.address}
                  </p>
                </div>
              </div>

              {/* 셔틀버스 */}
              {shuttle.available && shuttle.routes.length > 0 && (
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: 'var(--color-botanical-light, #e8ede6)' }}
                  >
                    <Bus className="w-[18px] h-[18px]" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium tracking-wide uppercase mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      셔틀버스
                    </p>
                    {shuttle.routes.map((route, i) => (
                      <div key={i}>
                        <p className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>
                          {route.departure}
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-light)' }}>
                          {route.timeStart}~{route.timeEnd} / {route.interval} 간격 / {route.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 구분선 */}
              <div className="border-t" style={{ borderColor: 'var(--color-border-light)' }} />

              {/* 길찾기 버튼 - 기존 아이콘 사용 */}
              <div>
                <p className="text-[11px] font-medium tracking-wide uppercase mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
                  길찾기
                </p>
                <div className="flex gap-5 justify-center">
                  {venue.navigation.naver && (
                    <a
                      href={venue.navigation.naver}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                        <Image
                          src="/images/icons/navermap.webp"
                          alt="네이버 지도"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px]" style={{ color: 'var(--color-text-light)' }}>
                        네이버 지도
                      </span>
                    </a>
                  )}
                  {venue.navigation.kakao && (
                    <a
                      href={venue.navigation.kakao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                        <Image
                          src="/images/icons/kakaonavi.png"
                          alt="카카오맵"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px]" style={{ color: 'var(--color-text-light)' }}>
                        카카오맵
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 하단 */}
            <div className="px-6 pb-4">
              <button
                onClick={handleSkipToday}
                className="w-full py-2 text-[11px] rounded-lg transition-colors hover:bg-[var(--color-secondary)]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                오늘 하루 보지 않기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
