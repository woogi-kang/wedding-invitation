import { NextRequest, NextResponse } from 'next/server';
import { confirmPayment } from '@/lib/payment/toss';
import type { PaymentConfirmRequest } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    const body: PaymentConfirmRequest = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 유효성 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 },
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: '유효하지 않은 결제 금액입니다.' },
        { status: 400 },
      );
    }

    // 토스페이먼츠 결제 승인 요청
    const result = await confirmPayment({ paymentKey, orderId, amount });

    // TODO: DB에 결제 정보 저장
    console.log('결제 승인 완료:', {
      paymentKey: result.paymentKey,
      orderId: result.orderId,
      status: result.status,
      totalAmount: result.totalAmount,
      approvedAt: result.approvedAt,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('결제 승인 오류:', error);
    const message =
      error instanceof Error ? error.message : '결제 승인 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
