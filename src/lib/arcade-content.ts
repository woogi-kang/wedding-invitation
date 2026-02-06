// Retro RPG arcade content derived from WEDDING_INFO
// Transforms wedding data into RPG-themed game content

import { WEDDING_INFO } from './constants';

// Re-export the color palette for convenience
export const ARCADE_COLORS = {
  bg: '#0f0f23',
  bgLight: '#1a1a3e',
  text: '#ffffff',
  gold: '#ffcc00',
  pink: '#ff6b9d',
  green: '#00ff41',
  blue: '#4a9eff',
  red: '#ff4444',
  gray: '#8b8b8b',
  darkGray: '#333333',
} as const;

// ---------------------------------------------------------------------------
// Character Stats
// ---------------------------------------------------------------------------

export interface CharacterStat {
  name: string;
  value: number;
  max: number;
}

export interface GameCharacter {
  name: string;
  englishName: string;
  className: string;
  level: number;
  title: string;
  hp: { current: number; max: number };
  mp: { current: number; max: number };
  exp: { current: number; max: number };
  stats: CharacterStat[];
  special: string;
  specialDescription: string;
}

export function getCharacterStats(): { groom: GameCharacter; bride: GameCharacter } {
  const { groom, bride } = WEDDING_INFO;

  return {
    groom: {
      name: groom.name,
      englishName: groom.englishName,
      className: 'Developer',
      level: 99,
      title: 'Code Knight',
      hp: { current: 999, max: 999 },
      mp: { current: 450, max: 450 },
      exp: { current: 88, max: 100 },
      stats: [
        { name: 'STR', value: 85, max: 99 },  // Diligence
        { name: 'INT', value: 95, max: 99 },  // Coding prowess
        { name: 'WIS', value: 78, max: 99 },  // Cooking skill
        { name: 'CHA', value: 82, max: 99 },  // Humor
        { name: 'DEX', value: 70, max: 99 },  // Keyboard speed
        { name: 'LUK', value: 99, max: 99 },  // Met soulmate
      ],
      special: 'Debugging Love',
      specialDescription: 'Resolves any conflict with patience and logic',
    },
    bride: {
      name: bride.name,
      englishName: bride.englishName,
      className: 'Healer',
      level: 99,
      title: 'Heart Mage',
      hp: { current: 999, max: 999 },
      mp: { current: 550, max: 550 },
      exp: { current: 88, max: 100 },
      stats: [
        { name: 'STR', value: 80, max: 99 },  // Determination
        { name: 'INT', value: 90, max: 99 },  // Wisdom
        { name: 'WIS', value: 92, max: 99 },  // Emotional intelligence
        { name: 'CHA', value: 95, max: 99 },  // Warmth
        { name: 'DEX', value: 88, max: 99 },  // Multitasking
        { name: 'LUK', value: 99, max: 99 },  // Met soulmate
      ],
      special: 'Warm Embrace',
      specialDescription: 'Heals all wounds with boundless warmth and kindness',
    },
  };
}

// ---------------------------------------------------------------------------
// Dialog Script
// ---------------------------------------------------------------------------

export interface DialogLine {
  speaker: string;
  text: string;
}

// ---------------------------------------------------------------------------
// Stage Data
// ---------------------------------------------------------------------------

export interface StageData {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  icon: string;
  dialog: DialogLine[];
}

export function getStageData(): StageData[] {
  const { groom, bride, timeline } = WEDDING_INFO;

  const stageDialogs: DialogLine[][] = [
    // Stage 1: First Meeting
    [
      { speaker: '???', text: 'A mysterious encounter...' },
      { speaker: groom.name, text: '...!' },
      { speaker: bride.name, text: '...!' },
      { speaker: 'SYSTEM', text: `${groom.name}(와)과 ${bride.name} 사이에\n특별한 인연이 시작되었다!` },
      { speaker: 'SYSTEM', text: 'New quest unlocked:\n"Together Forever"' },
    ],
    // Stage 2: 1st Anniversary
    [
      { speaker: groom.name, text: '벌써 1년이라니...\n정말 빠르다.' },
      { speaker: bride.name, text: '앞으로도 매일매일이\n이렇게 행복했으면.' },
      { speaker: 'SYSTEM', text: 'BOND LEVEL UP!\nLv.1 -> Lv.50' },
      { speaker: 'SYSTEM', text: `${groom.name}(은)는 "Cooking" 스킬을 배웠다!` },
    ],
    // Stage 3: 2nd Anniversary
    [
      { speaker: bride.name, text: '우리가 함께한 시간이\n벌써 2년이나 됐네.' },
      { speaker: groom.name, text: '매일 새로운 걸 발견해.\n당신이라는 사람 안에서.' },
      { speaker: 'SYSTEM', text: 'BOND LEVEL UP!\nLv.50 -> Lv.90' },
      { speaker: 'SYSTEM', text: 'Hidden stat revealed:\n"Trust" MAX!' },
    ],
    // Stage 4: Wedding
    [
      { speaker: groom.name, text: '드디어 이 날이 왔어.\n영원을 약속하는 날.' },
      { speaker: bride.name, text: '긴장되지만...\n너무 행복해.' },
      { speaker: 'SYSTEM', text: `FINAL STAGE CLEAR!\n${groom.name} & ${bride.name}\nFOREVER COMMITTED!` },
    ],
  ];

  return timeline.map((item, index) => ({
    id: index + 1,
    title: item.title,
    subtitle: item.description,
    date: item.date,
    icon: item.icon,
    dialog: stageDialogs[index] || [],
  }));
}

