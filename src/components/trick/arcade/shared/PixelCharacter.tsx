'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

// 감정 타입 - 캐릭터 리액션 시스템
export type EmotionType = 'idle' | 'happy' | 'surprised' | 'nervous' | 'love';

// Each character is a grid of color codes
// 0=transparent, 1=skin, 2=hair, 3=outfit, 4=accent, 5=white, 6=shoes, 7=blush
const COLOR_MAPS = {
  groom: {
    0: 'transparent',
    1: '#FFD5B8', // skin
    2: '#2C1810', // dark brown hair
    3: '#1B3A5C', // navy suit
    4: '#C9A43C', // gold tie/accent
    5: '#FFFFFF', // white shirt
    6: '#1A1A1A', // black shoes
    7: '#FF9B9B', // blush
    8: '#3D2317', // hair highlight
  },
  bride: {
    0: 'transparent',
    1: '#FFD5B8', // skin
    2: '#3D2317', // dark brown hair
    3: '#F5F0FF', // white dress
    4: '#FFB6C1', // pink accent/flowers
    5: '#FFFFFF', // veil/white
    6: '#E8C4FF', // light purple shoes
    7: '#FF9B9B', // blush
    8: '#5C3D2E', // hair shadow
  },
} as const;

// --- Front-facing sprites (16x20) ---

const GROOM_SPRITE: number[][] = [
  [0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0],
  [0,0,0,0,2,2,8,2,2,2,2,0,0,0,0,0],
  [0,0,0,2,2,8,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,2,1,1,1,1,1,1,1,2,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,0,1,1,1,1,0,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,7,1,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,4,4,4,1,0,0,0,0,0,0],
  [0,0,0,0,3,5,4,4,4,5,3,0,0,0,0,0],
  [0,0,0,3,3,5,3,4,3,5,3,3,0,0,0,0],
  [0,0,3,3,3,5,3,4,3,5,3,3,3,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,0,3,1,3,3,3,3,3,3,3,1,3,0,0,0],
  [0,0,0,1,3,3,3,3,3,3,3,1,0,0,0,0],
  [0,0,0,1,0,3,3,3,3,3,0,1,0,0,0,0],
  [0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0],
  [0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0],
  [0,0,0,0,0,6,6,0,6,6,0,0,0,0,0,0],
  [0,0,0,0,6,6,6,0,6,6,6,0,0,0,0,0],
];

const BRIDE_SPRITE: number[][] = [
  [0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,0],
  [0,0,0,0,5,5,5,4,5,5,5,0,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
  [0,0,2,2,1,1,1,1,1,1,1,2,2,0,0,0],
  [0,0,2,1,1,1,1,1,1,1,1,1,2,0,0,0],
  [0,0,2,1,0,1,1,1,1,0,1,1,2,0,0,0],
  [0,0,2,1,1,1,7,1,7,1,1,1,2,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0],
  [0,0,0,0,3,3,4,3,4,3,3,0,0,0,0,0],
  [0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
  [0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,6,6,0,6,6,0,0,0,0,0,0],
];

// --- Back-facing sprites (16x20) - 포켓몬 배틀용 ---

const GROOM_BACK_SPRITE: number[][] = [
  [0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,3,5,3,3,3,5,3,0,0,0,0,0],
  [0,0,0,3,3,5,3,3,3,5,3,3,0,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,0,3,1,3,3,3,3,3,3,3,1,3,0,0,0],
  [0,0,0,1,3,3,3,3,3,3,3,1,0,0,0,0],
  [0,0,0,1,0,3,3,3,3,3,0,1,0,0,0,0],
  [0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0],
  [0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0],
  [0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0],
  [0,0,0,0,0,6,6,0,6,6,0,0,0,0,0,0],
  [0,0,0,0,6,6,6,0,6,6,6,0,0,0,0,0],
];

const BRIDE_BACK_SPRITE: number[][] = [
  [0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,0],
  [0,0,0,0,5,5,5,5,5,5,5,0,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
  [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
  [0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,3,3,3,4,3,4,3,3,3,0,0,0,0],
  [0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
  [0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
  [0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0],
  [0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,6,6,0,6,6,0,0,0,0,0,0],
];

// --- Mini versions (8x10) ---

const GROOM_MINI: number[][] = [
  [0,0,2,2,2,2,0,0],
  [0,2,2,2,2,2,2,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,1,1,0,1,0],
  [0,1,1,7,1,1,1,0],
  [0,0,5,4,4,5,0,0],
  [0,3,5,3,3,5,3,0],
  [0,3,3,3,3,3,3,0],
  [0,3,1,3,3,1,3,0],
  [0,0,6,6,6,6,0,0],
];

const BRIDE_MINI: number[][] = [
  [0,0,5,4,5,5,0,0],
  [0,2,2,2,2,2,2,0],
  [2,2,1,1,1,1,2,2],
  [2,1,0,1,1,0,1,2],
  [0,1,1,7,7,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,3,3,3,3,0,0],
  [0,3,3,4,4,3,3,0],
  [3,3,3,3,3,3,3,3],
  [0,0,0,6,6,0,0,0],
];

type CharacterType = 'groom' | 'bride';
type SpriteSize = 'mini' | 'full';

interface PixelCharacterProps {
  character: CharacterType;
  size?: SpriteSize;
  scale?: number;
  animate?: boolean;
  emotion?: EmotionType;
  facing?: 'front' | 'back';
  className?: string;
  flipX?: boolean;
}

// 감정별 애니메이션 설정
const EMOTION_ANIMATIONS: Record<EmotionType, {
  animate: Record<string, number[]>;
  transition: Record<string, unknown>;
} | null> = {
  idle: null,
  happy: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 0.5, repeat: 2, ease: 'easeOut' },
  },
  surprised: {
    animate: { y: [0, -12, 0], scale: [1, 1.1, 1] },
    transition: { duration: 0.4, repeat: 1, ease: 'easeOut' },
  },
  nervous: {
    animate: { x: [-1, 1, -1, 1, 0] },
    transition: { duration: 0.3, repeat: Infinity, ease: 'linear' },
  },
  love: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },
};

// 하트 파티클 (love 감정용)
function HeartParticles({ scale }: { scale: number }) {
  const hearts = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: (i - 1.5) * scale * 3,
      delay: i * 0.3,
      size: Math.max(8, scale * 3),
    })),
    [scale],
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: -scale * 4,
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        width: scale * 16,
        height: scale * 10,
      }}
    >
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            marginLeft: h.x,
            fontSize: h.size,
            color: '#ff6b9d',
          }}
          animate={{
            y: [0, -scale * 8, -scale * 14],
            opacity: [1, 0.8, 0],
            scale: [0.5, 1, 0.6],
          }}
          transition={{
            duration: 1.2,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          {'♥'}
        </motion.span>
      ))}
    </div>
  );
}

