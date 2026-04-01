'use client';

import { useState } from 'react';
import { useScrollReveal } from './useScrollReveal';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    q: '청첩장을 만드는 데 얼마나 걸리나요?',
    a: '템플릿을 선택하고 내용만 입력하면 되기 때문에, 평균 15분이면 완성됩니다. 섹션 구성까지 꼼꼼히 하셔도 30분이면 충분해요.',
  },
  {
    q: '결제 후 수정이 가능한가요?',
    a: '네, 결제 후에도 텍스트, 사진, 섹션 구성을 자유롭게 수정할 수 있습니다. 결혼식 당일까지 언제든 변경 가능합니다.',
  },
  {
    q: '환불 정책은 어떻게 되나요?',
    a: '결제 후 7일 이내, URL을 공유하기 전이라면 전액 환불이 가능합니다. URL 공유 이후에는 환불이 어려운 점 양해 부탁드립니다.',
  },
  {
    q: 'GuestSnap 용량은 어떻게 되나요?',
    a: '전 티어 업로드 무제한이며, 200GB까지 무료 다운로드가 가능합니다. 일반적인 결혼식 기준으로 충분한 용량입니다.',
  },
  {
    q: '아케이드 모드는 어떤 건가요?',
    a: 'RPG 게임 형태의 청첩장입니다. 하객이 게임 캐릭터가 되어 결혼식장까지 이동하면서 축하 메시지를 남기는 독특한 경험을 제공합니다.',
  },
  {
    q: '모바일에서도 잘 보이나요?',
    a: '네, 모바일 퍼스트로 설계되어 스마트폰에서 가장 아름답게 보입니다. 물론 PC와 태블릿에서도 완벽하게 동작합니다.',
  },
  {
    q: '카카오톡으로 어떻게 공유하나요?',
    a: '청첩장 완성 후 공유 버튼을 누르면 카카오톡에 예쁜 미리보기 카드와 함께 전송됩니다. 링크 복사도 가능합니다.',
  },
  {
    q: '청첩장 URL은 언제까지 유효한가요?',
    a: '결혼식 이후 6개월까지 유효합니다. 이후에도 연장을 원하시면 고객센터로 문의해주세요.',
  },
];

export function FAQSection() {
  const { ref, inView } = useScrollReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="bg-[var(--color-background)] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div
          className={cn(
            'mb-14 text-center transition-all duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="mb-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            자주 묻는 질문
          </h2>
          <p className="text-sm text-[var(--color-text-light)] sm:text-base">
            궁금한 점이 있으시면 언제든 문의해주세요
          </p>
        </div>

        <div
          className={cn(
            'space-y-3 transition-all duration-700',
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border-light)] bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-sm font-medium text-[var(--color-text)]">
                    {item.q}
                  </span>
                  <svg
                    className={cn(
                      'h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'max-h-48 pb-4' : 'max-h-0'
                  )}
                >
                  <p className="px-5 text-sm leading-relaxed text-[var(--color-text-light)]">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Schema.org FAQ 마크업 (서버 컴포넌트에서 사용)
export function FAQJsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
