'use client';

import { useReducer, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelCharacter, ARCADE_COLORS } from './shared';
import type { EmotionType } from './shared';

// -- HP bar component --
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

// -- Battle state --
interface BattleState {
  bossHp: number;
  bossMaxHp: number;
  bossPhase: 1 | 2 | 3;
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
  | { type: 'ATTACK' }
  | { type: 'MAGIC' }
  | { type: 'ITEM' }
  | { type: 'ESCAPE' }
  | { type: 'COMBINE' }
  | { type: 'BOSS_TURN' }
  | { type: 'SET_IDLE' }
  | { type: 'VICTORY' };

const ESCAPE_MESSAGES = [
  '사랑에서는 도망칠 수 없다!',
  '이미 청첩장을 열었잖아!',
  'EXIT는 결혼식장에서만 가능합니다',
  '도망? 축의금은 이미 준비하셨잖아요',
  '하객 200명이 대기 중입니다',
  'Cmd+Z 로도 취소 불가입니다',
  'git revert 할 수 없는 커밋입니다',
];

const BOSS_PHASE_NAMES: Record<1 | 2 | 3, string> = {
  1: 'BUSY SCHEDULE',
  2: 'LONG DISTANCE',
  3: 'WEDDING PLANNING',
};

function getPhase(hp: number, maxHp: number): 1 | 2 | 3 {
  const pct = hp / maxHp;
  if (pct > 0.66) return 1;
  if (pct > 0.33) return 2;
  return 3;
}

function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'ATTACK': {
      const damage = 2500 + Math.floor(Math.random() * 1000);
      const newHp = Math.max(0, state.bossHp - damage);
      const newPhase = getPhase(newHp, state.bossMaxHp);
      const attackLines = [
        `강태욱의 공격!\n"야근은 이제 그만!"\n${damage.toLocaleString()} 데미지!`,
        `김선경의 공격!\n"우리 행복할 거야!"\n${damage.toLocaleString()} 데미지!`,
        `합동 공격: 커플 콤보!\n${damage.toLocaleString()} 데미지!`,
        `강태욱의 디버깅 어택!\n${damage.toLocaleString()} 데미지!`,
      ];
      const logs = [attackLines[state.turn % attackLines.length]];

      if (newHp <= 0) {
        return {
          ...state,
          bossHp: 0,
          bossPhase: newPhase,
          log: logs,
          state: 'victory',
          turn: state.turn + 1,
        };
      }
      return {
        ...state,
        bossHp: newHp,
        bossPhase: newPhase,
        log: logs,
        state: 'player_action',
        turn: state.turn + 1,
      };
    }

    case 'MAGIC': {
      const damage = 4000 + Math.floor(Math.random() * 1500);
      const heal = 500;
      const newHp = Math.max(0, state.bossHp - damage);
      const newPhase = getPhase(newHp, state.bossMaxHp);
      const magicLines = [
        `사랑의 주문!\n효과는 굉장했다!\n${damage.toLocaleString()} 데미지!`,
        `"우리의 사랑은 무적!"\nCRITICAL HIT!\n${damage.toLocaleString()} 데미지!`,
        `커플 합체 마법!\n"함께라면 못할 게 없어!"\n${damage.toLocaleString()} 데미지!`,
      ];
      const logs = [magicLines[state.turn % magicLines.length]];

      if (newHp <= 0) {
        return {
          ...state,
          bossHp: 0,
          bossPhase: newPhase,
          groomHp: Math.min(state.groomMaxHp, state.groomHp + heal),
          brideHp: Math.min(state.brideMaxHp, state.brideHp + heal),
          groomMp: Math.max(0, state.groomMp - 30),
          log: logs,
          state: 'victory',
          turn: state.turn + 1,
        };
      }
      return {
        ...state,
        bossHp: newHp,
        bossPhase: newPhase,
        groomHp: Math.min(state.groomMaxHp, state.groomHp + heal),
        brideHp: Math.min(state.brideMaxHp, state.brideHp + heal),
        groomMp: Math.max(0, state.groomMp - 30),
        log: logs,
        state: 'player_action',
        turn: state.turn + 1,
      };
    }

