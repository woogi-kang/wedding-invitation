'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Download,
  UtensilsCrossed,
} from 'lucide-react';
import {
  MOCK_RSVP_RESPONSES,
  MOCK_RSVP_SUMMARY,
} from '@/lib/dashboard/mock-data';

type FilterType = 'all' | 'attending' | 'declined';

const mealLabels: Record<string, string> = {
  western: '양식',
  korean: '한식',
  child: '어린이',
  none: '-',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RSVPPage() {
  const summary = MOCK_RSVP_SUMMARY;
  const responses = MOCK_RSVP_RESPONSES;

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    let result = [...responses];
    if (search.trim()) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter === 'attending') {
      result = result.filter((r) => r.attending);
    } else if (filter === 'declined') {
      result = result.filter((r) => !r.attending);
    }
    return result;
  }, [responses, search, filter]);

  const handleExportCSV = () => {
    const header = '이름,참석여부,인원,식사,메시지,응답일시\n';
    const rows = responses
      .map(
        (r) =>
          `"${r.name}","${r.attending ? '참석' : '불참'}",${r.guestCount},"${mealLabels[r.mealType]}","${r.message}","${formatDate(r.respondedAt)}"`
      )
      .join('\n');
    const csv = header + rows;
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-responses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = [
    {
      label: '참석',
      value: summary.attending,
      icon: UserCheck,
      color: 'var(--color-primary)',
    },
    {
      label: '불참',
      value: summary.declined,
      icon: UserX,
      color: 'var(--color-rose)',
    },
    {
      label: '미응답',
      value: summary.pending,
      icon: Clock,
      color: 'var(--color-accent)',
    },
    {
      label: '총 인원',
      value: summary.totalGuests,
      icon: Users,
      color: 'var(--color-primary-dark)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h1
          className="text-lg font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          RSVP 현황
        </h1>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-4 text-center"
            >
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: card.color }} />
              <p className="text-2xl font-bold" style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* 식사 요약 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <UtensilsCrossed className="w-5 h-5" />
          식사 구성
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '양식', value: summary.meals.western },
            { label: '한식', value: summary.meals.korean },
            { label: '어린이', value: summary.meals.child },
          ].map((m) => (
            <div
              key={m.label}
              className="text-center p-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                {m.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 검색 & 필터 & CSV */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-light)' }}
              />
              <input
                type="text"
                placeholder="이름 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg border text-sm w-48"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
              {(['all', 'attending', 'declined'] as FilterType[]).map((f) => {
                const labels: Record<FilterType, string> = {
                  all: '전체',
                  attending: '참석',
                  declined: '불참',
                };
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-2 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        filter === f ? 'var(--color-primary)' : 'transparent',
                      color:
                        filter === f ? 'var(--color-white)' : 'var(--color-text)',
                    }}
                  >
                    {labels[f]}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }}
          >
            <Download className="w-4 h-4" />
            CSV 내보내기
          </button>
        </div>

        {/* 테이블 (데스크톱) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['이름', '참석여부', '인원', '식사', '메시지'].map((h) => (
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
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <td className="py-3 px-3 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {r.name}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: r.attending ? '#d1fae5' : '#fee2e2',
                        color: r.attending ? '#065f46' : '#991b1b',
                      }}
                    >
                      {r.attending ? '참석' : '불참'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm" style={{ color: 'var(--color-text)' }}>
                    {r.guestCount}명
                  </td>
                  <td className="py-3 px-3 text-sm" style={{ color: 'var(--color-text)' }}>
                    {mealLabels[r.mealType]}
                  </td>
                  <td className="py-3 px-3 text-sm" style={{ color: 'var(--color-text-light)' }}>
                    {r.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 카드 리스트 (모바일) */}
        <div className="md:hidden space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-lg border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {r.name}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: r.attending ? '#d1fae5' : '#fee2e2',
                    color: r.attending ? '#065f46' : '#991b1b',
                  }}
                >
                  {r.attending ? '참석' : '불참'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-light)' }}>
                <span>인원: {r.guestCount}명</span>
                <span>식사: {mealLabels[r.mealType]}</span>
              </div>
              {r.message && (
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
                  &ldquo;{r.message}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              검색 결과가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
