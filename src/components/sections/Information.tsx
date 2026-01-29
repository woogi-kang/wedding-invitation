'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { UtensilsCrossed } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Information() {
  const { information } = WEDDING_INFO;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <Section id="information" background="primary">
      <SectionTitle title="예식정보 및 안내사항" subtitle="INFORMATION" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="flex flex-col items-center"
      >
        {/* 식사 안내 */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm"
        >
          {/* 이미지 */}
          <div className="mb-5 flex justify-center">
            <div className="relative h-20 w-40 overflow-hidden rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <UtensilsCrossed className="h-10 w-10 text-[var(--color-accent)]" />
              </div>
            </div>
          </div>

          {/* 타이틀 */}
          <h3 className="mb-4 text-center font-serif text-lg font-medium text-[var(--color-text)]">
            {information.meal.title}
          </h3>

          {/* 설명 */}
          <p className="text-center text-sm leading-relaxed text-[var(--color-text-light)] whitespace-pre-line">
            {information.meal.description.split('(오후 2시~4시)').map((part, index, arr) => (
              <span key={index}>
                {part}
                {index < arr.length - 1 && (
                  <span className="text-[var(--color-accent)] font-medium">(오후 2시~4시)</span>
                )}
              </span>
            ))}
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}
