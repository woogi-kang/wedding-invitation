'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play } from 'lucide-react';
import { Section } from '@/components/common/Section';
import type { DynamicVideoProps } from '../types';

export function DynamicVideo({ youtubeId, title = '우리의 이야기' }: DynamicVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section id="video" background="white">
      <div ref={sectionRef} className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-primary)' }}>
            Our Film
          </p>
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {title}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-primary)' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative overflow-hidden rounded-lg"
          style={{ border: '1px solid var(--color-border-light)' }}
        >
          {!isPlaying ? (
            <div className="group relative aspect-video cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <Play className="ml-1 h-6 w-6 text-white" fill="currentColor" />
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </motion.div>
      </div>
    </Section>
  );
}
