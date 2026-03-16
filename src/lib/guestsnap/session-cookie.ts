import { cookies } from 'next/headers';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';

export interface GuestSnapCookieSessionData {
  id: string;
  guestName: string;
  guestFolder: string;
  uploadCount: number;
  createdAt: number;
}

function getSessionExpiresAt(createdAt: number): Date {
  return new Date(
    createdAt + GUEST_SNAP_CONFIG.session.durationHours * 60 * 60 * 1000
  );
}

function getCookieOptions(createdAt: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    expires: getSessionExpiresAt(createdAt),
    path: '/',
  };
}

export async function getGuestSnapSessionCookieData(): Promise<GuestSnapCookieSessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionDataStr = cookieStore.get(
      `${GUEST_SNAP_CONFIG.session.cookieName}_data`
    )?.value;

    if (!sessionDataStr) {
      return null;
    }

    return JSON.parse(sessionDataStr) as GuestSnapCookieSessionData;
  } catch {
    return null;
  }
}

export async function setGuestSnapSessionCookies(
  sessionData: GuestSnapCookieSessionData
): Promise<void> {
  const cookieStore = await cookies();
  const cookieOptions = getCookieOptions(sessionData.createdAt);

  cookieStore.set(GUEST_SNAP_CONFIG.session.cookieName, sessionData.id, cookieOptions);
  cookieStore.set(
    `${GUEST_SNAP_CONFIG.session.cookieName}_data`,
    JSON.stringify(sessionData),
    cookieOptions
  );
}

export async function updateGuestSnapSessionUploadCount(
  newCount: number
): Promise<void> {
  const sessionData = await getGuestSnapSessionCookieData();

  if (!sessionData) {
    return;
  }

  sessionData.uploadCount = newCount;
  await setGuestSnapSessionCookies(sessionData);
}

export function getGuestSnapSessionExpiry(createdAt: number): Date {
  return getSessionExpiresAt(createdAt);
}
