// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { createMockCookieStore } from '@/test-utils/guestsnap';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createGuestFolder: vi.fn(),
  validateGuestName: vi.fn(),
  sanitizeGuestName: vi.fn(),
  checkRateLimit: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
}));

vi.mock('@/lib/guestsnap', () => ({
  createGuestFolder: mocks.createGuestFolder,
  validateGuestName: mocks.validateGuestName,
  sanitizeGuestName: mocks.sanitizeGuestName,
  checkRateLimit: mocks.checkRateLimit,
}));

import { GET, POST } from './route';

function createPostRequest(body: unknown, ip = '127.0.0.1') {
  return new NextRequest('http://localhost/api/guestsnap/session', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('GuestSnap session route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 9,
      resetTime: Date.now() + 60000,
    });
    mocks.validateGuestName.mockReturnValue({ valid: true });
    mocks.sanitizeGuestName.mockImplementation((value: string) => value.trim());
    mocks.createGuestFolder.mockResolvedValue({
      success: true,
      folderPath: 'guest-folder-id',
    });
  });

  it('POST creates a session, sanitizes the guest name, and sets cookies', async () => {
    const cookieStore = createMockCookieStore();
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await POST(createPostRequest({ guestName: '  홍길동  ' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      '127.0.0.1',
      GUEST_SNAP_CONFIG.rateLimits.sessionCreationsPerMinute,
      60000,
      'guestsnap:session'
    );
    expect(mocks.validateGuestName).toHaveBeenCalledWith('  홍길동  ');
    expect(mocks.sanitizeGuestName).toHaveBeenCalledWith('  홍길동  ');
    expect(mocks.createGuestFolder).toHaveBeenCalledWith('홍길동');
    expect(body.success).toBe(true);
    expect(body.guestName).toBe('홍길동');
    expect(body.guestFolder).toBe('guest-folder-id');
    expect(body.sessionId).toMatch(/^gs_/);

    const snapshot = cookieStore.snapshot();
    expect(snapshot[GUEST_SNAP_CONFIG.session.cookieName]).toMatch(/^gs_/);
    expect(snapshot[`${GUEST_SNAP_CONFIG.session.cookieName}_data`]).toContain('"guestName":"홍길동"');
    expect(cookieStore.setCalls).toHaveLength(2);
  });

  it('POST returns 400 for an invalid guest name', async () => {
    const cookieStore = createMockCookieStore();
    mocks.cookies.mockResolvedValue(cookieStore);
    mocks.validateGuestName.mockReturnValue({
      valid: false,
      error: '이름은 2자 이상이어야 해요',
    });

    const response = await POST(createPostRequest({ guestName: 'ㅎ' }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('INVALID_NAME');
    expect(body.error?.message).toBe('이름은 2자 이상이어야 해요');
    expect(mocks.createGuestFolder).not.toHaveBeenCalled();
  });

  it('POST returns a shared-drive specific error message when folder creation fails that way', async () => {
    const cookieStore = createMockCookieStore();
    mocks.cookies.mockResolvedValue(cookieStore);
    mocks.createGuestFolder.mockResolvedValue({
      success: false,
      errorCode: 'service_account_requires_shared_drive',
      error: 'Service Accounts do not have storage quota',
    });

    const response = await POST(createPostRequest({ guestName: '홍길동' }));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('service_account_requires_shared_drive');
    expect(body.error?.message).toBe(
      '업로드 저장소 연결을 확인하고 있어요. 관리자에게 문의해주세요.'
    );
  });

  it('POST returns 429 and rate limit headers when the caller is throttled', async () => {
    const cookieStore = createMockCookieStore();
    mocks.cookies.mockResolvedValue(cookieStore);
    mocks.checkRateLimit.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetTime: 123456789,
    });

    const response = await POST(createPostRequest({ guestName: '홍길동' }));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.error?.code).toBe('RATE_LIMITED');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(response.headers.get('X-RateLimit-Reset')).toBe('123456789');
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      '127.0.0.1',
      GUEST_SNAP_CONFIG.rateLimits.sessionCreationsPerMinute,
      60000,
      'guestsnap:session'
    );
  });

  it('GET returns 404 when no session cookies exist', async () => {
    mocks.cookies.mockResolvedValue(createMockCookieStore());

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error?.code).toBe('NO_SESSION');
  });

  it('GET returns 401 when the stored session has expired', async () => {
    const expiredCreatedAt =
      Date.now() - (GUEST_SNAP_CONFIG.session.durationHours + 1) * 60 * 60 * 1000;
    const cookieStore = createMockCookieStore({
      [GUEST_SNAP_CONFIG.session.cookieName]: 'gs_expired',
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_expired',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 3,
        createdAt: expiredCreatedAt,
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error?.code).toBe('SESSION_EXPIRED');
  });

  it('GET returns the current session when cookies are valid', async () => {
    const createdAt = Date.now();
    const cookieStore = createMockCookieStore({
      [GUEST_SNAP_CONFIG.session.cookieName]: 'gs_valid',
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_valid',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 7,
        createdAt,
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.sessionId).toBe('gs_valid');
    expect(body.guestName).toBe('홍길동');
    expect(body.guestFolder).toBe('guest-folder-id');
    expect(body.uploadCount).toBe(7);
    expect(body.uploadLimit).toBe(GUEST_SNAP_CONFIG.limits.maxFilesPerSession);
  });
});
