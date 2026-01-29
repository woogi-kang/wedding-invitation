'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Video() {
  const { video } = WEDDING_INFO;
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  if (!video.enabled) return null;

  return (
    <Section id="video" background="white">
      <div ref={sectionRef} className="max-w-lg mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-3"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            Our Film
          </p>
          <h2
            className="text-2xl mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {video.title}
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

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative overflow-hidden rounded-lg"
          style={{
            border: '1px solid var(--color-border-light)',
          }}
        >
          {!isPlaying ? (
            // Thumbnail
            <div
              className="group relative aspect-video cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* Pulse animation */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                  <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Play className="ml-1 h-6 w-6 text-white" fill="currentColor" />
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            // YouTube Player
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.title}
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
