'use client';

import { motion } from 'framer-motion';
import { PixelButton, PixelCharacter, ARCADE_COLORS } from './shared';
import { WEDDING_INFO } from '@/lib/constants';

interface EndingSequenceProps {
  onComplete: () => void;
}

const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${6 + (i * 91) % 88}%`,
  top: `${8 + (i * 37) % 72}%`,
  size: 2 + (i % 4),
  delay: (i % 6) * 0.25,
  duration: 1.8 + (i % 5) * 0.35,
}));

const PETALS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${12 + i * 8}%`,
  drift: ((i % 5) - 2) * 14,
  delay: i * 0.18,
  duration: 3 + (i % 4) * 0.4,
}));

export function EndingSequence({ onComplete }: EndingSequenceProps) {
  const handleViewInvitation = () => {
    window.location.assign('/invitation#location');
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,218,164,0.12) 0%, transparent 28%), linear-gradient(180deg, #12091a 0%, #26111f 42%, #130912 100%)',
      }}
    >
      {SPARKLES.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            background: sparkle.id % 3 === 0 ? ARCADE_COLORS.gold : sparkle.id % 3 === 1 ? ARCADE_COLORS.pink : '#fff4dd',
            boxShadow: `0 0 ${sparkle.size * 4}px rgba(255,228,196,0.4)`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: sparkle.duration, delay: sparkle.delay, repeat: Infinity }}
        />
      ))}

      {PETALS.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: petal.left,
            top: '-4%',
            width: 4,
            height: 3,
            background: petal.id % 2 === 0 ? 'rgba(255,183,197,0.88)' : 'rgba(255,239,219,0.82)',
          }}
          animate={{
            x: [0, petal.drift, petal.drift * 0.4, 0],
            y: ['0vh', '36vh', '74vh'],
            rotate: [0, 28, -18, 8],
            opacity: [0, 1, 0.2],
          }}
          transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full overflow-hidden"
          style={{
            background: 'rgba(8, 6, 14, 0.82)',
            border: `3px solid ${ARCADE_COLORS.gold}`,
            boxShadow: '0 0 24px rgba(255,204,0,0.16), inset 0 0 0 2px rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="px-5 py-3 text-center"
            style={{
              background: 'linear-gradient(90deg, rgba(255,204,0,0.16) 0%, rgba(255,107,157,0.14) 100%)',
              borderBottom: `2px solid ${ARCADE_COLORS.gold}`,
            }}
          >
            <p
              className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[11px]"
              style={{ color: ARCADE_COLORS.gray }}
            >
              FINAL QUEST UPDATE
            </p>
            <h1
              className="mt-2 font-['Press_Start_2P',monospace] text-[22px] leading-[1.5] sm:text-[34px]"
              style={{
                color: ARCADE_COLORS.gold,
                textShadow: '0 0 12px rgba(255,204,0,0.5)',
              }}
            >
              TO BE
              <br />
              CONTINUED
            </h1>
          </div>

          <div className="px-5 py-6 sm:px-7">
            <div className="flex items-end justify-center gap-3">
              <PixelCharacter character="groom" size="full" scale={4} emotion="love" />
              <motion.span
                className="font-['Press_Start_2P',monospace] text-[20px] sm:text-[28px]"
                style={{ color: ARCADE_COLORS.pink }}
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                ♥
              </motion.span>
              <PixelCharacter character="bride" size="full" scale={4} emotion="love" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div
                className="px-4 py-3"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${ARCADE_COLORS.gray}50`,
                }}
              >
                <p
                  className="font-['Press_Start_2P',monospace] text-[10px]"
                  style={{ color: ARCADE_COLORS.gray }}
                >
                  NEXT CHAPTER
                </p>
                <p className="mt-2 text-[15px] sm:text-[16px]" style={{ color: ARCADE_COLORS.text }}>
                  {WEDDING_INFO.dateDisplay.year}.{String(WEDDING_INFO.dateDisplay.month).padStart(2, '0')}.{String(WEDDING_INFO.dateDisplay.day).padStart(2, '0')} {WEDDING_INFO.dateDisplay.time}
                </p>
                <p className="mt-1 text-[14px] leading-[1.6]" style={{ color: ARCADE_COLORS.gray }}>
                  이제 이야기는 화면 밖,
                  <br />
                  실제 예식에서 이어집니다.
                </p>
              </div>

              <div
                className="px-4 py-3"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${ARCADE_COLORS.gray}50`,
                }}
              >
                <p
                  className="font-['Press_Start_2P',monospace] text-[10px]"
                  style={{ color: ARCADE_COLORS.gray }}
                >
                  LOCATION
                </p>
                <p className="mt-2 text-[15px] sm:text-[16px]" style={{ color: ARCADE_COLORS.text }}>
                  {WEDDING_INFO.venue.name}
                </p>
                <p className="mt-1 text-[14px] leading-[1.6]" style={{ color: ARCADE_COLORS.gray }}>
                  {WEDDING_INFO.venue.hall}
                  <br />
                  {WEDDING_INFO.venue.address}
                </p>
              </div>
            </div>

            <p
              className="mt-6 text-center font-['Press_Start_2P',monospace] text-[10px] leading-[1.8] sm:text-[11px]"
              style={{ color: ARCADE_COLORS.gray }}
            >
              PRESS START IN REAL LIFE
            </p>

            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PixelButton onClick={handleViewInvitation}>
                예식 정보 보기
              </PixelButton>
              <PixelButton variant="secondary" onClick={onComplete}>
                숨겨진 에필로그
              </PixelButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
