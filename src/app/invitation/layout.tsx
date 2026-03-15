'use client';

import { ReactNode } from 'react';

interface InvitationLayoutProps {
  children: ReactNode;
}

export default function InvitationLayout({ children }: InvitationLayoutProps) {
  return <div>{children}</div>;
}
