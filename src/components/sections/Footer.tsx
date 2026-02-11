'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

export function Footer() {
  const { groom, bride, dateDisplay } = WEDDING_INFO;

  return (
    <footer className="relative py-16 px-6 text-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-10 h-px w-16 origin-center"
        style={{ backgroundColor: 'var(--color-border)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto"
      >
        {/* Names */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <span
            className="text-[19px] tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {groom.name}
          </span>
          <span
            className="text-[15px]"
            style={{ color: 'var(--color-gold)' }}
          >
            &
          </span>
          <span
            className="text-[19px] tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {bride.name}
          </span>
        </div>

        {/* Date */}
        <p
          className="mb-8 text-[15px] tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
        </p>

        {/* Thank you */}
        <p
          className="mb-8 text-[15px] italic"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-muted)',
          }}
        >
          함께해 주셔서 감사합니다
        </p>

        {/* Copyright */}
        <p
          className="text-[13px] tracking-wider"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          © 2026 woogi & looppy. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
