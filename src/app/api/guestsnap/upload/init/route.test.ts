// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { createMockCookieStore } from '@/test-utils/guestsnap';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  checkRateLimit: vi.fn(),
  getGuestUploadCount: vi.fn(),
  validateUploadMetadataServer: vi.fn(),
  createResumableUploadSession: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
}));

vi.mock('@/lib/guestsnap', () => ({
  checkRateLimit: mocks.checkRateLimit,
  getGuestUploadCount: mocks.getGuestUploadCount,
  validateUploadMetadataServer: mocks.validateUploadMetadataServer,
  createResumableUploadSession: mocks.createResumableUploadSession,
}));

import { POST } from './route';

function createRequest(
  body: Record<string, unknown>,
  ip = '127.0.0.1'
): NextRequest {
  return new NextRequest('http://localhost/api/guestsnap/upload/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('GuestSnap upload init route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 29,
      resetTime: Date.now() + 60_000,
    });
    mocks.getGuestUploadCount.mockResolvedValue(3);
    mocks.validateUploadMetadataServer.mockResolvedValue({
      valid: true,
      type: 'image',
    });
    mocks.createResumableUploadSession.mockResolvedValue({
      success: true,
      uploadUrl: 'https://google-upload.test/session',
      fileName: 'IMG_001_123456.jpg',
    });
  });

  it('returns 401 when the upload session is missing', async () => {
    mocks.cookies.mockResolvedValue(createMockCookieStore());

    const response = await POST(
      createRequest({
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        headerBase64: 'abcd',
      })
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error?.code).toBe('NO_SESSION');
    expect(mocks.checkRateLimit).not.toHaveBeenCalled();
  });

  it('returns 400 when the per-session upload limit is already reached', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 50,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);
    mocks.getGuestUploadCount.mockResolvedValue(GUEST_SNAP_CONFIG.limits.maxFilesPerSession);

    const response = await POST(
      createRequest({
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        headerBase64: 'abcd',
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error?.code).toBe('LIMIT_REACHED');
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadInitsPerMinute,
      60000,
      'guestsnap:upload-init'
    );
    expect(mocks.validateUploadMetadataServer).not.toHaveBeenCalled();
  });

  it('returns 400 when metadata validation fails', async () => {
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
    mocks.validateUploadMetadataServer.mockResolvedValue({
      valid: false,
      error: '파일 형식이 올바르지 않아요',
    });

    const response = await POST(
      createRequest({
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        headerBase64: 'abcd',
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error?.code).toBe('INVALID_FILE');
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadInitsPerMinute,
      60000,
      'guestsnap:upload-init'
    );
    expect(mocks.createResumableUploadSession).not.toHaveBeenCalled();
  });

  it('returns a Google upload URL when initialization succeeds', async () => {
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
      createRequest({
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        headerBase64: 'abcd',
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.uploadUrl).toBe('https://google-upload.test/session');
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadInitsPerMinute,
      60000,
      'guestsnap:upload-init'
    );
    expect(mocks.createResumableUploadSession).toHaveBeenCalledWith(
      'photo.jpg',
      'image/jpeg',
      'guest-folder-id',
      'image',
      1024,
      undefined
    );
  });

  it('returns 500 when Google upload session creation fails', async () => {
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
    mocks.createResumableUploadSession.mockResolvedValue({
      success: false,
      error: 'Google Drive unavailable',
    });

    const response = await POST(
      createRequest({
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        headerBase64: 'abcd',
      })
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error?.code).toBe('UPLOAD_INIT_FAILED');
  });

  it('returns 429 when upload initialization is throttled for the session', async () => {
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
      resetTime: 123456789,
    });

    const response = await POST(
      createRequest({
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        headerBase64: 'abcd',
      })
    );
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.error?.code).toBe('RATE_LIMITED');
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      'gs_123',
      GUEST_SNAP_CONFIG.rateLimits.uploadInitsPerMinute,
      60000,
      'guestsnap:upload-init'
    );
  });
});
