'use client';

import { useScrollReveal } from './useScrollReveal';
import { cn } from '@/lib/utils';

const TESTIMONIALS = [
  {
    name: '김서연 & 이민준',
    date: '2026년 3월',
    text: '다른 청첩장 서비스 3개를 써봤는데, WeddingCraft만큼 자유도 높은 곳은 처음이었어요. 섹션 on/off 기능이 정말 편했어요.',
    highlight: '섹션 on/off가 정말 편해요',
  },
  {
    name: '박지호 & 최수빈',
    date: '2026년 2월',
    text: '아케이드 모드로 청첩장 보낸 건 저희가 처음 아닐까요? 하객분들이 너무 재밌다고 연락이 쏟아졌어요!',
    highlight: '하객 반응이 폭발적!',
  },
  {
    name: '정현우 & 한하은',
    date: '2026년 1월',
    text: 'GuestSnap으로 하객분들이 올려준 사진이 200장이 넘었어요. 우리 결혼식 사진첩이 자연스럽게 완성됐습니다.',
    highlight: 'GuestSnap 사진 200장+',
  },
];

export function TestimonialsSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section ref={ref} className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <div
          className={cn(
            'mb-14 text-center transition-all duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="mb-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            커플들의 이야기
          </h2>
          <p className="text-sm text-[var(--color-text-light)] sm:text-base">
            WeddingCraft로 특별한 청첩장을 만든 분들
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                'rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-secondary)] p-6 transition-all duration-600',
                inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
            >
              {/* 별점 */}
              <div className="mb-3 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className="h-4 w-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="mb-1 text-sm font-semibold text-[var(--color-primary)]">
                &ldquo;{t.highlight}&rdquo;
              </p>
              <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-light)]">
                {t.text}
              </p>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[var(--color-botanical-light)]" />
                <div>
                  <p className="text-xs font-medium text-[var(--color-text)]">{t.name}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
