import { getGalleryImages } from '@/lib/cloudinary';
import { ArcadeInvitationClient } from './ArcadeInvitationClient';

export const revalidate = 60;

export default async function ArcadeInvitationPage() {
  const galleryImages = await getGalleryImages('wedding/gallery');

  return <ArcadeInvitationClient galleryImages={galleryImages} />;
}
