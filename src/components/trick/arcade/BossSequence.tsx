'use client';

import { useState, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelCharacter, ARCADE_COLORS } from './shared';
import { WEDDING_INFO } from '@/lib/constants';

// --- Types ---

interface EliteFourAttack {
  name: string;
  damage: number;
  description: string;
  effect?: 'dot' | 'debuff' | 'split' | 'stun';
}

interface EliteFourAction {
  label: string;
  key: string;
  color: string;
  character: 'groom' | 'bride' | 'both';
  mpCost: number;
  minDamage: number;
  maxDamage: number;
  heal: number;
  description: string;
}

interface EliteFourBoss {
  id: number;
  name: string;
  title: string;
  level: number;
  hp: number;
  attacks: EliteFourAttack[];
  playerActions: EliteFourAction[];
  escapeMessages: string[];
  introDialog: { speaker: string; text: string }[];
  defeatDialog: { speaker: string; text: string }[];
}

interface ChampionPhase {
  id: number;
  title: string;
  dialog: { speaker: string; text: string }[];
  choices?: { prompt: string; options: string[] };
}

interface ChampionData {
  phases: ChampionPhase[];
  victoryDialog: { speaker: string; text: string }[];
}

// --- Hardcoded Data ---

const ELITE_FOUR: EliteFourBoss[] = [
  {
    id: 1,
    name: '예산의 벽',
    title: '사천왕 1',
    level: 85,
    hp: 6000,
    attacks: [
      { name: '스드메 견적서', damage: 1200, description: '스튜디오+드레스+메이크업\n추가 300만원!' },
      { name: '식장 계약금', damage: 800, description: '토요일 오후는 할증입니다 ^^' },
      { name: '혼수 폭탄', damage: 1500, description: '가전? 가구? 이사? 인테리어?' },
      { name: '숨은 비용 출현', damage: 600, description: '사회자, 축가, 답례품, 인쇄비...' },
    ],
    playerActions: [
      { label: '엑셀 정리', key: 'ACTION1', color: '#4a9eff', character: 'groom', mpCost: 0, minDamage: 1400, maxDamage: 1800, heal: 0, description: '지출 항목을 체계적으로 정리했다!' },
      { label: '비교 견적', key: 'ACTION2', color: '#ff6b9d', character: 'bride', mpCost: 20, minDamage: 1800, maxDamage: 2200, heal: 0, description: '3곳 이상 비교 견적을 받았다!' },
      { label: '지원금', key: 'HEAL', color: '#00ff41', character: 'both', mpCost: 0, minDamage: 0, maxDamage: 0, heal: 1500, description: '감사합니다...' },
      { label: '가성비 최적화', key: 'COMBINE', color: '#ffcc00', character: 'both', mpCost: 40, minDamage: 3500, maxDamage: 4500, heal: 500, description: '둘이서 밤새 엑셀 돌렸다!' },
    ],
    escapeMessages: ['축의금으로 충당하면 되지 않을까...?', '도망쳐봤자 청구서는 따라온다', '이미 계약금 냈잖아!'],
    introDialog: [
      { speaker: 'SYSTEM', text: '사천왕 제1관문!' },
      { speaker: 'SYSTEM', text: '"예산의 벽" Lv.85 가 나타났다!' },
      { speaker: '예산의 벽', text: '결혼 예산이 얼마인지 알고 있나?' },
    ],
    defeatDialog: [
      { speaker: '강태욱', text: '...생각보다 돈이 많이 든다' },
      { speaker: '김선경', text: '그래도 우리가 진짜 중요한 건\n알잖아' },
      { speaker: '강태욱', text: '그치. 비싼 게 좋은 게 아니라\n우리다운 게 좋은 거지' },
      { speaker: 'SYSTEM', text: '커플 BOND +10!\nHP/MP 소량 회복!' },
    ],
  },
  {
    id: 2,
    name: '양가 어른들',
    title: '사천왕 2',
    level: 88,
    hp: 7000,
    attacks: [
      { name: '하객 명단 전쟁', damage: 1000, description: '이 사람은 꼭 불러야 해!' },
      { name: '상견례 긴장감', damage: 800, description: '어색한 침묵이 흐른다...' },
      { name: '예단 예물 논쟁', damage: 1200, description: '우리 때는 말이야...' },
      { name: '일정 충돌', damage: 600, description: '그 날은 좀 곤란한데...' },
    ],
    playerActions: [
      { label: '차분한 설득', key: 'ACTION1', color: '#ff6b9d', character: 'bride', mpCost: 0, minDamage: 1600, maxDamage: 2000, heal: 0, description: '부드럽지만 단호하게\n의견을 전달했다' },
      { label: '양보와 조율', key: 'ACTION2', color: '#4a9eff', character: 'groom', mpCost: 15, minDamage: 1300, maxDamage: 1700, heal: 0, description: '이건 이쪽, 저건 저쪽\n의견을 따르자' },
      { label: '식사 자리', key: 'HEAL', color: '#00ff41', character: 'both', mpCost: 0, minDamage: 0, maxDamage: 0, heal: 1200, description: '밥 먹으면서 이야기하니\n분위기가 좋아졌다' },
      { label: '우리가 결정', key: 'COMBINE', color: '#ffcc00', character: 'both', mpCost: 50, minDamage: 4500, maxDamage: 5500, heal: 0, description: '어른들의 의견을 존중하되\n최종 결정은 우리가' },
    ],
    escapeMessages: ['하객 200명이 대기 중입니다', '어머니가 부르신다...', '카톡 읽씹은 안 됩니다'],
    introDialog: [
      { speaker: 'SYSTEM', text: '사천왕 제2관문!' },
      { speaker: 'SYSTEM', text: '"양가 어른들" Lv.88 이 나타났다!' },
      { speaker: '양가 어른들', text: '하객은 몇 명이야?' },
    ],
    defeatDialog: [
      { speaker: '김선경', text: '우리 부모님들 다 좋은 분들이야\n다 우리 걱정이셔서 그런 거잖아' },
      { speaker: '강태욱', text: '맞아. 감사한 거지 사실' },
      { speaker: '김선경', text: '근데 하객 200명은 좀... ㅋㅋ' },
      { speaker: '강태욱', text: 'ㅋㅋㅋㅋ' },
      { speaker: 'SYSTEM', text: '커플 BOND +15!' },
    ],
  },
  {
    id: 3,
    name: '디테일 지옥',
    title: '사천왕 3',
    level: 92,
    hp: 8000,
    attacks: [
      { name: '선택의 연속', damage: 900, description: '뷔페 vs 한식?\n포토부스 필요?\n답례품 뭘로?' },
      { name: '시안 수정 요청', damage: 1000, description: '청첩장 시안 3차 수정 요청입니다' },
      { name: '좌석 배치 퍼즐', damage: 800, description: '이 테이블과 저 테이블은\n절대 옆에 두면 안 됩니다' },
      { name: 'D-100 카운트다운', damage: 500, description: '남은 시간이 줄어들고 있다!' },
    ],
    playerActions: [
      { label: '투두 정리', key: 'ACTION1', color: '#4a9eff', character: 'groom', mpCost: 0, minDamage: 1800, maxDamage: 2200, heal: 0, description: '개발자답게 Notion에 정리했다' },
      { label: '센스 결정', key: 'ACTION2', color: '#ff6b9d', character: 'bride', mpCost: 20, minDamage: 2200, maxDamage: 2800, heal: 0, description: '직감이 말한다. 이거다!' },
      { label: '플래너 도움', key: 'HEAL', color: '#00ff41', character: 'both', mpCost: 0, minDamage: 0, maxDamage: 0, heal: 2000, description: '전문가의 조언은 역시 다르다' },
      { label: '야근 준비', key: 'COMBINE', color: '#ffcc00', character: 'both', mpCost: 45, minDamage: 5500, maxDamage: 6500, heal: 0, description: '카페에서 밤 12시까지\n함께 정리했다' },
    ],
    escapeMessages: ['체크리스트가 쫓아온다!', '결정을 미루면 더 복잡해진다', '이미 D-100이야!'],
    introDialog: [
      { speaker: 'SYSTEM', text: '사천왕 제3관문!' },
      { speaker: 'SYSTEM', text: '"디테일 지옥" Lv.92 이 나타났다!' },
      { speaker: '디테일 지옥', text: '아직 정할 게 147개 남았는데?' },
    ],
    defeatDialog: [
      { speaker: '강태욱', text: '...이제 끝난 거야?' },
      { speaker: '김선경', text: '아직 하나 남았어' },
      { speaker: '강태욱', text: '뭔데' },
      { speaker: '김선경', text: '제일 어려운 거' },
      { speaker: 'SYSTEM', text: '...최종 관문이 다가온다' },
    ],
  },
  {
    id: 4,
    name: '불안의 그림자',
    title: '최종 관문',
    level: 95,
    hp: 5000,
    attacks: [
      { name: '미래에 대한 걱정', damage: 1500, description: '잘 살 수 있을까...?' },
      { name: '비교의 함정', damage: 1000, description: '다른 사람들은\n더 잘하는 것 같은데...' },
      { name: '완벽의 압박', damage: 1200, description: '결혼식이 망하면 어쩌지?' },
      { name: '혼자라는 착각', damage: 800, description: '내가 이걸 감당할 수 있을까?' },
    ],
    playerActions: [
      { label: '솔직하게', key: 'ACTION1', color: '#4a9eff', character: 'groom', mpCost: 0, minDamage: 1300, maxDamage: 1700, heal: 0, description: '사실 나도 무서워' },
      { label: '안심시키기', key: 'ACTION2', color: '#ff6b9d', character: 'bride', mpCost: 0, minDamage: 1800, maxDamage: 2200, heal: 500, description: '괜찮아. 우리 잘 해왔잖아' },
      { label: '함께라면', key: 'HEAL', color: '#00ff41', character: 'groom', mpCost: 0, minDamage: 2200, maxDamage: 2800, heal: 800, description: '완벽하지 않아도 돼.\n같이 하면 되잖아' },
      { label: '약속', key: 'COMBINE', color: '#ffcc00', character: 'both', mpCost: 0, minDamage: 8000, maxDamage: 10000, heal: 2000, description: '힘들면 꼭 말하기.\n혼자 끙끙 앓지 않기.' },
    ],
    escapeMessages: ['불안에서 도망치면\n더 커져서 돌아온다', '눈을 감아도\n사라지지 않는다', '도망이 아니라\n마주해야 할 때다'],
    introDialog: [
      { speaker: 'SYSTEM', text: '마지막 관문...' },
      { speaker: 'SYSTEM', text: '"불안의 그림자" Lv.95 가 나타났다!' },
      { speaker: '불안의 그림자', text: '...정말 괜찮을까?' },
    ],
    defeatDialog: [
      { speaker: 'SYSTEM', text: '"불안의 그림자"가 사라졌다...' },
      { speaker: 'SYSTEM', text: '아니, 사라진 게 아니다\n불안은 늘 있다' },
      { speaker: 'SYSTEM', text: '다만 이제는 혼자가 아니다' },
      { speaker: '강태욱', text: '...고마워' },
      { speaker: '김선경', text: '나야말로' },
      { speaker: 'SYSTEM', text: '커플 BOND MAX!\n모든 관문을 통과했습니다' },
    ],
  },
];

