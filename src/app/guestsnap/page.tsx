import type { Metadata } from 'next';
import { GuestSnapStandalone } from '@/components/guestsnap/GuestSnapStandalone';

export const metadata: Metadata = {
  title: 'GuestSnap 업로드',
  description: '하객 사진/영상을 업로드하는 전용 페이지',
};

export default function GuestSnapPage() {
  return <GuestSnapStandalone />;
}

