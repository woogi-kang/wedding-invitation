'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function CoupleIntro() {
  const { groom, bride } = WEDDING_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section id="couple" background="secondary">
      <div ref={sectionRef} className="max-w-lg mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            About Us
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

        {/* Couple Cards */}
        <div className="space-y-5 flex flex-col items-center">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-5 px-5 py-4 rounded-lg w-fit"
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            {/* Photo */}
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: 'url(/images/hero/groom.jpg)',
                border: '3px solid var(--color-groom)',
              }}
            />
            {/* Info */}
            <div className="flex-1">
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-1"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-groom)',
                }}
              >
                Groom
              </p>
              <p
                className="text-xl mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {groom.name}
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-light)',
                }}
              >
                {groom.fatherDeceased ? '故 ' : ''}{groom.father} · {groom.motherDeceased ? '故 ' : ''}{groom.mother}
                <span style={{ color: 'var(--color-text-muted)' }}> 의 아들</span>
              </p>
            </div>
          </motion.div>

          {/* Connector */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'white',
              }}
            >
              <span className="text-sm">&</span>
            </div>
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-5 px-5 py-4 rounded-lg flex-row-reverse w-fit"
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            {/* Photo */}
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: 'url(/images/hero/bride.jpg)',
                border: '3px solid var(--color-bride)',
              }}
            />
            {/* Info */}
            <div className="flex-1 text-right">
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-1"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-bride)',
                }}
              >
                Bride
              </p>
              <p
                className="text-xl mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                {bride.name}
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-light)',
                }}
              >
                {bride.fatherDeceased ? '故 ' : ''}{bride.father} · {bride.motherDeceased ? '故 ' : ''}{bride.mother}
                <span style={{ color: 'var(--color-text-muted)' }}> 의 딸</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
