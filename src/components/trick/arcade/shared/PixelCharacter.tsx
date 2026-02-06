'use client';

import { motion } from 'framer-motion';

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

// 16x20 pixel grids
// Groom: formal suit, short hair, standing pose
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

// Bride: dress, longer hair, flowers
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

// Mini versions (8x10) for dialog portraits and map
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
  className?: string;
  flipX?: boolean;
}

function getSpriteData(character: CharacterType, size: SpriteSize) {
  if (size === 'mini') {
    return character === 'groom' ? GROOM_MINI : BRIDE_MINI;
  }
  return character === 'groom' ? GROOM_SPRITE : BRIDE_SPRITE;
}

export function PixelCharacter({
  character,
  size = 'full',
  scale = 3,
  animate = false,
  className = '',
  flipX = false,
}: PixelCharacterProps) {
  const sprite = getSpriteData(character, size);
  const colors = COLOR_MAPS[character];
  const rows = sprite.length;
  const cols = sprite[0].length;
  const pixelSize = scale;

  const width = cols * pixelSize;
  const height = rows * pixelSize;

  // Generate box-shadow string for the entire sprite
  const shadows: string[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const colorIdx = sprite[y][x] as keyof typeof colors;
      if (colorIdx === 0) continue;
      const color = colors[colorIdx];
      if (!color) continue;
      const px = (x + 1) * pixelSize;
      const py = (y + 1) * pixelSize;
      shadows.push(`${px}px ${py}px 0 ${color}`);
    }
  }

  const content = (
    <div
      className={className}
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

  if (!animate) return content;

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-block' }}
    >
      {content}
    </motion.div>
  );
}

// Walking animation variant - alternates between two frames
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
