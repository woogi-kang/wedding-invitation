'use client';

import { GuestSnap } from '@/components/sections/GuestSnap';
import type { DynamicGuestSnapProps } from '../types';

// GuestSnap 컴포넌트는 현재 GUEST_SNAP_CONFIG를 직접 사용
// SaaS 전환 시 invitationId 기반 설정으로 교체 예정
export function DynamicGuestSnap({ invitationId: _invitationId, config }: DynamicGuestSnapProps) {
  if (config && !config.enabled) return null;
  return <GuestSnap />;
}