const CHAMPION: ChampionData = {
  phases: [
    {
      id: 1,
      title: '아침 준비',
      dialog: [
        { speaker: 'SYSTEM', text: 'D-DAY가 밝았다!' },
        { speaker: 'SYSTEM', text: `${WEDDING_INFO.dateDisplay.year}. ${String(WEDDING_INFO.dateDisplay.month).padStart(2, '0')}. ${String(WEDDING_INFO.dateDisplay.day).padStart(2, '0')} (${WEDDING_INFO.dateDisplay.dayOfWeek.charAt(0)})` },
        { speaker: '강태욱', text: '(거울을 보며) ...오늘이다' },
        { speaker: '김선경', text: '(별도 공간에서) ...오늘이다' },
        { speaker: 'SYSTEM', text: '두 사람의 심박수가 동기화되었다!' },
      ],
      choices: { prompt: '무엇을 할까?', options: ['심호흡을 한다', '커피를 마신다', '부모님께 전화한다'] },
    },
    {
      id: 2,
      title: '식장 도착',
      dialog: [
        { speaker: 'SYSTEM', text: `장소: ${WEDDING_INFO.venue.name} ${WEDDING_INFO.venue.hall}` },
        { speaker: 'SYSTEM', text: '하객들이 모여들고 있다!' },
        { speaker: '친구', text: '야 축하해!\n진짜 결혼하는 거 맞지? ㅋㅋ' },
        { speaker: '부모님', text: '우리 아들/딸 정말 잘 컸다...' },
        { speaker: 'SYSTEM', text: '감동 게이지가 차오르고 있다...' },
      ],
    },
    {
      id: 3,
      title: '입장',
      dialog: [
        { speaker: 'SYSTEM', text: '문이 열린다' },
        { speaker: 'SYSTEM', text: '...' },
        { speaker: 'SYSTEM', text: '강태욱이 김선경을 봤다' },
        { speaker: 'SYSTEM', text: '김선경이 강태욱을 봤다' },
        { speaker: '강태욱', text: '(속마음) ...아,\n이래서 결혼하는구나' },
        { speaker: '김선경', text: '(속마음) ...이 사람이구나.\n평생 함께할 사람' },
      ],
      choices: { prompt: '', options: ['영원을 약속한다'] },
    },
  ],
  victoryDialog: [
    { speaker: 'SYSTEM', text: '챔피언 클리어!' },
    { speaker: 'SYSTEM', text: '강태욱 & 김선경' },
    { speaker: 'SYSTEM', text: '영원히 함께' },
  ],
};

// --- Boss Sprites (box-shadow pixel art) ---

// Boss 1 - Budget Wall (12x12): Calculator/money bag
const BOSS1_COLORS: Record<number, string> = {
  0: 'transparent',
  1: '#228B22', // 녹색 (돈)
  2: '#FFD700', // 금 (동전)
  3: '#4a4a4a', // 계산기 본체
  4: '#1a1a1a', // 외곽선
  5: '#ff4444', // 빨간 숫자
  6: '#8b8b8b', // 회색 버튼
};

const BOSS1_SPRITE: number[][] = [
  [0,0,0,4,4,4,4,4,4,0,0,0],
  [0,0,4,3,3,3,3,3,3,4,0,0],
  [0,4,3,5,6,5,6,5,6,3,4,0],
  [0,4,3,6,3,6,3,6,3,3,4,0],
  [0,4,3,5,6,5,6,5,6,3,4,0],
  [0,4,3,6,3,6,3,6,3,3,4,0],
  [0,4,3,3,3,3,3,3,3,3,4,0],
  [0,4,2,2,3,3,3,3,2,2,4,0],
  [4,1,2,1,1,1,1,1,1,2,1,4],
  [4,1,1,1,2,2,2,2,1,1,1,4],
  [0,4,1,1,1,1,1,1,1,1,4,0],
  [0,0,4,4,4,4,4,4,4,4,0,0],
];

// Boss 2 - Family Council (14x14): Round table with seats
const BOSS2_COLORS: Record<number, string> = {
  0: 'transparent',
  1: '#8B4513', // 나무 갈색
  2: '#DEB887', // 밝은 나무
  3: '#CD853F', // 의자
  4: '#1a1a1a', // 외곽선
  5: '#FFE4B5', // 따뜻한 빛
  6: '#A0522D', // 짙은 갈색
};

const BOSS2_SPRITE: number[][] = [
  [0,0,0,0,3,3,0,0,3,3,0,0,0,0],
  [0,0,0,3,6,6,3,3,6,6,3,0,0,0],
  [0,0,0,3,6,6,3,3,6,6,3,0,0,0],
  [0,0,0,0,3,3,0,0,3,3,0,0,0,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,0,0],
  [0,4,2,2,2,2,2,2,2,2,2,2,4,0],
  [4,2,1,1,5,5,5,5,5,5,1,1,2,4],
  [4,2,1,1,5,5,5,5,5,5,1,1,2,4],
  [0,4,2,2,2,2,2,2,2,2,2,2,4,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,0,0],
  [0,0,0,0,3,3,0,0,3,3,0,0,0,0],
  [0,0,0,3,6,6,3,3,6,6,3,0,0,0],
  [0,0,0,3,6,6,3,3,6,6,3,0,0,0],
  [0,0,0,0,3,3,0,0,3,3,0,0,0,0],
];

