'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TRIGGER_PROGRESS = 0.3;
const SESSION_DISMISS_KEY = 'wedding_secret_route_prompt_hidden';

const PROMPT_THEME = {
  signalDefault: 'STORY MODE READY',
  signalPool: ['ARCADE PASS OPEN', 'WEDDING QUEST ENTRY', 'PRESS START TO ENTER'],
  heading: '웨딩 퀘스트 입장권이 열렸어요',
  description: '첫만남부터 프로포즈까지, 선택하며 진행하는 스토리형 아케이드입니다.',
  enterLabel: '아케이드 시작',
  dismissLabel: '나중에 보기',
  ticketTitle: 'WEDDING QUEST STORY MODE',
  ticketCode: 'PASS-ID: WQ-0405-ARCADE',
  cardBackground:
    'linear-gradient(164deg, rgba(10,18,43,0.96) 0%, rgba(14,28,67,0.96) 56%, rgba(10,18,45,0.97) 100%)',
  accentGlow: 'rgba(98, 236, 224, 0.18)',
  borderColor: 'rgba(101, 228, 251, 0.44)',
  borderSoftColor: 'rgba(187, 247, 255, 0.2)',
  signalColor: '#7ff0ff',
  headingColor: '#ffe997',
  bodyColor: 'rgba(223, 237, 255, 0.92)',
  ticketBackground:
    'linear-gradient(140deg, rgba(14,34,81,0.9) 0%, rgba(18,45,103,0.88) 46%, rgba(14,31,78,0.9) 100%)',
  primaryButton: 'linear-gradient(180deg, #55f2d8 0%, #14b9a1 100%)',
  primaryButtonText: '#04211b',
  chipBackground: 'linear-gradient(180deg, #6df8df 0%, #2ecdb6 100%)',
  fabGradient: 'radial-gradient(circle at 35% 30%, #ffe388 0%, #d59c2f 54%, #80500f 100%)',
};

