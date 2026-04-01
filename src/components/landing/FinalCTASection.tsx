'use client';

import Link from 'next/link';
import { useScrollReveal } from './useScrollReveal';
import { cn } from '@/lib/utils';

export function FinalCTASection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section ref={ref} className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div
          className={cn(
            'transition-all duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <div className="mb-6 text-4xl">&#128141;</div>
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            지금 시작하면 3분 후,
            <br />
            나만의 청첩장이 완성됩니다
          </h2>
          <p className="mb-8 text-sm text-[var(--color-text-light)] sm:text-base">
            더 이상 고민하지 마세요. 수백 쌍의 커플이 WeddingCraft를 선택했습니다.
          </p>
          <Link
            href="#pricing"
            className="inline-block rounded-full bg-[var(--color-primary)] px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-xl"
          >
            무료로 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}
