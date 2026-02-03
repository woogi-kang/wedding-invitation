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
  Guestbook,
  GuestSnap,
  Share,
  Footer,
} from '@/components/sections';
import { MouseTrail } from '@/components/ui/MouseTrail';
import { RSVPDialog } from '@/components/ui/RSVPDialog';
import { GuestSnapDialog } from '@/components/ui/GuestSnapDialog';
import { getGalleryImages } from '@/lib/cloudinary';

export default async function InvitationPage() {
  // Fetch gallery images from Cloudinary (server-side)
  const galleryImages = await getGalleryImages('wedding/gallery');
  return (
    <>
      {/* Mouse Trail - petal effect following cursor */}
      <MouseTrail />

      {/* RSVP Dialog - 결혼식 시작 전까지 2초 후 자동 표시 */}
      <RSVPDialog />

      {/* GuestSnap Dialog - 결혼식 시작 후 2초 후 자동 표시 */}
      <GuestSnapDialog />

      <main className="min-h-screen main-content">

        {/* 1. Hero */}
        <Hero />

        {/* 2. Greeting */}
        <Greeting />

        {/* 3. CoupleIntro */}
        <CoupleIntro />

        {/* 4. Interview */}
        <Interview />

        {/* 5. Gallery */}
        <Gallery images={galleryImages} />

        {/* 6. Video - 준비 후 주석 해제 */}
        {/* <Video /> */}

        {/* 7. WeddingInfo */}
        <WeddingInfo />

        {/* 8. Location */}
        <Location />

        {/* 9. Account */}
        <Account />

        {/* 10. Guestbook */}
        <Guestbook />

        {/* 11. GuestSnap */}
        <GuestSnap />

        {/* 12. Share */}
        <Share />

        {/* 13. Footer */}
        <Footer />
      </main>
    </>
  );
}
