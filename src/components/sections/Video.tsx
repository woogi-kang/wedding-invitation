'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Film } from 'lucide-react';
import { Section, SectionTitle } from '@/components/common/Section';
import { WEDDING_INFO } from '@/lib/constants';

export function Video() {
  const { video } = WEDDING_INFO;
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video.enabled) return null;

  return (
    <Section id="video" background="secondary">
      <SectionTitle title="우리의 이야기" subtitle="영상" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-lg shadow-lg"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/60 via-transparent to-[var(--color-primary-dark)]/30" />

            {/* Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Pulse animation */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-white"
                />
                <div className="relative flex h-14 w-14 min-[375px]:h-16 min-[375px]:w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/95 shadow-xl backdrop-blur-sm">
                  <Play className="ml-0.5 h-5 w-5 min-[375px]:h-6 min-[375px]:w-6 sm:h-8 sm:w-8 text-[var(--color-primary)]" fill="currentColor" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 min-[375px]:mt-5 sm:mt-6 font-serif text-xs min-[375px]:text-sm tracking-wider text-white/90"
              >
                {video.title}
              </motion.p>
            </div>

            {/* Film icon decoration */}
            <div className="absolute bottom-4 right-4">
              <Film className="h-5 w-5 text-white/40" />
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
    </Section>
  );
}
