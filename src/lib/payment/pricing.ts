// 가격 및 상품 정보 상수

import type { PricingInfo, AddonInfo, PricingTier, AddonType } from '@/types/payment';

export const PRICING_TIERS: Record<PricingTier, PricingInfo> = {
  basic: {
    tier: 'basic',
    name: 'Basic',
    price: 19_000,
    features: [
      '기본 섹션 10개',
      '에디터',
      '카카오 공유',
      'GuestSnap (200GB)',
      'RSVP',
      '방명록',
    ],
  },
  premium: {
    tier: 'premium',
    name: 'Premium',
    price: 39_000,
    features: [
      'Basic 전체 포함',
      '인터뷰 섹션',
      '타임라인 섹션',
      '3D 효과',
      'BGM',
      '프리미엄 갤러리',
    ],
  },
  arcade: {
    tier: 'arcade',
    name: 'Arcade',
    price: 49_000,
    features: [
      'Premium 전체 포함',
      '아케이드 모드 (RPG 게임 청첩장)',
      '게임 커스터마이징',
      '특별 이스터에그',
    ],
  },
};

export const ADDONS: Record<AddonType, AddonInfo> = {
  lifetime: {
    type: 'lifetime',
    name: '평생소장',
    price: 10_000,
    description: '청첩장 영구 보관 (기본: 예식일+60일)',
  },
  guestsnap_extra_download: {
    type: 'guestsnap_extra_download',
    name: 'GuestSnap 초과 다운로드',
    price: 5_000,
    description: '200GB 초과분 다운로드',
    unit: '100GB당',
  },
  guestsnap_delayed_download: {
    type: 'guestsnap_delayed_download',
    name: 'GuestSnap 지연 다운로드',
    price: 5_000,
    description: '2주 경과 후 다운로드',
  },
  guestsnap_storage_extension: {
    type: 'guestsnap_storage_extension',
    name: 'GuestSnap 보관 연장',
    price: 3_000,
    description: '보관 기간 4주 연장',
    unit: '4주당',
  },
  premium_bgm: {
    type: 'premium_bgm',
    name: '프리미엄 BGM 팩',
    price: 5_000,
    description: '저작권 해결된 10곡 추가',
  },
  extra_gallery: {
    type: 'extra_gallery',
    name: '추가 갤러리 사진',
    price: 3_000,
    description: '20장 -> 50장',
  },
  custom_domain: {
    type: 'custom_domain',
    name: '커스텀 도메인',
    price: 8_000,
    description: 'yourname.weddingcraft.kr',
  },
};

export function calculateTotal(tier: PricingTier, selectedAddons: AddonType[]): number {
  const tierPrice = PRICING_TIERS[tier].price;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + ADDONS[addon].price, 0);
  return tierPrice + addonsTotal;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

// 환불 정책 계산
export function calculateRefundRate(
  hasUrl: boolean,
  weddingDate: Date,
): { rate: number; refundable: boolean; reason: string } {
  if (!hasUrl) {
    return { rate: 100, refundable: true, reason: 'URL 발급 전 100% 환불' };
  }

  const now = new Date();
  const daysUntilWedding = Math.ceil(
    (weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilWedding > 7) {
    return { rate: 70, refundable: true, reason: 'URL 발급 후, 결혼식 7일 전까지 70% 환불' };
  }

  return { rate: 0, refundable: false, reason: '결혼식 7일 전 이후 환불 불가' };
}
