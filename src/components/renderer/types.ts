// 템플릿 렌더링 엔진 타입 정의
// Foundation 워커가 만드는 타입이 준비되면 교체 예정

import type { GalleryImage } from '@/lib/gallery';

// ============================================
// 섹션 타입 열거
// ============================================

export type SectionType =
  | 'hero'
  | 'greeting'
  | 'couple_intro'
  | 'gallery'
  | 'wedding_info'
  | 'location'
  | 'account'
  | 'share'
  | 'video'
  | 'interview'
  | 'timeline'
  | 'rsvp'
  | 'guestbook'
  | 'guest_snap'
  | 'after_party'
  | 'footer';

// ============================================
// 섹션 설정 (sort_order, enabled 등)
// ============================================

export interface SectionConfig {
  type: SectionType;
  sort_order: number;
  enabled: boolean;
}

// ============================================
// 청첩장 전체 설정
// ============================================

export interface InvitationConfig {
  slug: string;
  status: 'draft' | 'published' | 'archived';
  template_id: string;
  theme?: ThemeConfig;
  music?: MusicConfig;
}

export interface ThemeConfig {
  primary: string;
  primaryLight?: string;
  primaryDark?: string;
  secondary: string;
  accent: string;
  accentLight?: string;
  text: string;
  textLight?: string;
  textMuted?: string;
  background: string;
  white?: string;
  groom?: string;
  bride?: string;
  gold?: string;
}

export interface MusicConfig {
  enabled: boolean;
  src: string;
  title: string;
  artist: string;
}

// ============================================
// 각 Dynamic 컴포넌트 Props 타입
// ============================================

export interface AccountInfo {
  bank: string;
  number: string;
  holder: string;
}

export interface ParentInfo {
  name: string;
  deceased?: boolean;
}

// --- Hero ---
export interface DynamicHeroProps {
  groomName: string;
  groomEnglishName?: string;
  brideName: string;
  brideEnglishName?: string;
  weddingDate: string;
  dateDisplay: DateDisplayInfo;
  venue: {
    name: string;
    hall: string;
  };
  heroImages: {
    groom: string;
    bride: string;
    couple: string;
  };
}

export interface DateDisplayInfo {
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
  time: string;
  timeDetail?: string;
}

// --- Greeting ---
export interface DynamicGreetingProps {
  greetingTitle?: string;
  greetingMessage: string;
}

// --- CoupleIntro ---
export interface DynamicCoupleIntroProps {
  groom: {
    name: string;
    photo?: string;
    father: string;
    mother: string;
    fatherDeceased?: boolean;
    motherDeceased?: boolean;
  };
  bride: {
    name: string;
    photo?: string;
    father: string;
    mother: string;
    fatherDeceased?: boolean;
    motherDeceased?: boolean;
  };
}

// --- Gallery ---
export interface DynamicGalleryProps {
  images: GalleryImage[];
}

// --- WeddingInfo ---
export interface DynamicWeddingInfoProps {
  dateDisplay: DateDisplayInfo;
  venue: {
    name: string;
    hall: string;
  };
  mealInfo?: {
    title: string;
    description: string;
    time?: string;
  };
}

// --- Location ---
export interface DynamicLocationProps {
  venue: {
    name: string;
    hall: string;
    address: string;
    roadAddress: string;
    tel?: string;
    coordinates: { lat: number; lng: number };
    navigation?: {
      naver?: string;
      kakao?: string;
      tmap?: string;
    };
    parking?: string;
    parkingNotice?: string;
    subway?: string;
    bus?: string;
  };
  shuttle?: {
    available: boolean;
    routes: ShuttleRouteInfo[];
  };
}

export interface ShuttleRouteInfo {
  name: string;
  departure: string;
  timeStart: string;
  timeEnd: string;
  interval: string;
  duration: string;
}

// --- Account ---
export interface DynamicAccountProps {
  groomAccounts: AccountInfo[];
  brideAccounts: AccountInfo[];
}

// --- Share ---
export interface DynamicShareProps {
  groomName: string;
  brideName: string;
  date: string;
  dateDisplay: DateDisplayInfo;
  venue: {
    name: string;
    hall: string;
    roadAddress: string;
  };
}

// --- Video ---
export interface DynamicVideoProps {
  youtubeId: string;
  title?: string;
}

// --- Interview ---
export interface InterviewItem {
  question: string;
  groomAnswer: string;
  brideAnswer: string;
}

export interface DynamicInterviewProps {
  interviews: InterviewItem[];
}

// --- Timeline ---
export interface TimelineMilestone {
  date: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface DynamicTimelineProps {
  milestones: TimelineMilestone[];
}

// --- RSVP ---
export interface DynamicRsvpProps {
  invitationId: string;
  enabled?: boolean;
}

// --- Guestbook ---
export interface DynamicGuestbookProps {
  invitationId: string;
  enabled?: boolean;
}

// --- GuestSnap ---
export interface DynamicGuestSnapProps {
  invitationId: string;
  config?: {
    enabled: boolean;
    weddingDate: string;
    maxFilesPerSession?: number;
  };
}

// --- AfterParty ---
export interface AfterPartyPlace {
  name: string;
  description?: string;
  address?: string;
  mapUrl?: string;
}

export interface DynamicAfterPartyProps {
  places: AfterPartyPlace[];
  showAfterTime?: string;
}

// --- Footer ---
export interface DynamicFooterProps {
  groomName: string;
  brideName: string;
  groomPhone?: string;
  bridePhone?: string;
  dateDisplay: DateDisplayInfo;
}

// ============================================
// SectionRenderer가 사용하는 유니온 타입
// ============================================

export type SectionData =
  | { type: 'hero'; data: DynamicHeroProps }
  | { type: 'greeting'; data: DynamicGreetingProps }
  | { type: 'couple_intro'; data: DynamicCoupleIntroProps }
  | { type: 'gallery'; data: DynamicGalleryProps }
  | { type: 'wedding_info'; data: DynamicWeddingInfoProps }
  | { type: 'location'; data: DynamicLocationProps }
  | { type: 'account'; data: DynamicAccountProps }
  | { type: 'share'; data: DynamicShareProps }
  | { type: 'video'; data: DynamicVideoProps }
  | { type: 'interview'; data: DynamicInterviewProps }
  | { type: 'timeline'; data: DynamicTimelineProps }
  | { type: 'rsvp'; data: DynamicRsvpProps }
  | { type: 'guestbook'; data: DynamicGuestbookProps }
  | { type: 'guest_snap'; data: DynamicGuestSnapProps }
  | { type: 'after_party'; data: DynamicAfterPartyProps }
  | { type: 'footer'; data: DynamicFooterProps };

// ============================================
// InvitationRenderer에 전달되는 전체 데이터
// ============================================

export interface InvitationRenderData {
  config: InvitationConfig;
  sections: SectionConfig[];
  sectionData: Record<string, unknown>;
}
