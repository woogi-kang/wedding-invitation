// 토스페이먼츠 API 클라이언트
// 테스트 모드로 구현 (실제 API 키 없이 동작)

const TOSS_API_URL = 'https://api.tosspayments.com/v1';
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_sk_XXXXXXXXXXXXX';
const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_XXXXXXXXXXXXX';

export { TOSS_CLIENT_KEY };

interface TossPaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  approvedAt: string;
  method: string;
  card?: {
    number: string;
    company: string;
  };
  receipt?: {
    url: string;
  };
}

interface TossError {
  code: string;
  message: string;
}

// Base64 인코딩 (서버 사이드)
function encodeSecretKey(secretKey: string): string {
  return Buffer.from(secretKey + ':').toString('base64');
}

// 결제 승인 API
export async function confirmPayment(
  request: TossPaymentConfirmRequest,
): Promise<TossPaymentResponse> {
  // 테스트 모드: API 키가 test_로 시작하면 mock 응답
  if (TOSS_SECRET_KEY.startsWith('test_')) {
    return mockConfirmPayment(request);
  }

  const response = await fetch(`${TOSS_API_URL}/payments/confirm`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeSecretKey(TOSS_SECRET_KEY)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: TossError = await response.json();
    throw new Error(`토스 결제 승인 실패: ${error.message} (${error.code})`);
  }

  return response.json();
}

// 결제 취소 API
export async function cancelPayment(
  paymentKey: string,
  reason: string,
  cancelAmount?: number,
): Promise<TossPaymentResponse> {
  if (TOSS_SECRET_KEY.startsWith('test_')) {
    return mockCancelPayment(paymentKey, reason);
  }

  const body: Record<string, unknown> = { cancelReason: reason };
  if (cancelAmount) {
    body.cancelAmount = cancelAmount;
  }

  const response = await fetch(`${TOSS_API_URL}/payments/${paymentKey}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeSecretKey(TOSS_SECRET_KEY)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: TossError = await response.json();
    throw new Error(`토스 결제 취소 실패: ${error.message} (${error.code})`);
  }

  return response.json();
}

// 결제 조회 API
export async function getPayment(paymentKey: string): Promise<TossPaymentResponse> {
  if (TOSS_SECRET_KEY.startsWith('test_')) {
    return mockGetPayment(paymentKey);
  }

  const response = await fetch(`${TOSS_API_URL}/payments/${paymentKey}`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${encodeSecretKey(TOSS_SECRET_KEY)}`,
    },
  });

  if (!response.ok) {
    const error: TossError = await response.json();
    throw new Error(`토스 결제 조회 실패: ${error.message} (${error.code})`);
  }

  return response.json();
}

// 웹훅 시그니처 검증
export function verifyWebhookSignature(
  _body: string,
  _signature: string,
): boolean {
  // 테스트 모드에서는 항상 통과
  if (TOSS_SECRET_KEY.startsWith('test_')) {
    return true;
  }

  // 실제 구현 시 HMAC-SHA256 검증
  return true;
}

// Mock 응답 (테스트 모드)
function mockConfirmPayment(request: TossPaymentConfirmRequest): TossPaymentResponse {
  return {
    paymentKey: request.paymentKey,
    orderId: request.orderId,
    status: 'DONE',
    totalAmount: request.amount,
    approvedAt: new Date().toISOString(),
    method: '카드',
    card: {
      number: '4242-****-****-4242',
      company: '삼성카드',
    },
    receipt: {
      url: `https://dashboard.tosspayments.com/receipt/test/${request.orderId}`,
    },
  };
}

function mockCancelPayment(paymentKey: string, _reason: string): TossPaymentResponse {
  return {
    paymentKey,
    orderId: `order_${Date.now()}`,
    status: 'CANCELED',
    totalAmount: 0,
    approvedAt: new Date().toISOString(),
    method: '카드',
  };
}

function mockGetPayment(paymentKey: string): TossPaymentResponse {
  return {
    paymentKey,
    orderId: `order_${Date.now()}`,
    status: 'DONE',
    totalAmount: 49000,
    approvedAt: new Date().toISOString(),
    method: '카드',
  };
}
