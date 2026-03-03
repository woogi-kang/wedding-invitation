import QRCode from 'qrcode';
import { OG_METADATA } from '@/lib/constants';

function trimTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function getGuestSnapPageUrl(): string {
  const baseUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || OG_METADATA.url);
  return `${baseUrl}/guestsnap`;
}

export async function generateGuestSnapQrDataUrl(
  size: number = 360
): Promise<string> {
  return QRCode.toDataURL(getGuestSnapPageUrl(), {
    width: size,
    margin: 1,
    color: {
      dark: '#2f3d29',
      light: '#ffffff',
    },
  });
}

