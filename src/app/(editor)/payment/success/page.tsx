'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PartyPopper, Copy, ExternalLink, Share2, LayoutDashboard, Check, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';

const MOCK_INVITATION_URL = 'https://weddingcraft.kr/taewook-seongyeong';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const paymentKey = searchParams.get('paymentKey') || '';
  const amount = searchParams.get('amount') || '0';

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // QR 코드 생성
  useEffect(() => {
    QRCode.toDataURL(MOCK_INVITATION_URL, {
      width: 200,
      margin: 2,
      color: {
        dark: '#43573a',
        light: '#faf8f5',
      },
    }).then(setQrDataUrl);
  }, []);

  // 등장 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // URL 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_INVITATION_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 폴백: 구형 브라우저 대응
      const textArea = document.createElement('textarea');
      textArea.value = MOCK_INVITATION_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // TODO: 실제 앱 키로 교체
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '');
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '저희 결혼합니다',
          description: '소중한 분들을 초대합니다.',
          imageUrl: 'https://weddingcraft.kr/og-image.png',
          link: {
            mobileWebUrl: MOCK_INVITATION_URL,
            webUrl: MOCK_INVITATION_URL,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: MOCK_INVITATION_URL,
              webUrl: MOCK_INVITATION_URL,
            },
          },
        ],
      });
    } else {
      alert('카카오 SDK가 로드되지 않았습니다.');
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: 'var(--color-white)',
          borderColor: 'var(--color-border)',
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          opacity: showContent ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 상단 축하 영역 */}
        <div
          className="relative px-6 py-10 text-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {/* 장식 원 */}
          <div
            className="absolute left-4 top-4 h-16 w-16 rounded-full opacity-10"
            style={{ backgroundColor: 'var(--color-white)' }}
          />
          <div
            className="absolute bottom-4 right-6 h-10 w-10 rounded-full opacity-10"
            style={{ backgroundColor: 'var(--color-white)' }}
          />

          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <PartyPopper className="h-8 w-8" style={{ color: 'var(--color-white)' }} />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-white)', fontFamily: 'var(--font-sans)' }}
          >
            결제가 완료되었습니다!
          </h1>
          <p className="mt-2 text-sm opacity-80" style={{ color: 'var(--color-secondary)' }}>
            아름다운 청첩장이 준비되었어요
          </p>
        </div>

        {/* 결제 정보 */}
        <div className="px-6 py-5">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-accent)' }}>주문번호</span>
                <span
                  className="font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-accent)' }}>결제금액</span>
                <span
                  className="font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {Number(amount).toLocaleString('ko-KR')}원
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-accent)' }}>결제키</span>
                <span
                  className="max-w-[180px] truncate font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {paymentKey}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 청첩장 URL */}
        <div className="px-6 pb-5">
          <p
            className="mb-3 text-center text-sm font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            나의 청첩장 URL
          </p>

          <div
            className="flex items-center gap-2 rounded-xl border p-3"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <ExternalLink
              className="h-4 w-4 flex-shrink-0"
              style={{ color: 'var(--color-accent)' }}
            />
            <span
              className="flex-1 truncate text-sm"
              style={{ color: 'var(--color-primary)' }}
            >
              {MOCK_INVITATION_URL}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: copied
                  ? 'var(--color-primary)'
                  : 'var(--color-secondary)',
                color: copied
                  ? 'var(--color-white)'
                  : 'var(--color-text)',
              }}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  복사
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR 코드 */}
        <div className="px-6 pb-5 text-center">
          <p
            className="mb-3 text-sm font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            QR 코드
          </p>
          {qrDataUrl && (
            <div className="inline-block rounded-xl border p-3" style={{ borderColor: 'var(--color-border)' }}>
              <img
                src={qrDataUrl}
                alt="청첩장 QR 코드"
                width={200}
                height={200}
                className="block"
              />
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="space-y-3 px-6 pb-8">
          <button
            type="button"
            onClick={handleKakaoShare}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-all duration-200"
            style={{
              backgroundColor: '#FEE500',
              color: '#191919',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Share2 className="h-5 w-5" />
            카카오톡으로 공유하기
          </button>

          <a
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 font-semibold transition-all duration-200"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <LayoutDashboard className="h-5 w-5" />
            대시보드로 이동
          </a>
        </div>
      </div>
    </div>
  );
}
