/**
 * DB의 section_data (jsonb) → 각 Dynamic 컴포넌트의 props로 변환
 * 기본값(default) 처리 포함
 */

import type {
  SectionType,
  DynamicHeroProps,
  DynamicGreetingProps,
  DynamicCoupleIntroProps,
  DynamicGalleryProps,
  DynamicWeddingInfoProps,
  DynamicLocationProps,
  DynamicAccountProps,
  DynamicShareProps,
  DynamicVideoProps,
  DynamicInterviewProps,
  DynamicTimelineProps,
  DynamicRsvpProps,
  DynamicGuestbookProps,
  DynamicGuestSnapProps,
  DynamicAfterPartyProps,
  DynamicFooterProps,
  DateDisplayInfo,
} from '@/components/renderer/types';

// ============================================
// 기본값 상수
// ============================================

const DEFAULT_DATE_DISPLAY: DateDisplayInfo = {
  year: 2026,
  month: 1,
  day: 1,
  dayOfWeek: '목요일',
  time: '오후 12시',
};

// ============================================
// 헬퍼 함수
// ============================================

function getString(data: Record<string, unknown>, key: string, fallback = ''): string {
  const val = data[key];
  return typeof val === 'string' ? val : fallback;
}

function getNumber(data: Record<string, unknown>, key: string, fallback = 0): number {
  const val = data[key];
  return typeof val === 'number' ? val : fallback;
}

function getBoolean(data: Record<string, unknown>, key: string, fallback = false): boolean {
  const val = data[key];
  return typeof val === 'boolean' ? val : fallback;
}

function getObject(data: Record<string, unknown>, key: string): Record<string, unknown> {
  const val = data[key];
  return (val && typeof val === 'object' && !Array.isArray(val)) ? val as Record<string, unknown> : {};
}

function getArray(data: Record<string, unknown>, key: string): unknown[] {
  const val = data[key];
  return Array.isArray(val) ? val : [];
}

function parseDateDisplay(data: Record<string, unknown>): DateDisplayInfo {
  const raw = getObject(data, 'dateDisplay');
  if (!raw || Object.keys(raw).length === 0) {
    // weddingDate ISO 문자열에서 파싱 시도
    const dateStr = getString(data, 'weddingDate') || getString(data, 'date');
    if (dateStr) {
      return parseDateFromISO(dateStr);
    }
    return DEFAULT_DATE_DISPLAY;
  }
  return {
    year: getNumber(raw, 'year', DEFAULT_DATE_DISPLAY.year),
    month: getNumber(raw, 'month', DEFAULT_DATE_DISPLAY.month),
    day: getNumber(raw, 'day', DEFAULT_DATE_DISPLAY.day),
    dayOfWeek: getString(raw, 'dayOfWeek', DEFAULT_DATE_DISPLAY.dayOfWeek),
    time: getString(raw, 'time', DEFAULT_DATE_DISPLAY.time),
    timeDetail: getString(raw, 'timeDetail'),
  };
}

function parseDateFromISO(isoString: string): DateDisplayInfo {
  const date = new Date(isoString);
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHour = hours > 12 ? hours - 12 : hours;
  const timeStr = minutes > 0 ? `${ampm} ${displayHour}시 ${minutes}분` : `${ampm} ${displayHour}시`;

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    dayOfWeek: days[date.getDay()],
    time: timeStr,
    timeDetail: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
  };
}

// ============================================
// 섹션별 변환 함수
// ============================================

function transformHero(data: Record<string, unknown>): DynamicHeroProps {
  const heroImages = getObject(data, 'heroImages');
  const venue = getObject(data, 'venue');
  return {
    groomName: getString(data, 'groomName', '신랑'),
    groomEnglishName: getString(data, 'groomEnglishName'),
    brideName: getString(data, 'brideName', '신부'),
    brideEnglishName: getString(data, 'brideEnglishName'),
    weddingDate: getString(data, 'weddingDate'),
    dateDisplay: parseDateDisplay(data),
    venue: {
      name: getString(venue, 'name', '예식장'),
      hall: getString(venue, 'hall'),
    },
    heroImages: {
      groom: getString(heroImages, 'groom', '/images/hero/groom.jpg'),
      bride: getString(heroImages, 'bride', '/images/hero/bride.jpg'),
      couple: getString(heroImages, 'couple', '/images/hero/couple.jpg'),
    },
  };
}

function transformGreeting(data: Record<string, unknown>): DynamicGreetingProps {
  return {
    greetingTitle: getString(data, 'greetingTitle'),
    greetingMessage: getString(data, 'greetingMessage', '소중한 분들을 초대합니다'),
  };
}

