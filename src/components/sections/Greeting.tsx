'use client';

import { useRef } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';
import { callPhone, sendSms } from '@/lib/utils';

export function Greeting() {
  const { groom, bride, greeting } = WEDDING_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section id="greeting" background="white">
      <div ref={sectionRef}>
        {/* Decorative Botanical Corners */}
        <div className="absolute top-8 left-8 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10 90 Q10 10, 90 10"
              stroke="var(--color-primary)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M20 80 Q20 20, 80 20"
              stroke="var(--color-rose)"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>
        <div className="absolute bottom-8 right-8 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none rotate-180">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10 90 Q10 10, 90 10"
              stroke="var(--color-primary)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M20 80 Q20 20, 80 20"
              stroke="var(--color-rose)"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Section Title - Custom styled */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 min-[375px]:mb-12 text-center"
        >
          {/* Brush stroke accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-4 h-[2px] w-12 origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, var(--color-primary), transparent)',
            }}
          />

          <h2
            className="text-2xl min-[375px]:text-3xl sm:text-4xl mb-2"
            style={{
              fontFamily: 'var(--font-calligraphy)',
              color: 'var(--color-text)',
            }}
          >
            {greeting.title}
          </h2>

          <p
            className="text-[10px] min-[375px]:text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-elegant)',
              color: 'var(--color-text-muted)',
            }}
          >
            Invitation
          </p>
        </motion.div>

        {/* Greeting Message - Poetic layout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 min-[375px]:mb-12 text-center relative"
        >
          {/* Background decoration */}
          <div
            className="absolute inset-0 -inset-x-4 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, var(--color-rose-light) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          <p
            className="relative whitespace-pre-line text-sm min-[375px]:text-base sm:text-lg leading-[2.2] min-[375px]:leading-[2.4]"
            style={{
              fontFamily: 'var(--font-elegant)',
              color: 'var(--color-text)',
            }}
          >
            {greeting.message}
          </p>
        </motion.div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-4 mb-10 min-[375px]:mb-12"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-12 origin-right"
            style={{ background: 'var(--color-border)' }}
          />
          <motion.span
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring' }}
            className="text-lg"
            style={{ color: 'var(--color-rose)' }}
          >
            &#10084;
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-12 origin-left"
            style={{ background: 'var(--color-border)' }}
          />
        </motion.div>

        {/* Parents Names - Elegant Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 min-[375px]:space-y-5 text-center mb-10 min-[375px]:mb-12"
        >
          {/* Groom's Family */}
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 min-[375px]:gap-x-2 gap-y-1">
            <span
              className="text-xs min-[375px]:text-sm"
              style={{
                fontFamily: 'var(--font-elegant)',
                color: 'var(--color-text-light)',
              }}
            >
              {groom.fatherDeceased ? '故 ' : ''}{groom.father}
              <span className="mx-1" style={{ color: 'var(--color-primary-light)' }}>.</span>
              {groom.motherDeceased ? '故 ' : ''}{groom.mother}
            </span>
            <span
              className="text-xs min-[375px]:text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              의 아들
            </span>
            <span
              className="text-base min-[375px]:text-lg font-medium"
              style={{
                fontFamily: 'var(--font-calligraphy)',
                color: 'var(--color-primary)',
              }}
            >
              {groom.name}
            </span>
          </div>

          {/* Bride's Family */}
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 min-[375px]:gap-x-2 gap-y-1">
            <span
              className="text-xs min-[375px]:text-sm"
              style={{
                fontFamily: 'var(--font-elegant)',
                color: 'var(--color-text-light)',
              }}
            >
              {bride.fatherDeceased ? '故 ' : ''}{bride.father}
              <span className="mx-1" style={{ color: 'var(--color-rose-light)' }}>.</span>
              {bride.motherDeceased ? '故 ' : ''}{bride.mother}
            </span>
            <span
              className="text-xs min-[375px]:text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              의 딸
            </span>
            <span
              className="text-base min-[375px]:text-lg font-medium"
              style={{
                fontFamily: 'var(--font-calligraphy)',
                color: 'var(--color-rose)',
              }}
            >
              {bride.name}
            </span>
          </div>
        </motion.div>

        {/* Contact Cards - Refined Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-3 min-[375px]:gap-4"
        >
          {/* Groom Contact */}
          <ContactCard
            label="신랑"
            name={groom.name}
            phone={groom.phone}
            accentColor="var(--color-primary)"
            gradientFrom="var(--color-primary)"
            gradientTo="var(--color-primary-light)"
          />

          {/* Bride Contact */}
          <ContactCard
            label="신부"
            name={bride.name}
            phone={bride.phone}
            accentColor="var(--color-rose)"
            gradientFrom="var(--color-rose)"
            gradientTo="var(--color-rose-light)"
          />
        </motion.div>
      </div>
    </Section>
  );
}

// Contact Card Component
function ContactCard({
  label,
  name,
  phone,
  accentColor,
  gradientFrom,
  gradientTo,
}: {
  label: string;
  name: string;
  phone: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white p-4 min-[375px]:p-5 transition-all duration-300 hover:shadow-lg border border-[var(--color-border-light)]">
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      {/* Label */}
      <p
        className="mb-1 text-[9px] min-[375px]:text-[10px] tracking-[0.2em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </p>

      {/* Name */}
      <p
        className="mb-4 text-lg min-[375px]:text-xl font-medium"
        style={{
          fontFamily: 'var(--font-calligraphy)',
          color: 'var(--color-text)',
        }}
      >
        {name}
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2 min-[375px]:gap-3">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => callPhone(phone)}
          className="flex h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 items-center justify-center rounded-full text-white shadow-md transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: accentColor,
            outlineColor: accentColor,
          }}
          aria-label={`${name}에게 전화하기`}
        >
          <Phone className="h-4 w-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendSms(phone)}
          className="flex h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 items-center justify-center rounded-full text-white shadow-md transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: 'var(--color-accent)',
            outlineColor: 'var(--color-accent)',
          }}
          aria-label={`${name}에게 문자하기`}
        >
          <MessageCircle className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
