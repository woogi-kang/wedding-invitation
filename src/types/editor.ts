// 에디터 관련 타입 정의

export type Tier = 'basic' | 'premium' | 'arcade';
export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';
export type MobileView = 'edit' | 'preview';
export type SectionStatus = 'complete' | 'incomplete' | 'disabled';

export interface SectionConfig {
  type: string;
  name: string;
  description: string;
  icon: string;
  tier: Tier;
  requiredTier: Tier;
  defaultEnabled: boolean;
  canDisable: boolean;
  requiredFields: string[];
  order: number;
}

export interface SectionState {
  type: string;
  enabled: boolean;
  order: number;
  data: Record<string, unknown>;
}

export interface InvitationDraft {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'expired';
  tier: Tier;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountEntry {
  bank: string;
  number: string;
  holder: string;
}

export interface InterviewItem {
  question: string;
  groomAnswer: string;
  brideAnswer: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon: string;
}

export interface AfterPartyPlace {
  category: string;
  name: string;
  time: string;
  comment: string;
  url: string;
}

export interface ShuttleInfo {
  departure: string;
  timeStart: string;
  timeEnd: string;
  interval: string;
}
