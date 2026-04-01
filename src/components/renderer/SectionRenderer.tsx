'use client';

import type { SectionData } from './types';
import {
  DynamicHero,
  DynamicGreeting,
  DynamicCoupleIntro,
  DynamicGallery,
  DynamicWeddingInfo,
  DynamicLocation,
  DynamicAccount,
  DynamicShare,
  DynamicVideo,
  DynamicInterview,
  DynamicTimeline,
  DynamicRsvp,
  DynamicGuestbook,
  DynamicGuestSnap,
  DynamicAfterParty,
  DynamicFooter,
} from './sections';

interface SectionRendererProps {
  section: SectionData;
}

/**
 * 섹션 타입과 데이터를 받아 적절한 Dynamic 컴포넌트를 렌더링
 *
 * @example
 * <SectionRenderer section={{ type: 'hero', data: heroData }} />
 */
export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case 'hero':
      return <DynamicHero {...section.data} />;
    case 'greeting':
      return <DynamicGreeting {...section.data} />;
    case 'couple_intro':
      return <DynamicCoupleIntro {...section.data} />;
    case 'gallery':
      return <DynamicGallery {...section.data} />;
    case 'wedding_info':
      return <DynamicWeddingInfo {...section.data} />;
    case 'location':
      return <DynamicLocation {...section.data} />;
    case 'account':
      return <DynamicAccount {...section.data} />;
    case 'share':
      return <DynamicShare {...section.data} />;
    case 'video':
      return <DynamicVideo {...section.data} />;
    case 'interview':
      return <DynamicInterview {...section.data} />;
    case 'timeline':
      return <DynamicTimeline {...section.data} />;
    case 'rsvp':
      return <DynamicRsvp {...section.data} />;
    case 'guestbook':
      return <DynamicGuestbook {...section.data} />;
    case 'guest_snap':
      return <DynamicGuestSnap {...section.data} />;
    case 'after_party':
      return <DynamicAfterParty {...section.data} />;
    case 'footer':
      return <DynamicFooter {...section.data} />;
    default:
      return null;
  }
}
