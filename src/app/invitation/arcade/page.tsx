import { Suspense } from 'react';
import { galleryImages } from '@/lib/gallery';
import { ArcadeInvitationClient } from './ArcadeInvitationClient';

export default function ArcadeInvitationPage() {
  return (
    <Suspense>
      <ArcadeInvitationClient galleryImages={galleryImages} />
    </Suspense>
  );
}
