import { NextRequest, NextResponse } from 'next/server';
import { calculateTotal, PRICING_TIERS, ADDONS } from '@/lib/payment/pricing';
import type { PaymentReadyRequest, PaymentReadyResponse } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    const body: PaymentReadyRequest = await request.json();
    const { invitationId, tier, addons } = body;

    // 유효성 검증
    if (!invitationId || !tier) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 },
      );
    }

    if (!PRICING_TIERS[tier]) {
      return NextResponse.json(
        { error: '유효하지 않은 요금제입니다.' },
        { status: 400 },
      );
    }

    const invalidAddons = (addons || []).filter((addon) => !ADDONS[addon]);
    if (invalidAddons.length > 0) {
      return NextResponse.json(
        { error: `유효하지 않은 부가 상품: ${invalidAddons.join(', ')}` },
        { status: 400 },
      );
    }

    // 주문 ID 생성
    const random = Math.random().toString(36).substring(2, 8);
    const orderId = `WC_${Date.now()}_${random}`;

    // 총 금액 계산
    const amount = calculateTotal(tier, addons || []);

    // 주문명 생성
    const tierName = PRICING_TIERS[tier].name;
    const addonCount = (addons || []).length;
    const orderName =
      addonCount > 0
        ? `WeddingCraft ${tierName} + 부가상품 ${addonCount}개`
        : `WeddingCraft ${tierName}`;

    const response: PaymentReadyResponse = {
      orderId,
      orderName,
      amount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('결제 준비 오류:', error);
    return NextResponse.json(
      { error: '결제 준비 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
