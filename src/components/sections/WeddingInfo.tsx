'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { ModernGrid } from '@/components/calendar';

export function WeddingInfo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section id="info" background="white">
      <div ref={sectionRef} className="max-w-md mx-auto">
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

        {/* Calendar - ModernGrid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-10"
        >
          <ModernGrid />
        </motion.div>

        {/* 식사 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <UtensilsCrossed
              className="w-5 h-5"
              style={{ color: 'var(--color-primary)' }}
            />
            <span
              className="text-xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              식사 안내
            </span>
          </div>
          <p
            className="text-sm mb-5 leading-relaxed"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            귀한 걸음 해주시는 하객분들을 위해
            <br />
            정성껏 식사를 준비하였습니다
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-muted)',
            }}
          >
            식사는 예식 30분 전부터 가능하며
            <br />
            총 2시간 이용 가능합니다
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
