'use client';

import { Sidebar } from './Sidebar';
import { MobileTabBar } from './MobileTabBar';
import { MobileHeader } from './MobileHeader';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* 모바일 헤더 (lg 이상에서 숨김) */}
      <MobileHeader />

      {/* 사이드바: 데스크톱(lg+)에서 w-60, 태블릿(md)에서 w-16, 모바일에서 숨김 */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* 메인 콘텐츠 영역 - 사이드바 너비만큼 마진 확보 */}
      <main
        className="min-h-screen pb-20 md:pb-0 pt-14 md:pt-0 md:ml-16 lg:ml-60 transition-all duration-300"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* 모바일 하단 탭바 (md 이상에서 숨김) */}
      <MobileTabBar />
    </div>
  );
}
