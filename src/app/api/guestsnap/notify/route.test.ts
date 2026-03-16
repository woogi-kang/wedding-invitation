// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { createMockCookieStore } from '@/test-utils/guestsnap';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  checkRateLimit: vi.fn(),
  notifyGuestSnapUploadBatch: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
}));

vi.mock('@/lib/guestsnap', () => ({
  checkRateLimit: mocks.checkRateLimit,
}));

vi.mock('@/lib/guestsnap/discord-notifier', () => ({
  notifyGuestSnapUploadBatch: mocks.notifyGuestSnapUploadBatch,
}));

import { POST } from './route';

function createNotifyRequest(body: unknown, ip = '127.0.0.1') {
  return new NextRequest('http://localhost/api/guestsnap/notify', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

describe('GuestSnap notify route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.checkRateLimit.mockReturnValue({
      allowed: true,
      remaining: 19,
      resetTime: Date.now() + 60000,
    });
    mocks.notifyGuestSnapUploadBatch.mockResolvedValue(undefined);
  });

  it('returns 401 when no active session is present', async () => {
    mocks.cookies.mockResolvedValue(createMockCookieStore());

    const response = await POST(
      createNotifyRequest({ uploadedCount: 1, failedCount: 0, totalCount: 1 })
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error?.code).toBe('NO_SESSION');
  });

  it('returns 400 for invalid payload values', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 2,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await POST(
      createNotifyRequest({ uploadedCount: -1, failedCount: 0, totalCount: 1 })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error?.code).toBe('INVALID_PAYLOAD');
    expect(mocks.notifyGuestSnapUploadBatch).not.toHaveBeenCalled();
  });

  it('returns success without notifying when there are no completed or failed uploads', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 2,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await POST(
      createNotifyRequest({ uploadedCount: 0, failedCount: 0, totalCount: 0 })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mocks.notifyGuestSnapUploadBatch).not.toHaveBeenCalled();
  });

  it('sends a batched notification with normalized totals', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 2,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);

    const response = await POST(
      createNotifyRequest({ uploadedCount: 2, failedCount: 1, totalCount: 1 })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mocks.notifyGuestSnapUploadBatch).toHaveBeenCalledWith({
      guestName: '홍길동',
      uploadedCount: 2,
      failedCount: 1,
      totalCount: 3,
    });
  });

  it('returns 429 when notify requests are throttled', async () => {
    const cookieStore = createMockCookieStore({
      [`${GUEST_SNAP_CONFIG.session.cookieName}_data`]: JSON.stringify({
        id: 'gs_123',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 2,
        createdAt: Date.now(),
      }),
    });
    mocks.cookies.mockResolvedValue(cookieStore);
    mocks.checkRateLimit.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetTime: 321,
    });

    const response = await POST(
      createNotifyRequest({ uploadedCount: 1, failedCount: 0, totalCount: 1 })
    );
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.error?.code).toBe('RATE_LIMITED');
  });
});
