'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Calendar, Sparkles, PartyPopper } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

const icons = {
  heart: Heart,
  calendar: Calendar,
  sparkles: Sparkles,
  party: PartyPopper,
};

export function Timeline() {
  const { timeline } = WEDDING_INFO;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <Section id="timeline" background="secondary">
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
            Our Story
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            우리의 시간
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: 'var(--color-border)' }}
          />

          {/* Timeline Items */}
          <div className="space-y-8">
            {timeline.map((item, index) => {
              const Icon = icons[item.icon as keyof typeof icons] || Heart;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 * index }}
                  className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`w-[calc(50%-24px)] ${isLeft ? 'text-right pr-4' : 'text-left pl-4'}`}>
                    <p
                      className="text-xs mb-1"
                      style={{
                        fontFamily: 'var(--font-accent)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {item.date}
                    </p>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-text)',
                      }}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p
                        className="text-xs"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text-light)',
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
                    style={{
                      backgroundColor: 'var(--color-white)',
                      border: '2px solid var(--color-primary)',
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: 'var(--color-primary)' }}
                    />
                  </div>

                  {/* Empty space for other side */}
                  <div className="w-[calc(50%-24px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
