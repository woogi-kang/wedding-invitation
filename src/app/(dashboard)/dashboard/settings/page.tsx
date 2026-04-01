'use client';

import { useState } from 'react';
import {
  User,
  CreditCard,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { MOCK_PAYMENTS, MOCK_INVITATION } from '@/lib/dashboard/mock-data';
import { formatPrice, calculateRefundRate, PRICING_TIERS } from '@/lib/payment/pricing';

const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
  DONE: { label: '완료', bg: '#d1fae5', text: '#065f46' },
  CANCELED: { label: '취소됨', bg: '#fee2e2', text: '#991b1b' },
  PARTIAL_CANCELED: { label: '부분취소', bg: '#fef3c7', text: '#92400e' },
  READY: { label: '대기', bg: '#e5e7eb', text: '#374151' },
  IN_PROGRESS: { label: '진행중', bg: '#dbeafe', text: '#1e40af' },
  ABORTED: { label: '중단', bg: '#fee2e2', text: '#991b1b' },
  EXPIRED: { label: '만료', bg: '#e5e7eb', text: '#374151' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function SettingsPage() {
  const payments = MOCK_PAYMENTS;
  const invitation = MOCK_INVITATION;

  const refundInfo = calculateRefundRate(
    invitation.status === 'published',
    new Date(invitation.weddingDate)
  );

  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h1
          className="text-lg font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          설정
        </h1>
      </div>

      {/* 계정 정보 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <User className="w-5 h-5" />
          계정 정보
        </h2>
        <div className="space-y-3">
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              이메일
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              woogi@example.com
            </span>
          </div>
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              가입 방법
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              카카오 로그인
            </span>
          </div>
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              가입일
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {formatDate(invitation.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* 결제 내역 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <CreditCard className="w-5 h-5" />
          결제 내역
        </h2>

        {/* 데스크톱 테이블 */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['날짜', '상품', '금액', '상태', '영수증'].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 text-sm font-medium"
                    style={{ color: 'var(--color-text-light)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const status = statusLabels[p.status] || statusLabels.READY;
                const tierName = PRICING_TIERS[p.tier]?.name || p.tier;
                return (
                  <tr
                    key={p.id}
                    className="border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <td className="py-3 px-3 text-sm" style={{ color: 'var(--color-text)' }}>
                      {formatDate(p.approvedAt)}
                    </td>
                    <td className="py-3 px-3 text-sm" style={{ color: 'var(--color-text)' }}>
                      {tierName}
                      {p.addons.length > 0 && ` + 부가상품 ${p.addons.length}개`}
                    </td>
                    <td className="py-3 px-3 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {formatPrice(p.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        className="text-xs flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        보기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 */}
        <div className="md:hidden space-y-3">
          {payments.map((p) => {
            const status = statusLabels[p.status] || statusLabels.READY;
            const tierName = PRICING_TIERS[p.tier]?.name || p.tier;
            return (
              <div
                key={p.id}
                className="p-4 rounded-lg border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {tierName}
                    {p.addons.length > 0 && ` + ${p.addons.length}`}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: status.bg, color: status.text }}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-light)' }}>
                  <span>{formatDate(p.approvedAt)}</span>
                  <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                    {formatPrice(p.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 환불 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <RefreshCw className="w-5 h-5" />
          환불
        </h2>

        {/* 환불 정책 */}
        <div
          className="p-4 rounded-lg mb-4"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            환불 정책
          </h3>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--color-text-light)' }}>
            <li>- URL 발급 전: 100% 환불</li>
            <li>- URL 발급 후, 결혼식 7일 전까지: 70% 환불</li>
            <li>- 결혼식 7일 전 이후: 환불 불가</li>
          </ul>
        </div>

        {/* 현재 상태 */}
        <div
          className="p-4 rounded-lg mb-4 flex items-start gap-3"
          style={{
            backgroundColor: refundInfo.refundable ? '#d1fae5' : '#fef3c7',
          }}
        >
          <AlertTriangle
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: refundInfo.refundable ? '#065f46' : '#92400e' }}
          />
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: refundInfo.refundable ? '#065f46' : '#92400e' }}
            >
              {refundInfo.reason}
            </p>
            {refundInfo.refundable && (
              <p
                className="text-xs mt-1"
                style={{ color: refundInfo.refundable ? '#065f46' : '#92400e' }}
              >
                환불율: {refundInfo.rate}%
              </p>
            )}
          </div>
        </div>

        {refundInfo.refundable && !showRefundConfirm && (
          <button
            onClick={() => setShowRefundConfirm(true)}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium border transition-colors"
            style={{
              borderColor: 'var(--color-rose)',
              color: 'var(--color-rose)',
            }}
          >
            환불 요청
          </button>
        )}

        {showRefundConfirm && (
          <div
            className="p-4 rounded-lg border"
            style={{ borderColor: 'var(--color-rose)' }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>
              정말 환불을 요청하시겠습니까? 환불 처리 시 청첩장이 비활성화됩니다.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--color-rose)' }}
              >
                확인
              </button>
              <button
                onClick={() => setShowRefundConfirm(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
