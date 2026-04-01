'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#features', label: '기능' },
  { href: '#pricing', label: '가격' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* 로고 */}
        <Link href="/" className="text-lg font-bold tracking-tight text-[var(--color-primary-dark)]">
          WeddingCraft
        </Link>

        {/* 데스크탑 네비게이션 */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-text-light)] transition-colors hover:text-[var(--color-primary)]"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/demo"
            className="text-sm font-medium text-[var(--color-text-light)] transition-colors hover:text-[var(--color-primary)]"
          >
            데모
          </Link>
          <Link
            href="#pricing"
            className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-md"
          >
            시작하기
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
        >
          <div className="relative h-5 w-5">
            <span
              className={cn(
                'absolute left-0 h-0.5 w-5 bg-[var(--color-text)] transition-all duration-300',
                mobileOpen ? 'top-2.5 rotate-45' : 'top-0.5'
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-2.5 h-0.5 w-5 bg-[var(--color-text)] transition-opacity duration-300',
                mobileOpen ? 'opacity-0' : 'opacity-100'
              )}
            />
            <span
              className={cn(
                'absolute left-0 h-0.5 w-5 bg-[var(--color-text)] transition-all duration-300',
                mobileOpen ? 'top-2.5 -rotate-45' : 'top-[18px]'
              )}
            />
          </div>
        </button>
      </nav>

      {/* 모바일 메뉴 오버레이 */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center gap-6 pt-12">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-[var(--color-text)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/demo"
              className="text-lg font-medium text-[var(--color-text)]"
              onClick={() => setMobileOpen(false)}
            >
              데모 체험
            </Link>
            <Link
              href="#pricing"
              className="mt-4 rounded-full bg-[var(--color-primary)] px-8 py-3 text-base font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              시작하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
