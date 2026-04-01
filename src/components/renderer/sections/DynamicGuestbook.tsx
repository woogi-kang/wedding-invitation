'use client';

import { Guestbook } from '@/components/sections/Guestbook';
import type { DynamicGuestbookProps } from '../types';

// Guestbook 컴포넌트는 현재 Firebase Firestore를 직접 사용
// SaaS 전환 시 Supabase 기반으로 교체 예정, 일단 기존 컴포넌트 래핑
export function DynamicGuestbook({ invitationId: _invitationId, enabled = true }: DynamicGuestbookProps) {
  if (!enabled) return null;
  return <Guestbook />;
}
