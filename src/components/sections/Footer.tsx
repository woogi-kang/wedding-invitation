'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

export function Footer() {
  const { groom, bride, dateDisplay } = WEDDING_INFO;

  return (
    <footer className="relative overflow-hidden bg-[var(--color-primary-dark)] py-12 min-[375px]:py-14 sm:py-16 px-4 text-center">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-md mx-auto"
      >
        {/* Names */}
        <div className="mb-3 min-[375px]:mb-4 flex items-center justify-center gap-2 min-[375px]:gap-3">
          <span className="font-serif text-lg min-[375px]:text-xl tracking-wider text-white">{groom.name}</span>
          <span className="text-sm min-[375px]:text-base text-[var(--color-accent-light)]">&</span>
          <span className="font-serif text-lg min-[375px]:text-xl tracking-wider text-white">{bride.name}</span>
        </div>

        {/* Date */}
        <p className="mb-6 min-[375px]:mb-8 font-serif text-xs min-[375px]:text-sm tracking-[0.15em] min-[375px]:tracking-[0.2em] text-white/60">
          {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
        </p>

        {/* Divider */}
        <div className="mx-auto mb-6 min-[375px]:mb-8 h-px w-12 min-[375px]:w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Thank you message */}
        <p className="mb-6 min-[375px]:mb-8 font-serif text-xs min-[375px]:text-sm italic tracking-wide text-white/70">
          참석해 주셔서 감사합니다
        </p>

        {/* Copyright */}
        <div className="space-y-0.5 min-[375px]:space-y-1 text-[9px] min-[375px]:text-[10px] uppercase tracking-[0.1em] min-[375px]:tracking-[0.15em] text-white/40">
          <p>사랑으로 만들었습니다</p>
          <p>&copy; {new Date().getFullYear()} 모바일 청첩장</p>
        </div>
      </motion.div>
    </footer>
  );
}
