'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border-light)] bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
      <Link
        href="#pricing"
        className="block w-full rounded-full bg-[var(--color-primary)] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        무료로 시작하기
      </Link>
    </div>
  );
}
