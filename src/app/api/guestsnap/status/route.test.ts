// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';

const mocks = vi.hoisted(() => ({
  checkStorageStatus: vi.fn(),
}));

vi.mock('@/lib/guestsnap', () => ({
  checkStorageStatus: mocks.checkStorageStatus,
}));

import { GET, HEAD } from './route';

describe('GuestSnap status route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns storage availability, configuration state, and auth mode', async () => {
    mocks.checkStorageStatus.mockResolvedValue({
      available: true,
      configurationValid: true,
      authMode: 'oauth',
      errorCode: undefined,
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      serviceEnabled: true,
      storageAvailable: true,
      configurationValid: true,
      authMode: 'oauth',
      storageErrorCode: undefined,
      currentUploads: 0,
      maxConcurrentUploads: GUEST_SNAP_CONFIG.limits.maxConcurrentUploads,
    });
  });

  it('GET falls back to an unavailable status when the storage check throws', async () => {
    mocks.checkStorageStatus.mockRejectedValue(new Error('boom'));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.storageAvailable).toBe(false);
    expect(body.configurationValid).toBe(false);
    expect(body.authMode).toBe('unconfigured');
    expect(body.storageErrorCode).toBe('unknown');
  });

  it('HEAD returns 200 when storage is available', async () => {
    mocks.checkStorageStatus.mockResolvedValue({
      available: true,
      configurationValid: true,
      authMode: 'oauth',
    });

    const response = await HEAD();
    expect(response.status).toBe(200);
  });

  it('HEAD returns 503 when storage is unavailable', async () => {
    mocks.checkStorageStatus.mockResolvedValue({
      available: false,
      configurationValid: true,
      authMode: 'oauth',
      errorCode: 'drive_access_failed',
    });

    const response = await HEAD();
    expect(response.status).toBe(503);
  });
});
