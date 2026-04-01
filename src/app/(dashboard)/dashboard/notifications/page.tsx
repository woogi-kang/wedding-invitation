'use client';

import { useState } from 'react';
import {
  Bell,
  Mail,
  MessageCircle,
  Settings,
  Circle,
  CheckCircle2,
} from 'lucide-react';
import {
  MOCK_NOTIFICATION_SETTINGS,
  MOCK_NOTIFICATIONS,
} from '@/lib/dashboard/mock-data';
import type { NotificationSettings } from '@/types/dashboard';

const notificationTypeLabels: Record<string, { label: string; description: string }> = {
  newRsvp: { label: '새 RSVP 응답', description: '참석/불참 응답이 들어올 때' },
  newGuestSnap: { label: '새 GuestSnap', description: '새 사진/영상이 업로드될 때' },
  newGuestbook: { label: '새 방명록', description: '방명록 메시지가 작성될 때' },
  dailyReport: { label: '일일 리포트', description: '매일 아침 전일 현황 요약' },
  guestSnapExpiry: { label: 'GuestSnap 만료 알림', description: '보관 기간 만료 7일 전' },
  invitationExpiry: { label: '청첩장 만료 알림', description: '청첩장 만료 7일 전' },
};

function formatNotificationDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{
        backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-border)',
      }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
        style={{
          transform: checked ? 'translateX(24px)' : 'translateX(4px)',
        }}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(
    MOCK_NOTIFICATION_SETTINGS
  );
  const notifications = MOCK_NOTIFICATIONS;

  const updateChannel = (key: 'emailEnabled' | 'kakaoEnabled', value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateType = (key: keyof NotificationSettings['types'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      types: { ...prev.types, [key]: value },
    }));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h1
          className="text-lg font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          알림 설정
        </h1>
      </div>

      {/* 알림 채널 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <Settings className="w-5 h-5" />
          알림 채널
        </h2>
        <div className="space-y-4">
          {/* 이메일 */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  이메일
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {settings.email}
                </p>
              </div>
            </div>
            <Toggle
              checked={settings.emailEnabled}
              onChange={(v) => updateChannel('emailEnabled', v)}
            />
          </div>

          {/* 카카오톡 */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5" style={{ color: '#FEE500' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  카카오톡
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  카카오 알림톡
                </p>
              </div>
            </div>
            <Toggle
              checked={settings.kakaoEnabled}
              onChange={(v) => updateChannel('kakaoEnabled', v)}
            />
          </div>
        </div>
      </div>

      {/* 알림 유형 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <Bell className="w-5 h-5" />
          알림 유형
        </h2>
        <div className="space-y-3">
          {(
            Object.entries(notificationTypeLabels) as [
              keyof NotificationSettings['types'],
              { label: string; description: string },
            ][]
          ).map(([key, info]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {info.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {info.description}
                </p>
              </div>
              <Toggle
                checked={settings.types[key]}
                onChange={(v) => updateType(key, v)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 알림 내역 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-primary)' }}
        >
          알림 내역
        </h2>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{
                backgroundColor: n.read ? 'transparent' : 'var(--color-secondary)',
              }}
            >
              {n.read ? (
                <CheckCircle2
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: 'var(--color-text-light)' }}
                />
              ) : (
                <Circle
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: 'var(--color-primary)' }}
                  fill="var(--color-primary)"
                />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm"
                  style={{
                    color: 'var(--color-text)',
                    fontWeight: n.read ? 'normal' : '500',
                  }}
                >
                  {n.message}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-light)' }}>
                  {formatNotificationDate(n.createdAt)}
                </p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                아직 알림이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