// Boss 3 - Detail Hell (12x14): Scroll/checklist
const BOSS3_COLORS: Record<number, string> = {
  0: 'transparent',
  1: '#4169E1', // 파란색
  2: '#FFFFFF', // 종이
  3: '#333333', // 글씨
  4: '#1a1a1a', // 외곽선
  5: '#FF6347', // 미체크 빨강
  6: '#00CC44', // 체크 초록
  7: '#8b8b8b', // 회색 디테일
};

const BOSS3_SPRITE: number[][] = [
  [0,0,4,4,4,4,4,4,4,4,0,0],
  [0,4,1,1,2,2,2,2,1,1,4,0],
  [0,4,2,2,2,2,2,2,2,2,4,0],
  [0,4,2,5,3,3,3,3,3,2,4,0],
  [0,4,2,6,3,3,3,3,3,2,4,0],
  [0,4,2,5,3,3,3,3,3,2,4,0],
  [0,4,2,6,3,3,3,3,3,2,4,0],
  [0,4,2,5,3,3,3,3,3,2,4,0],
  [0,4,2,5,3,3,3,3,3,2,4,0],
  [0,4,2,5,3,3,3,3,3,2,4,0],
  [0,4,2,2,2,2,2,2,2,2,4,0],
  [0,4,1,1,2,2,2,2,1,1,4,0],
  [0,0,4,7,7,7,7,7,7,4,0,0],
  [0,0,0,4,4,4,4,4,4,0,0,0],
];

// Boss 4 - Shadow of Doubt (14x14): Amorphous dark cloud
const BOSS4_COLORS: Record<number, string> = {
  0: 'transparent',
  1: '#1a1a2e', // 깊은 그림자
  2: '#663399', // 짙은 보라
  3: '#4a4a6a', // 중간 그림자
  4: '#2d1b4e', // 공허
  5: '#9966cc', // 밝은 보라 (눈)
  6: '#332244', // 어두운 보라
};

const BOSS4_SPRITE: number[][] = [
  [0,0,0,0,4,1,1,1,1,4,0,0,0,0],
  [0,0,0,4,1,6,1,1,6,1,4,0,0,0],
  [0,0,4,1,6,1,3,3,1,6,1,4,0,0],
  [0,4,1,6,1,3,2,2,3,1,6,1,4,0],
  [4,1,6,1,3,2,5,5,2,3,1,6,1,4],
  [4,1,1,3,2,2,4,4,2,2,3,1,1,4],
  [4,6,1,3,2,4,1,1,4,2,3,1,6,4],
  [4,1,6,3,2,4,1,1,4,2,3,6,1,4],
  [4,1,1,3,2,2,4,4,2,2,3,1,1,4],
  [0,4,1,6,1,3,2,2,3,1,6,1,4,0],
  [0,0,4,1,6,1,3,3,1,6,1,4,0,0],
  [0,4,1,4,1,6,1,1,6,1,4,1,4,0],
  [4,1,4,0,4,1,6,6,1,4,0,4,1,4],
  [4,4,0,0,0,4,4,4,4,0,0,0,4,4],
];

const BOSS_SPRITE_DATA: { sprite: number[][]; colors: Record<number, string> }[] = [
  { sprite: BOSS1_SPRITE, colors: BOSS1_COLORS },
  { sprite: BOSS2_SPRITE, colors: BOSS2_COLORS },
  { sprite: BOSS3_SPRITE, colors: BOSS3_COLORS },
  { sprite: BOSS4_SPRITE, colors: BOSS4_COLORS },
];

// --- HP Bar ---

function HpBar({
  label,
  current,
  max,
  color,
  showNumbers,
}: {
  label: string;
  current: number;
  max: number;
  color: string;
  showNumbers?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between mb-0.5">
        <span
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
          style={{ color: ARCADE_COLORS.text }}
        >
          {label}
        </span>
        {showNumbers && (
          <span
            className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
            style={{ color: pct > 25 ? color : ARCADE_COLORS.red }}
          >
            {current}/{max}
          </span>
        )}
      </div>
      <div
        className="w-full h-3 sm:h-4"
        style={{ background: ARCADE_COLORS.darkGray, border: `1px solid ${ARCADE_COLORS.gray}40` }}
      >
        <motion.div
          className="h-full"
          style={{ background: pct > 25 ? color : ARCADE_COLORS.red }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// --- Damage Popup ---

interface DamageNumber {
  id: string;
  value: number;
  x: number;
  y: number;
  color: string;
  isHeal: boolean;
}

function DamagePopup({ damage }: { damage: DamageNumber }) {
  return (
    <motion.div
      className="absolute font-['Press_Start_2P',monospace] pointer-events-none z-20"
      style={{
        left: `${damage.x}%`,
        top: `${damage.y}%`,
        color: damage.color,
        fontSize: damage.isHeal ? '14px' : '18px',
        textShadow: `0 0 8px ${damage.color}80, 2px 2px 0 rgba(0,0,0,0.5)`,
      }}
      initial={{ y: 0, opacity: 1, scale: 0.5 }}
      animate={{ y: -50, opacity: [1, 1, 0], scale: [0.5, 1.2, 1] }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {damage.isHeal ? '+' : '-'}{Math.abs(damage.value).toLocaleString()}
    </motion.div>
  );
}

// --- Boss Sprite Renderer ---

function BossSprite({
  bossIndex,
  shake,
  isShadow,
}: {
  bossIndex: number;
  shake: boolean;
  isShadow?: boolean;
}) {
  const data = BOSS_SPRITE_DATA[bossIndex];
  if (!data) return null;
  const { sprite, colors } = data;
  const scale = 5;
  const rows = sprite.length;
  const cols = sprite[0].length;

  const shadows = useMemo(() => {
    const result: string[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const c = sprite[y][x];
        if (c === 0) continue;
        const color = colors[c];
        if (!color || color === 'transparent') continue;
        result.push(`${(x + 1) * scale}px ${(y + 1) * scale}px 0 ${color}`);
      }
    }
    return result.join(',');
  }, [sprite, colors, rows, cols]);

  return (
    <motion.div
      animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          width: `${(cols + 1) * scale}px`,
          height: `${(rows + 1) * scale}px`,
          position: 'relative',
          imageRendering: 'pixelated',
        }}
      >
        <div
          style={{
            width: `${scale}px`,
            height: `${scale}px`,
            boxShadow: shadows,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>
      {/* 보스4 전용 맥동 글로우 */}
      {isShadow && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -12,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102,51,153,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}

// --- MiniDialog (same pattern as StageEvent.tsx) ---

function MiniDialog({
  speaker,
  text,
  onComplete,
  speed = 35,
}: {
  speaker: string;
  text: string;
  onComplete?: () => void;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  const handleAdvance = () => {
    if (!done) {
      setDisplayed(text);
      setDone(true);
    } else {
      onComplete?.();
    }
  };

  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={handleAdvance}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAdvance();
        }
      }}
      aria-label="Dialog - click to advance"
    >
      <div
        className="relative w-full px-4 py-3"
        style={{
          background: 'rgba(0,0,0,0.92)',
          border: `3px solid ${ARCADE_COLORS.gray}`,
          boxShadow: `inset 2px 2px 0px ${ARCADE_COLORS.darkGray}`,
          imageRendering: 'pixelated',
        }}
      >
        <div
          className="absolute -top-3.5 left-4 px-2 py-0.5 flex items-center gap-1.5"
          style={{ background: ARCADE_COLORS.bg, border: `2px solid ${ARCADE_COLORS.gray}` }}
        >
          {(speaker === '강태욱' || speaker === '김선경') && (
            <PixelCharacter character={speaker === '강태욱' ? 'groom' : 'bride'} size="mini" scale={1} />
          )}
          <span
            className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px]"
            style={{ color: ARCADE_COLORS.gold }}
          >
            {speaker}
          </span>
        </div>
        <p
          className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px] leading-[21px] sm:leading-[26px] mt-2 min-h-[48px] whitespace-pre-wrap"
          style={{ color: ARCADE_COLORS.text }}
        >
          {displayed}
        </p>
        {done && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute bottom-2 right-4 font-['Press_Start_2P',monospace] text-[10px]"
            style={{ color: ARCADE_COLORS.text }}
          >
            {'\u25BC'}
          </motion.span>
        )}
      </div>
    </div>
  );
}

