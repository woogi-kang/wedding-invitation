'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Car, Bus, Train, MapPin, Navigation, Clock } from 'lucide-react';
import { Section, SectionTitle, HorizontalDivider } from '@/components/common/Section';
import { Button } from '@/components/ui/Button';
import { WEDDING_INFO } from '@/lib/constants';

export function Location() {
  const { venue, shuttle } = WEDDING_INFO;

  const openNaverMap = () => {
    window.open('https://naver.me/G9r5RXWh', '_blank');
  };

  const openKakaoMap = () => {
    window.open('https://place.map.kakao.com/1212235250', '_blank');
  };

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
    <Section id="location" background="secondary">
      <SectionTitle title="오시는 길" subtitle="장소 안내" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Map Image */}
        <motion.div
          variants={itemVariants}
          className="mb-6 min-[375px]:mb-8 overflow-hidden rounded-lg shadow-lg"
        >
          <div className="relative aspect-[4/3] bg-[var(--color-botanical-light)]">
            <Image
              src="/images/map.png"
              alt="Wedding venue map"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>

        {/* Venue Address */}
        <motion.div
          variants={itemVariants}
          className="mb-5 min-[375px]:mb-6 text-center"
        >
          <div className="mb-2 min-[375px]:mb-3 inline-flex items-center gap-1.5 min-[375px]:gap-2">
            <MapPin className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 text-[var(--color-primary)]" />
            <span className="font-serif text-base min-[375px]:text-lg font-medium text-[var(--color-text)]">{venue.name}</span>
          </div>
          <p className="text-xs min-[375px]:text-sm text-[var(--color-text)]">{venue.roadAddress}</p>
          <p className="text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">({venue.address})</p>
        </motion.div>

        {/* Map Buttons */}
        <motion.div
          variants={itemVariants}
          className="mb-6 min-[375px]:mb-8 flex justify-center gap-2 min-[375px]:gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openNaverMap}
            className="flex items-center gap-1.5 min-[375px]:gap-2 rounded-md border border-[var(--color-border)] bg-white px-4 min-[375px]:px-5 py-2.5 min-[375px]:py-3 text-xs min-[375px]:text-sm font-medium text-[var(--color-text)] shadow-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md"
          >
            <Navigation className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 text-[#03C75A]" />
            네이버지도
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openKakaoMap}
            className="flex items-center gap-1.5 min-[375px]:gap-2 rounded-md border border-[var(--color-border)] bg-white px-4 min-[375px]:px-5 py-2.5 min-[375px]:py-3 text-xs min-[375px]:text-sm font-medium text-[var(--color-text)] shadow-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md"
          >
            <Navigation className="h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 text-[#FEE500]" />
            카카오맵
          </motion.button>
        </motion.div>

        <HorizontalDivider />

        {/* Transportation Info */}
        <motion.div variants={itemVariants} className="space-y-3 min-[375px]:space-y-4">
          {/* Subway */}
          <div className="group rounded-lg border border-[var(--color-border-light)] bg-white p-4 min-[375px]:p-5 transition-all hover:border-[var(--color-botanical)] hover:shadow-md">
            <div className="mb-2 min-[375px]:mb-3 flex items-center gap-2 min-[375px]:gap-3">
              <div className="flex h-8 w-8 min-[375px]:h-10 min-[375px]:w-10 items-center justify-center rounded-full bg-[var(--color-botanical-light)]">
                <Train className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-primary)]" />
              </div>
              <span className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">지하철</span>
            </div>
            <p className="text-xs min-[375px]:text-sm leading-relaxed text-[var(--color-text-light)]">{venue.subway}</p>
          </div>

          {/* Bus */}
          <div className="group rounded-lg border border-[var(--color-border-light)] bg-white p-4 min-[375px]:p-5 transition-all hover:border-[var(--color-botanical)] hover:shadow-md">
            <div className="mb-2 min-[375px]:mb-3 flex items-center gap-2 min-[375px]:gap-3">
              <div className="flex h-8 w-8 min-[375px]:h-10 min-[375px]:w-10 items-center justify-center rounded-full bg-[var(--color-botanical-light)]">
                <Bus className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-primary)]" />
              </div>
              <span className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">버스</span>
            </div>
            <p className="text-xs min-[375px]:text-sm leading-relaxed text-[var(--color-text-light)]">{venue.bus}</p>
          </div>

          {/* Parking */}
          <div className="group rounded-lg border border-[var(--color-border-light)] bg-white p-4 min-[375px]:p-5 transition-all hover:border-[var(--color-botanical)] hover:shadow-md">
            <div className="mb-2 min-[375px]:mb-3 flex items-center gap-2 min-[375px]:gap-3">
              <div className="flex h-8 w-8 min-[375px]:h-10 min-[375px]:w-10 items-center justify-center rounded-full bg-[var(--color-botanical-light)]">
                <Car className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-primary)]" />
              </div>
              <span className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">주차</span>
            </div>
            <p className="text-xs min-[375px]:text-sm leading-relaxed text-[var(--color-text-light)]">{venue.parking}</p>
          </div>
        </motion.div>

        {/* Shuttle Bus Info */}
        {shuttle.available && (
          <>
            <HorizontalDivider className="my-8 min-[375px]:my-10" />

            <motion.div variants={itemVariants}>
              <h3 className="mb-5 min-[375px]:mb-6 text-center font-serif text-lg min-[375px]:text-xl font-medium text-[var(--color-primary)]">
                셔틀버스 안내
              </h3>

              <div className="space-y-3 min-[375px]:space-y-4">
                {shuttle.routes.map((route, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white p-4 min-[375px]:p-5"
                  >
                    {/* Accent bar */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-light)]" />

                    <div className="mb-2 min-[375px]:mb-3 flex items-center gap-2 min-[375px]:gap-3">
                      <Bus className="h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 text-[var(--color-accent)]" />
                      <span className="text-sm min-[375px]:text-base font-medium text-[var(--color-text)]">{route.name}</span>
                    </div>

                    <div className="mb-2 min-[375px]:mb-3 flex items-start gap-1.5 min-[375px]:gap-2 text-xs min-[375px]:text-sm text-[var(--color-text)]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 min-[375px]:h-4 min-[375px]:w-4 flex-shrink-0 text-[var(--color-text-muted)]" />
                      <span>{route.departure}</span>
                    </div>

                    <div className="mb-2 min-[375px]:mb-3 flex flex-wrap gap-1.5 min-[375px]:gap-2">
                      {route.times.map((time, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 min-[375px]:gap-1.5 rounded-full bg-[var(--color-secondary)] px-2.5 min-[375px]:px-3 py-1 min-[375px]:py-1.5 text-[10px] min-[375px]:text-xs font-medium text-[var(--color-text)]"
                        >
                          <Clock className="h-2.5 w-2.5 min-[375px]:h-3 min-[375px]:w-3 text-[var(--color-accent)]" />
                          {time}
                        </span>
                      ))}
                    </div>

                    <p className="text-[10px] min-[375px]:text-xs text-[var(--color-text-muted)]">{route.duration}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </Section>
  );
}
