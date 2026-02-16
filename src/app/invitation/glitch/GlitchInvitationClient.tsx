'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MatrixRain,
  CRTOverlay,
  GlitchHero,
  GitLogTimeline,
  ConfigYamlInfo,
  GlitchGallery,
  CoordinatesMap,
  TransferAccount,
} from '@/components/trick/glitch';
import { GlitchFooter } from '@/components/trick/glitch/GlitchFooter';
import type { GalleryImage } from '@/lib/gallery';

interface GlitchInvitationClientProps {
  galleryImages: GalleryImage[];
}

export function GlitchInvitationClient({ galleryImages }: GlitchInvitationClientProps) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="min-h-screen bg-black text-[#00ff41] overflow-x-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain
        colors={['#00ff41', '#ff0080', '#00d4ff']}
        speed={40}
        density={0.97}
      />

      {/* CRT Effects Overlay */}
      <CRTOverlay
        scanlineOpacity={0.02}
        flickerIntensity={0.01}
        vignetteStrength={0.5}
      />

      {/* Main Content */}
      <main className="relative z-30">
        {/* Hero - Boot Sequence */}
        <GlitchHero onBootComplete={() => setShowContent(true)} />

        {/* Sections - appear after boot */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Timeline as Git Log */}
              <GitLogTimeline />

              {/* Wedding Info as Config File */}
              <ConfigYamlInfo />

              {/* Gallery */}
              <GlitchGallery images={galleryImages} />

              {/* Location as Coordinates */}
              <CoordinatesMap />

              {/* Account Transfer */}
              <TransferAccount />

              {/* Footer */}
              <GlitchFooter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
