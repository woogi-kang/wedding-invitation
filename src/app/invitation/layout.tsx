'use client';

import { ReactNode } from 'react';
import { useKonamiCode, useTripleTap } from '@/hooks/useKonamiCode';
import { useTrickRouter } from '@/hooks/useTrickRouter';

interface InvitationLayoutProps {
  children: ReactNode;
}

export default function InvitationLayout({ children }: InvitationLayoutProps) {
  const { navigateToTrick } = useTrickRouter();

  // Konami code and "dev" typing detection
  useKonamiCode({
    onActivate: navigateToTrick,
  });

  // Triple tap detection for mobile (will be attached to footer)
  const { handleTap } = useTripleTap(navigateToTrick);

  return (
    <div data-trick-tap="enabled" onClick={handleTap}>
      {children}
    </div>
  );
}
