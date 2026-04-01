'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  Share2,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MOCK_ANALYTICS } from '@/lib/dashboard/mock-data';

type Period = '7d' | '30d' | 'all';

export default function AnalyticsPage() {
  const analytics = MOCK_ANALYTICS;
  const [period, setPeriod] = useState<Period>('7d');

  // 기간 필터 적용 (mock에서는 7일만 있으므로 동일 데이터 표시)
  const chartData = useMemo(() => {
    return analytics.dailyVisitors.map((d) => ({
      date: d.date.slice(5), // MM-DD
      방문자: d.visitors,
      순방문자: d.uniqueVisitors,
    }));
  }, [analytics.dailyVisitors]);

  const maxShareCount = Math.max(...analytics.shares.map((s) => s.count));
  const maxDwellTime = Math.max(...analytics.sectionDwell.map((s) => s.avgSeconds));
  const maxReferrerCount = Math.max(...analytics.referrers.map((r) => r.count));

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: '7일' },
    { key: '30d', label: '30일' },
    { key: 'all', label: '전체' },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 + 기간 필터 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1
            className="text-lg font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            통계
          </h1>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor:
                    period === p.key ? 'var(--color-primary)' : 'transparent',
                  color:
                    period === p.key ? 'var(--color-white)' : 'var(--color-text)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 방문자 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: '전체 방문', value: analytics.totalVisitors, icon: Users },
          { label: '순 방문자', value: analytics.uniqueVisitors, icon: Users },
          { label: '재방문자', value: analytics.returningVisitors, icon: Users },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                <item.icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                  {item.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 일별 방문자 차트 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-primary)' }}
        >
          일별 방문자
        </h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: 'var(--color-text-light)' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--color-text-light)' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '13px',
                }}
              />
              <Bar
                dataKey="방문자"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="순방문자"
                fill="var(--color-primary-light)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 공유 채널 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <Share2 className="w-5 h-5" />
          공유 채널
        </h2>
        <div className="space-y-3">
          {analytics.shares.map((share) => (
            <div key={share.channel}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {share.channel}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
                  {share.count}회 ({share.percentage}%)
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(share.count / maxShareCount) * 100}%`,
                    backgroundColor: 'var(--color-primary)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 섹션 체류 시간 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <Clock className="w-5 h-5" />
          섹션별 체류 시간
        </h2>
        <div className="space-y-3">
          {analytics.sectionDwell.map((section) => (
            <div key={section.section}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {section.section}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
                  {section.avgSeconds >= 60
                    ? `${Math.floor(section.avgSeconds / 60)}분 ${section.avgSeconds % 60}초`
                    : `${section.avgSeconds}초`}
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(section.avgSeconds / maxDwellTime) * 100}%`,
                    backgroundColor: 'var(--color-accent)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 디바이스 & OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: 'var(--color-primary)' }}
          >
            <Smartphone className="w-5 h-5" />
            디바이스
          </h2>
          <div className="space-y-3">
            {[
              { label: '모바일', value: analytics.devices.mobile, icon: Smartphone },
              { label: '데스크톱', value: analytics.devices.desktop, icon: Monitor },
              { label: '태블릿', value: analytics.devices.tablet, icon: Tablet },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
                    <d.icon className="w-3.5 h-3.5" />
                    {d.label}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
                    {d.value}%
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.value}%`,
                      backgroundColor: 'var(--color-primary)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            OS
          </h2>
          <div className="space-y-3">
            {[
              { label: 'iOS', value: analytics.os.ios },
              { label: 'Android', value: analytics.os.android },
              { label: '기타', value: analytics.os.other },
            ].map((o) => (
              <div key={o.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {o.label}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
                    {o.value}%
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${o.value}%`,
                      backgroundColor: 'var(--color-accent)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 유입 경로 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <Globe className="w-5 h-5" />
          유입 경로
        </h2>
        <div className="space-y-3">
          {analytics.referrers.map((ref) => (
            <div key={ref.channel}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {ref.channel}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
                  {ref.count.toLocaleString()}명 ({ref.percentage}%)
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(ref.count / maxReferrerCount) * 100}%`,
                    backgroundColor: 'var(--color-primary)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
