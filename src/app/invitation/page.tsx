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
import { AudioPreloader } from '@/components/ui/AudioPreloader';
import { MouseTrail } from '@/components/ui/MouseTrail';

export default function InvitationPage() {
  return (
    <>
      {/* Mouse Trail - petal effect following cursor */}
      <MouseTrail />

      <main className="min-h-screen main-content">
        {/* Preload audio */}
        <AudioPreloader />

        {/* 1. Hero */}
        <Hero />

        {/* 2. Greeting */}
        <Greeting />

        {/* 3. CoupleIntro */}
        <CoupleIntro />

        {/* 4. Interview */}
        <Interview />

        {/* 5. Gallery */}
        <Gallery />

        {/* 6. Video */}
        <Video />

        {/* 7. WeddingInfo */}
        <WeddingInfo />

        {/* 8. Location */}
        <Location />

        {/* 9. Account */}
        <Account />

        {/* 10. RSVP */}
        <RSVP />

        {/* 11. Guestbook */}
        <Guestbook />

        {/* 12. GuestSnap */}
        <GuestSnap />

        {/* 13. Share */}
        <Share />

        {/* 14. Footer */}
        <Footer />

        {/* Music Player */}
        <MusicPlayer />
      </main>
    </>
  );
}