    case 'ITEM': {
      const heal = 800;
      const itemLines = [
        '엄마의 응원을 사용했다!\n"밥은 먹었니?"\n전원 HP 회복!',
        '아빠의 카드를 사용했다!\n"쓸 건 써야지"\n전원 HP 회복!',
        '친구의 축하를 사용했다!\n"야 축하해 ㅋㅋ 밥 사라"\n전원 HP+MP 회복!',
        '집밥을 사용했다!\n"역시 엄마 손맛..."\n전원 HP 완전 회복!',
      ];
      return {
        ...state,
        groomHp: Math.min(state.groomMaxHp, state.groomHp + heal),
        brideHp: Math.min(state.brideMaxHp, state.brideHp + heal),
        groomMp: Math.min(state.groomMaxMp, state.groomMp + 20),
        brideMp: Math.min(state.brideMaxMp, state.brideMp + 20),
        log: [itemLines[state.turn % itemLines.length]],
        state: 'player_action',
        turn: state.turn + 1,
      };
    }

    case 'ESCAPE': {
      const msg = ESCAPE_MESSAGES[state.escapeCount % ESCAPE_MESSAGES.length];
      return {
        ...state,
        log: [msg],
        escapeCount: state.escapeCount + 1,
        state: 'idle',
      };
    }

    case 'COMBINE': {
      const damage = 8000 + Math.floor(Math.random() * 2000);
      const heal = 1000;
      const newHp = Math.max(0, state.bossHp - damage);
      const newPhase = getPhase(newHp, state.bossMaxHp);
      const combineLines = [
        '두 사람의 마음이 하나로!',
        `사랑의 합체공격!\n${damage.toLocaleString()} 데미지!`,
        `전원 HP ${heal} 회복!`,
      ];

      if (newHp <= 0) {
        return {
          ...state,
          bossHp: 0,
          bossPhase: newPhase,
          groomHp: Math.min(state.groomMaxHp, state.groomHp + heal),
          brideHp: Math.min(state.brideMaxHp, state.brideHp + heal),
          groomMp: state.groomMp - 50,
          brideMp: state.brideMp - 50,
          log: combineLines,
          state: 'victory',
          turn: state.turn + 1,
        };
      }
      return {
        ...state,
        bossHp: newHp,
        bossPhase: newPhase,
        groomHp: Math.min(state.groomMaxHp, state.groomHp + heal),
        brideHp: Math.min(state.brideMaxHp, state.brideHp + heal),
        groomMp: state.groomMp - 50,
        brideMp: state.brideMp - 50,
        log: combineLines,
        state: 'player_action',
        turn: state.turn + 1,
      };
    }

    case 'BOSS_TURN': {
      const phaseDamage = { 1: 200, 2: 350, 3: 500 };
      const dmg = phaseDamage[state.bossPhase] + Math.floor(Math.random() * 100);
      const phase1Lines = [
        `야근 폭격! ${dmg} 데미지!`,
        `회의 소환! ${dmg} 데미지!`,
        `"이번 주말도 일해야 해..."\n${dmg} 데미지!`,
      ];
      const phase2Lines = [
        `그리움 파동! ${dmg} 데미지!\n"보고 싶어..."`,
        `통화 끊김 공격! ${dmg} 데미지!`,
        `시차 폭탄! ${dmg} 데미지!`,
      ];
      const phase3Lines = [
        `청첩장 200장 인쇄!\n스트레스 ${dmg} 데미지!`,
        `"식장은 어디로?"\n"뷔페 vs 한식?"\n${dmg} 데미지!`,
        `하객 명단 작성!\n"이 사람은 빼도 되나...?"\n${dmg} 데미지!`,
      ];
      const phaseMsgArrays = { 1: phase1Lines, 2: phase2Lines, 3: phase3Lines };
      const msgArr = phaseMsgArrays[state.bossPhase];
      const phaseMsg = msgArr[state.turn % msgArr.length];

      // In phase 3, couple gets stronger (reduce damage taken)
      const actualDmg = state.bossPhase === 3 ? Math.floor(dmg * 0.5) : dmg;

      return {
        ...state,
        groomHp: Math.max(1, state.groomHp - actualDmg),
        brideHp: Math.max(1, state.brideHp - actualDmg),
        log: [
          phaseMsg,
          ...(state.bossPhase === 3 ? ['...하지만 사랑의 힘으로\n데미지 50% 감소!'] : []),
        ],
        state: 'idle',
      };
    }