// --- Battle State ---

interface BattleState {
  bossHp: number;
  groomHp: number;
  groomMaxHp: number;
  groomMp: number;
  groomMaxMp: number;
  brideHp: number;
  brideMaxHp: number;
  brideMp: number;
  brideMaxMp: number;
  turn: number;
  log: string[];
  state: 'idle' | 'player_action' | 'boss_action' | 'victory';
  escapeCount: number;
}

type BattleAction =
  | { type: 'PLAYER_ACTION'; actionIndex: number; boss: EliteFourBoss; damage: number }
  | { type: 'BOSS_TURN'; boss: EliteFourBoss; damage: number }
  | { type: 'SET_IDLE' }
  | { type: 'ESCAPE'; boss: EliteFourBoss }
  | { type: 'RESET_FOR_BOSS'; boss: EliteFourBoss; prevState: BattleState };

function createInitialState(): BattleState {
  return {
    bossHp: ELITE_FOUR[0].hp,
    groomHp: 9999,
    groomMaxHp: 9999,
    groomMp: 100,
    groomMaxMp: 100,
    brideHp: 9999,
    brideMaxHp: 9999,
    brideMp: 100,
    brideMaxMp: 100,
    turn: 0,
    log: [],
    state: 'idle',
    escapeCount: 0,
  };
}

function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'PLAYER_ACTION': {
      const act = action.boss.playerActions[action.actionIndex];
      if (!act) return state;

      const isHeal = act.heal > 0 && act.minDamage === 0 && act.maxDamage === 0;
      const damage = action.damage;
      const heal = act.heal;

      const newBossHp = Math.max(0, state.bossHp - damage);
      const newGroomMp = Math.max(0, state.groomMp - (act.character === 'groom' || act.character === 'both' ? act.mpCost : 0));
      const newBrideMp = Math.max(0, state.brideMp - (act.character === 'bride' || act.character === 'both' ? act.mpCost : 0));

      const charName = act.character === 'groom' ? '강태욱' : act.character === 'bride' ? '김선경' : '강태욱 & 김선경';
      const logs: string[] = [];

      if (isHeal) {
        logs.push(`${charName}의 "${act.label}"!\n${act.description}\nHP +${heal} 회복!`);
      } else if (heal > 0) {
        logs.push(`${charName}의 "${act.label}"!\n${act.description}\n${damage.toLocaleString()} 데미지!\nHP +${heal} 회복!`);
      } else {
        logs.push(`${charName}의 "${act.label}"!\n${act.description}\n${damage.toLocaleString()} 데미지!`);
      }

      if (newBossHp <= 0) {
        return {
          ...state,
          bossHp: 0,
          groomHp: Math.min(state.groomMaxHp, state.groomHp + heal),
          brideHp: Math.min(state.brideMaxHp, state.brideHp + heal),
          groomMp: newGroomMp,
          brideMp: newBrideMp,
          log: logs,
          state: 'victory',
          turn: state.turn + 1,
        };
      }

      return {
        ...state,
        bossHp: newBossHp,
        groomHp: Math.min(state.groomMaxHp, state.groomHp + heal),
        brideHp: Math.min(state.brideMaxHp, state.brideHp + heal),
        groomMp: newGroomMp,
        brideMp: newBrideMp,
        log: logs,
        state: 'player_action',
        turn: state.turn + 1,
      };
    }

    case 'BOSS_TURN': {
      const attacks = action.boss.attacks;
      const attack = attacks[state.turn % attacks.length];
      const actualDmg = action.damage;

      return {
        ...state,
        groomHp: Math.max(1, state.groomHp - actualDmg),
        brideHp: Math.max(1, state.brideHp - actualDmg),
        log: [`${action.boss.name}의 "${attack.name}"!\n${attack.description}\n${actualDmg.toLocaleString()} 데미지!`],
        state: 'idle',
      };
    }

    case 'ESCAPE': {
      const msg = action.boss.escapeMessages[state.escapeCount % action.boss.escapeMessages.length];
      return {
        ...state,
        log: [msg],
        escapeCount: state.escapeCount + 1,
        state: 'idle',
      };
    }

    case 'RESET_FOR_BOSS': {
      // HP/MP를 이전 상태에서 가져오되 약간 회복
      const prev = action.prevState;
      const hpRecovery = Math.floor(prev.groomMaxHp * 0.2);
      const mpRecovery = 30;
      return {
        bossHp: action.boss.hp,
        groomHp: Math.min(prev.groomMaxHp, prev.groomHp + hpRecovery),
        groomMaxHp: prev.groomMaxHp,
        groomMp: Math.min(prev.groomMaxMp, prev.groomMp + mpRecovery),
        groomMaxMp: prev.groomMaxMp,
        brideHp: Math.min(prev.brideMaxHp, prev.brideHp + hpRecovery),
        brideMaxHp: prev.brideMaxHp,
        brideMp: Math.min(prev.brideMaxMp, prev.brideMp + mpRecovery),
        brideMaxMp: prev.brideMaxMp,
        turn: 0,
        log: [],
        state: 'idle',
        escapeCount: 0,
      };
    }

    case 'SET_IDLE':
      return { ...state, state: 'idle' };

    default:
      return state;
  }
}

// --- Phase Management ---

type SequencePhase =
  | { type: 'elite-intro'; bossIndex: number }
  | { type: 'elite-battle'; bossIndex: number }
  | { type: 'elite-defeat'; bossIndex: number }
  | { type: 'champion'; phaseIndex: number }
  | { type: 'victory' };

// --- Main Component ---

interface BossSequenceProps {
  onVictory: () => void;
}

