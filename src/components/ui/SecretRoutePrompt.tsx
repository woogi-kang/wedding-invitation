'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const TRIGGER_PROGRESS = 0.3;
const SESSION_DISMISS_KEY = 'wedding_secret_route_prompt_hidden';

type SecretVariant = 'cipher' | 'omen';

interface SecretRoutePromptProps {
  variant?: SecretVariant;
}

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

export function SecretRoutePrompt({ variant = 'cipher' }: SecretRoutePromptProps) {
  const router = useRouter();
  const isOmen = variant === 'omen';
  const sessionKey = `${SESSION_DISMISS_KEY}_${variant}`;
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => getInitialDismissed(sessionKey));
  const [hasTriggered, setHasTriggered] = useState(() => getInitialDismissed(sessionKey));
  const [glitchActive, setGlitchActive] = useState(false);
  const [signalLabel, setSignalLabel] = useState(
    isOmen ? 'MIDNIGHT SEAL STABLE' : 'SIGNAL LOCKED',
  );

  const signalPool = useMemo(
    () =>
      isOmen
        ? ['MIDNIGHT SEAL OPENED', 'MOONLIT ROUTE FOUND', 'CANDLE TRACE ACTIVE']
        : ['ENCRYPTED INVITATION', 'SEALED ROUTE FOUND', 'HIDDEN ENTRY READY'],
    [isOmen],
  );

  useEffect(() => {
    if (dismissed || hasTriggered) return;

    const onScroll = () => {
      const progress = getScrollProgress();
      if (progress >= TRIGGER_PROGRESS) {
        setVisible(true);
        setHasTriggered(true);
        setSignalLabel(signalPool[Math.floor(Math.random() * signalPool.length)]);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [dismissed, hasTriggered, signalPool]);

  useEffect(() => {
    if (!visible) return;

    const intervalId = window.setInterval(() => {
      setGlitchActive(true);
      window.setTimeout(() => setGlitchActive(false), 130);
    }, 2600);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(sessionKey, '1');
    } catch {
      // ignore storage failures
    }
  };

  const handleReopen = () => {
    setVisible(true);
  };

  const handleEnterSecret = () => {
    try {
      sessionStorage.removeItem(sessionKey);
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
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-5 z-[80] mx-auto max-w-md sm:bottom-6"
          >
            <div
              className={`relative overflow-hidden rounded-md border px-4 py-4 shadow-2xl backdrop-blur-xl ${
                glitchActive ? 'translate-x-[1px] -translate-y-[1px]' : ''
              }`}
              style={{
                background: isOmen
                  ? 'linear-gradient(150deg, rgba(19,10,19,0.95) 0%, rgba(33,12,30,0.95) 52%, rgba(18,14,28,0.96) 100%)'
                  : 'linear-gradient(155deg, rgba(9,13,28,0.93) 0%, rgba(16,9,33,0.92) 48%, rgba(8,20,20,0.95) 100%)',
                borderColor: isOmen
                  ? 'rgba(215, 124, 130, 0.58)'
                  : 'rgba(215, 191, 123, 0.6)',
                boxShadow: isOmen
                  ? '0 14px 36px rgba(15,8,14,0.58), 0 0 0 1px rgba(255,181,176,0.11) inset, 0 0 26px rgba(255,92,121,0.16)'
                  : '0 14px 36px rgba(5,6,14,0.55), 0 0 0 1px rgba(255,215,130,0.12) inset, 0 0 28px rgba(93,255,187,0.16)',
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)',
                  opacity: 0.09,
                }}
              />

              <div
                aria-hidden
                className={`pointer-events-none absolute -inset-x-10 top-7 h-7 blur-md transition-opacity ${
                  glitchActive ? 'opacity-50' : 'opacity-20'
                }`}
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,72,164,0) 0%, rgba(255,72,164,0.35) 34%, rgba(109,243,255,0.3) 66%, rgba(109,243,255,0) 100%)',
                }}
              />

              <div className="relative">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span
                    className="font-['Press_Start_2P',monospace] text-[9px] uppercase tracking-[0.14em]"
                    style={{ color: isOmen ? '#ff9a9a' : '#5dffbb' }}
                  >
                    {signalLabel}
                  </span>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="font-['Press_Start_2P',monospace] text-[10px] uppercase tracking-[0.08em] text-white/65 transition hover:text-white"
                    aria-label="비밀 루트 안내 닫기"
                  >
                    close
                  </button>
                </div>

                <p
                  className="font-['Press_Start_2P',monospace] text-[14px] leading-relaxed sm:text-[15px]"
                  style={{ color: isOmen ? '#ffd0cf' : '#ffe8b0' }}
                >
                  {isOmen ? 'MIDNIGHT ENVELOPE OPENED' : 'UNMARKED INVITATION DETECTED'}
                </p>
                <p
                  className="mt-2 text-[13px] leading-relaxed sm:text-[14px]"
                  style={{ color: 'rgba(236, 241, 255, 0.85)' }}
                >
                  {isOmen
                    ? '촛농 봉인 아래 숨겨진 초대장이 깨어났습니다.'
                    : '정식 초대장 뒤에 숨겨진 보조 초대장을 해독했습니다.'}
                  <br />
                  {isOmen
                    ? '달빛 경로를 따라 비밀 연회장으로 이동하시겠어요?'
                    : '봉인된 루트를 열어 확인하시겠어요?'}
                </p>

                <div
                  className="relative mt-3 overflow-hidden rounded-[3px] border"
                  style={{
                    borderColor: isOmen
                      ? 'rgba(255, 156, 169, 0.38)'
                      : 'rgba(174, 198, 255, 0.35)',
                    boxShadow: isOmen
                      ? '0 0 0 1px rgba(255, 125, 141, 0.16) inset'
                      : '0 0 0 1px rgba(123, 220, 255, 0.15) inset',
                  }}
                >
                  <Image
                    src={isOmen ? '/images/hero/couple.jpg' : '/images/og-wedding.jpg'}
                    alt={isOmen ? 'Moonlit invitation seal' : 'Encrypted invitation fragment'}
                    width={640}
                    height={320}
                    className={`h-20 w-full object-cover sm:h-24 ${
                      isOmen
                        ? 'sepia contrast-125 brightness-70 saturate-75'
                        : 'grayscale contrast-125 brightness-75'
                    }`}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: isOmen
                        ? 'linear-gradient(100deg, rgba(191,43,87,0.22) 0%, rgba(0,0,0,0.46) 44%, rgba(255,152,106,0.18) 100%)'
                        : 'linear-gradient(98deg, rgba(255,80,168,0.14) 0%, rgba(0,0,0,0.4) 38%, rgba(68,225,255,0.2) 100%)',
                    }}
                  />
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 ${
                      glitchActive ? 'opacity-65' : 'opacity-30'
                    }`}
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 3px)',
                    }}
                  />
                  <div className="absolute bottom-1.5 right-2">
                    <span
                      className="font-['Press_Start_2P',monospace] text-[8px] tracking-[0.12em]"
                      style={{ color: isOmen ? 'rgba(255, 226, 226, 0.82)' : 'rgba(222, 236, 255, 0.82)' }}
                    >
                      {isOmen ? 'SEAL: MOON-LETTER-07' : 'FILE: INV-0405-1410'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleEnterSecret}
                    className="rounded-[3px] border px-3 py-2.5 text-[12px] font-semibold transition hover:scale-[1.02] active:scale-[0.99]"
                    style={{
                      borderColor: isOmen
                        ? 'rgba(255, 174, 172, 0.8)'
                        : 'rgba(255, 218, 147, 0.88)',
                      color: isOmen ? '#fff7f7' : '#0d1018',
                      background: isOmen
                        ? 'linear-gradient(180deg, #5b1c2f 0%, #8f2a4a 100%)'
                        : 'linear-gradient(180deg, #f8df9b 0%, #d7b15d 100%)',
                      boxShadow: isOmen
                        ? '0 3px 0 #35101d, 0 0 14px rgba(255,116,145,0.24)'
                        : '0 3px 0 #8f7337, 0 0 14px rgba(249,223,154,0.2)',
                    }}
                  >
                    {isOmen ? '달빛 경로로 입장' : '봉인 해제하고 입장'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="rounded-[3px] border px-3 py-2.5 text-[12px] font-medium transition hover:border-white/55 hover:text-white"
                    style={{
                      borderColor: 'rgba(163, 179, 208, 0.55)',
                      color: 'rgba(234, 241, 255, 0.82)',
                      background: isOmen ? 'rgba(31, 15, 30, 0.7)' : 'rgba(16, 18, 31, 0.6)',
                    }}
                  >
                    {isOmen ? '봉인 다시 덮기' : '모른 척 지나가기'}
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
            initial={{ opacity: 0, y: 12, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.88 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="fixed bottom-5 right-5 z-[75] flex h-11 w-11 items-center justify-center rounded-full border text-[11px] font-semibold"
            style={{
              borderColor: isOmen
                ? 'rgba(255, 137, 155, 0.42)'
                : 'rgba(140, 255, 213, 0.48)',
              background: isOmen
                ? 'radial-gradient(circle at 30% 30%, rgba(255,109,139,0.3), rgba(28,12,25,0.95) 55%)'
                : 'radial-gradient(circle at 30% 30%, rgba(75,255,210,0.35), rgba(13,16,28,0.95) 55%)',
              color: isOmen ? '#ffe6eb' : '#eafff7',
              boxShadow: isOmen
                ? '0 0 0 1px rgba(255,126,162,0.17) inset, 0 12px 30px rgba(0,0,0,0.35), 0 0 18px rgba(255,93,136,0.24)'
                : '0 0 0 1px rgba(82,255,205,0.16) inset, 0 12px 30px rgba(0,0,0,0.35), 0 0 18px rgba(82,255,205,0.25)',
            }}
            aria-label="비밀 루트 안내 다시 열기"
          >
            ???
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
