'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MinimalTypography,
  CountdownDDay,
  VerticalTimeline,
  CircleRing,
  FloralFrame,
  PolaroidStyle,
  SplitScreen,
  GlassMorphism,
  NeonGlow,
  VintageTypewriter,
  WatercolorWash,
  GeometricArt,
  ElegantScript,
  ModernGrid,
} from '@/components/calendar';

interface CalendarDesign {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  component: React.ComponentType<{ className?: string }>;
  bgClass?: string;
}

const calendarDesigns: CalendarDesign[] = [
  {
    id: 'minimal-typography',
    name: 'Minimal Typography',
    nameKo: '미니멀 타이포',
    description: 'Large date number with ultra-clean aesthetics',
    component: MinimalTypography,
  },
  {
    id: 'countdown-dday',
    name: 'Countdown D-Day',
    nameKo: 'D-Day 카운트다운',
    description: 'Real-time countdown with flip animation',
    component: CountdownDDay,
  },
  {
    id: 'vertical-timeline',
    name: 'Vertical Timeline',
    nameKo: '세로 타임라인',
    description: 'Elegant vertical timeline layout',
    component: VerticalTimeline,
  },
  {
    id: 'circle-ring',
    name: 'Circle Ring',
    nameKo: '원형 링',
    description: 'Circular ring with rotating text',
    component: CircleRing,
  },
  {
    id: 'floral-frame',
    name: 'Floral Frame',
    nameKo: '플로럴 프레임',
    description: 'Botanical decorative corner elements',
    component: FloralFrame,
  },
  {
    id: 'polaroid-style',
    name: 'Polaroid Style',
    nameKo: '폴라로이드',
    description: 'Instant photo card aesthetic',
    component: PolaroidStyle,
  },
  {
    id: 'split-screen',
    name: 'Split Screen',
    nameKo: '분할 화면',
    description: 'Dramatic date/time split layout',
    component: SplitScreen,
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    nameKo: '글래스모피즘',
    description: 'Frosted glass effect with blur',
    component: GlassMorphism,
    bgClass: 'bg-gradient-to-br from-rose-100 via-pink-50 to-teal-50',
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    nameKo: '네온 글로우',
    description: 'Soft glowing romantic night feel',
    component: NeonGlow,
  },
  {
    id: 'vintage-typewriter',
    name: 'Vintage Typewriter',
    nameKo: '빈티지 타자기',
    description: 'Retro typewriter wedding feel',
    component: VintageTypewriter,
  },
  {
    id: 'watercolor-wash',
    name: 'Watercolor Wash',
    nameKo: '수채화',
    description: 'Soft watercolor gradient background',
    component: WatercolorWash,
  },
  {
    id: 'geometric-art',
    name: 'Geometric Art',
    nameKo: '지오메트릭 아트',
    description: 'Bold geometric shapes composition',
    component: GeometricArt,
  },
  {
    id: 'elegant-script',
    name: 'Elegant Script',
    nameKo: '엘레강트 스크립트',
    description: 'Classic wedding invitation style',
    component: ElegantScript,
  },
  {
    id: 'modern-grid',
    name: 'Modern Grid',
    nameKo: '모던 그리드',
    description: 'Clean monthly calendar with highlight',
    component: ModernGrid,
  },
];

export default function CalendarDemoPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto text-center mb-12"
      >
        <h1
          className="text-3xl sm:text-4xl mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          Calendar Design Gallery
        </h1>
        <p
          className="text-sm sm:text-base max-w-2xl mx-auto"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          14가지 고유한 캘린더 디자인 중 마음에 드는 것을 선택하세요.
          <br />
          각 디자인을 클릭하면 선택됩니다.
        </p>

        {/* Selected indicator */}
        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span
                className="text-sm"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                선택됨: {calendarDesigns.find((d) => d.id === selectedId)?.nameKo}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Grid of calendar designs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {calendarDesigns.map((design, index) => {
          const Component = design.component;
          const isSelected = selectedId === design.id;

          return (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'ring-4 ring-[var(--color-primary)] shadow-xl scale-[1.02]'
                  : 'hover:shadow-lg hover:scale-[1.01]'
              }`}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-border-light)',
              }}
              onClick={() => setSelectedId(design.id)}
            >
              {/* Selection badge */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Design number badge */}
              <div
                className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-accent)',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Calendar Component Preview */}
              <div
                className={`relative min-h-[320px] overflow-hidden ${
                  design.bgClass || ''
                }`}
              >
                <Component />
              </div>

              {/* Info Footer */}
              <div
                className="p-4 border-t"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="text-base font-medium"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-text)',
                      }}
                    >
                      {design.nameKo}
                    </h3>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        fontFamily: 'var(--font-accent)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {design.name}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(design.id);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
                      isSelected
                        ? 'text-white'
                        : 'hover:bg-[var(--color-primary)] hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--color-primary)'
                        : 'transparent',
                      border: `1px solid var(--color-primary)`,
                      color: isSelected ? 'white' : 'var(--color-primary)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {isSelected ? '선택됨' : '선택'}
                  </button>
                </div>
                <p
                  className="text-xs mt-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text-light)',
                  }}
                >
                  {design.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto mt-12 text-center"
      >
        <p
          className="text-xs"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-muted)',
          }}
        >
          모든 디자인은 실시간 애니메이션과 반응형 레이아웃을 지원합니다.
        </p>
      </motion.div>
    </div>
  );
}
