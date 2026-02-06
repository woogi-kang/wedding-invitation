'use client';

import { useState, useCallback, useEffect } from 'react';
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

// -- Inline DialogBox for self-contained builds --
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

  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={() => {
        if (!done) {
          setDisplayed(text);
          setDone(true);
        } else {
          onComplete?.();
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!done) {
            setDisplayed(text);
            setDone(true);
          } else {
            onComplete?.();
          }
        }
      }}
      aria-label="Dialog - click to advance"
    >
      <div
        className="relative w-full px-4 py-3"
        style={{
          background: 'rgba(0,0,0,0.9)',
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
            <PixelCharacter
              character={speaker === '강태욱' ? 'groom' : 'bride'}
              size="mini"
              scale={1}
            />
          )}
          <span
            className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px]"
            style={{ color: ARCADE_COLORS.gold }}
          >
            {speaker}
          </span>
        </div>
        <p
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[11px] leading-[16px] sm:leading-[20px] mt-2 min-h-[40px] whitespace-pre-wrap"
          style={{ color: ARCADE_COLORS.text }}
        >
          {displayed}
        </p>
        {done && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute bottom-2 right-4 font-['Press_Start_2P',monospace] text-[8px]"
            style={{ color: ARCADE_COLORS.text }}
          >
            {'\u25BC'}
          </motion.span>
        )}
      </div>
    </div>
  );
}

// -- Stage scripts --
type ScriptStep =
  | { type: 'dialog'; speaker: string; text: string }
  | { type: 'choice'; prompt: string; options: string[]; escapeIdx?: number }
  | { type: 'effect'; effectType: 'hp_drain' | 'items' | 'hearts' }
  | { type: 'result'; text: string };

interface StageScript {
  title: string;
  steps: ScriptStep[];
}

const ESCAPE_LINES = [
  '도망칠 수 없다!',
  '도망칠 수 없다! (진짜로)',
  '포기해. 운명이야.',
  '개발자면 포기란 없잖아?',
  '404: EXIT NOT FOUND',
];

