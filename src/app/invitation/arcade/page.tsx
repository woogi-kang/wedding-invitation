import { galleryImages } from '@/lib/gallery';
import { ArcadeInvitationClient } from './ArcadeInvitationClient';

export default function ArcadeInvitationPage() {
  return <ArcadeInvitationClient galleryImages={galleryImages} />;
}
