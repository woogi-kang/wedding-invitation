'use client';

import { motion } from 'framer-motion';
import type { DynamicFooterProps } from '../types';

export function DynamicFooter({ groomName, brideName, dateDisplay }: DynamicFooterProps) {
  return (
    <footer className="relative py-16 px-6 text-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
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
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="text-lg tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {groomName}
          </span>
          <span className="text-sm" style={{ color: 'var(--color-gold)' }}>&</span>
          <span className="text-lg tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {brideName}
          </span>
        </div>

        <p className="mb-8 text-sm tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-light)' }}>
          {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
        </p>

        <p className="mb-8 text-sm italic" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-text-muted)' }}>
          함께해 주셔서 감사합니다
        </p>

        <p className="text-xs tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          Powered by WeddingCraft
        </p>
      </motion.div>
    </footer>
  );
}
