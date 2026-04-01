'use client';

import { useScrollReveal } from './useScrollReveal';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    step: '01',
    title: '템플릿 선택 + 섹션 구성',
    description: '마음에 드는 템플릿을 고르고, 18가지 섹션을 on/off로 원하는 구성을 만드세요.',
    color: 'bg-[var(--color-rose-light)]',
  },
  {
    step: '02',
    title: '내용 입력 + 실시간 미리보기',
    description: '사진, 텍스트, 날짜 등을 입력하면 실시간으로 완성될 청첩장을 확인할 수 있어요.',
    color: 'bg-[var(--color-botanical-light)]',
  },
  {
    step: '03',
    title: '결제 후 URL 발급 + 공유',
    description: '결제와 동시에 고유 URL이 발급됩니다. 카카오톡으로 바로 공유하세요.',
    color: 'bg-[var(--color-accent-light)]/40',
  },
];

export function HowItWorksSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section ref={ref} className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <div
          className={cn(
            'mb-14 text-center transition-all duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="mb-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            3단계로 완성되는 청첩장
          </h2>
          <p className="text-sm text-[var(--color-text-light)] sm:text-base">
            복잡한 과정 없이, 정말 간단해요
          </p>
        </div>

        <div className="space-y-6 md:space-y-0 md:flex md:gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className={cn(
                'flex-1 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-secondary)] p-6 transition-all duration-600',
                inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: inView ? `${i * 120}ms` : '0ms' }}
            >
              <div
                className={cn(
                  'mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-[var(--color-primary)]',
                  step.color
                )}
              >
                {step.step}
              </div>
              <h3 className="mb-2 text-base font-semibold text-[var(--color-text)]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-light)]">
                {step.description}
              </p>

              {/* 연결선 (데스크탑에서만) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
