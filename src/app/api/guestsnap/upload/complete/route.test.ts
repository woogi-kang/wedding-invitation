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
    expect(mocks.checkRateLimit).not.toHaveBeenCalled();
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
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadCompletionsPerMinute,
      60000,
      'guestsnap:upload-complete'
    );
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
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadCompletionsPerMinute,
      60000,
      'guestsnap:upload-complete'
    );
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
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadCompletionsPerMinute,
      60000,
      'guestsnap:upload-complete'
    );
    expect(mocks.verifyGuestFolderFile).toHaveBeenCalledWith(
      'file_123',
      'guest-folder-id'
    );
  });

  it('allows the upload that reaches the session max limit', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 49,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);
    mocks.getGuestUploadCount.mockResolvedValue(
      GUEST_SNAP_CONFIG.limits.maxFilesPerSession
    );

    const response = await POST(
      createRequest({ fileId: 'file_123', fileName: 'IMG_001_123456.jpg' })
    );
    const body = await response.json();
    const updatedSessionData = JSON.parse(
      cookieStore.snapshot()[`${GUEST_SNAP_CONFIG.session.cookieName}_data`]
    );

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(updatedSessionData.uploadCount).toBe(
      GUEST_SNAP_CONFIG.limits.maxFilesPerSession
    );
  });

  it('returns 429 when completion is throttled for the session', async () => {
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
    mocks.checkRateLimit.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetTime: 777,
    });

    const response = await POST(createRequest({ fileId: 'file_123' }));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.error?.code).toBe('RATE_LIMITED');
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadCompletionsPerMinute,
      60000,
      'guestsnap:upload-complete'
    );
  });
});
