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
      <div ref={sectionRef} className="max-w-lg mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p
            className="mb-4 text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
            }}
          >
            Invitation
          </p>
          <h2
            className="text-2xl min-[375px]:text-3xl"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {greeting.title}
          </h2>
        </motion.div>

        {/* Greeting Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p
            className="whitespace-pre-line text-sm min-[375px]:text-base leading-[2.2]"
            style={{
              fontFamily: 'var(--font-heading)',
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div
            className="h-px w-12"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: 'var(--color-gold)' }}
          />
          <div
            className="h-px w-12"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
        </motion.div>

        {/* Parents Names */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center space-y-4"
        >
          {/* Groom's Family */}
          <div
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            <span style={{ color: 'var(--color-text-light)' }}>
              {groom.fatherDeceased ? '故 ' : ''}{groom.father} · {groom.motherDeceased ? '故 ' : ''}{groom.mother}
            </span>
            <span className="mx-2" style={{ color: 'var(--color-text-muted)' }}>의 아들</span>
            <span style={{ color: 'var(--color-groom)', fontWeight: 500 }}>{groom.name}</span>
          </div>

          {/* Bride's Family */}
          <div
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            <span style={{ color: 'var(--color-text-light)' }}>
              {bride.fatherDeceased ? '故 ' : ''}{bride.father} · {bride.motherDeceased ? '故 ' : ''}{bride.mother}
            </span>
            <span className="mx-2" style={{ color: 'var(--color-text-muted)' }}>의 딸</span>
            <span style={{ color: 'var(--color-bride)', fontWeight: 500 }}>{bride.name}</span>
          </div>
        </motion.div>

        {/* Contact Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center gap-4"
        >
          {/* Groom Contact */}
          <div className="text-center">
            <p
              className="mb-3 text-xs tracking-wider"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-text-muted)',
              }}
            >
              신랑에게 연락하기
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => callPhone(groom.phone)}
                className="flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:scale-105"
                style={{
                  borderColor: 'var(--color-groom)',
                  color: 'var(--color-groom)',
                }}
                aria-label="신랑에게 전화하기"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => sendSms(groom.phone)}
                className="flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:scale-105"
                style={{
                  borderColor: 'var(--color-groom)',
                  color: 'var(--color-groom)',
                }}
                aria-label="신랑에게 문자하기"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-px h-16 self-center"
            style={{ backgroundColor: 'var(--color-border)' }}
          />

          {/* Bride Contact */}
          <div className="text-center">
            <p
              className="mb-3 text-xs tracking-wider"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-text-muted)',
              }}
            >
              신부에게 연락하기
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => callPhone(bride.phone)}
                className="flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:scale-105"
                style={{
                  borderColor: 'var(--color-bride)',
                  color: 'var(--color-bride)',
                }}
                aria-label="신부에게 전화하기"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => sendSms(bride.phone)}
                className="flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:scale-105"
                style={{
                  borderColor: 'var(--color-bride)',
                  color: 'var(--color-bride)',
                }}
                aria-label="신부에게 문자하기"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