    case 'SET_IDLE':
      return { ...state, state: 'idle' };

    case 'VICTORY':
      return { ...state, state: 'victory' };

    default:
      return state;
  }
}

// 보스 픽셀 스프라이트 (16x16) - "ADULTING" 몬스터
// 0=transparent, 1=dark gray body, 2=red eyes/accent, 3=purple aura, 4=dark outline, 5=white teeth
const BOSS_COLORS: Record<number, string> = {
  0: 'transparent',
  1: '#4a4a6a', // 몸체
  2: '#ff4444', // 눈/강조
  3: '#663399', // 보라색 오라
  4: '#1a1a2e', // 외곽선
  5: '#ffffff', // 이빨
  6: '#8b8b8b', // 회색 디테일
  7: '#ffcc00', // 황금 장식
};

const BOSS_SPRITE: number[][] = [
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,3,4,4,4,4,4,4,4,4,3,0,0,0],
  [0,0,3,4,1,1,1,1,1,1,1,1,4,3,0,0],
  [0,3,4,1,1,1,1,1,1,1,1,1,1,4,3,0],
  [0,3,4,1,2,2,1,1,1,2,2,1,1,4,3,0],
  [0,3,4,1,2,5,1,1,1,2,5,1,1,4,3,0],
  [0,3,4,1,1,1,1,6,1,1,1,1,1,4,3,0],
  [0,3,4,1,1,5,5,5,5,5,5,1,1,4,3,0],
  [0,3,4,1,1,4,5,4,5,4,5,1,1,4,3,0],
  [0,0,3,4,1,1,1,1,1,1,1,1,4,3,0,0],
  [0,0,3,4,1,7,1,1,1,7,1,1,4,3,0,0],
  [0,0,0,3,4,1,1,1,1,1,1,4,3,0,0,0],
  [0,0,3,3,4,1,1,1,1,1,1,4,3,3,0,0],
  [0,3,3,0,4,4,1,1,1,1,4,4,0,3,3,0],
  [3,3,0,0,0,4,4,4,4,4,4,0,0,0,3,3],
  [3,0,0,0,0,0,4,4,4,4,0,0,0,0,0,3],
];

