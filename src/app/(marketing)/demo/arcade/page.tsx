import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'WeddingCraft 아케이드 모드 데모 - RPG 게임 청첩장',
  description: '세계 최초 RPG 게임 청첩장을 직접 플레이해보세요. 하객이 되어 결혼식장까지 모험을 떠나보세요!',
};

export default function ArcadeDemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16">
      {/* 데모 안내 배너 */}
      <div className="sticky top-16 z-40 border-b border-white/10 bg-gradient-to-r from-cyan-600 to-purple-600 px-4 py-2.5 text-center">
        <p className="text-xs font-medium text-white sm:text-sm">
          아케이드 모드 데모 체험 중!
          <Link href="#" className="ml-2 underline underline-offset-2 hover:no-underline">
            나만의 게임 청첩장 만들기
          </Link>
        </p>
      </div>

      {/* 아케이드 데모 컨텐츠 */}
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-xs text-cyan-300">
            ARCADE MODE DEMO
          </span>
          <h1 className="mb-2 text-2xl font-bold text-white">
            RPG 게임 청첩장
          </h1>
          <p className="text-sm text-gray-400">
            캐릭터를 조작하여 결혼식장까지 이동해보세요
          </p>
        </div>

        {/* 게임 화면 placeholder */}
        <div className="mx-auto max-w-sm">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a2e] shadow-2xl shadow-purple-500/20">
            <div className="flex aspect-[9/16] flex-col items-center justify-center p-8">
              {/* 게임 필드 placeholder */}
              <div className="relative mb-6 h-48 w-full rounded-lg border border-white/5 bg-[#0f0f1a]">
                {/* 그리드 */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                {/* 캐릭터 */}
                <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                {/* 목적지 */}
                <div className="absolute right-4 top-4 h-5 w-5 animate-pulse rounded bg-purple-400 shadow-lg shadow-purple-400/50" />
              </div>

              {/* 조작 안내 */}
              <p className="mb-4 font-mono text-xs text-gray-500">
                TAP TO MOVE
              </p>

              {/* 방향키 */}
              <div className="grid grid-cols-3 gap-1">
                <div />
                <div className="flex h-10 w-10 items-center justify-center rounded border border-white/10 bg-white/5 text-xs text-gray-400">
                  &#9650;
                </div>
                <div />
                <div className="flex h-10 w-10 items-center justify-center rounded border border-white/10 bg-white/5 text-xs text-gray-400">
                  &#9664;
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded border border-white/10 bg-white/5 text-xs text-gray-400">
                  &#9660;
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded border border-white/10 bg-white/5 text-xs text-gray-400">
                  &#9654;
                </div>
              </div>

              <div className="mt-6">
                <p className="text-center font-mono text-[10px] text-cyan-300/50">
                  DEMO VERSION - PLAY TO EXPLORE
                </p>
              </div>
            </div>
          </div>

          {/* 게임 종료 후 CTA */}
          <div className="mt-8 text-center">
            <p className="mb-4 text-sm text-gray-400">
              마음에 드셨나요? 나만의 게임 청첩장을 만들어보세요!
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-purple-500/20"
            >
              나만의 게임 청첩장 만들기
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
