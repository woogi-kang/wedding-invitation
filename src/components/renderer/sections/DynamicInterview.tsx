'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Section } from '@/components/common/Section';
import type { DynamicInterviewProps } from '../types';

export function DynamicInterview({ interviews }: DynamicInterviewProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!interviews || interviews.length === 0) return null;

  return (
    <Section id="interview" background="white">
      <div ref={sectionRef} className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-primary)' }}>
            Interview
          </p>
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            웨딩 인터뷰
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        <div className="space-y-4">
          {interviews.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: 'var(--color-secondary)', border: '1px solid var(--color-border-light)' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors"
                style={{ backgroundColor: openIndex === index ? 'var(--color-primary)' : 'transparent' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium" style={{ color: openIndex === index ? 'white' : 'var(--color-primary)' }}>Q.</span>
                  <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: openIndex === index ? 'white' : 'var(--color-text)' }}>
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  style={{ color: openIndex === index ? 'white' : 'var(--color-text-muted)' }}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 border-t space-y-4" style={{ borderColor: 'var(--color-border-light)' }}>
                      {item.groomAnswer && (
                        <div className="rounded-lg p-3" style={{ backgroundColor: 'white' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm flex-shrink-0 leading-none">🤵</span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-groom)', color: 'white' }}>신랑</span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-line pl-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>
                            {item.groomAnswer}
                          </p>
                        </div>
                      )}
                      {item.brideAnswer && (
                        <div className="rounded-lg p-3" style={{ backgroundColor: 'white' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm flex-shrink-0 leading-none">👰</span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-bride)', color: 'white' }}>신부</span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-line pl-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>
                            {item.brideAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
