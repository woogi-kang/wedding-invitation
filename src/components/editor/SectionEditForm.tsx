'use client';

import { useEditorStore } from '@/stores/editor-store';
import { SECTION_CONFIGS } from '@/lib/editor/section-config';
import HeroForm from './forms/HeroForm';
import GreetingForm from './forms/GreetingForm';
import CoupleIntroForm from './forms/CoupleIntroForm';
import GalleryForm from './forms/GalleryForm';
import WeddingInfoForm from './forms/WeddingInfoForm';
import LocationForm from './forms/LocationForm';
import AccountForm from './forms/AccountForm';
import ShareForm from './forms/ShareForm';
import VideoForm from './forms/VideoForm';
import InterviewForm from './forms/InterviewForm';
import TimelineForm from './forms/TimelineForm';
import RsvpForm from './forms/RsvpForm';
import GuestSnapForm from './forms/GuestSnapForm';
import GuestbookForm from './forms/GuestbookForm';
import AfterPartyForm from './forms/AfterPartyForm';
import MusicForm from './forms/MusicForm';
import ArcadeForm from './forms/ArcadeForm';
import FooterForm from './forms/FooterForm';

const FORM_MAP: Record<string, React.ComponentType<{ data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }>> = {
  hero: HeroForm,
  greeting: GreetingForm,
  coupleIntro: CoupleIntroForm,
  gallery: GalleryForm,
  weddingInfo: WeddingInfoForm,
  location: LocationForm,
  account: AccountForm,
  share: ShareForm,
  video: VideoForm,
  interview: InterviewForm,
  timeline: TimelineForm,
  rsvp: RsvpForm,
  guestbook: GuestbookForm,
  guestSnap: GuestSnapForm,
  afterParty: AfterPartyForm,
  music: MusicForm,
  arcade: ArcadeForm,
  footer: FooterForm,
};

export default function SectionEditForm() {
  const { activeSectionId, setActiveSection, sections, updateSectionData } = useEditorStore();

  if (!activeSectionId) return null;

  const section = sections.find((s) => s.type === activeSectionId);
  const config = SECTION_CONFIGS.find((c) => c.type === activeSectionId);
  const FormComponent = FORM_MAP[activeSectionId];

  if (!section || !config || !FormComponent) return null;

  return (
    <div className="flex flex-col h-full">
      {/* 헤더: 뒤로가기 + 섹션명 */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button
          onClick={() => setActiveSection(null)}
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-base" role="img" aria-label={config.name}>{config.icon}</span>
        <h2 className="text-sm font-semibold text-gray-900">{config.name} 편집</h2>
      </div>

      {/* 폼 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <FormComponent
          data={section.data}
          onChange={(data) => updateSectionData(activeSectionId, data)}
        />
      </div>
    </div>
  );
}
