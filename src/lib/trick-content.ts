// Developer-themed content transformations
// Converts WEDDING_INFO into various developer-friendly formats

import { WEDDING_INFO } from './constants';

// Git commit hash generator (fake but consistent)
function generateHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(7, '0').slice(0, 7);
}

// Timeline to Git Log format
export interface GitCommit {
  hash: string;
  message: string;
  date: string;
  emoji: string;
  isHead?: boolean;
}

export function toGitLog(): GitCommit[] {
  const timeline = WEDDING_INFO.timeline;

  return timeline.map((item, index) => ({
    hash: generateHash(item.date + item.title),
    message: `feat: ${item.title}`,
    date: item.date,
    emoji: getTimelineEmoji(item.icon),
    isHead: index === timeline.length - 1,
  })).reverse();
}

function getTimelineEmoji(icon: string): string {
  const emojiMap: Record<string, string> = {
    heart: '❤️',
    sparkles: '✨',
    calendar: '📅',
    party: '🎉',
    ring: '💍',
    home: '🏠',
  };
  return emojiMap[icon] || '📌';
}

// Wedding Info to YAML format
export function toYaml(): string {
  const { groom, bride, date, dateDisplay, venue } = WEDDING_INFO;

  return `# wedding.config.yaml
# Auto-generated configuration

wedding:
  version: "1.0.0"
  status: "FOREVER_COMMITTED"

couple:
  groom:
    name: "${groom.name}"
    english: "${groom.englishName}"
    github: "@${groom.englishName.toLowerCase()}"
  bride:
    name: "${bride.name}"
    english: "${bride.englishName}"
    github: "@${bride.englishName.toLowerCase()}"

event:
  date: "${date}"
  display:
    year: ${dateDisplay.year}
    month: ${dateDisplay.month}
    day: ${dateDisplay.day}
    dayOfWeek: "${dateDisplay.dayOfWeek}"
    time: "${dateDisplay.time}"

venue:
  name: "${venue.name}"
  hall: "${venue.hall}"
  address: "${venue.address}"
  coordinates:
    lat: ${venue.coordinates.lat}
    lng: ${venue.coordinates.lng}
  contact: "${venue.tel}"`;
}

// Wedding Info to JSON format (package.json style)
export function toPackageJson(): string {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;

  return JSON.stringify({
    name: "wedding-invitation",
    version: `${dateDisplay.year}.${dateDisplay.month}.${dateDisplay.day}`,
    description: `${groom.name} ♥ ${bride.name} 결혼합니다`,
    main: "matrimony.exe",
    scripts: {
      start: "flutter run wedding --release",
      build: "flutter build happiness",
      test: "flutter test love --coverage=100%",
      deploy: "vercel --prod"
    },
    authors: [
      { name: groom.name, role: "groom" },
      { name: bride.name, role: "bride" }
    ],
    location: {
      name: venue.name,
      hall: venue.hall,
      coordinates: [venue.coordinates.lat, venue.coordinates.lng]
    },
    keywords: ["wedding", "love", "happiness", "forever"],
    license: "LOVE-1.0"
  }, null, 2);
}

// Account info to code format
export function toTransferCode(): string {
  const { groom, bride } = WEDDING_INFO;

  return `// bank_transfer.ts
import { BankAPI } from '@/lib/bank';

interface TransferRequest {
  bank: string;
  account: string;
  holder: string;
  amount?: number;
}

// 신랑측 계좌
export const GROOM_ACCOUNTS: TransferRequest[] = [
  {
    bank: "${groom.account.bank}",
    account: "${groom.account.number}",
    holder: "${groom.account.holder}",
  },
  {
    bank: "${groom.fatherAccount.bank}",
    account: "${groom.fatherAccount.number}",
    holder: "${groom.fatherAccount.holder}",
  },
  {
    bank: "${groom.motherAccount.bank}",
    account: "${groom.motherAccount.number}",
    holder: "${groom.motherAccount.holder}",
  },
];

// 신부측 계좌
export const BRIDE_ACCOUNTS: TransferRequest[] = [
  {
    bank: "${bride.account.bank}",
    account: "${bride.account.number}",
    holder: "${bride.account.holder}",
  },
  {
    bank: "${bride.fatherAccount.bank}",
    account: "${bride.fatherAccount.number}",
    holder: "${bride.fatherAccount.holder}",
  },
  {
    bank: "${bride.motherAccount.bank}",
    account: "${bride.motherAccount.number}",
    holder: "${bride.motherAccount.holder}",
  },
];

export async function sendBlessings(
  to: TransferRequest,
  message: string = "축하합니다! 🎉"
): Promise<void> {
  await BankAPI.transfer({
    ...to,
    memo: message,
  });
  console.log(\`✨ Blessings sent to \${to.holder}!\`);
}`;
}

// Location to coordinates format
export function toCoordinates(): string {
  const { venue } = WEDDING_INFO;

  return `// location.config.ts
export const VENUE_COORDINATES = {
  name: "${venue.name}",
  hall: "${venue.hall}",

  // GPS Coordinates
  latitude: ${venue.coordinates.lat},
  longitude: ${venue.coordinates.lng},

  // Navigation URLs
  navigation: {
    naver: "${venue.navigation.naver}",
    kakao: "${venue.navigation.kakao}",
    tmap: "${venue.navigation.tmap}",
  },

  // Access Info
  subway: "${venue.subway.replace(/\n/g, '\\n')}",
  bus: "${venue.bus.replace(/\n/g, '\\n')}",
  parking: "${venue.parking.replace(/\n/g, '\\n')}",
} as const;

// Open in map app
export function openNavigation(app: 'naver' | 'kakao' | 'tmap') {
  window.open(VENUE_COORDINATES.navigation[app], '_blank');
}`;
}

// Boot sequence messages
export function getBootSequence(): string[] {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;

  return [
    `BIOS v${dateDisplay.year}.${String(dateDisplay.month).padStart(2, '0')}.${String(dateDisplay.day).padStart(2, '0')}`,
    '',
    '> Initializing MATRIMONY.EXE...',
    '> Loading happiness modules...',
    '> Compiling love.ts...',
    '> flutter pub add new_beginning...',
    '',
    'PROGRESS',
    '',
    `[✓] ${groom.name} ♥ ${bride.name}`,
    `[✓] ${dateDisplay.year}. ${String(dateDisplay.month).padStart(2, '0')}. ${String(dateDisplay.day).padStart(2, '0')} (${dateDisplay.dayOfWeek})`,
    `[✓] ${dateDisplay.time}`,
    `[✓] ${venue.name}`,
    '',
    '→ STATUS: FOREVER_COMMITTED',
    '',
    '> 새로운 시작을 함께 해주세요 💙',
  ];
}

// Glitch theme colors
export const GLITCH_COLORS = {
  background: '#0a0a0a',
  primary: '#00ff41',      // Matrix Green
  secondary: '#ff0080',    // Magenta
  tertiary: '#00d4ff',     // Cyan
  accent: '#ffff00',       // Yellow
  text: '#00ff41',
  textDim: 'rgba(0, 255, 65, 0.6)',
  scanline: 'rgba(0, 255, 65, 0.03)',
} as const;

// 3D theme colors
export const THEME_3D_COLORS = {
  background: '#1a1a2e',
  primary: '#16213e',
  secondary: '#0f3460',
  accent: '#e94560',
  glow: '#00d4ff',
  text: '#ffffff',
} as const;
