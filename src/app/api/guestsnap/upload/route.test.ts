// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { createMockCookieStore, createTestFile } from '@/test-utils/guestsnap';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  uploadFile: vi.fn(),
  validateFileServer: vi.fn(),
  checkRateLimit: vi.fn(),
  getGuestUploadCount: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
}));

vi.mock('@/lib/guestsnap', () => ({
  uploadFile: mocks.uploadFile,
  validateFileServer: mocks.validateFileServer,
  checkRateLimit: mocks.checkRateLimit,
  getGuestUploadCount: mocks.getGuestUploadCount,
}));

import { OPTIONS, POST } from './route';

function createUploadRequest(file?: File, ip = '127.0.0.1') {
  const formData = new FormData();
  if (file) {
    formData.set('file', file);
  }

  return new NextRequest('http://localhost/api/guestsnap/upload', {
    method: 'POST',
    headers: {
      'x-forwarded-for': ip,
    },
    body: formData,
  });
}

describe('GuestSnap upload route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 29,
      resetTime: Date.now() + 60000,
    });
    mocks.getGuestUploadCount.mockResolvedValue(3);
    mocks.validateFileServer.mockResolvedValue({
      valid: true,
      type: 'image',
    });
    mocks.uploadFile.mockResolvedValue({
      success: true,
      fileName: 'IMG_001_123456789.jpg',
    });
  });

  it('POST returns 401 when the upload session is missing', async () => {
    mocks.cookies.mockResolvedValue(createMockCookieStore());

    const response = await POST(createUploadRequest(createTestFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
    })));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error?.code).toBe('NO_SESSION');
  });

  it('POST returns 400 when the per-session upload limit is already reached', async () => {
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

    const response = await POST(createUploadRequest(createTestFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
    })));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error?.code).toBe('LIMIT_REACHED');
    expect(mocks.validateFileServer).not.toHaveBeenCalled();
  });

  it('POST returns 400 when no file is provided', async () => {
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

    const response = await POST(createUploadRequest());
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error?.code).toBe('NO_FILE');
  });

  it('POST returns 400 when server-side validation fails', async () => {
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
    mocks.validateFileServer.mockResolvedValue({
      valid: false,
      error: '파일 형식이 올바르지 않아요',
    });

    const response = await POST(createUploadRequest(createTestFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
    })));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error?.code).toBe('INVALID_FILE');
    expect(body.error?.message).toBe('파일 형식이 올바르지 않아요');
    expect(mocks.uploadFile).not.toHaveBeenCalled();
  });

  it('POST uploads the file and updates the session upload count cookie', async () => {
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

    const response = await POST(createUploadRequest(createTestFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
      content: 'binary-image-data',
    })));
    const body = await response.json();
    const updatedSessionData = JSON.parse(
      cookieStore.snapshot()[`${GUEST_SNAP_CONFIG.session.cookieName}_data`]
    );

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.fileId).toBe('guest-folder-id/IMG_001_123456789.jpg');
    expect(body.fileName).toBe('IMG_001_123456789.jpg');
    expect(mocks.uploadFile).toHaveBeenCalledWith(
      expect.any(ArrayBuffer),
      'photo.jpg',
      'guest-folder-id',
      'image'
    );
    expect(updatedSessionData.uploadCount).toBe(4);
  });

  it('POST returns 500 when the storage upload fails', async () => {
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
    mocks.uploadFile.mockResolvedValue({
      success: false,
      error: 'Google Drive unavailable',
    });

    const response = await POST(createUploadRequest(createTestFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
    })));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error?.code).toBe('UPLOAD_FAILED');
  });

  it('POST returns 429 and rate limit headers when throttled', async () => {
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

    const response = await POST(createUploadRequest(createTestFile({
      name: 'photo.jpg',
      type: 'image/jpeg',
    })));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.error?.code).toBe('RATE_LIMITED');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(response.headers.get('X-RateLimit-Reset')).toBe('777');
  });

  it('OPTIONS returns the expected CORS headers', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
  });
});
