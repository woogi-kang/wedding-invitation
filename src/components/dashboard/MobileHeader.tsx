'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import Link from 'next/link';

// 경로 기반 페이지 타이틀 매핑
const pageTitles: Record<string, string> = {
  '/dashboard': '홈',
  '/dashboard/invitation': '청첩장 관리',
  '/dashboard/guestsnap': 'GuestSnap',
  '/dashboard/afterparty': 'AfterParty',
  '/dashboard/analytics': '통계',
  '/dashboard/rsvp': 'RSVP',
  '/dashboard/notifications': '알림 설정',
  '/dashboard/settings': '설정',
};

export function MobileHeader() {
  const pathname = usePathname();

  // 현재 경로에 해당하는 타이틀 찾기
  const currentTitle =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
    '대시보드';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 md:hidden h-14 flex items-center
        justify-between px-4 border-b"
      style={{
        backgroundColor: 'var(--color-white)',
        borderColor: 'var(--color-border-light)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 좌측: 로고 */}
      <Link
        href="/dashboard"
        className="no-underline flex items-center gap-1.5"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          W
        </div>
        <span
          className="text-sm tracking-wide"
          style={{
            color: 'var(--color-primary-dark)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.04em',
          }}
        >
          WeddingCraft
        </span>
      </Link>

      {/* 중앙: 페이지 타이틀 */}
      <span
        className="absolute left-1/2 -translate-x-1/2 text-sm font-medium"
        style={{
          color: 'var(--color-text)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {currentTitle}
      </span>

      {/* 우측: 알림 벨 */}
      <Link
        href="/dashboard/notifications"
        className="relative p-2 rounded-full transition-colors duration-200 no-underline"
        style={{ color: 'var(--color-text-light)' }}
      >
        <Bell size={20} />
        {/* 알림 뱃지 */}
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-rose)' }}
        />
      </Link>
    </header>
  );
}
