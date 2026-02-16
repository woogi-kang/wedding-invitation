import { galleryImages } from '@/lib/gallery';
import { GlitchInvitationClient } from './GlitchInvitationClient';

export default function GlitchInvitationPage() {
  return <GlitchInvitationClient galleryImages={galleryImages} />;
}
