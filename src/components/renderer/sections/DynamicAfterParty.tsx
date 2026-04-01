'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import { Section } from '@/components/common/Section';
import type { DynamicAfterPartyProps } from '../types';

export function DynamicAfterParty({ places, showAfterTime }: DynamicAfterPartyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  if (!places || places.length === 0) return null;

  // showAfterTime이 설정되어 있으면 해당 시간 이후에만 표시
  if (showAfterTime) {
    const now = new Date();
    const showTime = new Date(showAfterTime);
    if (now < showTime) return null;
  }

  return (
    <Section id="after-party" background="secondary">
      <div ref={sectionRef} className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-primary)' }}
          >
            After Party
          </p>
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            뒤풀이 안내
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        <div className="space-y-4">
          {places.map((place, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="p-5 bg-white rounded-lg border border-[var(--color-border-light)]"
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--color-botanical-light)' }}
                >
                  <MapPin className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                    {place.name}
                  </p>
                  {place.description && (
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-light)' }}>{place.description}</p>
                  )}
                  {place.address && (
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{place.address}</p>
                  )}
                  {place.mapUrl && (
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs transition-opacity hover:opacity-70"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      지도 보기 <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
