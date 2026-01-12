'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, ExternalLink, Heart } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function RSVP() {
  const { rsvp } = WEDDING_INFO;

  if (!rsvp.enabled) return null;

  const openRSVPForm = () => {
    window.open(rsvp.formUrl, '_blank');
  };

  return (
    <Section id="rsvp" background="white">
      <SectionTitle title="참석 여부" subtitle="RSVP" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        {/* Decorative Icon */}
        <div className="relative mb-6 min-[375px]:mb-8 inline-block">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="flex h-16 w-16 min-[375px]:h-20 min-[375px]:w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-botanical-light)] to-[var(--color-secondary)]"
          >
            <ClipboardCheck className="h-7 w-7 min-[375px]:h-9 min-[375px]:w-9 text-[var(--color-primary)]" />
          </motion.div>
          {/* Decorative ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute inset-0 -m-1.5 min-[375px]:-m-2 rounded-full border border-[var(--color-botanical)]/30"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-1.5 min-[375px]:mb-2 font-serif text-base min-[375px]:text-lg text-[var(--color-text)]">
            결혼식에 참석하시겠습니까?
          </p>
          <p className="mb-6 min-[375px]:mb-8 text-xs min-[375px]:text-sm leading-relaxed text-[var(--color-text-light)]">
            축하연 준비에 참고하겠습니다.
            <br />
            참석 여부를 알려주세요.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={openRSVPForm}
          className="group inline-flex items-center gap-2 min-[375px]:gap-3 rounded-md bg-[var(--color-primary)] px-6 min-[375px]:px-8 py-3 min-[375px]:py-4 text-sm min-[375px]:text-base font-medium text-white shadow-lg transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-xl"
        >
          <Heart className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 transition-transform group-hover:scale-110" />
          <span className="tracking-wide">참석 의사 전달하기</span>
          <ExternalLink className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 opacity-60" />
        </motion.button>
      </motion.div>
    </Section>
  );
}
