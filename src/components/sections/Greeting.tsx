'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, SectionTitle, HorizontalDivider } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { callPhone, sendSms } from '@/lib/utils';

export function Greeting() {
  const { groom, bride, greeting } = WEDDING_INFO;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <Section id="greeting" background="white">
      {/* Decorative Botanical Corner */}
      <div className="absolute top-8 left-8 w-20 h-20 opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[var(--color-primary)]">
          <path d="M10 90 Q10 10, 90 10 Q50 30, 30 50 Q10 70, 10 90" />
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 w-20 h-20 opacity-[0.06] pointer-events-none rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[var(--color-primary)]">
          <path d="M10 90 Q10 10, 90 10 Q50 30, 30 50 Q10 70, 10 90" />
        </svg>
      </div>

      <SectionTitle title={greeting.title} subtitle="초대합니다" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="space-y-10"
      >
        {/* Message */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="whitespace-pre-line font-serif text-sm min-[375px]:text-base leading-[2] min-[375px]:leading-[2.2] text-[var(--color-text)] sm:text-lg">
            {greeting.message}
          </p>
        </motion.div>

        <HorizontalDivider />

        {/* Parents Names */}
        <motion.div variants={itemVariants} className="space-y-4 min-[375px]:space-y-5 text-center">
          {/* Groom's Parents */}
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 min-[375px]:gap-x-2 gap-y-1">
            <span className="text-xs min-[375px]:text-sm text-[var(--color-text-light)]">
              {groom.fatherDeceased ? '故 ' : ''}{groom.father}
              <span className="mx-0.5 min-[375px]:mx-1 text-[var(--color-botanical)]">.</span>
              {groom.motherDeceased ? '故 ' : ''}{groom.mother}
            </span>
            <span className="text-xs min-[375px]:text-sm text-[var(--color-text-muted)]">의 아들</span>
            <span className="font-serif text-sm min-[375px]:text-base font-medium text-[var(--color-primary)]">{groom.name}</span>
          </div>

          {/* Bride's Parents */}
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 min-[375px]:gap-x-2 gap-y-1">
            <span className="text-xs min-[375px]:text-sm text-[var(--color-text-light)]">
              {bride.fatherDeceased ? '故 ' : ''}{bride.father}
              <span className="mx-0.5 min-[375px]:mx-1 text-[var(--color-botanical)]">.</span>
              {bride.motherDeceased ? '故 ' : ''}{bride.mother}
            </span>
            <span className="text-xs min-[375px]:text-sm text-[var(--color-text-muted)]">의 딸</span>
            <span className="font-serif text-sm min-[375px]:text-base font-medium text-[var(--color-primary)]">{bride.name}</span>
          </div>
        </motion.div>

        {/* Contact Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 min-[375px]:gap-3 sm:gap-4 pt-4">
          {/* Groom Contact */}
          <div className="group relative overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white p-3 min-[375px]:p-4 sm:p-5 transition-all duration-300 hover:border-[var(--color-botanical)] hover:shadow-lg">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-botanical)] transition-all duration-300 group-hover:w-full" />

            <p className="mb-0.5 min-[375px]:mb-1 text-[9px] min-[375px]:text-[10px] uppercase tracking-[0.15em] min-[375px]:tracking-[0.2em] text-[var(--color-text-muted)]">신랑</p>
            <p className="mb-3 min-[375px]:mb-4 font-serif text-base min-[375px]:text-lg font-medium text-[var(--color-text)]">{groom.name}</p>

            <div className="flex justify-center gap-2 min-[375px]:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => callPhone(groom.phone)}
                className="flex h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-md transition-shadow hover:shadow-lg"
                aria-label="전화하기"
              >
                <Phone className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendSms(groom.phone)}
                className="flex h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-md transition-shadow hover:shadow-lg"
                aria-label="문자하기"
              >
                <MessageCircle className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Bride Contact */}
          <div className="group relative overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white p-3 min-[375px]:p-4 sm:p-5 transition-all duration-300 hover:border-[var(--color-rose)] hover:shadow-lg">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-rose-light)] transition-all duration-300 group-hover:w-full" />

            <p className="mb-0.5 min-[375px]:mb-1 text-[9px] min-[375px]:text-[10px] uppercase tracking-[0.15em] min-[375px]:tracking-[0.2em] text-[var(--color-text-muted)]">신부</p>
            <p className="mb-3 min-[375px]:mb-4 font-serif text-base min-[375px]:text-lg font-medium text-[var(--color-text)]">{bride.name}</p>

            <div className="flex justify-center gap-2 min-[375px]:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => callPhone(bride.phone)}
                className="flex h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-md transition-shadow hover:shadow-lg"
                aria-label="전화하기"
              >
                <Phone className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendSms(bride.phone)}
                className="flex h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-md transition-shadow hover:shadow-lg"
                aria-label="문자하기"
              >
                <MessageCircle className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
