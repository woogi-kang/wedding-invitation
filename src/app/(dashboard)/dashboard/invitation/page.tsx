'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  Edit3,
  ExternalLink,
  ShoppingBag,
  Crown,
} from 'lucide-react';
import QRCode from 'qrcode';
import { MOCK_INVITATION } from '@/lib/dashboard/mock-data';
import { PRICING_TIERS, ADDONS } from '@/lib/payment/pricing';
import type { AddonType } from '@/types/payment';

const statusConfig = {
  draft: { label: '작성 중', bg: '#fef3c7', text: '#92400e' },
  published: { label: '게시됨', bg: '#d1fae5', text: '#065f46' },
  expired: { label: '만료됨', bg: '#e5e7eb', text: '#374151' },
};

export default function InvitationPage() {
  const invitation = MOCK_INVITATION;
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const status = statusConfig[invitation.status];
  const tierInfo = PRICING_TIERS[invitation.tier];

  useEffect(() => {
    QRCode.toDataURL(invitation.url, {
      width: 200,
      margin: 2,
      color: { dark: '#43573a', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [invitation.url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitation.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 폴백: 구형 브라우저
    }
  };

  const allAddonTypes = Object.keys(ADDONS) as AddonType[];
  const purchasedAddons = invitation.addons as AddonType[];
  const availableAddons = allAddonTypes.filter(
    (a) => !purchasedAddons.includes(a)
  );

  return (
    <div className="space-y-6">
      {/* 상태 및 티어 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1
              className="text-lg font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              청첩장 관리
            </h1>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {tierInfo.name} 플랜
            </span>
          </div>
        </div>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
          만료일: {new Date(invitation.expiresAt).toLocaleDateString('ko-KR')}
        </p>
      </div>

      {/* URL 섹션 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-primary)' }}
        >
          <Globe className="w-5 h-5 inline-block mr-2" />
          청첩장 URL
        </h2>
        <div className="flex items-center gap-2">
          <div
            className="flex-1 px-4 py-2.5 rounded-lg text-sm truncate"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-text)',
            }}
          >
            {invitation.url}
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                복사
              </>
            )}
          </button>
        </div>
      </div>

      {/* QR 코드 + 공유 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            <QrCode className="w-5 h-5 inline-block mr-2" />
            QR 코드
          </h2>
          <div className="flex flex-col items-center gap-4">
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
            )}
            <a
              href={qrDataUrl}
              download="wedding-qrcode.png"
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
              }}
            >
              다운로드
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            <MessageCircle className="w-5 h-5 inline-block mr-2" />
            공유하기
          </h2>
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white mb-4"
            style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
          >
            카카오톡 공유
          </button>
          {/* OG 프리뷰 목업 */}
          <div
            className="rounded-lg overflow-hidden border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="h-32 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-background)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                OG 미리보기
              </p>
            </div>
            <div className="p-3" style={{ backgroundColor: 'var(--color-secondary)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                {invitation.groomName} &amp; {invitation.brideName}의 결혼식에 초대합니다
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                {invitation.url}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 편집 버튼 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Edit3 className="w-4 h-4" />
          에디터에서 수정하기
        </button>
      </div>

      {/* 부가 상품 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-primary)' }}
        >
          <ShoppingBag className="w-5 h-5 inline-block mr-2" />
          부가 상품
        </h2>

        {purchasedAddons.length > 0 && (
          <div className="mb-4">
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              구매 완료
            </h3>
            <div className="space-y-2">
              {purchasedAddons.map((addonType) => {
                const addon = ADDONS[addonType];
                return (
                  <div
                    key={addonType}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--color-secondary)' }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {addon.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                        {addon.description}
                      </p>
                    </div>
                    <Check className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            추가 가능
          </h3>
          <div className="space-y-2">
            {availableAddons.map((addonType) => {
              const addon = ADDONS[addonType];
              return (
                <div
                  key={addonType}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {addon.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                      {addon.description}
                    </p>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {addon.price.toLocaleString()}원
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
