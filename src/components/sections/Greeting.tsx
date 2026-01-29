'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Greeting() {
  const { greeting } = WEDDING_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section id="greeting" background="white">
      <div ref={sectionRef} className="max-w-md mx-auto text-center">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            Invitation
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Decorative Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-10"
        >
          <svg
            className="w-8 h-8 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: 'var(--color-gold)' }}
          >
            <path
              d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        {/* Greeting Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10"
        >
          <p
            className="whitespace-pre-line text-[15px] leading-[2.4] tracking-wide"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)',
            }}
          >
            {greeting.message}
          </p>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: 'var(--color-primary)' }}
          >
            <path
              d="M12 3C12 3 5 8 5 13C5 17 8.5 20 12 20C15.5 20 19 17 19 13C19 8 12 3 12 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M12 7V16"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M9 10L12 7L15 10"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>
    </Section>
  );
}
