'use client';

import { motion } from 'framer-motion';

interface StoryTransitionProps {
  /** Korean poetry/phrase for the transition */
  text: string;
  /** Optional English subtitle */
  subtitle?: string;
  /** Visual style variant */
  variant?: 'brush' | 'minimal' | 'poetic' | 'vertical';
}

/**
 * Story-driven section transitions with Korean poetry/phrases
 * Replaces generic dividers with meaningful narrative moments
 */
export function StoryTransition({
  text,
  subtitle,
  variant = 'brush',
}: StoryTransitionProps) {
  if (variant === 'vertical') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="relative py-16 flex justify-center"
      >
        {/* Vertical text container */}
        <div className="relative">
          {/* Brush stroke background */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 origin-top"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--color-primary), var(--color-primary), transparent)',
            }}
          />

          {/* Vertical Korean text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative px-6 py-8 text-2xl tracking-[0.5em] leading-loose"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-primary-dark)',
              writingMode: 'vertical-rl',
            }}
          >
            {text}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'poetic') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="relative py-20 overflow-hidden"
      >
        {/* Decorative lines */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-1/2 h-px origin-center"
          style={{
            background: 'linear-gradient(to right, transparent, var(--color-border), transparent)',
          }}
        />

        {/* Center content */}
        <div className="relative mx-auto max-w-sm text-center">
          {/* Background shape */}
          <div
            className="absolute inset-0 -inset-x-8 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse, var(--color-rose-light) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />

          {/* Korean text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative text-xl min-[375px]:text-2xl leading-relaxed whitespace-pre-line"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {text}
          </motion.p>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative mt-4 text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: 'var(--font-elegant)',
                color: 'var(--color-text-muted)',
              }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="relative py-12"
      >
        <div className="mx-auto max-w-xs text-center">
          {/* Top decoration */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 h-px w-12 origin-center"
            style={{ background: 'var(--color-border)' }}
          />

          {/* Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm tracking-[0.2em]"
            style={{
              fontFamily: 'var(--font-elegant)',
              color: 'var(--color-text-light)',
            }}
          >
            {text}
          </motion.p>

          {/* Bottom decoration */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-6 h-px w-12 origin-center"
            style={{ background: 'var(--color-border)' }}
          />
        </div>
      </motion.div>
    );
  }

  // Default: brush variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
      className="relative py-16 overflow-hidden"
    >
      {/* Soft floral glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-64 h-24 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, var(--color-rose-light) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-md text-center px-6">
        {/* Brush stroke line top */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-6 h-[2px] w-16 origin-left"
          style={{
            background: 'linear-gradient(to right, var(--color-primary), var(--color-rose-light))',
          }}
        />

        {/* Korean calligraphy text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl min-[375px]:text-3xl leading-relaxed"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          {text}
        </motion.p>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 text-[10px] min-[375px]:text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-elegant)',
              color: 'var(--color-text-muted)',
            }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Brush stroke line bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 h-[2px] w-16 origin-right"
          style={{
            background: 'linear-gradient(to left, var(--color-primary), var(--color-rose-light))',
          }}
        />
      </div>
    </motion.div>
  );
}

// Pre-defined Korean wedding phrases for easy use
export const STORY_PHRASES = {
  afterGreeting: '두 사람이 만나',
  beforeGallery: '함께한 순간들',
  afterGallery: '그리고 우리는',
  beforeInfo: '새로운 시작',
  beforeLocation: '소중한 그 날',
  beforeAccount: '마음을 전해주세요',
  beforeRsvp: '함께해 주세요',
  beforeGuestbook: '축복의 말씀',
  ending: '감사합니다',
} as const;