// 보스 스프라이트 렌더러
function BossSprite({ phase, shake }: { phase: 1 | 2 | 3; shake: boolean }) {
  const scale = 5;
  const rows = BOSS_SPRITE.length;
  const cols = BOSS_SPRITE[0].length;

  const phaseColors: Record<number, Record<number, string>> = {
    1: BOSS_COLORS,
    2: { ...BOSS_COLORS, 3: '#9933cc', 2: '#ff6666' },
    3: { ...BOSS_COLORS, 3: '#cc0000', 2: '#ff0000', 1: '#3a3a5a' },
  };
  const colors = phaseColors[phase];

  const shadows: string[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = BOSS_SPRITE[y][x];
      if (c === 0) continue;
      const color = colors[c] || BOSS_COLORS[c];
      if (!color || color === 'transparent') continue;
      shadows.push(`${(x + 1) * scale}px ${(y + 1) * scale}px 0 ${color}`);
    }
  }

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
            boxShadow: shadows.join(','),
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>
      {/* 페이즈별 글로우 */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -8,
          borderRadius: '50%',
          background: phase === 3 ? 'radial-gradient(circle, rgba(255,0,0,0.15) 0%, transparent 70%)'
            : phase === 2 ? 'radial-gradient(circle, rgba(153,51,204,0.1) 0%, transparent 70%)'
            : 'none',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

/* ── 데미지 숫자 팝업 ── */
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

const INITIAL_STATE: BattleState = {
  bossHp: 9999,
  bossMaxHp: 9999,
  bossPhase: 1,
  groomHp: 9999,
  groomMaxHp: 9999,
  groomMp: 100,
  groomMaxMp: 100,
  brideHp: 9999,
  brideMaxHp: 9999,
  brideMp: 100,
  brideMaxMp: 100,
  turn: 0,
  log: ['BOSS가 나타났다!\nADULTING Lv.99!\n\n"결혼이 쉬울 줄 알았나?"'],
  state: 'idle',
  escapeCount: 0,
};

interface BossBattleProps {
  onVictory: () => void;
}

export function BossBattle({ onVictory }: BossBattleProps) {
  const [state, dispatch] = useReducer(battleReducer, INITIAL_STATE);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryStep, setVictoryStep] = useState(0);
  const [logIdx, setLogIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bossShake, setBossShake] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [showCombineHearts, setShowCombineHearts] = useState(false);

  const addDamageNumber = useCallback((value: number, x: number, y: number, isHeal: boolean) => {
    const id = `dmg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const color = isHeal ? ARCADE_COLORS.green : ARCADE_COLORS.red;
    setDamageNumbers((prev) => [...prev, { id, value, x, y, color, isHeal }]);
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 1200);
  }, []);

  const currentLog = state.log[logIdx] || '';

  // Handle log advancement and boss turn
  const advanceLog = useCallback(() => {
    if (logIdx < state.log.length - 1) {
      setLogIdx((prev) => prev + 1);
      return;
    }

    // All logs shown
    if (state.state === 'player_action') {
      // After player action, boss attacks
      setIsAnimating(true);
      setTimeout(() => {
        const phaseDmg = { 1: 200, 2: 350, 3: 500 };
        const bossDmg = phaseDmg[state.bossPhase] + Math.floor(Math.random() * 100);
        const actualBossDmg = state.bossPhase === 3 ? Math.floor(bossDmg * 0.5) : bossDmg;
        addDamageNumber(actualBossDmg, 20, 55, false);
        dispatch({ type: 'BOSS_TURN' });
        setLogIdx(0);
        setIsAnimating(false);
      }, 200);
    } else if (state.state === 'victory') {
      setShowVictory(true);
    } else {
      // Idle: waiting for player input
    }
  }, [logIdx, state.log.length, state.state]);

  // Handle player command
  const handleCommand = useCallback(
    (cmd: 'ATTACK' | 'MAGIC' | 'ITEM' | 'ESCAPE' | 'COMBINE') => {
      if (state.state !== 'idle' || isAnimating) return;

      // 데미지 계산용 (실제 reducer 결과와 동일한 로직)
      if (cmd === 'ATTACK') {
        const dmg = 2500 + Math.floor(Math.random() * 1000);
        setBossShake(true);
        setFlashScreen(true);
        addDamageNumber(dmg, 75, 25, false);
        setTimeout(() => { setBossShake(false); setFlashScreen(false); }, 200);
      }

      if (cmd === 'MAGIC') {
        const dmg = 4000 + Math.floor(Math.random() * 1500);
        setBossShake(true);
        setFlashScreen(true);
        addDamageNumber(dmg, 75, 25, false);
        addDamageNumber(500, 20, 60, true);
        setTimeout(() => { setBossShake(false); setFlashScreen(false); }, 250);
      }

      if (cmd === 'ITEM') {
        addDamageNumber(800, 15, 60, true);
        addDamageNumber(20, 30, 65, true);
      }

      if (cmd === 'COMBINE') {
        const dmg = 8000 + Math.floor(Math.random() * 2000);
        setBossShake(true);
        setFlashScreen(true);
        setShowCombineHearts(true);
        addDamageNumber(dmg, 75, 25, false);
        addDamageNumber(1000, 20, 60, true);
        setTimeout(() => { setBossShake(false); setFlashScreen(false); setShowCombineHearts(false); }, 1500);
      }

      dispatch({ type: cmd });
      setLogIdx(0);
    },
    [state.state, isAnimating, addDamageNumber],
  );

  // Victory sequence progression
  useEffect(() => {
    if (!showVictory) return;
    if (victoryStep >= 6) return;
    const timer = setTimeout(() => {
      setVictoryStep((prev) => prev + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [showVictory, victoryStep]);

  const VICTORY_LINES = [
    'ADULTING을 쓰러뜨렸다!',
    'EXP: 99,999,999 획득!',
    'LEVEL UP!',
    'Lv.LOVER \u2192 Lv.MARRIED',
    'NEW TITLE: 부부',
    'ACHIEVEMENT UNLOCKED:\n영원한 사랑',
  ];

  const canCombine = state.groomMp >= 50 && state.brideMp >= 50;
  const commands = [
    { label: '공격', key: 'ATTACK' as const, color: ARCADE_COLORS.red, disabled: false },
    { label: '마법', key: 'MAGIC' as const, color: ARCADE_COLORS.blue, disabled: state.groomMp < 30 },
    { label: '합체기', key: 'COMBINE' as const, color: ARCADE_COLORS.pink, disabled: !canCombine },
    { label: '아이템', key: 'ITEM' as const, color: ARCADE_COLORS.green, disabled: false },
  ];

  return (
    <div
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ background: ARCADE_COLORS.bg }}
    >
      {/* Screen flash */}
      <AnimatePresence>
        {flashScreen && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ background: ARCADE_COLORS.text }}
          />
        )}
      </AnimatePresence>

      {/* 포켓몬 스타일 배틀 필드 */}
      <div
        className="flex-1 relative min-h-0 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 40%, #3a5a3a 60%, #4a7a4a 100%)`,
        }}
      >
        {/* 배틀 필드 바닥 라인 */}
        <div
          className="absolute left-0 right-0"
          style={{ top: '55%', height: '2px', background: 'rgba(255,255,255,0.08)' }}
        />

        {/* 배경 요소: 풀밭 디테일 */}
        {[15, 35, 55, 75, 90].map((left, i) => (
          <div
            key={`grass-${i}`}
            className="absolute"
            style={{
              left: `${left}%`,
              bottom: `${42 + (i % 3) * 2}%`,
              width: 6 + (i % 2) * 4,
              height: 8,
              background: `linear-gradient(0deg, #3a5a3a, ${i % 2 === 0 ? '#5a8a5a' : '#4a7a4a'})`,
              borderRadius: '40% 40% 0 0',
              opacity: 0.6,
            }}
          />
        ))}

        {/* 배경 요소: 바위 */}
        {[{ l: 80, b: 44, s: 14 }, { l: 25, b: 43, s: 10 }, { l: 60, b: 45, s: 8 }].map((r, i) => (
          <div
            key={`rock-${i}`}
            className="absolute"
            style={{
              left: `${r.l}%`,
              bottom: `${r.b}%`,
              width: r.s,
              height: r.s * 0.7,
              background: 'linear-gradient(135deg, #5a5a6a, #3a3a4a)',
              borderRadius: '30%',
              opacity: 0.5,
            }}
          />
        ))}

        {/* 배경 요소: 떠다니는 파티클 */}
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
              background: i % 3 === 0 ? '#9966cc40' : i % 3 === 1 ? '#ffffff20' : '#ffcc0020',
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
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.span
                key={`combine-heart-${i}`}
                className="absolute"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: '50%',
                  fontSize: 16 + Math.random() * 12,
                  color: i % 2 === 0 ? ARCADE_COLORS.pink : ARCADE_COLORS.gold,
                }}
                initial={{ y: 0, opacity: 1, scale: 0 }}
                animate={{
                  y: -80 - Math.random() * 60,
                  x: (Math.random() - 0.5) * 80,
                  opacity: [1, 1, 0],
                  scale: [0, 1.3, 0.8],
                }}
                transition={{ duration: 1.2, delay: Math.random() * 0.3 }}
              >
                {i % 3 === 0 ? '\u2665' : '\u2736'}
              </motion.span>
            ))}
          </div>
        )}

        {/* 보스 영역 (우측 상단) */}
        <div className="absolute top-3 right-2 sm:right-4 flex flex-col items-end">
          {/* 보스 HP 바 */}
          <div className="w-[200px] sm:w-[250px] mb-2 p-2"
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
                ADULTING Lv.99
              </span>
              <span
                className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
                style={{ color: ARCADE_COLORS.gray }}
              >
                {BOSS_PHASE_NAMES[state.bossPhase]}
              </span>
            </div>
            <HpBar label="HP" current={state.bossHp} max={state.bossMaxHp} color={ARCADE_COLORS.red} />
          </div>
          {/* 보스 스프라이트 */}
          <div className="relative mr-2 sm:mr-6">
            <BossSprite phase={state.bossPhase} shake={bossShake} />
          </div>
        </div>

        {/* 아군 영역 (좌측 하단) - 뒷모습 */}
        <div className="absolute bottom-4 left-2 sm:left-4 flex flex-col items-start">
          {/* 아군 스프라이트 (뒷모습) */}
          <div className="flex items-end gap-1 mb-2">
            <motion.div
              animate={state.state === 'player_action' ? { x: [0, 6, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              <PixelCharacter character="groom" size="full" scale={4} facing="back" />
            </motion.div>
            <motion.div
              animate={state.state === 'player_action' ? { x: [0, 6, 0] } : {}}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <PixelCharacter character="bride" size="full" scale={4} facing="back" />
            </motion.div>
          </div>
          {/* 아군 HP 바 */}
          <div className="w-[200px] sm:w-[250px] p-2"
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: `2px solid ${ARCADE_COLORS.gray}`,
            }}
          >
            <div className="grid grid-cols-2 gap-1">
              <div>
                <HpBar label="GROOM" current={state.groomHp} max={state.groomMaxHp} color={ARCADE_COLORS.green} showNumbers />
                <div className="mt-0.5">
                  <HpBar label="MP" current={state.groomMp} max={state.groomMaxMp} color={ARCADE_COLORS.blue} showNumbers />
                </div>
              </div>
              <div>
                <HpBar label="BRIDE" current={state.brideHp} max={state.brideMaxHp} color={ARCADE_COLORS.green} showNumbers />
                <div className="mt-0.5">
                  <HpBar label="MP" current={state.brideMp} max={state.brideMaxMp} color={ARCADE_COLORS.blue} showNumbers />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단: 로그 + 커맨드 */}
      <div className="flex-shrink-0 px-2 pb-3 sm:px-4 sm:pb-4">
        {/* Log + command area */}
        <div className="flex gap-2">
          {/* Log box */}
          <div
            className="flex-1 min-h-[100px] sm:min-h-[110px] px-4 py-3 cursor-pointer"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: `3px solid ${ARCADE_COLORS.gray}`,
              imageRendering: 'pixelated',
            }}
            onClick={advanceLog}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                advanceLog();
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
            {logIdx < state.log.length - 1 && (
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
            {commands.map((cmd) => (
              <motion.button
                key={cmd.key}
                whileHover={state.state === 'idle' && !cmd.disabled ? { x: 3 } : undefined}
                whileTap={state.state === 'idle' && !cmd.disabled ? { scale: 0.95 } : undefined}
                onClick={() => handleCommand(cmd.key)}
                disabled={state.state !== 'idle' || isAnimating || cmd.disabled}
                className="w-full text-left px-2 py-1.5 font-['Press_Start_2P',monospace] text-[9px] sm:text-[11px] disabled:opacity-30 transition-opacity"
                style={{
                  color: state.state === 'idle' && !cmd.disabled ? cmd.color : ARCADE_COLORS.gray,
                  background: 'transparent',
                  borderBottom: `1px solid ${ARCADE_COLORS.darkGray}`,
                }}
              >
                {'>'} {cmd.label}
              </motion.button>
            ))}
            <motion.button
              whileHover={state.state === 'idle' ? { x: 2 } : undefined}
              onClick={() => handleCommand('ESCAPE')}
              disabled={state.state !== 'idle' || isAnimating}
              className="w-full text-center pt-1 font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px] disabled:opacity-30 transition-opacity"
              style={{ color: ARCADE_COLORS.gray, background: 'transparent' }}
            >
              도망
            </motion.button>
          </div>
        </div>
      </div>

      {/* 승리 오버레이 - 커플 만남 연출 */}
      <AnimatePresence>
        {showVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center px-4"
            style={{ background: 'rgba(0, 0, 0, 0.9)' }}
          >
            {/* 커플 만남 씬 (step 0~1에서 등장) */}
            {victoryStep >= 0 && (
              <div className="relative flex items-end justify-center gap-0 mb-6" style={{ height: 80 }}>
                {/* 신랑: 왼쪽에서 걸어옴 */}
                <motion.div
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <PixelCharacter
                    character="groom"
                    size="full"
                    scale={4}
                    emotion={victoryStep >= 3 ? 'love' : 'happy'}
                  />
                </motion.div>
                {/* 신부: 오른쪽에서 걸어옴 */}
                <motion.div
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                >
                  <PixelCharacter
                    character="bride"
                    size="full"
                    scale={4}
                    emotion={victoryStep >= 3 ? 'love' : 'happy'}
                  />
                </motion.div>
                {/* 하트 폭발 (step 2 이후) */}
                {victoryStep >= 2 && (
                  <motion.div
                    className="absolute"
                    style={{ top: -20, left: '50%', transform: 'translateX(-50%)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute"
                        style={{
                          fontSize: 12 + Math.random() * 8,
                          color: i % 2 === 0 ? ARCADE_COLORS.pink : ARCADE_COLORS.gold,
                        }}
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{
                          x: (i - 2.5) * 18,
                          y: -20 - Math.random() * 30,
                          opacity: [1, 1, 0],
                          scale: [0.5, 1.2, 0.8],
                        }}
                        transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
                      >
                        {i % 3 === 0 ? '\u2665' : '\u2736'}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {/* 텍스트 라인 */}
            <div className="text-center flex flex-col items-center gap-2.5">
              {VICTORY_LINES.slice(0, victoryStep + 1).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-['Press_Start_2P',monospace] whitespace-pre-wrap"
                  style={{
                    color:
                      i === 0 ? ARCADE_COLORS.gold :
                      i === 1 ? ARCADE_COLORS.green :
                      i === 2 ? ARCADE_COLORS.gold :
                      i === 3 ? ARCADE_COLORS.blue :
                      i === 4 ? ARCADE_COLORS.pink :
                      ARCADE_COLORS.gold,
                    fontSize: i === 2 || i === 4 ? '18px' : '13px',
                    textShadow: i === 5
                      ? `0 0 8px ${ARCADE_COLORS.gold}60`
                      : undefined,
                  }}
                >
                  {line}
                </motion.p>
              ))}

              {victoryStep >= 5 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={onVictory}
                  className="mt-6 px-8 py-3.5 font-['Press_Start_2P',monospace] text-[12px] sm:text-[13px]"
                  style={{
                    color: '#000',
                    background: ARCADE_COLORS.gold,
                    border: '2px solid #b38f00',
                    boxShadow: '4px 4px 0px #b38f00',
                  }}
                >
                  CONTINUE
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