// ---------------------------------------------------------------------------
// Boss Data
// ---------------------------------------------------------------------------

export interface BossAttack {
  name: string;
  damage: number;
  description: string;
}

export interface BossData {
  name: string;
  title: string;
  hp: { current: number; max: number };
  attacks: BossAttack[];
  defeatDialog: DialogLine[];
  victoryReward: string;
}

export function getBossData(): BossData {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;

  return {
    name: 'WEDDING DAY',
    title: 'The Final Challenge',
    hp: { current: 9999, max: 9999 },
    attacks: [
      {
        name: 'Schedule Chaos',
        damage: 150,
        description: 'A whirlwind of preparations!',
      },
      {
        name: 'Budget Crunch',
        damage: 200,
        description: 'The numbers keep growing!',
      },
      {
        name: 'Guest List Overflow',
        damage: 100,
        description: 'Too many people to invite!',
      },
    ],
    defeatDialog: [
      { speaker: 'SYSTEM', text: 'BOSS DEFEATED!' },
      {
        speaker: 'SYSTEM',
        text: `${dateDisplay.year}. ${String(dateDisplay.month).padStart(2, '0')}. ${String(dateDisplay.day).padStart(2, '0')} (${dateDisplay.dayOfWeek})\n${dateDisplay.time}`,
      },
      {
        speaker: 'SYSTEM',
        text: `${venue.name}\n${venue.hall}`,
      },
      {
        speaker: groom.name,
        text: '함께 해주셔서 감사합니다.',
      },
      {
        speaker: bride.name,
        text: '여러분의 축복이\n큰 힘이 됩니다.',
      },
      {
        speaker: 'SYSTEM',
        text: `${groom.name} & ${bride.name}\nTHANK YOU FOR PLAYING!`,
      },
    ],
    victoryReward: 'Eternal Happiness Ring',
  };
}

// ---------------------------------------------------------------------------
// Post-Game Village Data
// ---------------------------------------------------------------------------

export interface VillageNPC {
  name: string;
  dialog: DialogLine[];
}

export interface VillageShop {
  name: string;
  items: { name: string; description: string; price: string }[];
}

export interface PostGameData {
  villageName: string;
  description: string;
  npcs: VillageNPC[];
  shop: VillageShop;
  weddingInfo: {
    date: string;
    time: string;
    venue: string;
    hall: string;
    address: string;
    subway: string;
    parking: string;
  };
}

export function getPostGameData(): PostGameData {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;

  return {
    villageName: 'SKY GARDEN VILLAGE',
    description: 'A peaceful place atop the clouds where love stories come true.',
    npcs: [
      {
        name: 'Elder of Blessings',
        dialog: [
          {
            speaker: 'Elder',
            text: `${groom.name}(와)과 ${bride.name}의\n결혼을 진심으로 축하합니다!`,
          },
          {
            speaker: 'Elder',
            text: '두 사람의 앞날에\n행복만 가득하길 빕니다.',
          },
        ],
      },
      {
        name: 'Travel Guide',
        dialog: [
          {
            speaker: 'Guide',
            text: `웨딩홀은 ${venue.name}\n${venue.hall}에 있답니다.`,
          },
          {
            speaker: 'Guide',
            text: `주소: ${venue.address}`,
          },
          {
            speaker: 'Guide',
            text: `지하철: ${venue.subway.split('\n')[0]}`,
          },
        ],
      },
    ],
    shop: {
      name: 'Blessing Shop',
      items: [
        {
          name: 'Flower Bouquet',
          description: 'A beautiful bouquet of congratulations',
          price: 'FREE',
        },
        {
          name: 'Happiness Potion',
          description: 'Grants eternal joy to the couple',
          price: 'FREE',
        },
        {
          name: 'Memory Crystal',
          description: 'Preserves this special day forever',
          price: 'FREE',
        },
      ],
    },
    weddingInfo: {
      date: `${dateDisplay.year}. ${String(dateDisplay.month).padStart(2, '0')}. ${String(dateDisplay.day).padStart(2, '0')} (${dateDisplay.dayOfWeek})`,
      time: dateDisplay.time,
      venue: venue.name,
      hall: venue.hall,
      address: venue.address,
      subway: venue.subway,
      parking: venue.parking,
    },
  };
}
