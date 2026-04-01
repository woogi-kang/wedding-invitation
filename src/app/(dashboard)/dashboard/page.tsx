'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  Share2,
  Mail,
  Camera,
  ExternalLink,
  Edit3,
  QrCode,
  Clock,
  MessageSquare,
  Image,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import {
  MOCK_SUMMARY,
  MOCK_ACTIVITIES,
  MOCK_INVITATION,
} from '@/lib/dashboard/mock-data';

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;
  return `${diffDay}일 전`;
}

function getDDay(weddingDate: string): string {
  const now = new Date();
  const wedding = new Date(weddingDate);
  const diff = Math.ceil((wedding.getTime() - now.getTime()) / 86400000);
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

const activityIcon = {
  rsvp: Mail,
  guestsnap: Image,
  share: Share2,
  guestbook: MessageSquare,
};

export default function DashboardPage() {
  const summary = MOCK_SUMMARY;
  const activities = MOCK_ACTIVITIES;
  const invitation = MOCK_INVITATION;

  const sparklineData = useMemo(
    () => summary.weeklyVisitors.map((v, i) => ({ day: i, value: v })),
    [summary.weeklyVisitors]
  );

  const cards = [
    {
      label: '방문자',
      icon: Users,
      main: summary.totalVisitors.toLocaleString(),
      sub: `오늘 ${summary.todayVisitors}명`,
      showChart: true,
    },
    {
      label: '공유',
      icon: Share2,
      main: summary.totalShares.toLocaleString(),
      sub: `카카오톡 ${summary.kakaoShares}`,
      showChart: false,
    },
    {
      label: 'RSVP',
      icon: Mail,
      main: `${summary.rsvpAttending}명 참석`,
      sub: `불참 ${summary.rsvpDeclined} / 미응답 ${summary.rsvpPending}`,
      showChart: false,
    },
    {
      label: 'GuestSnap',
      icon: Camera,
      main: `${summary.guestSnapCount}장`,
      sub: `${(summary.guestSnapSize / (1024 ** 3)).toFixed(1)}GB / ${(summary.guestSnapLimit / (1024 ** 3)).toFixed(0)}GB`,
      showChart: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 인사말 및 D-day */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>
          안녕하세요, {invitation.groomName} &amp; {invitation.brideName} 님
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-light)' }}>
          결혼식까지{' '}
          <span className="font-bold" style={{ color: 'var(--color-rose)' }}>
            {getDDay(invitation.weddingDate)}
          </span>
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-secondary)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                      {card.label}
                    </p>
                    <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                      {card.main}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                      {card.sub}
                    </p>
                  </div>
                </div>
                {card.showChart && (
                  <div className="w-20 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sparklineData}>
                        <Bar
                          dataKey="value"
                          fill="var(--color-primary)"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 빠른 실행 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-primary)' }}
        >
          빠른 실행
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <ExternalLink className="w-4 h-4" />
            청첩장 공유하기
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-colors"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }}
          >
            <Edit3 className="w-4 h-4" />
            내용 수정하기
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-colors"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }}
          >
            <QrCode className="w-4 h-4" />
            QR 코드 다운로드
          </button>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-primary)' }}
        >
          최근 활동
        </h2>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcon[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: 'var(--color-primary)' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {activity.message}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--color-text-light)' }}>
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
