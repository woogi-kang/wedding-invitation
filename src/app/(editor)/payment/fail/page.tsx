'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, RotateCcw, ArrowLeft, Loader2 } from 'lucide-react';

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>}>
      <PaymentFailContent />
    </Suspense>
  );
}

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code') || 'UNKNOWN_ERROR';
  const errorMessage =
    searchParams.get('message') || '결제 처리 중 문제가 발생했습니다.';

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border text-center"
        style={{
          backgroundColor: 'var(--color-white)',
          borderColor: 'var(--color-border)',
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          opacity: showContent ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 아이콘 영역 */}
        <div className="px-6 pt-10">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
          >
            <AlertCircle className="h-8 w-8" style={{ color: '#dc2626' }} />
          </div>
        </div>

        {/* 메시지 */}
        <div className="px-6 py-6">
          <h1
            className="text-xl font-bold"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
          >
            결제에 실패했습니다
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-accent)' }}>
            {decodeURIComponent(errorMessage)}
          </p>
        </div>

        {/* 오류 코드 */}
        <div className="px-6 pb-6">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-accent)' }}>오류 코드</span>
                <span
                  className="font-mono font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {errorCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-accent)' }}>오류 내용</span>
                <span
                  className="max-w-[200px] text-right font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {decodeURIComponent(errorMessage)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="space-y-3 px-6 pb-8">
          <a
            href="/payment"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <RotateCcw className="h-5 w-5" />
            다시 시도하기
          </a>

          <a
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 font-semibold transition-all duration-200"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
