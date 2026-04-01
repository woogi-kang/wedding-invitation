import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payment/toss';

interface WebhookEvent {
  eventType: string;
  createdAt: string;
  data: {
    paymentKey: string;
    orderId: string;
    status: string;
    totalAmount: number;
    method: string;
    approvedAt?: string;
    cancels?: Array<{
      cancelAmount: number;
      cancelReason: string;
      canceledAt: string;
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('TossPayments-Signature') || '';

    // 시그니처 검증
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('웹훅 시그니처 검증 실패');
      return NextResponse.json(
        { error: '시그니처 검증 실패' },
        { status: 401 },
      );
    }

    const event: WebhookEvent = JSON.parse(rawBody);

    // 이벤트 타입별 처리
    switch (event.data.status) {
      case 'DONE':
        console.log('[웹훅] 결제 완료:', {
          paymentKey: event.data.paymentKey,
          orderId: event.data.orderId,
          totalAmount: event.data.totalAmount,
          method: event.data.method,
          approvedAt: event.data.approvedAt,
        });
        // TODO: DB 상태 업데이트 -> DONE
        break;

      case 'CANCELED':
        console.log('[웹훅] 결제 취소:', {
          paymentKey: event.data.paymentKey,
          orderId: event.data.orderId,
          cancels: event.data.cancels,
        });
        // TODO: DB 상태 업데이트 -> CANCELED, 환불 처리
        break;

      case 'PARTIAL_CANCELED':
        console.log('[웹훅] 부분 취소:', {
          paymentKey: event.data.paymentKey,
          orderId: event.data.orderId,
          cancels: event.data.cancels,
        });
        // TODO: DB 상태 업데이트 -> PARTIAL_CANCELED
        break;

      case 'ABORTED':
        console.log('[웹훅] 결제 중단:', {
          paymentKey: event.data.paymentKey,
          orderId: event.data.orderId,
        });
        // TODO: DB 상태 업데이트 -> ABORTED
        break;

      case 'EXPIRED':
        console.log('[웹훅] 결제 만료:', {
          paymentKey: event.data.paymentKey,
          orderId: event.data.orderId,
        });
        // TODO: DB 상태 업데이트 -> EXPIRED
        break;

      default:
        console.log('[웹훅] 알 수 없는 상태:', event.data.status, {
          paymentKey: event.data.paymentKey,
          orderId: event.data.orderId,
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('웹훅 처리 오류:', error);
    return NextResponse.json(
      { error: '웹훅 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
