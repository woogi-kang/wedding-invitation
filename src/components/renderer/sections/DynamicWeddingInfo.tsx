'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { ModernGrid } from '@/components/calendar';
import type { DynamicWeddingInfoProps } from '../types';

export function DynamicWeddingInfo({ dateDisplay, venue, mealInfo }: DynamicWeddingInfoProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section id="info" background="white">
      <div ref={sectionRef} className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-6 text-center"
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-primary)' }}
          >
            Schedule
          </p>
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            예식 안내
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* 일시/장소 요약 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-10"
        >
          <p className="text-lg sm:text-xl font-light" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {dateDisplay.year}년 {dateDisplay.month}월 {dateDisplay.day}일 {dateDisplay.dayOfWeek}
          </p>
          <p className="text-sm sm:text-base mt-1.5 tracking-wider" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-gold)' }}>
            {dateDisplay.time}
          </p>
          <div className="my-5" />
          <p className="text-[15px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {venue.name}
          </p>
          <p className="text-sm mt-0.5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)' }}>
            {venue.hall}
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
        {mealInfo && (
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
            <div className="h-1" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-gold))' }} />
            <div className="px-5 py-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <UtensilsCrossed className="w-[18px] h-[18px]" style={{ color: 'var(--color-primary)' }} />
                <span className="text-lg" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                  {mealInfo.title}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-5 whitespace-pre-line" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                {mealInfo.description}
              </p>
              {mealInfo.time && (
                <>
                  <div className="mx-auto mb-5 h-px w-[60%]" style={{ backgroundColor: 'var(--color-border)' }} />
                  <p className="text-sm tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                    {mealInfo.time}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  );
}