function getSpriteData(
  character: CharacterType,
  size: SpriteSize,
  facing: 'front' | 'back' = 'front',
) {
  if (size === 'mini') {
    // mini는 앞모습만 지원
    return character === 'groom' ? GROOM_MINI : BRIDE_MINI;
  }
  if (facing === 'back') {
    return character === 'groom' ? GROOM_BACK_SPRITE : BRIDE_BACK_SPRITE;
  }
  return character === 'groom' ? GROOM_SPRITE : BRIDE_SPRITE;
}

export function PixelCharacter({
  character,
  size = 'full',
  scale = 3,
  animate = false,
  emotion,
  facing = 'front',
  className = '',
  flipX = false,
}: PixelCharacterProps) {
  const sprite = getSpriteData(character, size, facing);
  const colors = COLOR_MAPS[character];
  const rows = sprite.length;
  const cols = sprite[0].length;
  const pixelSize = scale;

  const width = cols * pixelSize;
  const height = rows * pixelSize;

  const shadows = useMemo(() => {
    const result: string[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const colorIdx = sprite[y][x] as keyof typeof colors;
        if (colorIdx === 0) continue;
        const color = colors[colorIdx];
        if (!color) continue;
        const px = (x + 1) * pixelSize;
        const py = (y + 1) * pixelSize;
        result.push(`${px}px ${py}px 0 ${color}`);
      }
    }
    return result;
  }, [sprite, colors, rows, cols, pixelSize]);

  const spriteElement = (
    <div
      style={{
        width: `${width + pixelSize}px`,
        height: `${height + pixelSize}px`,
        position: 'relative',
        imageRendering: 'pixelated',
        transform: flipX ? 'scaleX(-1)' : undefined,
      }}
    >
      <div
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          boxShadow: shadows.join(','),
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );

  // emotion이 설정된 경우 감정 애니메이션 적용
  const emotionConfig = emotion ? EMOTION_ANIMATIONS[emotion] : null;
  const shouldAnimate = emotion ? !!emotionConfig : animate;

  if (!shouldAnimate && emotion !== 'love') {
    return (
      <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
        {spriteElement}
      </div>
    );
  }

  // love 감정: 하트 파티클 + 부드러운 바운스
  if (emotion === 'love') {
    const loveConfig = EMOTION_ANIMATIONS.love!;
    return (
      <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
        <HeartParticles scale={scale} />
        <motion.div
          animate={loveConfig.animate}
          transition={loveConfig.transition}
        >
          {spriteElement}
        </motion.div>
      </div>
    );
  }

  // emotion 애니메이션
  if (emotionConfig) {
    return (
      <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
        <motion.div
          animate={emotionConfig.animate}
          transition={emotionConfig.transition}
        >
          {spriteElement}
        </motion.div>
      </div>
    );
  }

  // 기존 animate prop (하위 호환)
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {spriteElement}
    </motion.div>
  );
}

// Walking animation variant
export function PixelCharacterWalking({
  character,
  scale = 2,
  className = '',
  direction = 'down',
}: {
  character: CharacterType;
  scale?: number;
  className?: string;
  direction?: 'down' | 'right' | 'left';
}) {
  return (
    <motion.div
      animate={{ y: [0, -2, 0, -2, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
      className={className}
      style={{ display: 'inline-block' }}
    >
      <PixelCharacter
        character={character}
        size="mini"
        scale={scale}
        flipX={direction === 'left'}
      />
    </motion.div>
  );
}
