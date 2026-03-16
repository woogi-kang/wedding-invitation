// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { createMockCookieStore } from '@/test-utils/guestsnap';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  checkRateLimit: vi.fn(),
  getGuestUploadCount: vi.fn(),
  verifyGuestFolderFile: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
}));

vi.mock('@/lib/guestsnap', () => ({
  checkRateLimit: mocks.checkRateLimit,
  getGuestUploadCount: mocks.getGuestUploadCount,
  verifyGuestFolderFile: mocks.verifyGuestFolderFile,
}));

import { POST } from './route';

function createRequest(
  body: Record<string, unknown>,
  ip = '127.0.0.1'
): NextRequest {
  return new NextRequest('http://localhost/api/guestsnap/upload/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('GuestSnap upload complete route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 29,
      resetTime: Date.now() + 60_000,
    });
    mocks.getGuestUploadCount.mockResolvedValue(4);
    mocks.verifyGuestFolderFile.mockResolvedValue({
      success: true,
      fileName: 'IMG_001_123456.jpg',
    });
  });

  it('returns 401 when the upload session is missing', async () => {
    mocks.cookies.mockResolvedValue(createMockCookieStore());

    const response = await POST(createRequest({ fileId: 'file_123' }));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error?.code).toBe('NO_SESSION');
  });

  it('returns 400 when file id is missing', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 3,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await POST(createRequest({}));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error?.code).toBe('NO_FILE_ID');
  });

  it('returns 500 when uploaded file ownership verification fails', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 3,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);
    mocks.verifyGuestFolderFile.mockResolvedValue({
      success: false,
      error: 'wrong folder',
    });

    const response = await POST(createRequest({ fileId: 'file_123' }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error?.code).toBe('UPLOAD_VERIFICATION_FAILED');
  });

  it('updates the session upload count when completion succeeds', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 3,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await POST(
      createRequest({ fileId: 'file_123', fileName: 'IMG_001_123456.jpg' })
    );
    const body = await response.json();
    const updatedSessionData = JSON.parse(
      cookieStore.snapshot()[`${GUEST_SNAP_CONFIG.session.cookieName}_data`]
    );

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.fileId).toBe('file_123');
    expect(updatedSessionData.uploadCount).toBe(4);
    expect(mocks.verifyGuestFolderFile).toHaveBeenCalledWith(
      'file_123',
      'guest-folder-id'
    );
  });
});
