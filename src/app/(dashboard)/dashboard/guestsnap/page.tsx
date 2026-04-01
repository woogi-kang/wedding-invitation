'use client';

import { useState, useMemo } from 'react';
import {
  HardDrive,
  Calendar,
  Download,
  Image,
  Video,
  ArrowDownToLine,
  SortAsc,
  Filter,
} from 'lucide-react';
import {
  MOCK_GUESTSNAP_SUMMARY,
  MOCK_GUESTSNAP_FILES,
} from '@/lib/dashboard/mock-data';

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)}GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)}MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${bytes}B`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type SortKey = 'newest' | 'oldest' | 'largest' | 'smallest';
type FileFilter = 'all' | 'photo' | 'video';

export default function GuestSnapPage() {
  const summary = MOCK_GUESTSNAP_SUMMARY;
  const files = MOCK_GUESTSNAP_FILES;

  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [filterType, setFilterType] = useState<FileFilter>('all');

  const usagePercent = (summary.totalSize / summary.limit) * 100;
  const gaugeColor =
    usagePercent >= 90 ? '#ef4444' : usagePercent >= 70 ? '#f59e0b' : '#43573a';

  const now = new Date();
  const freeDeadline = new Date(summary.freeDownloadDeadline);
  const isFreeDownload = now <= freeDeadline;

  const filteredAndSorted = useMemo(() => {
    let result = [...files];
    if (filterType !== 'all') {
      result = result.filter((f) => f.type === filterType);
    }
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'largest':
        result.sort((a, b) => b.size - a.size);
        break;
      case 'smallest':
        result.sort((a, b) => a.size - b.size);
        break;
    }
    return result;
  }, [files, sortBy, filterType]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h1
          className="text-lg font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          GuestSnap 관리
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>
          사진 {summary.photoCount}장 / 동영상 {summary.videoCount}개 (총{' '}
          {summary.totalFiles}개)
        </p>
      </div>

      {/* 저장 용량 게이지 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <HardDrive className="w-5 h-5" />
          저장 용량
        </h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: 'var(--color-text)' }}>
            {formatBytes(summary.totalSize)} / {formatBytes(summary.limit)}
          </span>
          <span className="text-sm font-medium" style={{ color: gaugeColor }}>
            {usagePercent.toFixed(1)}%
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(usagePercent, 100)}%`,
              backgroundColor: gaugeColor,
            }}
          />
        </div>
      </div>

      {/* 타임라인 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <Calendar className="w-5 h-5" />
          일정
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>업로드 시작</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{formatDate(summary.uploadStart)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>업로드 종료</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{formatDate(summary.uploadEnd)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>무료 다운로드 기한</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{formatDate(summary.freeDownloadDeadline)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <span className="text-sm" style={{ color: 'var(--color-text-light)' }}>보관 만료</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {formatDate(summary.storageExpiry)} (D-{summary.daysRemaining})
            </span>
          </div>
        </div>
      </div>

      {/* 다운로드 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <Download className="w-5 h-5" />
          다운로드
        </h2>
        <div
          className="p-4 rounded-lg mb-4"
          style={{
            backgroundColor: isFreeDownload ? '#d1fae5' : '#fef3c7',
            color: isFreeDownload ? '#065f46' : '#92400e',
          }}
        >
          <p className="text-sm font-medium">
            {isFreeDownload
              ? '현재 무료 다운로드 기간입니다.'
              : '무료 다운로드 기간이 종료되었습니다. 추가 요금이 발생할 수 있습니다.'}
          </p>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <ArrowDownToLine className="w-4 h-4" />
          전체 다운로드
        </button>
      </div>

      {/* 정렬/필터 + 파일 그리드 */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            파일 목록
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <SortAsc className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="text-sm rounded-lg px-2 py-1 border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="largest">용량 큰순</option>
                <option value="smallest">용량 작은순</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FileFilter)}
                className="text-sm rounded-lg px-2 py-1 border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <option value="all">전체</option>
                <option value="photo">사진</option>
                <option value="video">동영상</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {filteredAndSorted.map((file) => (
            <div
              key={file.id}
              className="relative aspect-square rounded-lg overflow-hidden border group cursor-pointer"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {file.type === 'video' ? (
                  <Video className="w-8 h-8" style={{ color: 'var(--color-text-light)' }} />
                ) : (
                  <Image className="w-8 h-8" style={{ color: 'var(--color-text-light)' }} />
                )}
              </div>
              {/* 오버레이 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs">
                <p>{file.uploaderName}</p>
                <p>{formatBytes(file.size)}</p>
              </div>
              {file.type === 'video' && (
                <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  VIDEO
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
