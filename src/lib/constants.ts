// 결혼식 정보 상수
// 이 파일의 값들을 수정하여 청첩장 내용을 변경하세요

export const WEDDING_INFO = {
  // 신랑 정보
  groom: {
    name: '강태욱',
    englishName: 'Taewook',
    father: '강승호',
    mother: '이지순',
    fatherDeceased: false,
    motherDeceased: false,
    phone: '010-1234-5678', // TODO: 실제 연락처로 변경
    account: {
      bank: '카카오뱅크',
      number: '3333-01-4259-709',
      holder: '강태욱',
    },
    fatherAccount: {
      bank: '토스뱅크',
      number: '1001-2370-2666',
      holder: '강승호',
    },
    motherAccount: {
      bank: '농협',
      number: '302-1189-5494-11',
      holder: '이지순',
    },
  },

  // 신부 정보
  bride: {
    name: '김선경',
    englishName: 'Seongyeong',
    father: '김종태',
    mother: '신현임',
    fatherDeceased: false,
    motherDeceased: false,
    phone: '010-9876-5432', // TODO: 실제 연락처로 변경
    account: {
      bank: '국민은행',
      number: '758002-01-165933',
      holder: '김선경',
    },
    fatherAccount: {
      bank: '농협',
      number: '517062-52-003975',
      holder: '김종태',
    },
    motherAccount: {
      bank: '농협',
      number: '351-0136-1933-03',
      holder: '신현임',
    },
  },

  // 결혼식 날짜/시간
  date: '2026-04-05T14:10:00+09:00',
  dateDisplay: {
    year: 2026,
    month: 4,
    day: 5,
    dayOfWeek: '일요일',
    time: '오후 2시 10분',
    timeDetail: '14:10',
  },

  // 예식장 정보
  venue: {
    name: '서울 신도림 라마다 호텔',
    hall: '14층 하늘정원(SKY GARDEN)',
    address: '서울 구로구 경인로 624',
    roadAddress: '서울 구로구 경인로 624',
    tel: '02-2162-2000',
    coordinates: {
      lat: 37.5064,
      lng: 126.8853,
    },
    // 네비게이션 링크
    navigation: {
      naver: 'https://map.naver.com/p/search/%EB%9D%BC%EB%A7%88%EB%8B%A4%20%EC%84%9C%EC%9A%B8%20%EC%8B%A0%EB%8F%84%EB%A6%BC%20%ED%98%B8%ED%85%94',
      kakao: 'https://map.kakao.com/link/to/라마다서울신도림호텔,37.5064,126.8853',
      tmap: 'https://apis.openapi.sk.com/tmap/app/routes?appKey=&name=라마다서울신도림호텔&lon=126.8853&lat=37.5064',
    },
    // 네이버 지도 정적 이미지 (썸네일)
    mapImage: `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=600&h=400&center=126.8853,37.5064&level=16&markers=type:d|size:mid|pos:126.8853%2037.5064|color:red`,
    parking: '호텔 지하주차장 (B1~B7)\n1시간 30분 무료',
    parkingNotice: '주말 웨딩 시 주차 혼잡이 예상되오니\n대중교통 이용을 권장드립니다',
    subway: '1호선, 2호선 신도림역 1번 출구\n(셔틀버스 운행)',
    bus: '간선: 160, 503, 600, 660, 662\n지선: 6515, 6516, 6637, 6640A, 6640B, 6713\n직행: 5200, 301, 320',
  },

  // 셔틀버스 정보
  shuttle: {
    available: true,
    routes: [
      {
        name: '신도림역 셔틀',
        departure: '신도림역 1번 출구 앞',
        timeStart: '13:00',
        timeEnd: '14:00',
        interval: '5분',
        duration: '약 5분 소요',
      },
    ],
  },

  // 예식 정보 및 안내사항
  information: {
    meal: {
      title: '식사 안내',
      description:
        '연회장은 예식 시작 30분 전 부터\n이용하실 수 있습니다. (오후 1시 40분~4시)\n식사는 뷔페로 준비되어 있습니다.',
    },
  },

  // 인사말
  greeting: {
    title: '소중한 분들을 초대합니다',
    message: `한 사람이 오는 것은
그 사람의 삶 전체가 오는 것이기에,
누군가를 곁에 두기로 하는 것은
무척 거대한 결심이라고 합니다.

그 귀한 마음을 서로에게 서약하는 날,
가장 소중한 분들을 모십니다.`,
  },

  // 웨딩 인터뷰
  interview: [
    {
      question: '첫만남은 어땠나요?',
      groomAnswer:
        '첫 만남은 회사 기획 미팅이었어요. 수많은 직원들 중 혼자만 노랑 탈색머리인 사람이 있어서 \'이상한 사람인가?\' 싶었는데, 미팅 중에 상사의 잘못된 의견을 조목조목 반박하는 모습을 보고 \'똑똑하고 당찬 사람이구나\' 싶었죠. 그때는 몰랐습니다, 그 조목조목의 대상이 제가 될 줄은. 그리고 이 사람이 제 인생을 송두리째 바꿀 사람이라는 것도요.',
      brideAnswer:
        '회사 회의에서 처음 만났는데 오류를 공격적으로 지적하던 모습이 아직도 기억납니다. 그런데 막상 업무요청하니까 친절하고 아주 번개처럼 처리해주는거에요, 프로페셔널함에 감동 받았는데 그냥 저를 꼬시기 위해 제 요청에 열심이었던 것으로 밝혀졌습니다.',
    },
    {
      question: '이 사람의 이런 모습, 하객분들은 알고 계셨나요?',
      groomAnswer:
        '평소에 애니메이션 좋아하는 저를 오타쿠라고 부르며 놀리는 사람이, 노래방에서 귀멸의 칼날 OST 홍련화를 부르더라고요. 그것도 일본어 가사를 전부 외워서요. 자, 이제 누가 오타쿠지?',
      brideAnswer:
        '생각보다 아기자기한걸 좋아합니다. 이 모바일 청첩장의 귀여운 처음 화면도 본인이 만들었어요. 이모티콘도 넣었다 뺏다하고 컴퓨터로 보면 마우스에 꽃잎이 따라다닙니다. 더 하겠다는 걸 말리느라 힘들었어요🤣',
    },
    {
      question: '서로에게 어떤 남편/아내가 되고 싶나요?',
      groomAnswer:
        '하객분들은 선경이의 당차고 강한 모습만 보셨을 텐데, 저한테는 별것 아닌 일에도 울고 투정을 부리는 사람이에요. 그런데 그게 저한테만 보여주는 모습이라는 걸 알기에, 제 앞에서만큼은 안심하고 약해져도 되는, 그런 남편이 되고 싶습니다.',
      brideAnswer:
        '어떠한 순간이 와도 본인을 지지해줄거라는 믿음을 주는 배우자가 되고 싶습니다. 불안함, 두려움을 마주했을 때에도 저와 함께임을 생각하면 마음이 놓였으면 좋겠어요.',
    },
    {
      question: '상대방에게 하고 싶은 한마디?',
      groomAnswer:
        '처음에 선경이를 좀 이상한 사람이라고 생각했거든? 알고 보니 진짜 이상한 사람 맞더라. 근데 나한테 딱 맞는 이상한 사람.',
      brideAnswer:
        '나만 믿고 따라와',
    },
  ],

  // 우리의 시간 (타임라인)
  timeline: [
    {
      date: '2022년 봄',
      title: '첫 만남',
      description: '운명처럼 만나게 된 우리',
      icon: 'heart',
    },
    {
      date: '2023년',
      title: '1주년',
      description: '함께한 첫 번째 해',
      icon: 'sparkles',
    },
    {
      date: '2024년',
      title: '2주년',
      description: '더 깊어진 사랑',
      icon: 'calendar',
    },
    {
      date: '2025년',
      title: '결혼',
      description: '영원을 약속하는 날',
      icon: 'party',
    },
  ],

  // Hero 이미지 (로컬 asset - LCP 최적화)
  hero: {
    // 데스크탑: 신랑/신부 각각
    groom: '/images/hero/groom.jpg',
    bride: '/images/hero/bride.jpg',
    // 모바일: 커플 사진
    couple: '/images/hero/couple.jpg',
  },

  // 갤러리 이미지
  // Cloudinary public ID 형식: 'wedding/gallery/파일명' (확장자 제외)
  // 예: photo1.jpg → 'wedding/gallery/photo1'
  gallery: {
    // Cloudinary 폴더 경로
    folder: 'wedding/gallery',
    images: [
      { publicId: 'wedding/gallery/photo1', alt: '웨딩 사진 1' },
      { publicId: 'wedding/gallery/photo2', alt: '웨딩 사진 2' },
      { publicId: 'wedding/gallery/photo3', alt: '웨딩 사진 3' },
      { publicId: 'wedding/gallery/photo4', alt: '웨딩 사진 4' },
      { publicId: 'wedding/gallery/photo5', alt: '웨딩 사진 5' },
      { publicId: 'wedding/gallery/photo6', alt: '웨딩 사진 6' },
    ],
  },

  // 영상 URL (YouTube)
  video: {
    enabled: true,
    youtubeId: 'M6JCSP7r7e8',
    title: '우리의 이야기',
  },

  // 배경음악
  music: {
    enabled: true,
    src: '/music/dancing_in_the_moonlight.mp3',
    title: 'Dancing in the Moonlight',
    artist: 'Toploader',
  },

  // RSVP Google Forms URL
  rsvp: {
    enabled: true,
    formUrl: 'https://forms.gle/your-form-id',
  },

  // 방명록 (Giscus 설정)
  guestbook: {
    enabled: true,
    // Giscus 설정 - https://giscus.app 에서 생성
    repo: 'woogi-kang/wedding-invitation',
    repoId: 'R_kgDOQ3ukEA',
    mapping: 'number',
    term: '1',
    reactionsEnabled: true,
    inputPosition: 'bottom',
    theme: 'light',
    lang: 'ko',
  },
};

