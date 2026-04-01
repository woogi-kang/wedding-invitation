'use client';

import { useScrollReveal } from './useScrollReveal';
import { cn } from '@/lib/utils';

const SHOWCASES = [
  { couple: '민준 & 서연', style: '보타니컬 엘레건스' },
  { couple: '지호 & 수빈', style: '모던 미니멀' },
  { couple: '현우 & 하은', style: '클래식 로맨스' },
  { couple: '도윤 & 지유', style: '아케이드 RPG' },
  { couple: '시우 & 채원', style: '빈티지 레트로' },
];

// 무한 롤링을 위해 복제
const DOUBLED = [...SHOWCASES, ...SHOWCASES];

export function SocialProofSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section ref={ref} className="overflow-hidden bg-white py-12">
      <div
        className={cn(
          'transition-all duration-700',
          inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
        <p className="mb-6 text-center text-sm font-medium text-[var(--color-text-muted)]">
          커플들이 만든 청첩장
        </p>

        {/* 롤링 배너 */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

          <div className="flex animate-[scroll_30s_linear_infinite] gap-6">
            {DOUBLED.map((item, i) => (
              <div
                key={i}
                className="flex w-[200px] shrink-0 flex-col items-center rounded-xl border border-[var(--color-border-light)] bg-[var(--color-secondary)] p-4"
              >
                {/* placeholder 스크린샷 */}
                <div className="mb-3 h-[140px] w-full rounded-lg bg-gradient-to-b from-[var(--color-rose-light)] to-[var(--color-botanical-light)] opacity-60" />
                <p className="text-xs font-medium text-[var(--color-text)]">
                  {item.couple}의 청첩장
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{item.style}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 키프레임 CSS for infinite scroll */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
