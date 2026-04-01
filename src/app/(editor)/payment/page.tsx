'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, ShoppingCart, Leaf, CreditCard, Loader2 } from 'lucide-react';
import {
  PRICING_TIERS,
  ADDONS,
  calculateTotal,
  formatPrice,
} from '@/lib/payment/pricing';
import type { PricingTier, AddonType } from '@/types/payment';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>}>
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tierParam = (searchParams.get('tier') || 'arcade') as PricingTier;
  const selectedTier = PRICING_TIERS[tierParam] ? tierParam : 'arcade';

  const [selectedAddons, setSelectedAddons] = useState<AddonType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tierInfo = PRICING_TIERS[selectedTier];

  const totalAmount = useMemo(
    () => calculateTotal(selectedTier, selectedAddons),
    [selectedTier, selectedAddons],
  );

  const toggleAddon = useCallback((addon: AddonType) => {
    setSelectedAddons((prev) =>
      prev.includes(addon)
        ? prev.filter((a) => a !== addon)
        : [...prev, addon],
    );
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // 결제 준비 API 호출
      const response = await fetch('/api/payment/ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId: 'mock-invitation-id',
          tier: selectedTier,
          addons: selectedAddons,
        }),
      });

      if (!response.ok) {
        throw new Error('결제 준비에 실패했습니다.');
      }

      const { orderId, amount } = await response.json();

      // TODO: 실제 토스 결제 위젯 연동
      // 현재는 mock으로 성공 페이지 리다이렉트
      const mockPaymentKey = `tpk_${Date.now()}_mock`;
      router.push(
        `/payment/success?orderId=${orderId}&paymentKey=${mockPaymentKey}&amount=${amount}`,
      );
    } catch (error) {
      console.error('결제 오류:', error);
      const message =
        error instanceof Error ? error.message : '알 수 없는 오류';
      router.push(
        `/payment/fail?code=PAYMENT_ERROR&message=${encodeURIComponent(message)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* 헤더 */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(245, 243, 237, 0.95)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
            <h1
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
            >
              결제하기
            </h1>
          </div>
          <ShoppingCart className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-32">
        {/* 선택된 요금제 */}
        <section
          className="mb-6 overflow-hidden rounded-2xl border"
          style={{
            borderColor: 'var(--color-primary)',
            backgroundColor: 'var(--color-white)',
          }}
        >
          <div
            className="px-6 py-4"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm opacity-80"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  선택한 요금제
                </p>
                <h2
                  className="mt-1 text-2xl font-bold"
                  style={{ color: 'var(--color-white)' }}
                >
                  {tierInfo.name}
                </h2>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: 'var(--color-white)' }}
              >
                {formatPrice(tierInfo.price)}
              </p>
            </div>
          </div>

          <div className="px-6 py-4">
            <p
              className="mb-3 text-sm font-medium"
              style={{ color: 'var(--color-accent)' }}
            >
              포함된 기능
            </p>
            <ul className="space-y-2">
              {tierInfo.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: 'var(--color-primary)' }}
                  />
                  <span style={{ color: 'var(--color-text)' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 부가 상품 */}
        <section className="mb-6">
          <h3
            className="mb-4 text-lg font-semibold"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
          >
            부가 상품 선택
          </h3>

          <div className="space-y-3">
            {Object.values(ADDONS).map((addon) => {
              const isSelected = selectedAddons.includes(addon.type);
              return (
                <button
                  key={addon.type}
                  type="button"
                  onClick={() => toggleAddon(addon.type)}
                  className="flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200"
                  style={{
                    borderColor: isSelected
                      ? 'var(--color-primary)'
                      : 'var(--color-border)',
                    backgroundColor: isSelected
                      ? 'rgba(67, 87, 58, 0.05)'
                      : 'var(--color-white)',
                  }}
                >
                  {/* 체크박스 */}
                  <div
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded"
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--color-primary)'
                        : 'transparent',
                      border: isSelected
                        ? 'none'
                        : '2px solid var(--color-border)',
                    }}
                  >
                    {isSelected && (
                      <Check className="h-3.5 w-3.5" style={{ color: 'var(--color-white)' }} />
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {addon.name}
                      </span>
                      {addon.unit && (
                        <span
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-accent)',
                          }}
                        >
                          {addon.unit}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm" style={{ color: 'var(--color-accent)' }}>
                      {addon.description}
                    </p>
                  </div>

                  {/* 가격 */}
                  <span
                    className="flex-shrink-0 font-semibold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    +{formatPrice(addon.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* 하단 결제 바 */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t"
        style={{
          backgroundColor: 'var(--color-white)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-accent)' }}>
              총 결제 금액
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {formatPrice(totalAmount)}
            </p>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                처리중...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                결제하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
