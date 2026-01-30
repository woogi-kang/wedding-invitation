'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { ModernGrid } from '@/components/calendar';

export function WeddingInfo() {
  const { venue } = WEDDING_INFO;
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

        {/* Venue Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin
              className="w-4 h-4"
              style={{ color: 'var(--color-primary)' }}
            />
            <span
              className="text-lg"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              {venue.name}
            </span>
          </div>
          <p
            className="text-sm mb-1"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {venue.hall}
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-muted)',
            }}
          >
            {venue.roadAddress}
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Tel. {venue.tel}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
