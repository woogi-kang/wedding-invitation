import { getGalleryImages } from '@/lib/cloudinary';
import { GlitchInvitationClient } from './GlitchInvitationClient';

export const revalidate = 60;

export default async function GlitchInvitationPage() {
  const galleryImages = await getGalleryImages('wedding/gallery');

  return <GlitchInvitationClient galleryImages={galleryImages} />;
}
