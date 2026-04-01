import type { SectionConfig, SectionStatus, Tier } from '@/types/editor';

// 섹션 메타데이터 설정
export const SECTION_CONFIGS: SectionConfig[] = [
  {
    type: 'hero',
    name: '메인 사진',
    description: '커플 사진과 날짜',
    icon: '📷',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: false,
    requiredFields: ['groomPhoto', 'bridePhoto', 'couplePhoto'],
    order: 1,
  },
  {
    type: 'greeting',
    name: '인사말',
    description: '초대 인사말',
    icon: '💌',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: ['message'],
    order: 2,
  },
  {
    type: 'coupleIntro',
    name: '신랑신부 소개',
    description: '양가 부모님 성함',
    icon: '💑',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: ['groomName', 'brideName', 'groomFather', 'groomMother', 'brideFather', 'brideMother'],
    order: 3,
  },
  {
    type: 'interview',
    name: '웨딩 인터뷰',
    description: 'Q&A 형식 커플 인터뷰',
    icon: '🎤',
    tier: 'premium',
    requiredTier: 'premium',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: ['items'],
    order: 4,
  },
  {
    type: 'gallery',
    name: '갤러리',
    description: '웨딩 사진',
    icon: '🖼️',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: ['photos'],
    order: 5,
  },
  {
    type: 'video',
    name: '영상',
    description: 'YouTube 영상',
    icon: '🎬',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: ['youtubeUrl'],
    order: 6,
  },
  {
    type: 'timeline',
    name: '우리의 시간',
    description: '커플 타임라인',
    icon: '⏳',
    tier: 'premium',
    requiredTier: 'premium',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: ['items'],
    order: 7,
  },
  {
    type: 'weddingInfo',
    name: '예식 정보',
    description: '날짜, 시간, 식사 안내',
    icon: '📅',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: ['date', 'time'],
    order: 8,
  },
  {
    type: 'location',
    name: '오시는 길',
    description: '예식장 위치, 교통편',
    icon: '📍',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: ['venueName', 'address'],
    order: 9,
  },
  {
    type: 'account',
    name: '축의금 계좌',
    description: '신랑/신부측 계좌',
    icon: '💳',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: ['groomAccounts', 'brideAccounts'],
    order: 10,
  },
  {
    type: 'rsvp',
    name: '참석 여부',
    description: 'RSVP 응답 수집',
    icon: '✅',
    tier: 'premium',
    requiredTier: 'premium',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: [],
    order: 11,
  },
  {
    type: 'guestbook',
    name: '방명록',
    description: '하객 축하 메시지',
    icon: '📖',
    tier: 'premium',
    requiredTier: 'premium',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: [],
    order: 12,
  },
  {
    type: 'guestSnap',
    name: '게스트스냅',
    description: '하객 사진 공유',
    icon: '📸',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: [],
    order: 13,
  },
  {
    type: 'share',
    name: '공유',
    description: '카카오톡/URL 공유',
    icon: '🔗',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: true,
    requiredFields: [],
    order: 14,
  },
  {
    type: 'footer',
    name: '푸터',
    description: '하단 정보',
    icon: '📄',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: true,
    canDisable: false,
    requiredFields: [],
    order: 15,
  },
  {
    type: 'afterParty',
    name: '식 후 안내',
    description: '뒤풀이 장소 안내',
    icon: '🎉',
    tier: 'basic',
    requiredTier: 'basic',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: ['places'],
    order: 16,
  },
  {
    type: 'music',
    name: '배경음악',
    description: 'BGM 설정',
    icon: '🎵',
    tier: 'premium',
    requiredTier: 'premium',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: [],
    order: 17,
  },
  {
    type: 'arcade',
    name: '아케이드 모드',
    description: 'RPG 게임 청첩장',
    icon: '🎮',
    tier: 'arcade',
    requiredTier: 'arcade',
    defaultEnabled: false,
    canDisable: true,
    requiredFields: ['groomCharacterName', 'brideCharacterName'],
    order: 18,
  },
];

