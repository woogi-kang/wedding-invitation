'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { ModernGrid } from '@/components/calendar';
import { WEDDING_INFO } from '@/lib/constants';

// 디자인 선택: 'timeline' (B안) | 'summary' (C안)
const DESIGN_VARIANT: 'timeline' | 'summary' = 'summary';

export function WeddingInfo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { dateDisplay, venue } = WEDDING_INFO;

  return (
    <Section id="info" background="white">
      <div ref={sectionRef} className="max-w-md mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`${DESIGN_VARIANT === 'summary' ? 'mb-6' : 'mb-12'} text-center`}
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            Schedule
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            예식 안내
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {DESIGN_VARIANT === 'timeline' ? (
          /* B안: Compact Timeline */
          <>
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8"
            >
              <ModernGrid />
            </motion.div>

            {/* 장소 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-8"
            >
              <p
                className="text-base"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {venue.name}
              </p>
              <p
                className="text-sm mt-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-light)',
                }}
              >
                {venue.hall}
              </p>
            </motion.div>

            {/* 점선 구분자 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mb-8 w-48 border-t border-dashed"
              style={{ borderColor: 'var(--color-border)' }}
            />

            {/* 타임라인 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative pl-8 pr-4 max-w-xs mx-auto"
            >
              {/* 세로 라인 */}
              <div
                className="absolute left-[18px] top-3 bottom-3 w-px"
                style={{ backgroundColor: 'var(--color-border)' }}
              />

              {/* 13:40 연회장 오픈 */}
              <div className="relative pb-8">
                <div
                  className="absolute left-[-22px] top-1.5 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-lg tracking-wider shrink-0"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    13:40
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text-light)',
                    }}
                  >
                    연회장 오픈
                  </span>
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  뷔페 식사 가능
                </p>
              </div>

              {/* 14:10 예식 시작 */}
              <div className="relative pb-8">
                <div
                  className="absolute left-[-22px] top-1.5 w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-lg tracking-wider shrink-0 font-medium"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    14:10
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    예식 시작
                  </span>
                </div>
              </div>

              {/* 16:00 연회장 마감 */}
              <div className="relative">
                <div
                  className="absolute left-[-22px] top-1.5 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-lg tracking-wider shrink-0"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    16:00
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text-light)',
                    }}
                  >
                    연회장 마감
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 안내 문구 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs text-center mt-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              귀한 걸음 해주시는 하객분들을 위해 정성껏 식사를 준비하였습니다
            </motion.p>
          </>
        ) : (
          /* C안: Elegant Summary + Detail */
          <>
            {/* 일시/장소 요약 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center mb-10"
            >
              <p
                className="text-lg sm:text-xl font-light"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {dateDisplay.year}년 {dateDisplay.month}월 {dateDisplay.day}일 {dateDisplay.dayOfWeek}
              </p>
              <p
                className="text-sm sm:text-base mt-1.5 tracking-wider"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-gold)',
                }}
              >
                {dateDisplay.time}
              </p>

              {/* 간격 */}
              <div className="my-5" />

              <p
                className="text-[15px]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {venue.name}
              </p>
              <p
                className="text-sm mt-0.5"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-light)',
                }}
              >
                14층 하늘정원
              </p>
              <p
                className="text-[10px] mt-1.5 tracking-[0.3em] uppercase"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Sky Garden
              </p>
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <ModernGrid showDateHeader={false} />
            </motion.div>

            {/* 식사 안내 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="relative overflow-hidden rounded-lg"
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-border-light)',
                boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* 상단 accent 바 */}
              <div
                className="h-1"
                style={{
                  background: 'linear-gradient(to right, var(--color-primary), var(--color-gold))',
                }}
              />

              <div className="px-5 py-6 text-center">
                {/* 타이틀 */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <UtensilsCrossed
                    className="w-[18px] h-[18px]"
                    style={{ color: 'var(--color-primary)' }}
                  />
                  <span
                    className="text-lg"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    식사 안내
                  </span>
                </div>

                {/* 감성 문구 */}
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                  }}
                >
                  귀한 걸음 해주시는 하객분들을 위해
                  <br />
                  정성껏 식사를 준비하였습니다
                </p>

                {/* 구분선 */}
                <div
                  className="mx-auto mb-5 h-px w-[60%]"
                  style={{ backgroundColor: 'var(--color-border)' }}
                />

                {/* 핵심 정보 */}
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    뷔페
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    |
                  </span>
                  <span
                    className="text-sm tracking-wider"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    오후 1:40 ~ 4:00
                  </span>
                </div>

                {/* 보조 설명 */}
                <p
                  className="text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  예식 30분 전부터 이용하실 수 있습니다
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Section>
  );
}
