import type { SectionType, InvitationTier } from '@/types/saas'

// 섹션 타입 정의
export const SECTION_TYPES: SectionType[] = [
  'hero',
  'greeting',
  'coupleIntro',
  'gallery',
  'weddingInfo',
  'location',
  'account',
  'share',
  'video',
  'footer',
  'interview',
  'timeline',
  'guestsnap',
  'musicPlayer',
  'mouseTrail',
  'rsvp',
  'guestbook',
  'terminalIntro',
  'arcadeMode',
  'afterparty',
] as const

// 티어별 접근 가능 섹션 매핑
export const TIER_SECTIONS: Record<InvitationTier, SectionType[]> = {
  basic: [
    'hero',
    'greeting',
    'coupleIntro',
    'gallery',
    'weddingInfo',
    'location',
    'account',
    'share',
    'footer',
    'rsvp',
    'guestbook',
  ],
  premium: [
    'hero',
    'greeting',
    'coupleIntro',
    'gallery',
    'weddingInfo',
    'location',
    'account',
    'share',
    'video',
    'footer',
    'interview',
    'timeline',
    'guestsnap',
    'musicPlayer',
    'rsvp',
    'guestbook',
    'afterparty',
  ],
  arcade: [
    'hero',
    'greeting',
    'coupleIntro',
    'gallery',
    'weddingInfo',
    'location',
    'account',
    'share',
    'video',
    'footer',
    'interview',
    'timeline',
    'guestsnap',
    'musicPlayer',
    'mouseTrail',
    'rsvp',
    'guestbook',
    'terminalIntro',
    'arcadeMode',
    'afterparty',
  ],
}

// 섹션별 JSON Schema 정의 (data 컬럼 구조)
export interface SectionFieldSchema {
  label: string
  description: string
  defaultData: Record<string, unknown>
  defaultEnabled: boolean
  defaultSortOrder: number
}

