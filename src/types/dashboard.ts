// 대시보드 관련 타입 정의

export type InvitationStatus = 'draft' | 'published' | 'expired';

export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  tier: 'basic' | 'premium' | 'arcade';
  status: InvitationStatus;
  addons: string[];
  weddingDate: string;
  groomName: string;
  brideName: string;
  url: string;
  createdAt: string;
  expiresAt: string;
}

// 대시보드 요약
export interface DashboardSummary {
  totalVisitors: number;
  todayVisitors: number;
  totalShares: number;
  kakaoShares: number;
  urlShares: number;
  rsvpAttending: number;
  rsvpDeclined: number;
  rsvpPending: number;
  guestSnapCount: number;
  guestSnapSize: number; // bytes
  guestSnapLimit: number; // bytes (200GB)
  weeklyVisitors: number[]; // 최근 7일
}

// 최근 활동
export type ActivityType = 'rsvp' | 'guestsnap' | 'share' | 'guestbook';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}

// 통계
export interface DailyVisitorStat {
  date: string;
  visitors: number;
  uniqueVisitors: number;
}

export interface ShareStat {
  channel: string;
  count: number;
  percentage: number;
}

export interface SectionDwellStat {
  section: string;
  avgSeconds: number;
}

export interface DeviceStat {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface OSStat {
  ios: number;
  android: number;
  other: number;
}

export interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  returningVisitors: number;
  dailyVisitors: DailyVisitorStat[];
  shares: ShareStat[];
  sectionDwell: SectionDwellStat[];
  devices: DeviceStat;
  os: OSStat;
  referrers: ShareStat[];
}

// RSVP
export type MealType = 'western' | 'korean' | 'child' | 'none';

export interface RSVPResponse {
  id: string;
  name: string;
  attending: boolean;
  guestCount: number;
  mealType: MealType;
  message: string;
  respondedAt: string;
}

export interface RSVPSummary {
  attending: number;
  declined: number;
  pending: number;
  totalGuests: number;
  meals: {
    western: number;
    korean: number;
    child: number;
  };
}

// GuestSnap
export interface GuestSnapSummary {
  totalFiles: number;
  photoCount: number;
  videoCount: number;
  totalSize: number; // bytes
  limit: number; // bytes
  uploadStart: string;
  uploadEnd: string;
  storageExpiry: string;
  daysRemaining: number;
  freeDownloadDeadline: string;
}

export interface GuestSnapFile {
  id: string;
  type: 'photo' | 'video';
  thumbnailUrl: string;
  originalUrl: string;
  uploaderName: string;
  size: number;
  createdAt: string;
}

// AfterParty
export type PlaceCategory =
  | 'afterparty'
  | 'restaurant'
  | 'cafe'
  | 'attraction'
  | 'photospot'
  | 'other';

export interface AfterPartyPlace {
  id: string;
  category: PlaceCategory;
  name: string;
  time?: string;
  description: string;
  mapUrl: string;
  order: number;
}

// 알림
export interface NotificationSettings {
  emailEnabled: boolean;
  kakaoEnabled: boolean;
  email: string;
  types: {
    newRsvp: boolean;
    newGuestSnap: boolean;
    newGuestbook: boolean;
    dailyReport: boolean;
    guestSnapExpiry: boolean;
    invitationExpiry: boolean;
  };
}

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}
