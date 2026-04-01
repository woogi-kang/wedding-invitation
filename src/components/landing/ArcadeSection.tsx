'use client';

import Link from 'next/link';
import { useScrollReveal } from './useScrollReveal';
import { cn } from '@/lib/utils';

export function ArcadeSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0a0a0f] py-20 md:py-28"
    >
      {/* 레트로 배경 효과 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        {/* 그리드 라인 */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <div
          className={cn(
            'transition-all duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <span className="mb-4 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 font-mono text-xs text-cyan-300">
            ARCADE MODE
          </span>

          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            하객이 게임하는 청첩장,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              세상에 이런 게 있었어?
            </span>
          </h2>

          <p className="mb-10 text-sm text-gray-400 sm:text-base">
            RPG 게임 속 주인공이 되어 결혼식에 초대받는 경험.
            <br className="hidden sm:block" />
            하객들이 직접 플레이하며 축하 메시지를 남겨요.
          </p>
        </div>

        {/* 아케이드 모드 미리보기 placeholder */}
        <div
          className={cn(
            'mx-auto mb-10 max-w-md transition-all delay-200 duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <div className="aspect-[9/16] max-h-[400px] w-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] p-8 shadow-2xl shadow-purple-500/10">
            <div className="flex h-full flex-col items-center justify-center gap-4">
              {/* 레트로 픽셀 캐릭터 placeholder */}
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      [1, 3, 4, 5, 7].includes(i)
                        ? 'bg-cyan-400'
                        : 'bg-purple-500/50'
                    )}
                  />
                ))}
              </div>
              <p className="font-mono text-xs text-cyan-300/70">
                PRESS START
              </p>
              <div className="mt-4 flex gap-1">
                <div className="h-1.5 w-8 animate-pulse rounded bg-cyan-400/50" />
                <div className="h-1.5 w-8 animate-pulse rounded bg-purple-400/50" style={{ animationDelay: '0.3s' }} />
                <div className="h-1.5 w-8 animate-pulse rounded bg-cyan-400/50" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'transition-all delay-300 duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <Link
            href="/demo/arcade"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-8 py-3.5 text-sm font-semibold text-cyan-300 transition-all hover:bg-cyan-400/20 hover:shadow-lg hover:shadow-cyan-400/10"
          >
            직접 플레이해보기
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
