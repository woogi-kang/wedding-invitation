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
import { IntroOverlay } from '@/components/ui/IntroOverlay';
import { StoryTransition } from '@/components/common/StoryTransition';
import { AudioPreloader } from '@/components/ui/AudioPreloader';

export default function Home() {
  return (
    <>
      {/* Intro Overlay - appears on first visit, outside main for visibility control */}
      <IntroOverlay />

      <main className="min-h-screen main-content">
        {/* Preload audio as early as possible */}
        <AudioPreloader />

      {/* Hero - Cinematic Split Screen */}
      <Hero />

      {/* Greeting - Message from the couple */}
      <Greeting />

      {/* Story Transition: After greeting, before memories */}
      <StoryTransition
        text="함께한 순간들"
        subtitle="Our Precious Moments"
        variant="brush"
      />

      {/* Gallery - Polaroid Memory Collection */}
      <Gallery />

      {/* Story Transition: The journey continues */}
      <StoryTransition
        text="그리고 우리는"
        variant="vertical"
      />

      {/* Wedding Info - Date & Calendar */}
      <WeddingInfo />

      {/* Story Transition: The special day */}
      <StoryTransition
        text="소중한 그 날"
        subtitle="The Day"
        variant="minimal"
      />

      {/* Location - Venue & Directions */}
      <Location />

      {/* Story Transition: Information */}
      <StoryTransition
        text="안내"
        variant="minimal"
      />

      {/* Information - Wedding ceremony details */}
      <Information />

      {/* Story Transition: Share your heart */}
      <StoryTransition
        text="마음을 전해주세요"
        subtitle="With Love"
        variant="poetic"
      />

      {/* Account - Gift registry */}
      <Account />

      {/* Story Transition: Our story */}
      <StoryTransition
        text="우리의 이야기"
        variant="minimal"
      />

      {/* Video - Wedding video */}
      <Video />

      {/* Story Transition: Please join us */}
      <StoryTransition
        text="함께해 주세요"
        subtitle="RSVP"
        variant="brush"
      />

      {/* RSVP - Attendance confirmation */}
      <RSVP />

      {/* Story Transition: Blessings */}
      <StoryTransition
        text="축복의 말씀"
        subtitle="Your Blessings"
        variant="poetic"
      />

      {/* Guestbook - Messages from guests */}
      <Guestbook />

      {/* Story Transition: Share moments */}
      <StoryTransition
        text="추억을 나눠주세요"
        variant="minimal"
      />

      {/* GuestSnap - Guest photo upload */}
      <GuestSnap />

      {/* Story Transition: Share this invitation */}
      <StoryTransition
        text="공유하기"
        variant="minimal"
      />

      {/* Share - Social sharing */}
      <Share />

      {/* Footer - Final thank you */}
      <Footer />

        {/* Music Player - Fixed Button */}
        <MusicPlayer />
      </main>
    </>
  );
}
