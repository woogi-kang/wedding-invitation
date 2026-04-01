'use client';

import { RSVP } from '@/components/sections/RSVP';
import type { DynamicRsvpProps } from '../types';

// RSVP 컴포넌트는 현재 내부적으로 WEDDING_INFO를 사용
// SaaS 전환 시 invitationId 기반 API로 교체 예정
export function DynamicRsvp({ invitationId: _invitationId, enabled = true }: DynamicRsvpProps) {
  if (!enabled) return null;
  return <RSVP />;
}