// 사이트 URL 자동 감지 (Vercel 시스템 환경변수 활용)
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://wedding-invitation-delta-eight.vercel.app';
}

// OG 메타데이터
// 카카오톡은 이미지 URL을 별도 캐시하므로 버전 파라미터로 캐시 버스팅
const OG_IMAGE_VERSION = 'v3';
export const OG_METADATA = {
  title: `${WEDDING_INFO.groom.name} ♥ ${WEDDING_INFO.bride.name} 결혼합니다`,
  description: `${WEDDING_INFO.dateDisplay.year}년 ${WEDDING_INFO.dateDisplay.month}월 ${WEDDING_INFO.dateDisplay.day}일 ${WEDDING_INFO.dateDisplay.dayOfWeek} ${WEDDING_INFO.dateDisplay.time}`,
  image: `/images/og-wedding.jpg?${OG_IMAGE_VERSION}`,
  url: getSiteUrl(),
};

// 카카오 설정 (환경변수에서 로드)
export const KAKAO_CONFIG = {
  javascriptKey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '',
};

// Guest Snap 설정
export const GUEST_SNAP_CONFIG = {
  enabled: true,

  // Wedding date for activation check
  weddingDate: '2026-04-05',

  // Upload limits
  limits: {
    maxFilesPerSession: 50,
    maxImageSizeMB: 30,
    maxVideoSizeMB: 500,
    maxConcurrentUploads: 3,
  },

  // UI Messages (Korean) - expressing gratitude
  messages: {
    // Section title & description
    sectionTitle: '게스트스냅',
    sectionSubtitle: '저희의 순간을 함께 담아주세요',
    uploadButtonText: '사진 공유하기',

    // Name input modal
    nameModalTitle: '소중한 사진을 공유해주시는 분은 누구신가요?',
    nameModalPlaceholder: '존함을 입력해주세요',
    nameModalSubmit: '사진 공유하러 가기',

    // File selection modal
    uploadModalTitle: '저희를 예쁘게 찍어주셨나요?',
    uploadModalSubtitle: '소중한 순간을 공유해주시면 평생 간직하겠습니다',
    uploadModalSelectButton: '사진/영상 선택하기',
    uploadModalCameraButton: '지금 촬영하기',
    uploadModalDragText: '여기에 파일을 끌어다 놓으세요',

    // Upload progress
    uploadingTitle: '소중한 추억을 전달받고 있어요',
    uploadingProgress: '{{current}}/{{total}} 업로드 중...',
    uploadingPleaseWait: '잠시만 기다려주세요',

    // Retry
    retryingText: '다시 시도하고 있어요... ({{attempt}}/3)',
    retryButton: '다시 시도',
    retryAllButton: '모두 다시 시도',

    // Complete
    uploadComplete: '예쁘게 찍어주셔서 정말 감사합니다 :)',
    uploadCompleteSubtitle: '공유해주신 사진은 평생 소중히 간직할게요',
    uploadMoreButton: '더 공유하기',
    closeButton: '닫기',

    // Failed
    uploadFailed: '앗, 전송이 잘 안됐어요',
    uploadFailedSubtitle: '다시 시도해주시겠어요?',

    // Limit reached
    limitReached: '최대 50장까지 공유하실 수 있어요',
    limitReachedSubtitle: '이미 많은 추억을 공유해주셨네요, 감사합니다!',

    // Offline
    offlineTitle: '인터넷 연결이 끊어졌어요',
    offlineSubtitle: '연결되면 자동으로 업로드를 이어갈게요',

    // File validation
    invalidFileType: '사진과 영상 파일만 공유하실 수 있어요',
    fileTooLarge: '파일이 너무 커요 (사진 30MB, 영상 500MB 이하)',

    // Not yet open (before wedding date)
    notYetOpen: '결혼식 당일부터 사진을 공유하실 수 있어요!',
    notYetOpenSubtitle: '조금만 기다려주세요 :)',

    // Pending uploads recovery
    pendingUploadsFound: '이전에 업로드하지 못한 사진이 있어요',
    pendingUploadsResume: '이어서 업로드하기',
    pendingUploadsDiscard: '새로 시작하기',

    // Leave confirmation
    confirmLeave: '업로드 중입니다. 정말 나가시겠어요?',
    confirmLeaveSubtitle: '나가시면 진행 중인 업로드가 중단될 수 있어요',
  },

  // Allowed file types
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
    videos: ['video/mp4', 'video/quicktime', 'video/hevc'],
  },

  // File extensions mapping
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.heic', '.webp', '.mp4', '.mov'],

  // Retry configuration
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
  },

  // Session configuration
  session: {
    durationHours: 24,
    cookieName: 'guestsnap_session',
  },

  // NAS configuration (actual values from env vars)
  nas: {
    basePath: '/GuestSnap',
    createFolderIfNotExists: true,
  },
};

// 디자인 테마 - Salon de Letter Style 1 (Botanical Elegance)
export const THEME = {
  colors: {
    primary: '#43573a', // Olive Green - 메인 포인트
    primaryLight: '#5a6f50',
    primaryDark: '#2f3d29',
    secondary: '#faf8f5', // Light Cream
    accent: '#b7a989', // Soft Gold - 장식용
    accentLight: '#d4c9b0',
    text: '#3d3d3d', // Dark Charcoal
    textLight: '#6b6b6b',
    textMuted: '#999999',
    background: '#f5f3ed', // Ivory Cream
    white: '#FFFFFF',
    groom: '#5f8b9b', // Soft Blue
    bride: '#BB7273', // Dusty Rose
    gold: '#b7a989', // Soft Gold
    wax: '#832b33', // Wax Seal
  },
  fonts: {
    title: 'var(--font-heading)',
    body: 'var(--font-body)',
  },
};
