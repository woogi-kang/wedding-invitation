import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'WeddingCraft 데모 - 청첩장 미리 체험하기',
  description: 'WeddingCraft로 만든 청첩장을 직접 체험해보세요. 마음에 드시면 바로 나만의 청첩장을 만들 수 있습니다.',
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-16">
      {/* 데모 안내 배너 */}
      <div className="sticky top-16 z-40 border-b border-[var(--color-border-light)] bg-[var(--color-primary)] px-4 py-2.5 text-center">
        <p className="text-xs font-medium text-white sm:text-sm">
          이것은 데모입니다. 나만의 청첩장을 만들어보세요!
          <Link href="#pricing" className="ml-2 underline underline-offset-2 hover:no-underline">
            시작하기
          </Link>
        </p>
      </div>

      {/* 데모 컨텐츠 영역 */}
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-[var(--color-text)]">
            청첩장 데모
          </h1>
          <p className="text-sm text-[var(--color-text-light)]">
            WeddingCraft로 만든 샘플 청첩장을 확인해보세요
          </p>
        </div>

        {/* 샘플 청첩장 프레임 */}
        <div className="mx-auto max-w-sm">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-2xl">
            <div className="overflow-hidden rounded-2xl">
              {/* 청첩장 미리보기 - 기존 청첩장 iframe 또는 placeholder */}
              <div className="flex aspect-[9/16] flex-col items-center justify-center bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-background)] p-8">
                <div className="mb-6 h-16 w-16 rounded-full bg-[var(--color-rose-light)]" />
                <p className="mb-1 font-[var(--font-heading)] text-lg text-[var(--color-text)]">
                  민준 & 서연
                </p>
                <p className="mb-6 text-xs text-[var(--color-text-muted)]">
                  2026년 4월 5일 토요일 오후 2시
                </p>
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-2 w-32 rounded bg-[var(--color-border-light)]" />
                  <div className="mx-auto h-2 w-28 rounded bg-[var(--color-border-light)]" />
                  <div className="mx-auto h-2 w-24 rounded bg-[var(--color-border-light)]" />
                </div>
                <div className="mt-8 flex gap-3">
                  <div className="h-20 w-16 rounded-lg bg-[var(--color-botanical-light)]" />
                  <div className="h-20 w-16 rounded-lg bg-[var(--color-rose-light)]" />
                </div>
              </div>
            </div>
          </div>

          {/* 데모 옵션 */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link
              href="/demo/arcade"
              className="rounded-xl border border-[var(--color-border-light)] bg-white p-4 text-center transition-all hover:border-[var(--color-primary-light)] hover:shadow-md"
            >
              <div className="mb-2 text-2xl">&#127918;</div>
              <p className="text-xs font-medium text-[var(--color-text)]">아케이드 모드</p>
              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">RPG 게임 체험</p>
            </Link>
            <Link
              href="/invitation"
              className="rounded-xl border border-[var(--color-border-light)] bg-white p-4 text-center transition-all hover:border-[var(--color-primary-light)] hover:shadow-md"
            >
              <div className="mb-2 text-2xl">&#128140;</div>
              <p className="text-xs font-medium text-[var(--color-text)]">클래식 모드</p>
              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">정통 청첩장 체험</p>
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border-light)] bg-white/95 px-4 py-3 backdrop-blur-sm">
        <Link
          href="#pricing"
          className="block w-full rounded-full bg-[var(--color-primary)] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          이 템플릿으로 시작하기
        </Link>
      </div>
    </div>
  );
}