const STAGE_SCRIPTS: StageScript[] = [
  // Stage 0: First Encounter
  {
    title: 'STAGE 1: First Encounter',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '야생의 김선경이(가) 나타났다!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '...잠깐, 심장 박동수가\n180을 넘었다' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'WARNING: cardiac_event.exe\n실행 중...' },
      {
        type: 'choice',
        prompt: '어떻게 하시겠습니까?',
        options: ['말을 건다', '도망친다'],
        escapeIdx: 1,
      },
      { type: 'dialog', speaker: '강태욱', text: '안...안녕하세요!\n저는 강태욱이라고...' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(내면의 소리: 아 왜 목소리가\n옥타브가 올라가지)' },
      { type: 'dialog', speaker: '김선경', text: '안녕하세요! 반가워요 :)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(강태욱의 뇌가 3초간\n정지했다)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(김선경은 이 어색함을\n못 느낀 것 같다)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(아니 느꼈다)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '호감도가 급상승했다!\nDEBUG: 호감도 = Integer.MAX_VALUE' },
      { type: 'result', text: '첫 만남 이벤트 클리어!' },
    ],
  },
  // Stage 1: Growing Love
  {
    title: 'STAGE 2: Butterfly Effect',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '강태욱에게 상태이상이 걸렸다!' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'STATUS: LOVE_STRUCK\nDURATION: PERMANENT' },
      { type: 'effect', effectType: 'hp_drain' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'HP가 줄어들고 있다...!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '부작용 발현 중...' },
      { type: 'dialog', speaker: 'SYSTEM', text: '- 5분마다 카톡 확인\n- 이유 없이 웃음\n- 갑자기 연애 노래가 이해됨' },
      { type: 'dialog', speaker: 'SYSTEM', text: '치료 시도: 친구에게 상담' },
      { type: 'dialog', speaker: '친구', text: '야 너 완전 빠졌다 ㅋㅋㅋㅋ\n치료 불가 ㅋㅋ' },
      { type: 'dialog', speaker: 'SYSTEM', text: '치료 실패!\n...하지만 사랑의 HP는\n무한이었다!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '사랑 포인트 +9999!\n(이미 오버플로우)' },
      { type: 'result', text: '사랑 성장 이벤트 클리어!' },
    ],
  },
  // Stage 2: Anniversary
  {
    title: 'STAGE 3: Side Quests',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '사이드 퀘스트 보상 정산 중...' },
      { type: 'effect', effectType: 'items' },
      { type: 'dialog', speaker: 'SYSTEM', text: '커플 잠옷을 획득했다!\n(착용 필수, 해제 불가)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '서로의 폰 비밀번호 획득!\n(신뢰 +999)' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'IKEA 가구 공동 조립\n퀘스트 클리어!\n(인내 +500, 관계 위기 +1)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '첫 싸움을 경험했다!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '...30분 만에 화해했다!\n스킬 습득: 화해의 기술 Lv.MAX' },
      { type: 'dialog', speaker: 'SYSTEM', text: '맛집 리스트 x147 획득!\n(위장 용량 초과 경고)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '숨겨진 업적 달성:\n"서로 없으면 안 되는 사이"' },
      { type: 'result', text: '기념일 이벤트 클리어!' },
    ],
  },
  // Stage 3: The Proposal
  {
    title: 'STAGE 4: The Proposal',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '강태욱이 긴장 상태에\n돌입했다!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(손이 떨리고 있다)\n(무릎이 떨리고 있다)\n(전부 떨리고 있다)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '아이템 사용:\nRing of Eternal Promise' },
      { type: 'dialog', speaker: 'SYSTEM', text: '손이 너무 떨려서\n반지를 떨어뜨렸다!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '...어쨌든 반지를 주웠다' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'ERROR: NO 버튼을 찾을 수\n없습니다' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'NO.exe has been\npermanently deleted' },
      {
        type: 'choice',
        prompt: '결혼해 주시겠습니까?',
        options: ['YES', '당연하지', '빨리 반지 줘', '이미 YES'],
      },
      { type: 'dialog', speaker: 'SYSTEM', text: '효과는 굉장했다!' },
      { type: 'effect', effectType: 'hearts' },
      { type: 'dialog', speaker: '김선경', text: '...바보야. 당연하지!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '강태욱이 울었다!\n김선경도 울었다!\n(근처 테이블 손님도 울었다)' },
      { type: 'dialog', speaker: 'SYSTEM', text: '프로포즈 대성공!\ncommit -m "feat: 영원의 약속"' },
      { type: 'result', text: '프로포즈 이벤트 클리어!' },
    ],
  },
];

interface StageEventProps {
  stageIndex: number;
  onComplete: () => void;
  onClose: () => void;
}

export function StageEvent({ stageIndex, onComplete, onClose }: StageEventProps) {
  const script = STAGE_SCRIPTS[stageIndex] || STAGE_SCRIPTS[0];
  const [stepIdx, setStepIdx] = useState(0);
  const [showClear, setShowClear] = useState(false);
  const [escapeAttempt, setEscapeAttempt] = useState(false);
  // Items animation state
  const [shownItems, setShownItems] = useState<string[]>([]);
  // Hearts animation state
  const [showHearts, setShowHearts] = useState(false);
  // HP bar state
  const [hpPercent, setHpPercent] = useState(100);
  const [escapeCount, setEscapeCount] = useState(0);

  const currentStep = script.steps[stepIdx];

  const advanceStep = useCallback(() => {
    if (stepIdx < script.steps.length - 1) {
      setStepIdx((prev) => prev + 1);
    }
  }, [stepIdx, script.steps.length]);

  // Handle effect auto-advance
  useEffect(() => {
    if (!currentStep || currentStep.type !== 'effect') return;

    if (currentStep.effectType === 'hp_drain') {
      // Animate HP draining
      const interval = setInterval(() => {
        setHpPercent((prev) => {
          if (prev <= 10) {
            clearInterval(interval);
            return 10;
          }
          return prev - 5;
        });
      }, 100);
      const timer = setTimeout(advanceStep, 1500);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }

    if (currentStep.effectType === 'items') {
      const items = ['🎂 1주년 케이크', '📸 추억의 사진 x99', '💍 2주년 반지'];
      items.forEach((item, i) => {
        setTimeout(() => {
          setShownItems((prev) => [...prev, item]);
        }, 600 * (i + 1));
      });
      const timer = setTimeout(advanceStep, 2500);
      return () => clearTimeout(timer);
    }

    if (currentStep.effectType === 'hearts') {
      setShowHearts(true);
      const timer = setTimeout(advanceStep, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, advanceStep]);

  // Handle result -> show STAGE CLEAR
  useEffect(() => {
    if (currentStep?.type === 'result') {
      const timer = setTimeout(() => setShowClear(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleChoice = (choiceIdx: number) => {
    if (!currentStep || currentStep.type !== 'choice') return;

    // Check if this is an escape choice
    if (currentStep.escapeIdx !== undefined && choiceIdx === currentStep.escapeIdx) {
      setEscapeAttempt(true);
      setEscapeCount((prev) => prev + 1);
      setTimeout(() => {
        setEscapeAttempt(false);
      }, 1200);
      return;
    }

    advanceStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.85)' }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-['Press_Start_2P',monospace] text-[10px] px-2 py-1 z-10"
        style={{
          color: ARCADE_COLORS.gray,
          border: `1px solid ${ARCADE_COLORS.gray}`,
          background: ARCADE_COLORS.bg,
        }}
        aria-label="Close stage event"
      >
        X
      </button>

      {/* Stage title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-4"
      >
        <p
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[11px] text-center"
          style={{ color: ARCADE_COLORS.gold }}
        >
          {script.title}
        </p>
      </motion.div>

      {/* Stage content area */}
      <div className="w-full max-w-lg px-4 flex flex-col items-center gap-4 flex-1 justify-center">
        {/* HP bar for stage 1 */}
        {stageIndex === 1 && (
          <div className="w-full max-w-xs">
            <div className="flex justify-between mb-1">
              <span
                className="font-['Press_Start_2P',monospace] text-[7px]"
                style={{ color: ARCADE_COLORS.text }}
              >
                HP
              </span>
              <span
                className="font-['Press_Start_2P',monospace] text-[7px]"
                style={{ color: hpPercent > 30 ? ARCADE_COLORS.green : ARCADE_COLORS.red }}
              >
                {hpPercent}%
              </span>
            </div>
            <div
              className="w-full h-3"
              style={{ background: ARCADE_COLORS.darkGray, border: `1px solid ${ARCADE_COLORS.gray}` }}
            >
              <motion.div
                className="h-full"
                style={{
                  background: hpPercent > 30 ? ARCADE_COLORS.green : ARCADE_COLORS.red,
                }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* Items display for stage 2 */}
        {stageIndex === 2 && shownItems.length > 0 && (
          <div className="flex flex-col gap-2">
            {shownItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="px-3 py-1.5"
                style={{
                  background: `${ARCADE_COLORS.gold}15`,
                  border: `2px solid ${ARCADE_COLORS.gold}`,
                }}
              >
                <span
                  className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px]"
                  style={{ color: ARCADE_COLORS.gold }}
                >
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Hearts explosion */}
        {showHearts && (
          <div className="relative w-full h-32 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-[16px] sm:text-[20px]"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  bottom: '0%',
                  color: ARCADE_COLORS.pink,
                }}
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  y: -(100 + Math.random() * 100),
                  opacity: [1, 1, 0],
                  scale: [0.5, 1.2, 0.8],
                  x: (Math.random() - 0.5) * 60,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              >
                {'♥'}
              </motion.span>
            ))}
          </div>
        )}

        {/* Escape attempt message */}
        <AnimatePresence>
          {escapeAttempt && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-2 text-center"
              style={{
                background: `${ARCADE_COLORS.red}20`,
                border: `2px solid ${ARCADE_COLORS.red}`,
              }}
            >
              <p
                className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[11px]"
                style={{ color: ARCADE_COLORS.red }}
              >
                {ESCAPE_LINES[(escapeCount - 1) % ESCAPE_LINES.length]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dialog / choice area at bottom */}
      <div className="w-full max-w-lg px-4 pb-6">
        {currentStep?.type === 'dialog' && (
          <MiniDialog
            speaker={currentStep.speaker}
            text={currentStep.text}
            onComplete={advanceStep}
          />
        )}

        {currentStep?.type === 'choice' && !escapeAttempt && (
          <div
            className="w-full px-4 py-3"
            style={{
              background: 'rgba(0,0,0,0.9)',
              border: `3px solid ${ARCADE_COLORS.gray}`,
              imageRendering: 'pixelated',
            }}
          >
            <p
              className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] mb-3"
              style={{ color: ARCADE_COLORS.text }}
            >
              {currentStep.prompt}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentStep.options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleChoice(i)}
                  className="px-3 py-2 font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] text-left"
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
        )}

        {currentStep?.type === 'result' && (
          <div className="text-center">
            <MiniDialog
              speaker="SYSTEM"
              text={currentStep.text}
              onComplete={() => {}}
            />
          </div>
        )}
      </div>

      {/* STAGE CLEAR overlay */}
      <AnimatePresence>
        {showClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <p
                className="font-['Press_Start_2P',monospace] text-[20px] sm:text-[32px]"
                style={{
                  color: ARCADE_COLORS.gold,
                  textShadow: `
                    0 0 10px ${ARCADE_COLORS.gold}80,
                    0 0 20px ${ARCADE_COLORS.gold}40,
                    4px 4px 0px #b38f00
                  `,
                }}
              >
                STAGE CLEAR!
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-3 h-[2px] w-48 mx-auto"
                style={{ background: `linear-gradient(90deg, transparent, ${ARCADE_COLORS.gold}, transparent)` }}
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onComplete}
              className="mt-8 px-6 py-3 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
              style={{
                color: '#000',
                background: ARCADE_COLORS.gold,
                border: '2px solid #b38f00',
                boxShadow: `4px 4px 0px #b38f00`,
              }}
            >
              CONTINUE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
