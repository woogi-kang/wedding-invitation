// 대시보드 mock 데이터 (Foundation 의존성 대체)

import type {
  DashboardSummary,
  Activity,
  AnalyticsData,
  RSVPResponse,
  RSVPSummary,
  GuestSnapSummary,
  GuestSnapFile,
  AfterPartyPlace,
  NotificationSettings,
  NotificationItem,
  Invitation,
} from '@/types/dashboard';
import type { PaymentRecord } from '@/types/payment';

export const MOCK_INVITATION: Invitation = {
  id: 'inv_001',
  userId: 'user_001',
  slug: 'taewook-seongyeong',
  tier: 'arcade',
  status: 'published',
  addons: ['premium_bgm'],
  weddingDate: '2026-04-05',
  groomName: '태욱',
  brideName: '선경',
  url: 'https://weddingcraft.kr/taewook-seongyeong',
  createdAt: '2026-03-20T00:00:00Z',
  expiresAt: '2026-06-04T00:00:00Z',
};

export const MOCK_SUMMARY: DashboardSummary = {
  totalVisitors: 1247,
  todayVisitors: 89,
  totalShares: 342,
  kakaoShares: 286,
  urlShares: 56,
  rsvpAttending: 67,
  rsvpDeclined: 12,
  rsvpPending: 120,
  guestSnapCount: 158,
  guestSnapSize: 12.3 * 1024 * 1024 * 1024, // 12.3GB
  guestSnapLimit: 200 * 1024 * 1024 * 1024, // 200GB
  weeklyVisitors: [120, 145, 198, 230, 210, 175, 169],
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    type: 'rsvp',
    message: '김OO님이 참석 응답을 보냈어요',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'act_2',
    type: 'guestsnap',
    message: 'GuestSnap에 새 사진 3장이 업로드됐어요',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act_3',
    type: 'share',
    message: '청첩장이 카카오톡으로 15회 공유됐어요',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act_4',
    type: 'guestbook',
    message: '새 방명록 메시지가 2개 작성됐어요',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_ANALYTICS: AnalyticsData = {
  totalVisitors: 1247,
  uniqueVisitors: 892,
  returningVisitors: 355,
  dailyVisitors: [
    { date: '2026-03-25', visitors: 120, uniqueVisitors: 95 },
    { date: '2026-03-26', visitors: 145, uniqueVisitors: 110 },
    { date: '2026-03-27', visitors: 198, uniqueVisitors: 150 },
    { date: '2026-03-28', visitors: 230, uniqueVisitors: 170 },
    { date: '2026-03-29', visitors: 210, uniqueVisitors: 155 },
    { date: '2026-03-30', visitors: 175, uniqueVisitors: 130 },
    { date: '2026-03-31', visitors: 169, uniqueVisitors: 125 },
  ],
  shares: [
    { channel: '카카오톡', count: 286, percentage: 83.6 },
    { channel: 'URL 복사', count: 42, percentage: 12.3 },
    { channel: '인스타그램', count: 14, percentage: 4.1 },
  ],
  sectionDwell: [
    { section: 'Hero', avgSeconds: 8 },
    { section: 'Greeting', avgSeconds: 12 },
    { section: 'Gallery', avgSeconds: 25 },
    { section: 'Interview', avgSeconds: 45 },
    { section: 'WeddingInfo', avgSeconds: 15 },
    { section: 'Location', avgSeconds: 20 },
    { section: 'Account', avgSeconds: 30 },
    { section: 'Arcade Mode', avgSeconds: 180 },
    { section: 'GuestSnap', avgSeconds: 60 },
  ],
  devices: { mobile: 89, desktop: 8, tablet: 3 },
  os: { ios: 62, android: 27, other: 11 },
  referrers: [
    { channel: '카카오톡', count: 950, percentage: 76 },
    { channel: '직접 접속', count: 187, percentage: 15 },
    { channel: 'SNS', count: 110, percentage: 9 },
  ],
};

export const MOCK_RSVP_RESPONSES: RSVPResponse[] = [
  { id: 'rsvp_1', name: '김OO', attending: true, guestCount: 2, mealType: 'western', message: '축하해요! 행복하세요~', respondedAt: '2026-03-30T14:23:00Z' },
  { id: 'rsvp_2', name: '이OO', attending: true, guestCount: 1, mealType: 'korean', message: '결혼 축하합니다!', respondedAt: '2026-03-30T12:00:00Z' },
  { id: 'rsvp_3', name: '박OO', attending: false, guestCount: 0, mealType: 'none', message: '일정이 안 돼요 ㅠㅠ', respondedAt: '2026-03-29T18:30:00Z' },
  { id: 'rsvp_4', name: '최OO', attending: true, guestCount: 3, mealType: 'western', message: '가족과 함께 갈게요', respondedAt: '2026-03-29T10:15:00Z' },
  { id: 'rsvp_5', name: '정OO', attending: true, guestCount: 2, mealType: 'korean', message: '축하드려요!', respondedAt: '2026-03-28T16:45:00Z' },
  { id: 'rsvp_6', name: '한OO', attending: true, guestCount: 1, mealType: 'western', message: '행복하세요~', respondedAt: '2026-03-28T09:00:00Z' },
  { id: 'rsvp_7', name: '장OO', attending: false, guestCount: 0, mealType: 'none', message: '출장 중이라 못 가요', respondedAt: '2026-03-27T20:00:00Z' },
  { id: 'rsvp_8', name: '윤OO', attending: true, guestCount: 2, mealType: 'child', message: '아이 포함 3명이요', respondedAt: '2026-03-27T14:00:00Z' },
];

export const MOCK_RSVP_SUMMARY: RSVPSummary = {
  attending: 67,
  declined: 12,
  pending: 120,
  totalGuests: 89,
  meals: { western: 42, korean: 35, child: 12 },
};

export const MOCK_GUESTSNAP_SUMMARY: GuestSnapSummary = {
  totalFiles: 158,
  photoCount: 145,
  videoCount: 13,
  totalSize: 12.3 * 1024 * 1024 * 1024,
  limit: 200 * 1024 * 1024 * 1024,
  uploadStart: '2026-04-05',
  uploadEnd: '2026-04-19',
  storageExpiry: '2026-05-31',
  daysRemaining: 42,
  freeDownloadDeadline: '2026-04-19',
};

export const MOCK_GUESTSNAP_FILES: GuestSnapFile[] = Array.from({ length: 12 }, (_, i) => ({
  id: `gs_${i + 1}`,
  type: (i % 4 === 3 ? 'video' : 'photo') as 'photo' | 'video',
  thumbnailUrl: `/images/guestsnap/thumb_${i + 1}.jpg`,
  originalUrl: `/images/guestsnap/original_${i + 1}.jpg`,
  uploaderName: ['김OO', '이OO', '박OO', '최OO', '정OO', '한OO'][i % 6],
  size: Math.floor(Math.random() * 10 * 1024 * 1024) + 1024 * 1024,
  createdAt: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(),
}));

export const MOCK_AFTERPARTY_PLACES: AfterPartyPlace[] = [
  { id: 'ap_1', category: 'afterparty', name: 'OO호프', time: '18시~', description: '다 같이 한잔해요!', mapUrl: 'https://naver.me/example1', order: 1 },
  { id: 'ap_2', category: 'restaurant', name: '파스타 마니아', description: '우리가 매주 가는 파스타집', mapUrl: 'https://place.map.kakao.com/example2', order: 2 },
  { id: 'ap_3', category: 'cafe', name: '르 카페', description: '디저트 맛집, 포토존 있음', mapUrl: 'https://place.map.kakao.com/example3', order: 3 },
];

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailEnabled: true,
  kakaoEnabled: false,
  email: 'woogi@example.com',
  types: {
    newRsvp: true,
    newGuestSnap: true,
    newGuestbook: true,
    dailyReport: true,
    guestSnapExpiry: true,
    invitationExpiry: true,
  },
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n_1', type: 'daily_report', message: '일일 리포트: 어제 89명 방문, RSVP 5건', read: false, createdAt: '2026-03-31T09:00:00Z' },
  { id: 'n_2', type: 'rsvp', message: '김OO님이 참석 응답을 보냈어요', read: false, createdAt: '2026-03-30T14:23:00Z' },
  { id: 'n_3', type: 'daily_report', message: '일일 리포트: 어제 76명 방문, RSVP 3건', read: true, createdAt: '2026-03-30T09:00:00Z' },
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_1',
    orderId: 'order_20260320_001',
    paymentKey: 'pk_test_001',
    invitationId: 'inv_001',
    userId: 'user_001',
    tier: 'arcade',
    addons: ['premium_bgm'],
    amount: 54_000,
    status: 'DONE',
    method: '카드',
    approvedAt: '2026-03-20T10:30:00Z',
    createdAt: '2026-03-20T10:28:00Z',
  },
];
