import type { Metadata } from 'next';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ArcadeSection } from '@/components/landing/ArcadeSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection, FAQJsonLd } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'WeddingCraft - 세상에 하나뿐인 모바일 청첩장',
  description:
    '18가지 섹션을 자유롭게 조합하고, RPG 게임으로 초대하세요. 3분이면 완성되는 나만의 모바일 청첩장. GuestSnap으로 하객 사진도 무제한 수집.',
  keywords: [
    '모바일 청첩장',
    '웨딩 청첩장',
    '디지털 청첩장',
    '청첩장 만들기',
    'RPG 게임 청첩장',
    '아케이드 청첩장',
    'GuestSnap',
    '하객 사진',
    'WeddingCraft',
  ],
  openGraph: {
    type: 'website',
    title: 'WeddingCraft - 세상에 하나뿐인 모바일 청첩장',
    description:
      '18가지 섹션을 자유롭게 조합하고, RPG 게임으로 초대하세요. 3분이면 완성!',
    siteName: 'WeddingCraft',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeddingCraft - 세상에 하나뿐인 모바일 청첩장',
    description:
      '18가지 섹션을 자유롭게 조합하고, RPG 게임으로 초대하세요.',
  },
};

// JSON-LD: SoftwareApplication schema
function SoftwareAppJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WeddingCraft',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Basic',
        price: '19000',
        priceCurrency: 'KRW',
      },
      {
        '@type': 'Offer',
        name: 'Premium',
        price: '39000',
        priceCurrency: 'KRW',
      },
      {
        '@type': 'Offer',
        name: 'Arcade',
        price: '49000',
        priceCurrency: 'KRW',
      },
    ],
    description:
      '18가지 섹션을 자유롭게 조합하는 모바일 청첩장 서비스. RPG 게임 청첩장, GuestSnap 하객 사진 수집 기능 포함.',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function MarketingPage() {
  return (
    <>
      <SoftwareAppJsonLd />
      <FAQJsonLd />

      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <ArcadeSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </>
  );
}
