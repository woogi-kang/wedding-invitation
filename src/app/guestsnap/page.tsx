import type { Metadata } from 'next';
import { GuestSnapStandalone } from '@/components/guestsnap/GuestSnapStandalone';
import {
  generateGuestSnapQrDataUrl,
  getGuestSnapPageUrl,
} from '@/lib/guestsnap/qr-code';

export const metadata: Metadata = {
  title: 'GuestSnap 업로드',
  description: '하객 사진/영상을 업로드하는 전용 페이지',
};

export default async function GuestSnapPage() {
  const pageUrl = getGuestSnapPageUrl();
  const qrDataUrl = await generateGuestSnapQrDataUrl(380);

  return <GuestSnapStandalone qrDataUrl={qrDataUrl} pageUrl={pageUrl} />;
}

