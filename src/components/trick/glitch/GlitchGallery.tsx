'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { WEDDING_INFO } from '@/lib/constants';
import { TerminalWindow } from '../shared/TerminalWindow';

export function GlitchGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { gallery } = WEDDING_INFO;

  const images = gallery.images;

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#00ff41]/60 font-mono text-xs tracking-widest">
            $ ls -la ./gallery/
          </span>
          <h2 className="text-2xl font-bold text-[#00ff41] mt-2">
            Photo Gallery
          </h2>
        </motion.div>

        <TerminalWindow title="file-browser">
          {/* Terminal-style file listing */}
          <div className="mb-4 font-mono text-xs text-[#00ff41]/70">
            <div>total {images.length}</div>
            <div className="text-[#00ff41]/50">drwxr-xr-x  wedding  gallery</div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((image, index) => (
              <motion.div
                key={image.publicId}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => openImage(index)}
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden rounded border border-[#00ff41]/20 bg-black">
                  <CldImage
                    src={image.publicId}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />

                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      background: `repeating-linear-gradient(
                        0deg,
                        transparent 0px,
                        transparent 2px,
                        rgba(0, 255, 65, 0.05) 2px,
                        rgba(0, 255, 65, 0.05) 4px
                      )`,
                    }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-[#00ff41]" />
                  </div>
                </div>

                {/* Filename */}
                <div className="mt-1 font-mono text-xs text-[#00ff41]/60 truncate">
                  -rw-r--r-- photo_{String(index + 1).padStart(2, '0')}.jpg
                </div>
              </motion.div>
            ))}
          </div>
        </TerminalWindow>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={closeImage}
            >
              {/* Close button */}
              <button
                onClick={closeImage}
                className="absolute top-4 right-4 p-2 text-[#00ff41] hover:bg-[#00ff41]/20 rounded transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 p-2 text-[#00ff41] hover:bg-[#00ff41]/20 rounded transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 p-2 text-[#00ff41] hover:bg-[#00ff41]/20 rounded transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Image */}
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-4xl max-h-[80vh] w-full h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <CldImage
                  src={images[selectedIndex].publicId}
                  alt={images[selectedIndex].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />

                {/* CRT effect on lightbox */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      transparent 0px,
                      transparent 2px,
                      rgba(0, 255, 65, 0.03) 2px,
                      rgba(0, 255, 65, 0.03) 4px
                    )`,
                  }}
                />
              </motion.div>

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-sm text-[#00ff41]/70">
                [{selectedIndex + 1}/{images.length}]
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
