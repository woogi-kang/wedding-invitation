import {
  Hero,
  Greeting,
  CoupleIntro,
  Interview,
  Video,
  Gallery,
  WeddingInfo,
  Location,
  Account,
  RSVP,
  Guestbook,
  GuestSnap,
  Share,
  Footer,
} from '@/components/sections';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { IntroOverlay } from '@/components/ui/IntroOverlay';
import { AudioPreloader } from '@/components/ui/AudioPreloader';
import { MouseTrail } from '@/components/ui/MouseTrail';

export default function Home() {
  return (
    <>
      {/* Mouse Trail - petal effect following cursor */}
      <MouseTrail />

      {/* Intro Overlay - appears on first visit */}
      <IntroOverlay />

      <main className="min-h-screen main-content">
        {/* Preload audio */}
        <AudioPreloader />

        {/* 1. Hero - 메인 비주얼 */}
        <Hero />

        {/* 2. Greeting - 인사말 */}
        <Greeting />

        {/* 3. CoupleIntro - 신랑신부 소개 */}
        <CoupleIntro />

        {/* 4. Interview - 웨딩 인터뷰 Q&A */}
        <Interview />

        {/* 5. Gallery - 갤러리 */}
        <Gallery />

        {/* 6. Video - 영상 */}
        <Video />

        {/* 7. WeddingInfo - 예식 안내 + 캘린더 */}
        <WeddingInfo />

        {/* 8. Location - 오시는 길 */}
        <Location />

        {/* 9. Account - 마음 전하실 곳 */}
        <Account />

        {/* 10. RSVP - 참석 여부 */}
        <RSVP />

        {/* 11. Guestbook - 방명록 */}
        <Guestbook />

        {/* 12. GuestSnap - 게스트 사진 업로드 */}
        <GuestSnap />

        {/* 13. Share - 공유하기 */}
        <Share />

        {/* 13. Footer */}
        <Footer />

        {/* Music Player */}
        <MusicPlayer />
      </main>
    </>
  );
}
