'use client';

import Link from 'next/link';
import { useScrollReveal } from './useScrollReveal';
import { cn } from '@/lib/utils';

interface Tier {
  name: string;
  price: string;
  priceNum: number;
  badge?: string;
  badgeColor?: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Basic',
    price: '19,000',
    priceNum: 19000,
    features: [
      '기본 템플릿 선택',
      '12가지 섹션 사용',
      '실시간 미리보기',
      '카카오톡 공유',
      'GuestSnap (무제한 업로드)',
      '200GB 무료 다운로드',
    ],
    cta: 'Basic으로 시작',
  },
  {
    name: 'Premium',
    price: '39,000',
    priceNum: 39000,
    badge: 'POPULAR',
    badgeColor: 'bg-[var(--color-primary)] text-white',
    features: [
      '프리미엄 템플릿 전체',
      '18가지 섹션 모두 사용',
      '실시간 미리보기',
      '카카오톡 공유',
      'GuestSnap (무제한 업로드)',
      '200GB 무료 다운로드',
      'AfterParty 섹션',
      '커스텀 도메인 연결',
    ],
    cta: 'Premium으로 시작',
    popular: true,
  },
  {
    name: 'Arcade',
    price: '49,000',
    priceNum: 49000,
    badge: 'UNIQUE',
    badgeColor: 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white',
    features: [
      'Premium 전체 기능 포함',
      'RPG 게임 청첩장',
      '아케이드 모드 전용 테마',
      '게임 내 축하 메시지',
      '플레이 통계 대시보드',
      'GuestSnap (무제한 업로드)',
      '200GB 무료 다운로드',
      '우선 고객 지원',
    ],
    cta: 'Arcade로 시작',
  },
];

export function PricingSection() {
  const { ref, inView } = useScrollReveal();

  return (
    <section id="pricing" ref={ref} className="bg-[var(--color-background)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={cn(
            'mb-14 text-center transition-all duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="mb-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            합리적인 가격, 특별한 청첩장
          </h2>
          <p className="text-sm text-[var(--color-text-light)] sm:text-base">
            전 티어 업로드 무제한, 200GB 무료 다운로드
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-600',
                tier.popular
                  ? 'border-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/10 md:-translate-y-2'
                  : 'border-[var(--color-border-light)]',
                inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
            >
              {/* 뱃지 */}
              {tier.badge && (
                <span
                  className={cn(
                    'absolute -top-3 left-6 rounded-full px-3 py-0.5 text-xs font-bold',
                    tier.badgeColor
                  )}
                >
                  {tier.badge}
                </span>
              )}

              <h3 className="mb-1 text-lg font-bold text-[var(--color-text)]">{tier.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-[var(--color-text)]">{tier.price}</span>
                <span className="ml-1 text-sm text-[var(--color-text-muted)]">원</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-[var(--color-text-light)]">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className={cn(
                  'block rounded-full py-3 text-center text-sm font-semibold transition-all',
                  tier.popular
                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:shadow-md'
                    : 'border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary-light)] hover:bg-[var(--color-secondary)]'
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
          GuestSnap 정책: 전 티어 업로드 무제한, 200GB 무료 다운로드 포함. 추가 저장소는 별도 안내.
        </p>
      </div>
    </section>
  );
}
