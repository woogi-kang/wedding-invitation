'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Train } from 'lucide-react';
import { WEDDING_INFO } from '@/lib/constants';
import { TerminalWindow } from '../shared/TerminalWindow';

export function CoordinatesMap() {
  const { venue } = WEDDING_INFO;

  const openNavigation = (app: 'naver' | 'kakao' | 'tmap') => {
    const urls = {
      naver: venue.navigation.naver,
      kakao: venue.navigation.kakao,
      tmap: venue.navigation.tmap,
    };
    window.open(urls[app], '_blank');
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#00ff41]/60 font-mono text-xs tracking-widest">
            $ gps --coordinates
          </span>
          <h2 className="text-2xl font-bold text-[#00ff41] mt-2">
            Location
          </h2>
        </motion.div>

        <TerminalWindow title="location.config.ts">
          <div className="space-y-4">
            {/* Coordinates Display */}
            <div className="font-mono text-sm">
              <div className="text-[#569cd6]">const</div>
              <div className="pl-4">
                <span className="text-[#9cdcfe]">VENUE</span>
                <span className="text-white"> = </span>
                <span className="text-[#ce9178]">&quot;{venue.name}&quot;</span>
              </div>
              <div className="pl-4">
                <span className="text-[#9cdcfe]">HALL</span>
                <span className="text-white"> = </span>
                <span className="text-[#ce9178]">&quot;{venue.hall}&quot;</span>
              </div>
              <div className="pl-4">
                <span className="text-[#9cdcfe]">COORDINATES</span>
                <span className="text-white"> = [</span>
                <span className="text-[#b5cea8]">{venue.coordinates.lat}</span>
                <span className="text-white">, </span>
                <span className="text-[#b5cea8]">{venue.coordinates.lng}</span>
                <span className="text-white">]</span>
              </div>
            </div>

            {/* Visual Map Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative h-48 bg-[#0a0a0a] rounded border border-[#00ff41]/30 overflow-hidden"
            >
              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,255,65,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,255,65,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Center Pin */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <MapPin className="w-8 h-8 text-[#ff0080]" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#ff0080]/50 blur-sm rounded-full" />
                </motion.div>
              </div>

              {/* Coordinate Labels */}
              <div className="absolute bottom-2 left-2 text-xs font-mono text-[#00ff41]/60">
                LAT: {venue.coordinates.lat}
              </div>
              <div className="absolute bottom-2 right-2 text-xs font-mono text-[#00ff41]/60">
                LNG: {venue.coordinates.lng}
              </div>
            </motion.div>

            {/* Address */}
            <div className="text-center text-[#00ff41]/80 font-mono text-sm">
              {venue.address}
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Naver', key: 'naver' as const, color: '#00ff41' },
                { name: 'Kakao', key: 'kakao' as const, color: '#ffff00' },
                { name: 'Tmap', key: 'tmap' as const, color: '#00d4ff' },
              ].map((nav) => (
                <motion.button
                  key={nav.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openNavigation(nav.key)}
                  className="px-3 py-2 border rounded font-mono text-xs transition-colors"
                  style={{
                    borderColor: `${nav.color}50`,
                    color: nav.color,
                  }}
                >
                  <Navigation className="w-3 h-3 inline mr-1" />
                  {nav.name}
                </motion.button>
              ))}
            </div>

            {/* Transport Info */}
            <div className="space-y-2 pt-4 border-t border-[#00ff41]/20">
              <div className="flex items-start gap-2 text-xs font-mono text-[#00ff41]/70">
                <Train className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{venue.subway}</span>
              </div>
              <div className="flex items-start gap-2 text-xs font-mono text-[#00ff41]/70">
                <Car className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{venue.parking}</span>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