function transformCoupleIntro(data: Record<string, unknown>): DynamicCoupleIntroProps {
  const groom = getObject(data, 'groom');
  const bride = getObject(data, 'bride');
  return {
    groom: {
      name: getString(groom, 'name', '신랑'),
      photo: getString(groom, 'photo'),
      father: getString(groom, 'father'),
      mother: getString(groom, 'mother'),
      fatherDeceased: getBoolean(groom, 'fatherDeceased'),
      motherDeceased: getBoolean(groom, 'motherDeceased'),
    },
    bride: {
      name: getString(bride, 'name', '신부'),
      photo: getString(bride, 'photo'),
      father: getString(bride, 'father'),
      mother: getString(bride, 'mother'),
      fatherDeceased: getBoolean(bride, 'fatherDeceased'),
      motherDeceased: getBoolean(bride, 'motherDeceased'),
    },
  };
}

function transformGallery(data: Record<string, unknown>): DynamicGalleryProps {
  const images = getArray(data, 'images').map((img) => {
    const item = img as Record<string, unknown>;
    return {
      src: getString(item, 'src'),
      alt: getString(item, 'alt', '웨딩 사진'),
      width: getNumber(item, 'width', 4000),
      height: getNumber(item, 'height', 6000),
    };
  });
  return { images };
}

function transformWeddingInfo(data: Record<string, unknown>): DynamicWeddingInfoProps {
  const venue = getObject(data, 'venue');
  const mealRaw = getObject(data, 'mealInfo');
  const mealInfo = Object.keys(mealRaw).length > 0
    ? {
        title: getString(mealRaw, 'title', '식사 안내'),
        description: getString(mealRaw, 'description'),
        time: getString(mealRaw, 'time'),
      }
    : undefined;

  return {
    dateDisplay: parseDateDisplay(data),
    venue: {
      name: getString(venue, 'name', '예식장'),
      hall: getString(venue, 'hall'),
    },
    mealInfo,
  };
}

function transformLocation(data: Record<string, unknown>): DynamicLocationProps {
  const venue = getObject(data, 'venue');
  const coords = getObject(venue, 'coordinates');
  const nav = getObject(venue, 'navigation');
  const shuttleRaw = getObject(data, 'shuttle');
  const shuttleRoutes = getArray(shuttleRaw, 'routes').map((r) => {
    const route = r as Record<string, unknown>;
    return {
      name: getString(route, 'name'),
      departure: getString(route, 'departure'),
      timeStart: getString(route, 'timeStart'),
      timeEnd: getString(route, 'timeEnd'),
      interval: getString(route, 'interval'),
      duration: getString(route, 'duration'),
    };
  });

  return {
    venue: {
      name: getString(venue, 'name', '예식장'),
      hall: getString(venue, 'hall'),
      address: getString(venue, 'address'),
      roadAddress: getString(venue, 'roadAddress') || getString(venue, 'address'),
      tel: getString(venue, 'tel'),
      coordinates: {
        lat: getNumber(coords, 'lat', 37.5665),
        lng: getNumber(coords, 'lng', 126.978),
      },
      navigation: {
        naver: getString(nav, 'naver'),
        kakao: getString(nav, 'kakao'),
        tmap: getString(nav, 'tmap'),
      },
      parking: getString(venue, 'parking'),
      parkingNotice: getString(venue, 'parkingNotice'),
      subway: getString(venue, 'subway'),
      bus: getString(venue, 'bus'),
    },
    shuttle: shuttleRoutes.length > 0
      ? { available: getBoolean(shuttleRaw, 'available', true), routes: shuttleRoutes }
      : undefined,
  };
}

function transformAccount(data: Record<string, unknown>): DynamicAccountProps {
  const parseAccounts = (arr: unknown[]) =>
    arr.map((a) => {
      const acc = a as Record<string, unknown>;
      return {
        bank: getString(acc, 'bank'),
        number: getString(acc, 'number'),
        holder: getString(acc, 'holder'),
      };
    });

  return {
    groomAccounts: parseAccounts(getArray(data, 'groomAccounts')),
    brideAccounts: parseAccounts(getArray(data, 'brideAccounts')),
  };
}

function transformShare(data: Record<string, unknown>): DynamicShareProps {
  const venue = getObject(data, 'venue');
  return {
    groomName: getString(data, 'groomName', '신랑'),
    brideName: getString(data, 'brideName', '신부'),
    date: getString(data, 'date'),
    dateDisplay: parseDateDisplay(data),
    venue: {
      name: getString(venue, 'name', '예식장'),
      hall: getString(venue, 'hall'),
      roadAddress: getString(venue, 'roadAddress'),
    },
  };
}

