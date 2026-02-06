'use client';

import { useReducer, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelCharacter } from './shared/PixelCharacter';

const ARCADE_COLORS = {
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
          className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
          style={{ color: ARCADE_COLORS.text }}
        >
          {label}
        </span>
        {showNumbers && (
          <span
            className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
            style={{ color: pct > 25 ? color : ARCADE_COLORS.red }}
          >
            {current}/{max}
          </span>
        )}
      </div>
      <div
        className="w-full h-2.5 sm:h-3"
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
    (cmd: 'ATTACK' | 'MAGIC' | 'ITEM' | 'ESCAPE') => {
      if (state.state !== 'idle' || isAnimating) return;

      if (cmd === 'ATTACK') {
        setBossShake(true);
        setFlashScreen(true);
        setTimeout(() => {
          setBossShake(false);
          setFlashScreen(false);
        }, 200);
      }

      if (cmd === 'MAGIC') {
        setFlashScreen(true);
        setTimeout(() => setFlashScreen(false), 250);
      }

      dispatch({ type: cmd });
      setLogIdx(0);
    },
    [state.state, isAnimating],
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

  const commands = [
    { label: '공격', key: 'ATTACK' as const, color: ARCADE_COLORS.red },
    { label: '마법', key: 'MAGIC' as const, color: ARCADE_COLORS.blue },
    { label: '아이템', key: 'ITEM' as const, color: ARCADE_COLORS.green },
    { label: '도망', key: 'ESCAPE' as const, color: ARCADE_COLORS.gray },
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

      {/* Boss area (top half) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-4 pb-2 min-h-0">
        {/* Boss info */}
        <div className="w-full max-w-xs mb-3">
          <div className="flex justify-between items-center mb-1">
            <span
              className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[10px]"
              style={{ color: ARCADE_COLORS.red }}
            >
              ADULTING Lv.99
            </span>
            <span
              className="font-['Press_Start_2P',monospace] text-[6px] sm:text-[7px]"
              style={{ color: ARCADE_COLORS.gray }}
            >
              {BOSS_PHASE_NAMES[state.bossPhase]}
            </span>
          </div>
          <HpBar label="HP" current={state.bossHp} max={state.bossMaxHp} color={ARCADE_COLORS.red} />
        </div>

        {/* Boss sprite (CSS art) */}
        <motion.div
          animate={bossShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center"
        >
          {/* Boss body using layered divs */}
          <div className="relative">
            {/* Phase-based appearance */}
            <motion.div
              className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center"
              style={{
                background: `linear-gradient(180deg,
                  ${state.bossPhase === 1 ? ARCADE_COLORS.gray : state.bossPhase === 2 ? '#663399' : ARCADE_COLORS.red}40,
                  ${ARCADE_COLORS.darkGray})`,
                border: `3px solid ${state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.gray}`,
                boxShadow: `
                  0 0 ${state.bossPhase * 6}px ${state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.gray}40,
                  inset 0 0 10px rgba(0,0,0,0.5)
                `,
                imageRendering: 'pixelated',
              }}
              animate={{
                boxShadow: [
                  `0 0 ${state.bossPhase * 6}px ${state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.gray}40`,
                  `0 0 ${state.bossPhase * 10}px ${state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.gray}60`,
                  `0 0 ${state.bossPhase * 6}px ${state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.gray}40`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Face */}
              <div className="text-center">
                <div className="flex justify-center gap-3 sm:gap-4 mb-1.5">
                  <span
                    className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[10px]"
                    style={{ color: state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.text }}
                  >
                    {'*'}
                  </span>
                  <span
                    className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[10px]"
                    style={{ color: state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.text }}
                  >
                    {'*'}
                  </span>
                </div>
                <span
                  className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px]"
                  style={{ color: state.bossPhase === 3 ? ARCADE_COLORS.red : ARCADE_COLORS.text }}
                >
                  {state.bossPhase === 1 ? '---' : state.bossPhase === 2 ? '~~~' : 'XXX'}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom section */}
      <div className="flex-shrink-0 px-2 pb-3 sm:px-4 sm:pb-4">
        {/* Party status bar */}
        <div
          className="w-full p-2 sm:p-3 mb-2"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: `2px solid ${ARCADE_COLORS.gray}`,
            imageRendering: 'pixelated',
          }}
        >
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Groom */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <PixelCharacter character="groom" size="mini" scale={1} />
                <span
                  className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
                  style={{ color: ARCADE_COLORS.blue }}
                >
                  {'강태욱'}
                </span>
              </div>
              <HpBar label="HP" current={state.groomHp} max={state.groomMaxHp} color={ARCADE_COLORS.green} showNumbers />
              <div className="mt-0.5">
                <HpBar label="MP" current={state.groomMp} max={state.groomMaxMp} color={ARCADE_COLORS.blue} showNumbers />
              </div>
            </div>
            {/* Bride */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <PixelCharacter character="bride" size="mini" scale={1} />
                <span
                  className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
                  style={{ color: ARCADE_COLORS.pink }}
                >
                  {'김선경'}
                </span>
              </div>
              <HpBar label="HP" current={state.brideHp} max={state.brideMaxHp} color={ARCADE_COLORS.green} showNumbers />
              <div className="mt-0.5">
                <HpBar label="MP" current={state.brideMp} max={state.brideMaxMp} color={ARCADE_COLORS.blue} showNumbers />
              </div>
            </div>
          </div>
        </div>

        {/* Log + command area */}
        <div className="flex gap-2">
          {/* Log box */}
          <div
            className="flex-1 min-h-[80px] sm:min-h-[90px] px-3 py-2 cursor-pointer"
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
              className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[10px] leading-[14px] sm:leading-[18px] whitespace-pre-wrap"
              style={{ color: ARCADE_COLORS.text }}
            >
              {currentLog}
            </p>
            {logIdx < state.log.length - 1 && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="font-['Press_Start_2P',monospace] text-[8px] block mt-1"
                style={{ color: ARCADE_COLORS.gray }}
              >
                {'\u25BC'}
              </motion.span>
            )}
          </div>

          {/* Command menu */}
          <div
            className="flex-shrink-0 w-[110px] sm:w-[130px] flex flex-col gap-1 p-1.5 sm:p-2"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: `3px solid ${ARCADE_COLORS.gray}`,
              imageRendering: 'pixelated',
            }}
          >
            {commands.map((cmd) => (
              <motion.button
                key={cmd.key}
                whileHover={state.state === 'idle' ? { x: 3 } : undefined}
                whileTap={state.state === 'idle' ? { scale: 0.95 } : undefined}
                onClick={() => handleCommand(cmd.key)}
                disabled={state.state !== 'idle' || isAnimating}
                className="w-full text-left px-2 py-1.5 font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px] disabled:opacity-40 transition-opacity"
                style={{
                  color: state.state === 'idle' ? cmd.color : ARCADE_COLORS.gray,
                  background: 'transparent',
                  borderBottom: `1px solid ${ARCADE_COLORS.darkGray}`,
                }}
              >
                {'>'} {cmd.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Victory overlay */}
      <AnimatePresence>
        {showVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center px-4"
            style={{ background: 'rgba(0, 0, 0, 0.85)' }}
          >
            <div className="text-center flex flex-col items-center gap-3">
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
                    fontSize: i === 2 || i === 4 ? '14px' : '10px',
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
                  className="mt-6 px-6 py-3 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
                  style={{
                    color: '#000',
                    background: ARCADE_COLORS.gold,
                    border: '2px solid #b38f00',
                    boxShadow: `4px 4px 0px #b38f00`,
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
