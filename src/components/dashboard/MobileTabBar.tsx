'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Mail,
  Camera,
  BarChart3,
  MoreHorizontal,
  PartyPopper,
  ClipboardList,
  Bell,
  Settings,
  X,
} from 'lucide-react';

interface TabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

const tabs: TabItem[] = [
  { label: '홈', href: '/dashboard', icon: Home },
  { label: '청첩장', href: '/dashboard/invitation', icon: Mail },
  { label: 'GuestSnap', href: '/dashboard/guestsnap', icon: Camera },
  { label: '통계', href: '/dashboard/analytics', icon: BarChart3 },
];

const moreMenuItems: TabItem[] = [
  { label: 'AfterParty', href: '/dashboard/afterparty', icon: PartyPopper },
  { label: 'RSVP', href: '/dashboard/rsvp', icon: ClipboardList },
  { label: '알림 설정', href: '/dashboard/notifications', icon: Bell },
  { label: '설정', href: '/dashboard/settings', icon: Settings },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // "더보기" 메뉴에 속한 경로가 활성 상태인지 확인
  const isMoreActive = moreMenuItems.some((item) => isActive(item.href));

  return (
    <>
      {/* 더보기 오버레이 */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 배경 딤 */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={() => setMoreOpen(false)}
          />

          {/* 메뉴 시트 */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl shadow-2xl
              animate-fade-in-up pb-8"
            style={{
              backgroundColor: 'var(--color-white)',
              fontFamily: 'var(--font-sans)',
              paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
            }}
          >
            {/* 핸들 바 */}
            <div className="flex justify-center pt-3 pb-2">
              <div
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 pb-3">
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
              >
                더보기
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1.5 rounded-full transition-colors duration-200"
                style={{ color: 'var(--color-text-light)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 메뉴 아이템 */}
            <div className="px-3">
              {moreMenuItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl no-underline
                      transition-colors duration-200"
                    style={{
                      backgroundColor: active ? 'var(--color-botanical-light)' : 'transparent',
                      color: active ? 'var(--color-primary-dark)' : 'var(--color-text)',
                    }}
                  >
                    <Icon
                      size={22}
                      style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-light)' }}
                    />
                    <span
                      className="text-sm"
                      style={{ fontWeight: active ? 500 : 400 }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 하단 탭바 */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t"
        style={{
          backgroundColor: 'var(--color-white)',
          borderColor: 'var(--color-border-light)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div className="flex items-center justify-around h-14">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full
                  no-underline transition-colors duration-200"
                style={{
                  color: active ? 'var(--color-primary)' : 'var(--color-text-light)',
                }}
              >
                <Icon size={20} />
                <span
                  className="text-[10px] leading-tight"
                  style={{ fontWeight: active ? 500 : 400 }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* 더보기 탭 */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full
              border-none bg-transparent cursor-pointer transition-colors duration-200"
            style={{
              color: isMoreActive ? 'var(--color-primary)' : 'var(--color-text-light)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <MoreHorizontal size={20} />
            <span
              className="text-[10px] leading-tight"
              style={{ fontWeight: isMoreActive ? 500 : 400 }}
            >
              더보기
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