function transformVideo(data: Record<string, unknown>): DynamicVideoProps {
  return {
    youtubeId: getString(data, 'youtubeId'),
    title: getString(data, 'title', '우리의 이야기'),
  };
}

function transformInterview(data: Record<string, unknown>): DynamicInterviewProps {
  const interviews = getArray(data, 'interviews').map((item) => {
    const i = item as Record<string, unknown>;
    return {
      question: getString(i, 'question'),
      groomAnswer: getString(i, 'groomAnswer'),
      brideAnswer: getString(i, 'brideAnswer'),
    };
  });
  return { interviews };
}

function transformTimeline(data: Record<string, unknown>): DynamicTimelineProps {
  const milestones = getArray(data, 'milestones').map((item) => {
    const m = item as Record<string, unknown>;
    return {
      date: getString(m, 'date'),
      title: getString(m, 'title'),
      description: getString(m, 'description'),
      icon: getString(m, 'icon', 'heart'),
    };
  });
  return { milestones };
}

function transformRsvp(data: Record<string, unknown>): DynamicRsvpProps {
  return {
    invitationId: getString(data, 'invitationId'),
    enabled: getBoolean(data, 'enabled', true),
  };
}

function transformGuestbook(data: Record<string, unknown>): DynamicGuestbookProps {
  return {
    invitationId: getString(data, 'invitationId'),
    enabled: getBoolean(data, 'enabled', true),
  };
}

function transformGuestSnap(data: Record<string, unknown>): DynamicGuestSnapProps {
  const config = getObject(data, 'config');
  return {
    invitationId: getString(data, 'invitationId'),
    config: Object.keys(config).length > 0
      ? {
          enabled: getBoolean(config, 'enabled', true),
          weddingDate: getString(config, 'weddingDate'),
          maxFilesPerSession: getNumber(config, 'maxFilesPerSession', 50),
        }
      : undefined,
  };
}

function transformAfterParty(data: Record<string, unknown>): DynamicAfterPartyProps {
  const places = getArray(data, 'places').map((p) => {
    const place = p as Record<string, unknown>;
    return {
      name: getString(place, 'name'),
      description: getString(place, 'description'),
      address: getString(place, 'address'),
      mapUrl: getString(place, 'mapUrl'),
    };
  });
  return {
    places,
    showAfterTime: getString(data, 'showAfterTime'),
  };
}

function transformFooter(data: Record<string, unknown>): DynamicFooterProps {
  return {
    groomName: getString(data, 'groomName', '신랑'),
    brideName: getString(data, 'brideName', '신부'),
    groomPhone: getString(data, 'groomPhone'),
    bridePhone: getString(data, 'bridePhone'),
    dateDisplay: parseDateDisplay(data),
  };
}

// ============================================
// 메인 변환 함수
// ============================================

/**
 * DB의 section_data (jsonb)를 Dynamic 컴포넌트 props로 변환
 * 사용자가 입력하지 않은 필드는 기본값 사용
 */
export function transformSectionData(
  type: SectionType,
  data: Record<string, unknown>,
): Record<string, unknown> | null {
  switch (type) {
    case 'hero': return transformHero(data) as unknown as Record<string, unknown>;
    case 'greeting': return transformGreeting(data) as unknown as Record<string, unknown>;
    case 'couple_intro': return transformCoupleIntro(data) as unknown as Record<string, unknown>;
    case 'gallery': return transformGallery(data) as unknown as Record<string, unknown>;
    case 'wedding_info': return transformWeddingInfo(data) as unknown as Record<string, unknown>;
    case 'location': return transformLocation(data) as unknown as Record<string, unknown>;
    case 'account': return transformAccount(data) as unknown as Record<string, unknown>;
    case 'share': return transformShare(data) as unknown as Record<string, unknown>;
    case 'video': return transformVideo(data) as unknown as Record<string, unknown>;
    case 'interview': return transformInterview(data) as unknown as Record<string, unknown>;
    case 'timeline': return transformTimeline(data) as unknown as Record<string, unknown>;
    case 'rsvp': return transformRsvp(data) as unknown as Record<string, unknown>;
    case 'guestbook': return transformGuestbook(data) as unknown as Record<string, unknown>;
    case 'guest_snap': return transformGuestSnap(data) as unknown as Record<string, unknown>;
    case 'after_party': return transformAfterParty(data) as unknown as Record<string, unknown>;
    case 'footer': return transformFooter(data) as unknown as Record<string, unknown>;
    default: return null;
  }
}

