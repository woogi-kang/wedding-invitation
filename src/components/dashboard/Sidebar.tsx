'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Mail,
  Camera,
  PartyPopper,
  BarChart3,
  ClipboardList,
  Bell,
  Settings,
  ExternalLink,
  Eye,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

const mainNavItems: NavItem[] = [
  { label: '홈', href: '/dashboard', icon: Home },
  { label: '청첩장 관리', href: '/dashboard/invitation', icon: Mail },
  { label: 'GuestSnap', href: '/dashboard/guestsnap', icon: Camera },
  { label: 'AfterParty', href: '/dashboard/afterparty', icon: PartyPopper },
  { label: '통계', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'RSVP', href: '/dashboard/rsvp', icon: ClipboardList },
  { label: '알림 설정', href: '/dashboard/notifications', icon: Bell },
];

const bottomNavItems: NavItem[] = [
  { label: '설정', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col border-r z-40
        w-16 lg:w-60 transition-all duration-300"
      style={{
        backgroundColor: 'var(--color-white)',
        borderColor: 'var(--color-border-light)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 로고 */}
      <div
        className="h-16 flex items-center px-4 lg:px-6 border-b shrink-0"
        style={{ borderColor: 'var(--color-border-light)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2 no-underline">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            W
          </div>
          <span
            className="hidden lg:block text-base tracking-wide"
            style={{
              color: 'var(--color-primary-dark)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.05em',
            }}
          >
            WeddingCraft
          </span>
        </Link>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 lg:px-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative flex items-center gap-3 rounded-lg no-underline
                    h-10 lg:h-11 px-2.5 lg:px-3.5 transition-all duration-200"
                  style={{
                    backgroundColor: active ? 'var(--color-botanical-light)' : 'transparent',
                    color: active ? 'var(--color-primary-dark)' : 'var(--color-text-light)',
                  }}
                  title={item.label}
                >
                  {/* 활성 상태 인디케이터 */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full hidden lg:block"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                  )}
                  <Icon
                    size={20}
                    className="shrink-0 transition-colors duration-200"
                    style={{
                      color: active ? 'var(--color-primary)' : undefined,
                    }}
                  />
                  <span
                    className="hidden lg:block text-sm truncate transition-colors duration-200"
                    style={{
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {item.label}
                  </span>

                  {/* 툴팁 (태블릿 - 아이콘 전용 모드) */}
                  <span
                    className="absolute left-full ml-2 px-2.5 py-1 rounded-md text-xs whitespace-nowrap
                      opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200
                      lg:hidden z-50 shadow-md"
                    style={{
                      backgroundColor: 'var(--color-primary-dark)',
                      color: 'var(--color-white)',
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 구분선 */}
        <div
          className="my-4 mx-2 lg:mx-3 h-px"
          style={{ backgroundColor: 'var(--color-border-light)' }}
        />

        {/* 하단 네비게이션 (설정) */}
        <ul className="space-y-1">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative flex items-center gap-3 rounded-lg no-underline
                    h-10 lg:h-11 px-2.5 lg:px-3.5 transition-all duration-200"
                  style={{
                    backgroundColor: active ? 'var(--color-botanical-light)' : 'transparent',
                    color: active ? 'var(--color-primary-dark)' : 'var(--color-text-light)',
                  }}
                  title={item.label}
                >
                  <Icon size={20} className="shrink-0" />
                  <span
                    className="hidden lg:block text-sm truncate"
                    style={{ fontWeight: active ? 500 : 400 }}
                  >
                    {item.label}
                  </span>

                  {/* 툴팁 */}
                  <span
                    className="absolute left-full ml-2 px-2.5 py-1 rounded-md text-xs whitespace-nowrap
                      opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200
                      lg:hidden z-50 shadow-md"
                    style={{
                      backgroundColor: 'var(--color-primary-dark)',
                      color: 'var(--color-white)',
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 퀵 링크 (데스크톱 전용) */}
      <div
        className="hidden lg:block px-4 py-4 border-t shrink-0"
        style={{ borderColor: 'var(--color-border-light)' }}
      >
        <div className="space-y-1.5">
          <Link
            href="#"
            className="flex items-center gap-2 text-xs no-underline px-2 py-1.5 rounded-md
              transition-colors duration-200 hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            <ExternalLink size={14} />
            <span>에디터 열기</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-xs no-underline px-2 py-1.5 rounded-md
              transition-colors duration-200 hover:opacity-80"
            style={{ color: 'var(--color-accent)' }}
          >
            <Eye size={14} />
            <span>청첩장 보기</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