export function BossSequence({ onVictory }: BossSequenceProps) {
  // Phase management
  const [seqPhase, setSeqPhase] = useState<SequencePhase>({ type: 'elite-intro', bossIndex: 0 });

  // Battle state
  const [battleState, dispatch] = useReducer(battleReducer, undefined, createInitialState);

  // Dialog state
  const [dialogIdx, setDialogIdx] = useState(0);

  // Champion choice state
  const [showChoice, setShowChoice] = useState(false);

  // Battle visual state
  const [bossShake, setBossShake] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [showCombineHearts, setShowCombineHearts] = useState(false);
  const [logIdx, setLogIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Transition state
  const [showTransition, setShowTransition] = useState(false);
  const [transitionText, setTransitionText] = useState('');

  // Champion walk animation for phase 3
  const [championWalkPhase, setChampionWalkPhase] = useState(false);
  const [championWhiteFlash, setChampionWhiteFlash] = useState(false);

  // Boss 4 darkness vignette
  const [boss4Darkness, setBoss4Darkness] = useState(0);
  const [boss4LightBurst, setBoss4LightBurst] = useState(false);

  // setTimeout 추적 및 언마운트 시 정리
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter((t) => t !== id);
      fn();
    }, ms);
    timeoutRefs.current.push(id);
    return id;
  }, []);
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  // 데미지 숫자 추가
  const addDamageNumber = useCallback((value: number, x: number, y: number, isHeal: boolean) => {
    const id = `dmg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const color = isHeal ? ARCADE_COLORS.green : ARCADE_COLORS.red;
    setDamageNumbers((prev) => [...prev, { id, value, x, y, color, isHeal }]);
    safeTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 1200);
  }, []);

  // 보스4 어둠 효과
  useEffect(() => {
    if (seqPhase.type === 'elite-battle' && seqPhase.bossIndex === 3) {
      const boss = ELITE_FOUR[3];
      const hpPct = battleState.bossHp / boss.hp;
      setBoss4Darkness(1 - hpPct);
    } else {
      setBoss4Darkness(0);
    }
  }, [seqPhase, battleState.bossHp]);

  // 전투 전환 애니메이션
  const doTransition = useCallback((text: string, callback: () => void) => {
    setTransitionText(text);
    setShowTransition(true);
    safeTimeout(() => {
      callback();
      safeTimeout(() => {
        setShowTransition(false);
      }, 800);
    }, 1200);
  }, []);

  // --- Phase: elite-intro ---
  const handleIntroDialogAdvance = useCallback(() => {
    const boss = ELITE_FOUR[seqPhase.type === 'elite-intro' ? seqPhase.bossIndex : 0];
    if (!boss) return;
    if (dialogIdx < boss.introDialog.length - 1) {
      setDialogIdx((prev) => prev + 1);
    } else {
      // 인트로 끝나면 전투로 전환
      setDialogIdx(0);
      if (seqPhase.type === 'elite-intro') {
        setSeqPhase({ type: 'elite-battle', bossIndex: seqPhase.bossIndex });
      }
    }
  }, [seqPhase, dialogIdx]);

  // --- Phase: elite-battle ---
  const currentBoss = useMemo(() => {
    if (seqPhase.type === 'elite-battle' || seqPhase.type === 'elite-intro' || seqPhase.type === 'elite-defeat') {
      return ELITE_FOUR[seqPhase.bossIndex];
    }
    return null;
  }, [seqPhase]);

  const currentLog = seqPhase.type === 'elite-battle' ? (battleState.log[logIdx] || '') : '';

  // 로그 진행 + 보스 턴
  const advanceBattleLog = useCallback(() => {
    if (logIdx < battleState.log.length - 1) {
      setLogIdx((prev) => prev + 1);
      return;
    }

    if (battleState.state === 'player_action' && currentBoss) {
      setIsAnimating(true);
      safeTimeout(() => {
        const attacks = currentBoss.attacks;
        const attack = attacks[battleState.turn % attacks.length];
        const dmg = attack.damage + Math.floor(Math.random() * 200) - 100;
        const actualDmg = Math.max(0, dmg);
        addDamageNumber(actualDmg, 20, 55, false);
        dispatch({ type: 'BOSS_TURN', boss: currentBoss, damage: actualDmg });
        setLogIdx(0);
        setIsAnimating(false);
      }, 200);
    } else if (battleState.state === 'victory') {
      // 보스 격파 => defeat 페이즈
      if (seqPhase.type === 'elite-battle') {
        setDialogIdx(0);
        setSeqPhase({ type: 'elite-defeat', bossIndex: seqPhase.bossIndex });
      }
    }
  }, [logIdx, battleState.log.length, battleState.state, battleState.turn, currentBoss, seqPhase, addDamageNumber]);

  // 플레이어 커맨드
  const handleCommand = useCallback(
    (actionIndex: number) => {
      if (battleState.state !== 'idle' || isAnimating || !currentBoss) return;

      const act = currentBoss.playerActions[actionIndex];
      if (!act) return;

      // MP 체크
      if (act.character === 'groom' || act.character === 'both') {
        if (battleState.groomMp < act.mpCost) return;
      }
      if (act.character === 'bride' || act.character === 'both') {
        if (battleState.brideMp < act.mpCost) return;
      }

      const damage = act.minDamage > 0
        ? act.minDamage + Math.floor(Math.random() * (act.maxDamage - act.minDamage + 1))
        : 0;

      if (damage > 0) {
        setBossShake(true);
        setFlashScreen(true);
        addDamageNumber(damage, 75, 25, false);
        safeTimeout(() => {
          setBossShake(false);
          setFlashScreen(false);
        }, 200);
      }

      if (act.heal > 0) {
        addDamageNumber(act.heal, 20, 60, true);
      }

      // 보스4 + "약속" 스킬 => 빛 폭발 연출
      if (seqPhase.type === 'elite-battle' && seqPhase.bossIndex === 3 && act.key === 'COMBINE') {
        setBoss4LightBurst(true);
        setShowCombineHearts(true);
        safeTimeout(() => {
          setBoss4LightBurst(false);
          setShowCombineHearts(false);
        }, 1500);
      } else if (act.key === 'COMBINE') {
        setShowCombineHearts(true);
        safeTimeout(() => setShowCombineHearts(false), 1500);
      }

      dispatch({ type: 'PLAYER_ACTION', actionIndex, boss: currentBoss, damage });
      setLogIdx(0);
    },
    [battleState.state, battleState.groomMp, battleState.brideMp, isAnimating, currentBoss, addDamageNumber, seqPhase],
  );

  // 도망
  const handleEscape = useCallback(() => {
    if (battleState.state !== 'idle' || isAnimating || !currentBoss) return;
    dispatch({ type: 'ESCAPE', boss: currentBoss });
    setLogIdx(0);
  }, [battleState.state, isAnimating, currentBoss]);

  // --- Phase: elite-defeat ---
  const handleDefeatDialogAdvance = useCallback(() => {
    if (seqPhase.type !== 'elite-defeat') return;
    const boss = ELITE_FOUR[seqPhase.bossIndex];
    if (!boss) return;

    if (dialogIdx < boss.defeatDialog.length - 1) {
      setDialogIdx((prev) => prev + 1);
    } else {
      // 다음 보스 또는 챔피언
      const nextBossIndex = seqPhase.bossIndex + 1;
      if (nextBossIndex < ELITE_FOUR.length) {
        doTransition('다음 상대...', () => {
          const nextBoss = ELITE_FOUR[nextBossIndex];
          dispatch({ type: 'RESET_FOR_BOSS', boss: nextBoss, prevState: battleState });
          setDialogIdx(0);
          setLogIdx(0);
          setSeqPhase({ type: 'elite-intro', bossIndex: nextBossIndex });
        });
      } else {
        // 사천왕 올클리어 => 챔피언 페이즈
        doTransition('', () => {
          setDialogIdx(0);
          setShowChoice(false);
          setSeqPhase({ type: 'champion', phaseIndex: 0 });
        });
      }
    }
  }, [seqPhase, dialogIdx, doTransition, battleState]);

  // --- Phase: champion ---
  const handleChampionDialogAdvance = useCallback(() => {
    if (seqPhase.type !== 'champion') return;
    const phase = CHAMPION.phases[seqPhase.phaseIndex];
    if (!phase) return;

    if (dialogIdx < phase.dialog.length - 1) {
      setDialogIdx((prev) => prev + 1);
    } else {
      // 선택지가 있으면 보여주기
      if (phase.choices && !showChoice) {
        setShowChoice(true);
      } else if (!phase.choices) {
        // 선택지 없는 페이즈: 다음으로 자동 진행
        const nextPhaseIndex = seqPhase.phaseIndex + 1;
        if (nextPhaseIndex < CHAMPION.phases.length) {
          setDialogIdx(0);
          setSeqPhase({ type: 'champion', phaseIndex: nextPhaseIndex });
        } else {
          setDialogIdx(0);
          setSeqPhase({ type: 'victory' });
        }
      }
    }
  }, [seqPhase, dialogIdx, showChoice]);

  // 챔피언 선택지 클릭
  const handleChampionChoice = useCallback(() => {
    if (seqPhase.type !== 'champion') return;
    const nextPhaseIndex = seqPhase.phaseIndex + 1;
    setShowChoice(false);

    if (seqPhase.phaseIndex === 2) {
      // 챔피언 페이즈3 (입장) => 특수 연출 후 빅토리
      setChampionWhiteFlash(true);
      setChampionWalkPhase(true);
      safeTimeout(() => {
        setChampionWhiteFlash(false);
      }, 600);
      safeTimeout(() => {
        setChampionWalkPhase(false);
        setDialogIdx(0);
        setSeqPhase({ type: 'victory' });
      }, 2500);
    } else if (nextPhaseIndex < CHAMPION.phases.length) {
      setDialogIdx(0);
      setSeqPhase({ type: 'champion', phaseIndex: nextPhaseIndex });
    } else {
      setDialogIdx(0);
      setSeqPhase({ type: 'victory' });
    }
  }, [seqPhase]);

  // --- Phase: victory ---
  const [victoryDialogIdx, setVictoryDialogIdx] = useState(0);
  const [showVictoryButton, setShowVictoryButton] = useState(false);

  const handleVictoryDialogAdvance = useCallback(() => {
    if (victoryDialogIdx < CHAMPION.victoryDialog.length - 1) {
      setVictoryDialogIdx((prev) => prev + 1);
    } else {
      setShowVictoryButton(true);
    }
  }, [victoryDialogIdx]);

  // 렌더 시 Math.random() 호출 방지를 위한 메모이제이션
  const combineHeartsData = useMemo(() =>
    Array.from({ length: 15 }, () => ({
      left: 10 + Math.random() * 80,
      yOffset: -80 - Math.random() * 60,
      xOffset: (Math.random() - 0.5) * 80,
      delay: Math.random() * 0.3,
      fontSize: 16 + Math.random() * 12,
    })), []);

  const championSparklesData = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      left: 5 + Math.random() * 90,
      top: 5 + Math.random() * 80,
      size: 3 + Math.random() * 3,
      duration: 1.5 + Math.random(),
      delay: Math.random() * 2,
    })), []);

  const victorySparklesData = useMemo(() =>
    Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 3,
    })), []);

  const victoryHeartsData = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      fontSize: 12 + Math.random() * 10,
      yOffset: -20 - Math.random() * 30,
    })), []);

  // 배틀 배경 그라디언트
  const battleBgGradient = useMemo(() => {
    if (seqPhase.type === 'elite-battle' || seqPhase.type === 'elite-intro' || seqPhase.type === 'elite-defeat') {
      if (seqPhase.bossIndex === 3) {
        return 'linear-gradient(180deg, #0a0a15 0%, #1a1030 40%, #2a1a3e 60%, #1a1020 100%)';
      }
      return 'linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 40%, #3a5a3a 60%, #4a7a4a 100%)';
    }
    return 'linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 40%, #3a5a3a 60%, #4a7a4a 100%)';
  }, [seqPhase]);

  // 챔피언 배경 그라디언트
  const championBgGradient = useMemo(() => {
    if (seqPhase.type !== 'champion') return '';
    switch (seqPhase.phaseIndex) {
      case 0: return 'linear-gradient(180deg, #1a2a4e 0%, #3a5a8e 40%, #7aa0cc 70%, #c0d8f0 100%)';
      case 1: return 'linear-gradient(180deg, #f5e6cc 0%, #faf0e0 30%, #fff8f0 60%, #ffeedd 100%)';
      case 2: return 'linear-gradient(180deg, #ffffff 0%, #fffaf0 30%, #fff5e0 60%, #ffeedd 100%)';
      default: return 'linear-gradient(180deg, #1a1a3e 0%, #2a2a5e 100%)';
    }
  }, [seqPhase]);

  // ================================================================
  // RENDER: elite-intro
  // ================================================================
  if (seqPhase.type === 'elite-intro') {
    const boss = ELITE_FOUR[seqPhase.bossIndex];
    const dialogLine = boss.introDialog[dialogIdx];
    return (
      <div
        className="relative w-full min-h-screen flex flex-col overflow-hidden"
        style={{ background: ARCADE_COLORS.bg }}
      >
        {/* 극적 배경 */}
        <div className="flex-1 relative flex flex-col items-center justify-center">
          {/* 방사형 효과 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: seqPhase.bossIndex === 3
                ? 'radial-gradient(ellipse at center, rgba(102,51,153,0.15) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(255,68,68,0.1) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* 보스 이름 + 레벨 + 타이틀 */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
            className="text-center mb-6 z-10"
          >
            <p
              className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px] mb-2"
              style={{ color: ARCADE_COLORS.gray }}
            >
              Lv.{boss.level}
            </p>
            <p
              className="font-['Press_Start_2P',monospace] text-[20px] sm:text-[28px] mb-1"
              style={{
                color: seqPhase.bossIndex === 3 ? '#9966cc' : ARCADE_COLORS.red,
                textShadow: `0 0 12px ${seqPhase.bossIndex === 3 ? '#9966cc' : ARCADE_COLORS.red}60`,
              }}
            >
              {boss.name}
            </p>
            <p
              className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px]"
              style={{ color: ARCADE_COLORS.gray }}
            >
              {boss.title}
            </p>
          </motion.div>

          {/* 보스 스프라이트 */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative z-10"
          >
            <BossSprite bossIndex={seqPhase.bossIndex} shake={false} isShadow={seqPhase.bossIndex === 3} />
          </motion.div>
        </div>

        {/* 대화창 */}
        <div className="flex-shrink-0 px-3 pb-4 pt-2 sm:px-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          {dialogLine && (
            <MiniDialog
              speaker={dialogLine.speaker}
              text={dialogLine.text}
              onComplete={handleIntroDialogAdvance}
            />
          )}
        </div>
      </div>
    );
  }

  // ================================================================
  // RENDER: elite-battle
  // ================================================================
  if (seqPhase.type === 'elite-battle' && currentBoss) {
    const actions = currentBoss.playerActions;

    return (
      <div
        className="relative w-full min-h-screen flex flex-col overflow-hidden"
        style={{ background: ARCADE_COLORS.bg }}
      >
        {/* Screen flash */}
        <AnimatePresence>
          {flashScreen && (
            <motion.div
              key="flash-screen"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-30 pointer-events-none"
              style={{ background: ARCADE_COLORS.text }}
            />
          )}
        </AnimatePresence>

        {/* 보스4 빛 폭발 */}
        <AnimatePresence>
          {boss4LightBurst && (
            <motion.div
              key="boss4-light-burst"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 0] }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,204,0,0.4) 40%, transparent 80%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* 배틀 필드 */}
        <div
          className="flex-1 relative min-h-0 overflow-hidden"
          style={{ background: battleBgGradient }}
        >
          {/* 보스4 비네트 */}
          {seqPhase.bossIndex === 3 && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `radial-gradient(ellipse at center, transparent 30%, rgba(10,5,20,${0.3 + boss4Darkness * 0.5}) 100%)`,
              }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          {/* 배틀 필드 바닥 라인 */}
          <div
            className="absolute left-0 right-0"
            style={{ top: '55%', height: '2px', background: 'rgba(255,255,255,0.08)' }}
          />

          {/* 배경 파티클 */}
          {[15, 35, 55, 75, 90].map((left, i) => (
            <div
              key={`grass-${i}`}
              className="absolute"
              style={{
                left: `${left}%`,
                bottom: `${42 + (i % 3) * 2}%`,
                width: 6 + (i % 2) * 4,
                height: 8,
                background: seqPhase.bossIndex === 3
                  ? `linear-gradient(0deg, #2a1a3e, ${i % 2 === 0 ? '#3a2a4e' : '#2d1d3d'})`
                  : `linear-gradient(0deg, #3a5a3a, ${i % 2 === 0 ? '#5a8a5a' : '#4a7a4a'})`,
                borderRadius: '40% 40% 0 0',
                opacity: 0.6,
              }}
            />
          ))}

          {/* 떠다니는 파티클 */}
          {[
            { x: 20, y: 15, d: 0 }, { x: 50, y: 25, d: 1.2 }, { x: 75, y: 10, d: 0.6 },
            { x: 40, y: 35, d: 1.8 }, { x: 85, y: 20, d: 2.4 }, { x: 10, y: 30, d: 0.9 },
          ].map((p, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: 2 + (i % 2),
                height: 2 + (i % 2),
                background: seqPhase.bossIndex === 3
                  ? (i % 3 === 0 ? '#663399' + '40' : i % 3 === 1 ? '#ffffff20' : '#9966cc20')
                  : (i % 3 === 0 ? '#9966cc40' : i % 3 === 1 ? '#ffffff20' : '#ffcc0020'),
              }}
              animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + i * 0.5, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* 데미지 숫자 팝업 */}
          <AnimatePresence>
            {damageNumbers.map((dmg) => (
              <DamagePopup key={dmg.id} damage={dmg} />
            ))}
          </AnimatePresence>

          {/* 합체기 하트 폭발 */}
          {showCombineHearts && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
              {combineHeartsData.map((h, i) => (
                <motion.span
                  key={`combine-heart-${i}`}
                  className="absolute"
                  style={{
                    left: `${h.left}%`,
                    top: '50%',
                    fontSize: h.fontSize,
                    color: i % 2 === 0 ? ARCADE_COLORS.pink : ARCADE_COLORS.gold,
                  }}
                  initial={{ y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    y: h.yOffset,
                    x: h.xOffset,
                    opacity: [1, 1, 0],
                    scale: [0, 1.3, 0.8],
                  }}
                  transition={{ duration: 1.2, delay: h.delay }}
                >
                  {i % 3 === 0 ? '\u2665' : '\u2736'}
                </motion.span>
              ))}
            </div>
          )}

          {/* 보스 영역 (우측 상단) */}
          <div className="absolute top-3 right-2 sm:right-4 flex flex-col items-end">
            {/* 보스 HP 바 */}
            <div
              className="w-[200px] sm:w-[250px] mb-2 p-2"
              style={{
                background: 'rgba(0,0,0,0.7)',
                border: `2px solid ${ARCADE_COLORS.gray}`,
              }}
            >
              <div className="flex justify-between items-center mb-0.5">
                <span
                  className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[11px]"
                  style={{ color: ARCADE_COLORS.red }}
                >
                  {currentBoss.name} Lv.{currentBoss.level}
                </span>
              </div>
              <HpBar label="HP" current={battleState.bossHp} max={currentBoss.hp} color={ARCADE_COLORS.red} />
            </div>
            {/* 보스 스프라이트 */}
            <div className="relative mr-2 sm:mr-6">
              <BossSprite bossIndex={seqPhase.bossIndex} shake={bossShake} isShadow={seqPhase.bossIndex === 3} />
            </div>
          </div>

          {/* 아군 영역 (좌측 하단) - 뒷모습 */}
          <div className="absolute bottom-4 left-2 sm:left-4 flex flex-col items-start">
            {/* 아군 스프라이트 (뒷모습) */}
            <div className="flex items-end gap-1 mb-2">
              <motion.div
                animate={battleState.state === 'player_action' ? { x: [0, 6, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <PixelCharacter character="groom" size="full" scale={4} facing="back" />
              </motion.div>
              <motion.div
                animate={battleState.state === 'player_action' ? { x: [0, 6, 0] } : {}}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <PixelCharacter character="bride" size="full" scale={4} facing="back" />
              </motion.div>
            </div>
            {/* 아군 HP 바 */}
            <div
              className="w-[200px] sm:w-[250px] p-2"
              style={{
                background: 'rgba(0,0,0,0.7)',
                border: `2px solid ${ARCADE_COLORS.gray}`,
              }}
            >
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <HpBar label="신랑" current={battleState.groomHp} max={battleState.groomMaxHp} color={ARCADE_COLORS.green} showNumbers />
                  <div className="mt-0.5">
                    <HpBar label="MP" current={battleState.groomMp} max={battleState.groomMaxMp} color={ARCADE_COLORS.blue} showNumbers />
                  </div>
                </div>
                <div>
                  <HpBar label="신부" current={battleState.brideHp} max={battleState.brideMaxHp} color={ARCADE_COLORS.green} showNumbers />
                  <div className="mt-0.5">
                    <HpBar label="MP" current={battleState.brideMp} max={battleState.brideMaxMp} color={ARCADE_COLORS.blue} showNumbers />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단: 로그 + 커맨드 */}
        <div className="flex-shrink-0 px-2 pb-3 sm:px-4 sm:pb-4">
          <div className="flex gap-2">
            {/* Log box */}
            <div
              className="flex-1 min-h-[100px] sm:min-h-[110px] px-4 py-3 cursor-pointer"
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                border: `3px solid ${ARCADE_COLORS.gray}`,
                imageRendering: 'pixelated',
              }}
              onClick={advanceBattleLog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  advanceBattleLog();
                }
              }}
              aria-label="Battle log - click to advance"
            >
              <p
                className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[13px] leading-[18px] sm:leading-[24px] whitespace-pre-wrap"
                style={{ color: ARCADE_COLORS.text }}
              >
                {currentLog}
              </p>
              {logIdx < battleState.log.length - 1 && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="font-['Press_Start_2P',monospace] text-[10px] block mt-1"
                  style={{ color: ARCADE_COLORS.gray }}
                >
                  {'\u25BC'}
                </motion.span>
              )}
            </div>

            {/* Command menu */}
            <div
              className="flex-shrink-0 w-[130px] sm:w-[155px] flex flex-col gap-1.5 p-2 sm:p-2.5"
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                border: `3px solid ${ARCADE_COLORS.gray}`,
                imageRendering: 'pixelated',
              }}
            >
              {actions.map((act, idx) => {
                const mpOk = (() => {
                  if (act.character === 'groom' || act.character === 'both') {
                    if (battleState.groomMp < act.mpCost) return false;
                  }
                  if (act.character === 'bride' || act.character === 'both') {
                    if (battleState.brideMp < act.mpCost) return false;
                  }
                  return true;
                })();
                const isDisabled = battleState.state !== 'idle' || isAnimating || !mpOk;

                return (
                  <motion.button
                    key={act.key}
                    whileHover={!isDisabled ? { x: 3 } : undefined}
                    whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                    onClick={() => handleCommand(idx)}
                    disabled={isDisabled}
                    className="w-full text-left px-2 py-1.5 font-['Press_Start_2P',monospace] text-[9px] sm:text-[11px] disabled:opacity-30 transition-opacity"
                    style={{
                      color: !isDisabled ? act.color : ARCADE_COLORS.gray,
                      background: 'transparent',
                      borderBottom: `1px solid ${ARCADE_COLORS.darkGray}`,
                    }}
                  >
                    {'>'} {act.label}
                  </motion.button>
                );
              })}
              <motion.button
                whileHover={battleState.state === 'idle' ? { x: 2 } : undefined}
                onClick={handleEscape}
                disabled={battleState.state !== 'idle' || isAnimating}
                className="w-full text-center pt-1 font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px] disabled:opacity-30 transition-opacity"
                style={{ color: ARCADE_COLORS.gray, background: 'transparent' }}
              >
                도망
              </motion.button>
            </div>
          </div>
        </div>

        {/* 전환 오버레이 */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              key="transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.95)' }}
            >
              {transitionText && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
                  transition={{ duration: 2, times: [0, 0.3, 0.7, 1] }}
                  className="font-['Press_Start_2P',monospace] text-[14px] sm:text-[18px]"
                  style={{ color: ARCADE_COLORS.text }}
                >
                  {transitionText}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ================================================================
  // RENDER: elite-defeat
  // ================================================================
  if (seqPhase.type === 'elite-defeat') {
    const boss = ELITE_FOUR[seqPhase.bossIndex];
    const dialogLine = boss.defeatDialog[dialogIdx];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col overflow-hidden"
        style={{ background: ARCADE_COLORS.bg }}
      >
        {/* 격파 배너 */}
        <div className="flex-1 relative flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center mb-6 z-10"
          >
            <p
              className="font-['Press_Start_2P',monospace] text-[22px] sm:text-[32px]"
              style={{
                color: ARCADE_COLORS.gold,
                textShadow: `0 0 10px ${ARCADE_COLORS.gold}80, 0 0 20px ${ARCADE_COLORS.gold}40, 4px 4px 0px #b38f00`,
              }}
            >
              격파!
            </p>
            <p
              className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px] mt-2"
              style={{ color: ARCADE_COLORS.gray }}
            >
              {boss.name}
            </p>
          </motion.div>

          {/* 캐릭터 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-end gap-1 z-10"
          >
            <PixelCharacter character="groom" size="full" scale={4} emotion="happy" />
            <PixelCharacter character="bride" size="full" scale={4} emotion="happy" />
          </motion.div>
        </div>

        {/* 대화창 */}
        <div className="flex-shrink-0 px-3 pb-4 pt-2 sm:px-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          {dialogLine && (
            <MiniDialog
              speaker={dialogLine.speaker}
              text={dialogLine.text}
              onComplete={handleDefeatDialogAdvance}
            />
          )}
        </div>

        {/* 전환 오버레이 */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              key="transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.95)' }}
            >
              {transitionText && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
                  transition={{ duration: 2, times: [0, 0.3, 0.7, 1] }}
                  className="font-['Press_Start_2P',monospace] text-[14px] sm:text-[18px]"
                  style={{ color: ARCADE_COLORS.text }}
                >
                  {transitionText}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ================================================================
  // RENDER: champion
  // ================================================================
  if (seqPhase.type === 'champion') {
    const phase = CHAMPION.phases[seqPhase.phaseIndex];
    if (!phase) return null;
    const dialogLine = phase.dialog[dialogIdx];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col overflow-hidden"
        style={{ background: ARCADE_COLORS.bg }}
      >
        {/* 챔피언 백플래시 (입장) */}
        <AnimatePresence>
          {championWhiteFlash && (
            <motion.div
              key="champion-white-flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 0] }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-50 pointer-events-none"
              style={{ background: '#ffffff' }}
            />
          )}
        </AnimatePresence>

        {/* 타이틀 */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-2 flex-shrink-0 z-10"
        >
          <p
            className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px]"
            style={{ color: ARCADE_COLORS.gold }}
          >
            {phase.title}
          </p>
        </motion.div>

        {/* 필드 씬 */}
        <div className="flex-1 relative overflow-hidden min-h-0" style={{ background: championBgGradient }}>
          {/* 스파클 효과 (입장 페이즈) */}
          {seqPhase.phaseIndex === 2 && (
            <>
              {championSparklesData.map((s, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${s.left}%`,
                    top: `${s.top}%`,
                    width: s.size,
                    height: s.size,
                    background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#ffffff' : '#FFE4B5',
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: s.duration,
                    delay: s.delay,
                    repeat: Infinity,
                  }}
                />
              ))}
            </>
          )}

          {/* 캐릭터 */}
          {seqPhase.phaseIndex === 2 && championWalkPhase ? (
            /* 입장 워킹 애니메이션: 양쪽에서 중앙으로 */
            <div className="absolute inset-0 flex items-end justify-center pb-[10%]">
              <motion.div
                initial={{ x: -120 }}
                animate={{ x: -8 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                <PixelCharacter character="groom" size="full" scale={5} emotion="love" />
              </motion.div>
              <motion.div
                initial={{ x: 120 }}
                animate={{ x: 8 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                <PixelCharacter character="bride" size="full" scale={5} emotion="love" />
              </motion.div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-end justify-center pb-[10%]">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <PixelCharacter character="groom" size="full" scale={4} emotion="happy" />
              </motion.div>
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <PixelCharacter character="bride" size="full" scale={4} emotion="happy" />
              </motion.div>
            </div>
          )}
        </div>

        {/* 대화/선택 영역 */}
        <div className="flex-shrink-0 px-3 pb-4 pt-2 sm:px-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          {showChoice && phase.choices ? (
            <div
              className="w-full px-4 py-3"
              style={{
                background: 'rgba(0,0,0,0.9)',
                border: `3px solid ${ARCADE_COLORS.gray}`,
                imageRendering: 'pixelated',
              }}
            >
              {phase.choices.prompt && (
                <p
                  className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[13px] mb-3"
                  style={{ color: ARCADE_COLORS.text }}
                >
                  {phase.choices.prompt}
                </p>
              )}
              <div className={`grid ${phase.choices.options.length > 2 ? 'grid-cols-3' : phase.choices.options.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                {phase.choices.options.map((option, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleChampionChoice}
                    className="px-3 py-2.5 font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px] text-left"
                    style={{
                      color: ARCADE_COLORS.text,
                      background: ARCADE_COLORS.darkGray,
                      border: `2px solid ${ARCADE_COLORS.gray}`,
                    }}
                  >
                    {'>'} {option}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : dialogLine ? (
            <MiniDialog
              speaker={dialogLine.speaker}
              text={dialogLine.text}
              onComplete={handleChampionDialogAdvance}
            />
          ) : null}
        </div>
      </div>
    );
  }

  // ================================================================
  // RENDER: victory
  // ================================================================
  if (seqPhase.type === 'victory') {
    const vDialog = CHAMPION.victoryDialog[victoryDialogIdx];

    return (
      <div
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: ARCADE_COLORS.bg }}
      >
        {/* 스파클 배경 */}
        {victorySparklesData.map((s, i) => (
          <motion.div
            key={`v-sparkle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background: i % 4 === 0 ? '#FFD700' : i % 4 === 1 ? '#ffffff' : i % 4 === 2 ? '#ff6b9d' : '#FFE4B5',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
              y: [0, -10, 0],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
            }}
          />
        ))}

        {/* 텍스트 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-center mb-6 z-10"
        >
          <p
            className="font-['Press_Start_2P',monospace] text-[24px] sm:text-[36px]"
            style={{
              color: ARCADE_COLORS.gold,
              textShadow: `0 0 12px ${ARCADE_COLORS.gold}80, 0 0 24px ${ARCADE_COLORS.gold}40, 4px 4px 0 #b38f00`,
            }}
          >
            {vDialog?.text || 'CHAMPION CLEAR!'}
          </p>
          {victoryDialogIdx >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['Press_Start_2P',monospace] text-[14px] sm:text-[18px] mt-3"
              style={{ color: ARCADE_COLORS.pink }}
            >
              {CHAMPION.victoryDialog[1]?.text}
            </motion.p>
          )}
          {victoryDialogIdx >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['Press_Start_2P',monospace] text-[16px] sm:text-[22px] mt-3"
              style={{
                color: ARCADE_COLORS.gold,
                textShadow: `0 0 8px ${ARCADE_COLORS.gold}60`,
              }}
            >
              {CHAMPION.victoryDialog[2]?.text}
            </motion.p>
          )}
        </motion.div>

        {/* 캐릭터 (나란히 + 하트) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative flex items-end justify-center gap-0 mb-6 z-10"
        >
          <PixelCharacter character="groom" size="full" scale={5} emotion="love" />
          <PixelCharacter character="bride" size="full" scale={5} emotion="love" />

          {/* 하트 */}
          <motion.div
            className="absolute"
            style={{ top: -24, left: '50%', transform: 'translateX(-50%)' }}
          >
            {victoryHeartsData.map((h, i) => (
              <motion.span
                key={`v-heart-${i}`}
                className="absolute"
                style={{
                  fontSize: h.fontSize,
                  color: i % 2 === 0 ? ARCADE_COLORS.pink : ARCADE_COLORS.gold,
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: (i - 3.5) * 16,
                  y: h.yOffset,
                  opacity: [1, 1, 0],
                  scale: [0.5, 1.2, 0.8],
                }}
                transition={{ duration: 1.5, delay: i * 0.12, repeat: Infinity, repeatDelay: 1 }}
              >
                {i % 3 === 0 ? '\u2665' : '\u2736'}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* 클릭 영역 (대화 진행) */}
        {!showVictoryButton && (
          <motion.div
            className="z-10 cursor-pointer px-6 py-3"
            onClick={handleVictoryDialogAdvance}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleVictoryDialogAdvance();
              }
            }}
            aria-label="Victory dialog - click to advance"
          >
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="font-['Press_Start_2P',monospace] text-[12px]"
              style={{ color: ARCADE_COLORS.gray }}
            >
              탭하여 계속
            </motion.span>
          </motion.div>
        )}

        {/* CONTINUE 버튼 */}
        {showVictoryButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onVictory}
            className="mt-4 px-8 py-3.5 font-['Press_Start_2P',monospace] text-[12px] sm:text-[13px] z-10"
            style={{
              color: '#000',
              background: ARCADE_COLORS.gold,
              border: '2px solid #b38f00',
              boxShadow: '4px 4px 0px #b38f00',
            }}
          >
            다음으로
          </motion.button>
        )}
      </div>
    );
  }

  // Fallback
  return null;
}