/**
 * constants.ts의 기존 WEDDING_INFO 구조를 새 JSON 구조로 변환
 * 기존 청첩장 데이터를 동적 렌더링 엔진으로 마이그레이션할 때 사용
 */
export function transformLegacyWeddingInfo(weddingInfo: Record<string, unknown>): Record<string, Record<string, unknown>> {
  const groom = getObject(weddingInfo, 'groom');
  const bride = getObject(weddingInfo, 'bride');
  const venue = getObject(weddingInfo, 'venue');
  const dateDisplay = getObject(weddingInfo, 'dateDisplay');
  const hero = getObject(weddingInfo, 'hero');
  const greeting = getObject(weddingInfo, 'greeting');
  const shuttle = getObject(weddingInfo, 'shuttle');
  const video = getObject(weddingInfo, 'video');
  const information = getObject(weddingInfo, 'information');
  const meal = getObject(information, 'meal');

  return {
    hero: {
      groomName: getString(groom, 'name'),
      groomEnglishName: getString(groom, 'englishName'),
      brideName: getString(bride, 'name'),
      brideEnglishName: getString(bride, 'englishName'),
      weddingDate: getString(weddingInfo, 'date'),
      dateDisplay,
      venue: { name: getString(venue, 'name'), hall: getString(venue, 'hall') },
      heroImages: {
        groom: getString(hero, 'groom'),
        bride: getString(hero, 'bride'),
        couple: getString(hero, 'couple'),
      },
    },
    greeting: {
      greetingTitle: getString(greeting, 'title'),
      greetingMessage: getString(greeting, 'message'),
    },
    couple_intro: {
      groom: {
        name: getString(groom, 'name'),
        photo: '/images/hero/groom.webp',
        father: getString(groom, 'father'),
        mother: getString(groom, 'mother'),
        fatherDeceased: getBoolean(groom, 'fatherDeceased'),
        motherDeceased: getBoolean(groom, 'motherDeceased'),
      },
      bride: {
        name: getString(bride, 'name'),
        photo: '/images/hero/bride.webp',
        father: getString(bride, 'father'),
        mother: getString(bride, 'mother'),
        fatherDeceased: getBoolean(bride, 'fatherDeceased'),
        motherDeceased: getBoolean(bride, 'motherDeceased'),
      },
    },
    wedding_info: {
      dateDisplay,
      venue: { name: getString(venue, 'name'), hall: getString(venue, 'hall') },
      mealInfo: Object.keys(meal).length > 0
        ? { title: getString(meal, 'title'), description: getString(meal, 'description') }
        : undefined,
    },
    location: {
      venue: {
        name: getString(venue, 'name'),
        hall: getString(venue, 'hall'),
        address: getString(venue, 'address'),
        roadAddress: getString(venue, 'roadAddress'),
        tel: getString(venue, 'tel'),
        coordinates: getObject(venue, 'coordinates'),
        navigation: getObject(venue, 'navigation'),
        parking: getString(venue, 'parking'),
        parkingNotice: getString(venue, 'parkingNotice'),
        subway: getString(venue, 'subway'),
        bus: getString(venue, 'bus'),
      },
      shuttle: {
        available: getBoolean(shuttle, 'available'),
        routes: getArray(shuttle, 'routes'),
      },
    },
    account: {
      groomAccounts: [
        getObject(groom, 'account'),
        getObject(groom, 'fatherAccount'),
        getObject(groom, 'motherAccount'),
      ].filter((a) => getString(a, 'bank')),
      brideAccounts: [
        getObject(bride, 'account'),
        getObject(bride, 'fatherAccount'),
        getObject(bride, 'motherAccount'),
      ].filter((a) => getString(a, 'bank')),
    },
    share: {
      groomName: getString(groom, 'name'),
      brideName: getString(bride, 'name'),
      date: getString(weddingInfo, 'date'),
      dateDisplay,
      venue: {
        name: getString(venue, 'name'),
        hall: getString(venue, 'hall'),
        roadAddress: getString(venue, 'roadAddress'),
      },
    },
    video: {
      youtubeId: getString(video, 'youtubeId'),
      title: getString(video, 'title'),
    },
    interview: {
      interviews: getArray(weddingInfo, 'interview'),
    },
    timeline: {
      milestones: getArray(weddingInfo, 'timeline'),
    },
    footer: {
      groomName: getString(groom, 'name'),
      brideName: getString(bride, 'name'),
      groomPhone: getString(groom, 'phone'),
      bridePhone: getString(bride, 'phone'),
      dateDisplay,
    },
  };
}