// 티어 우선순위
const TIER_PRIORITY: Record<Tier, number> = {
  basic: 0,
  premium: 1,
  arcade: 2,
};

// 특정 티어에서 사용 가능한 섹션인지 확인
export function isSectionAvailable(sectionTier: Tier, userTier: Tier): boolean {
  return TIER_PRIORITY[userTier] >= TIER_PRIORITY[sectionTier];
}

// 섹션 기본 데이터 생성
export function createDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return { groomPhoto: '', bridePhoto: '', couplePhoto: '', displayText: '우리 결혼합니다', dateFormat: 'korean' };
    case 'greeting':
      return { title: '소중한 분들을 초대합니다', message: '' };
    case 'coupleIntro':
      return {
        groomName: '', groomEnglishName: '', groomFather: '', groomMother: '',
        groomFatherDeceased: false, groomMotherDeceased: false,
        brideName: '', brideEnglishName: '', brideFather: '', brideMother: '',
        brideFatherDeceased: false, brideMotherDeceased: false,
        titleFormat: 'son-daughter',
      };
    case 'gallery':
      return { photos: [] };
    case 'weddingInfo':
      return { date: '', time: '', mealInfo: '', additionalInfo: '' };
    case 'location':
      return {
        venueName: '', hall: '', address: '', lat: 0, lng: 0, tel: '',
        naverMapUrl: '', kakaoMapUrl: '', tmapUrl: '',
        parking: '', subway: '', bus: '', shuttles: [],
      };
    case 'account':
      return {
        groomAccounts: [{ bank: '', number: '', holder: '' }],
        brideAccounts: [{ bank: '', number: '', holder: '' }],
        kakaoPayUrl: '',
      };
    case 'share':
      return { kakaoEnabled: true, urlCopyEnabled: true, groomPhone: '', bridePhone: '' };
    case 'video':
      return { youtubeUrl: '', title: '' };
    case 'interview':
      return { items: [{ question: '', groomAnswer: '', brideAnswer: '' }] };
    case 'timeline':
      return { items: [{ date: '', title: '', description: '', icon: 'heart' }] };
    case 'rsvp':
      return { enabled: true, deadline: '', mealOptions: [], customQuestion: '' };
    case 'guestbook':
      return { enabled: true, guidanceText: '' };
    case 'guestSnap':
      return { enabled: true, title: '게스트스냅', description: '저희의 순간을 함께 담아주세요', buttonText: '사진 공유하기', completeMessage: '감사합니다' };
    case 'afterParty':
      return { showAfter: '', places: [{ category: '뒤풀이', name: '', time: '', comment: '', url: '' }] };
    case 'music':
      return { file: '', songName: '', artist: '', autoPlay: true };
    case 'arcade':
      return { groomCharacterName: '', brideCharacterName: '' };
    case 'footer':
      return { copyright: 'Made with WeddingCraft', customText: '' };
    default:
      return {};
  }
}

// 초기 섹션 상태 생성
export function createInitialSections(): { type: string; enabled: boolean; order: number; data: Record<string, unknown> }[] {
  return SECTION_CONFIGS.map((config) => ({
    type: config.type,
    enabled: config.defaultEnabled,
    order: config.order,
    data: createDefaultSectionData(config.type),
  }));
}

// 섹션 완성도 계산
export function calculateSectionCompletion(type: string, data: Record<string, unknown>): SectionStatus {
  const config = SECTION_CONFIGS.find((c) => c.type === type);
  if (!config) return 'disabled';

  if (config.requiredFields.length === 0) return 'complete';

  const allFilled = config.requiredFields.every((field) => {
    const value = data[field];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value !== 0;
    return value !== null && value !== undefined;
  });

  return allFilled ? 'complete' : 'incomplete';
}
