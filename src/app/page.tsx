import {
  Hero,
  Greeting,
  Gallery,
  WeddingInfo,
  Location,
  Information,
  Account,
  Video,
  RSVP,
  Guestbook,
  GuestSnap,
  Share,
  Footer,
} from '@/components/sections';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { Divider } from '@/components/common/Section';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero - 메인 커버 */}
      <Hero />

      {/* Greeting - 인사말 */}
      <Greeting />

      <Divider />

      {/* Gallery - 갤러리 */}
      <Gallery />

      <Divider />

      {/* Wedding Info - 예식 정보 + 캘린더 + D-Day */}
      <WeddingInfo />

      <Divider />

      {/* Location - 오시는 길 + 셔틀버스 */}
      <Location />

      <Divider />

      {/* Information - 예식정보 및 안내사항 */}
      <Information />

      <Divider />

      {/* Account - 계좌 정보 */}
      <Account />

      <Divider />

      {/* Video - 영상 */}
      <Video />

      <Divider />

      {/* RSVP - 참석 의사 */}
      <RSVP />

      <Divider />

      {/* Guestbook - 방명록 */}
      <Guestbook />

      <Divider />

      {/* GuestSnap - 게스트 사진 업로드 */}
      <GuestSnap />

      <Divider />

      {/* Share - 공유하기 */}
      <Share />

      {/* Footer */}
      <Footer />

      {/* Music Player - Fixed Button */}
      <MusicPlayer />
    </main>
  );
}