export const SECTION_SCHEMAS: Record<SectionType, SectionFieldSchema> = {
  hero: {
    label: '메인 히어로',
    description: '청첩장 상단 메인 이미지 및 문구',
    defaultData: {
      backgroundImage: '',
      subtitle: '',
      overlayOpacity: 0.3,
    },
    defaultEnabled: true,
    defaultSortOrder: 0,
  },
  greeting: {
    label: '인사말',
    description: '결혼 인사말 및 메시지',
    defaultData: {
      title: '결혼합니다',
      message: '',
    },
    defaultEnabled: true,
    defaultSortOrder: 1,
  },
  coupleIntro: {
    label: '신랑신부 소개',
    description: '신랑/신부 프로필 및 소개 문구',
    defaultData: {
      groomIntro: '',
      brideIntro: '',
      groomPhoto: '',
      bridePhoto: '',
    },
    defaultEnabled: true,
    defaultSortOrder: 2,
  },
  gallery: {
    label: '갤러리',
    description: '사진 갤러리',
    defaultData: {
      images: [],
      layout: 'grid',
      columns: 3,
    },
    defaultEnabled: true,
    defaultSortOrder: 3,
  },
  weddingInfo: {
    label: '예식 정보',
    description: '날짜, 시간, D-Day 등',
    defaultData: {
      showDday: true,
      showCalendar: true,
      ceremony: '',
    },
    defaultEnabled: true,
    defaultSortOrder: 4,
  },
  location: {
    label: '오시는 길',
    description: '지도 및 교통 안내',
    defaultData: {
      mapProvider: 'kakao',
      parkingInfo: '',
      transitInfo: '',
    },
    defaultEnabled: true,
    defaultSortOrder: 5,
  },
  account: {
    label: '축의금 계좌',
    description: '신랑측/신부측 계좌 정보',
    defaultData: {
      title: '마음 전하실 곳',
      showCopyButton: true,
    },
    defaultEnabled: true,
    defaultSortOrder: 6,
  },
  share: {
    label: '공유하기',
    description: '카카오톡/링크 공유 버튼',
    defaultData: {
      kakaoEnabled: true,
      linkCopyEnabled: true,
      qrEnabled: false,
    },
    defaultEnabled: true,
    defaultSortOrder: 7,
  },
  video: {
    label: '영상',
    description: '셀프 웨딩 영상, 인터뷰 영상 등',
    defaultData: {
      videoUrl: '',
      autoplay: false,
      showControls: true,
    },
    defaultEnabled: false,
    defaultSortOrder: 8,
  },
  footer: {
    label: '푸터',
    description: '하단 저작권 및 링크',
    defaultData: {
      showPoweredBy: true,
      customText: '',
    },
    defaultEnabled: true,
    defaultSortOrder: 19,
  },
  interview: {
    label: '인터뷰',
    description: '신랑신부 인터뷰 Q&A',
    defaultData: {
      questions: [],
    },
    defaultEnabled: false,
    defaultSortOrder: 9,
  },
  timeline: {
    label: '타임라인',
    description: '연애 타임라인 / 식순',
    defaultData: {
      items: [],
      style: 'vertical',
    },
    defaultEnabled: false,
    defaultSortOrder: 10,
  },
  guestsnap: {
    label: 'GuestSnap',
    description: '하객 사진/영상 업로드',
    defaultData: {
      maxFileSize: 10 * 1024 * 1024,
      allowVideo: true,
      maxUploadsPerSession: 10,
    },
    defaultEnabled: false,
    defaultSortOrder: 11,
  },
  musicPlayer: {
    label: '음악 플레이어',
    description: '배경 음악 재생',
    defaultData: {
      audioUrl: '',
      autoplay: true,
      loop: true,
    },
    defaultEnabled: false,
    defaultSortOrder: 12,
  },
  mouseTrail: {
    label: '마우스 트레일',
    description: '마우스 커서 이펙트',
    defaultData: {
      effect: 'sparkle',
      color: '#FFD700',
    },
    defaultEnabled: false,
    defaultSortOrder: 13,
  },
  rsvp: {
    label: 'RSVP',
    description: '참석 여부 응답',
    defaultData: {
      showMealType: false,
      showMessage: true,
      showPartySize: true,
    },
    defaultEnabled: true,
    defaultSortOrder: 14,
  },
  guestbook: {
    label: '방명록',
    description: '축하 메시지 남기기',
    defaultData: {
      requirePassword: false,
      showTimestamp: true,
    },
    defaultEnabled: true,
    defaultSortOrder: 15,
  },
  terminalIntro: {
    label: '터미널 인트로',
    description: '개발자 스타일 터미널 인트로 애니메이션',
    defaultData: {
      typingSpeed: 50,
      commands: [],
    },
    defaultEnabled: false,
    defaultSortOrder: -1,
  },
  arcadeMode: {
    label: '아케이드 모드',
    description: '레트로 게임 스타일 인터랙션',
    defaultData: {
      gameType: 'catchBouquet',
      difficulty: 'normal',
    },
    defaultEnabled: false,
    defaultSortOrder: 16,
  },
  afterparty: {
    label: '애프터파티',
    description: '2차 장소 및 주변 추천 장소 안내',
    defaultData: {
      title: '함께 즐겨요',
      showMap: true,
    },
    defaultEnabled: false,
    defaultSortOrder: 17,
  },
}

// 특정 티어에서 섹션 사용 가능 여부 확인
export function isSectionAvailable(
  tier: InvitationTier,
  sectionType: SectionType
): boolean {
  return TIER_SECTIONS[tier].includes(sectionType)
}

// 티어에 맞는 기본 섹션 설정 생성
export function getDefaultSections(tier: InvitationTier) {
  return TIER_SECTIONS[tier].map((type) => ({
    type,
    enabled: SECTION_SCHEMAS[type].defaultEnabled,
    sortOrder: SECTION_SCHEMAS[type].defaultSortOrder,
  }))
}