function getInitialDismissed(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function getScrollProgress(): number {
  if (typeof window === 'undefined') return 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  return window.scrollY / maxScroll;
}

export function SecretRoutePrompt() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => getInitialDismissed(SESSION_DISMISS_KEY));
  const [hasTriggered, setHasTriggered] = useState(() => getInitialDismissed(SESSION_DISMISS_KEY));
  const [pulseActive, setPulseActive] = useState(false);
  const [signalLabel, setSignalLabel] = useState(PROMPT_THEME.signalDefault);
  const displaySignalLabel = hasTriggered ? signalLabel : PROMPT_THEME.signalDefault;

  useEffect(() => {
    if (dismissed || hasTriggered) return;

    const onScroll = () => {
      const progress = getScrollProgress();
      if (progress >= TRIGGER_PROGRESS) {
        setVisible(true);
        setHasTriggered(true);
        setSignalLabel(PROMPT_THEME.signalPool[Math.floor(Math.random() * PROMPT_THEME.signalPool.length)]);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [dismissed, hasTriggered]);

  useEffect(() => {
    if (!visible) return;

    const intervalId = window.setInterval(() => {
      setPulseActive(true);
      window.setTimeout(() => setPulseActive(false), 120);
    }, 2400);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    } catch {
      // ignore storage failures
    }
  };

  const handleReopen = () => {
    setVisible(true);
  };

  const handleEnterArcade = () => {
    try {
      sessionStorage.removeItem(SESSION_DISMISS_KEY);
    } catch {
      // ignore storage failures
    }
    router.push('/invitation/arcade');
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.aside
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-5 z-[80] mx-auto max-w-sm sm:bottom-6"
          >
            <div
              className={`relative overflow-hidden rounded-[14px] border px-4 pb-3.5 pt-3.5 shadow-2xl backdrop-blur-xl ${
                pulseActive ? 'translate-y-[-1px]' : ''
              }`}
              style={{
                background: PROMPT_THEME.cardBackground,
                borderColor: PROMPT_THEME.borderColor,
                boxShadow: `0 14px 34px rgba(4,9,26,0.54), 0 0 0 1px ${PROMPT_THEME.borderSoftColor} inset, 0 0 24px ${PROMPT_THEME.accentGlow}`,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)',
                  opacity: 0.12,
                }}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-10 top-7 h-6 blur-md"
                style={{
                  opacity: pulseActive ? 0.46 : 0.16,
                  background:
                    'linear-gradient(90deg, rgba(109,243,255,0) 0%, rgba(109,243,255,0.3) 42%, rgba(255,217,126,0.16) 66%, rgba(109,243,255,0) 100%)',
                }}
              />

              <div className="relative">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span
                    className="text-[9px] uppercase tracking-[0.16em]"
                    style={{ color: PROMPT_THEME.signalColor, fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {displaySignalLabel}
                  </span>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-[11px] text-white/68 transition hover:text-white"
                    style={{ fontFamily: 'var(--font-body)' }}
                    aria-label="아케이드 입장 안내 닫기"
                  >
                    닫기
                  </button>
                </div>

                <p
                  className="text-[17px] leading-[1.4]"
                  style={{ color: PROMPT_THEME.headingColor, fontFamily: 'var(--font-heading)' }}
                >
                  {PROMPT_THEME.heading}
                </p>
                <p
                  className="mt-1.5 text-[13px] leading-relaxed"
                  style={{ color: PROMPT_THEME.bodyColor, fontFamily: 'var(--font-body)' }}
                >
                  {PROMPT_THEME.description}
                </p>

                <div
                  className="mt-3 flex items-center gap-2.5 rounded-[10px] border px-2.5 py-2"
                  style={{
                    background: PROMPT_THEME.ticketBackground,
                    borderColor: 'rgba(146, 235, 255, 0.5)',
                    boxShadow: '0 0 0 1px rgba(154,244,255,0.18) inset',
                  }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[9px]"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      color: '#062622',
                      background: PROMPT_THEME.chipBackground,
                      boxShadow: '0 2px 0 #158776',
                    }}
                  >
                    1P
                  </div>
                  <div className="min-w-0">
                    <p
                      className="truncate text-[10px] uppercase tracking-[0.06em]"
                      style={{ color: '#d6f8ff', fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {PROMPT_THEME.ticketTitle}
                    </p>
                    <p
                      className="mt-0.5 truncate text-[10px]"
                      style={{ color: 'rgba(237, 245, 255, 0.78)', fontFamily: 'var(--font-body)' }}
                    >
                      {PROMPT_THEME.ticketCode}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleEnterArcade}
                    className="w-full rounded-[8px] border px-3 py-2.5 text-[13px] font-semibold transition hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      borderColor: 'rgba(90, 245, 218, 0.72)',
                      color: PROMPT_THEME.primaryButtonText,
                      background: PROMPT_THEME.primaryButton,
                      boxShadow: '0 3px 0 #0f6f63, 0 0 14px rgba(86,246,217,0.24)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {PROMPT_THEME.enterLabel}
                  </button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="mt-2 w-full bg-transparent text-center text-[12px] text-cyan-100/80 underline-offset-2 transition hover:text-cyan-50 hover:underline"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {PROMPT_THEME.dismissLabel}
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!visible && dismissed && (
          <motion.button
            type="button"
            onClick={handleReopen}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="fixed bottom-5 right-5 z-[75] flex h-11 w-11 items-center justify-center rounded-full border text-[8px] tracking-[0.12em]"
            style={{
              borderColor: PROMPT_THEME.borderSoftColor,
              background: PROMPT_THEME.fabGradient,
              color: 'rgba(42, 23, 8, 0.92)',
              boxShadow: `0 0 0 1px ${PROMPT_THEME.borderSoftColor} inset, 0 10px 24px rgba(0,0,0,0.35), 0 0 14px ${PROMPT_THEME.accentGlow}`,
              fontFamily: "'Press Start 2P', monospace",
            }}
            aria-label="아케이드 입장 안내 다시 열기"
          >
            PLAY
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
