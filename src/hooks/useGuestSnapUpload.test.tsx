import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GuestSnapFile, SessionResponse, UploadResponse } from '@/types/guestsnap';
import { createTestFile } from '@/test-utils/guestsnap';

vi.mock('@/lib/constants', async () => {
  const actual = await vi.importActual<typeof import('@/lib/constants')>('@/lib/constants');

  return {
    ...actual,
    GUEST_SNAP_CONFIG: {
      ...actual.GUEST_SNAP_CONFIG,
      retry: {
        ...actual.GUEST_SNAP_CONFIG.retry,
        baseDelayMs: 0,
        maxDelayMs: 0,
      },
    },
  };
});

import { useGuestSnapUpload } from './useGuestSnapUpload';

function createQueuedFile(overrides: Partial<GuestSnapFile> = {}): GuestSnapFile {
  const file =
    overrides.file ||
    createTestFile({
      name: overrides.name || 'photo.jpg',
      type: overrides.mimeType || 'image/jpeg',
      content: 'image-bytes',
    });

  return {
    id: overrides.id || crypto.randomUUID(),
    name: overrides.name || file.name,
    size: overrides.size || file.size,
    type: overrides.type || 'image',
    mimeType: overrides.mimeType || file.type,
    status: overrides.status || 'pending',
    progress: overrides.progress ?? 0,
    retryCount: overrides.retryCount ?? 0,
    createdAt: overrides.createdAt || new Date(),
    file,
    error: overrides.error,
    uploadedAt: overrides.uploadedAt,
    thumbnail: overrides.thumbnail,
  };
}

function jsonResponse(body: SessionResponse | UploadResponse, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('useGuestSnapUpload', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('restores an existing session on mount', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        success: true,
        sessionId: 'gs_existing',
        guestName: '홍길동',
        guestFolder: 'guest-folder-id',
        uploadCount: 2,
        uploadLimit: 50,
        expiresAt: new Date(Date.now() + 60_000).toISOString(),
      })
    );

    const { result } = renderHook(() => useGuestSnapUpload());

    await waitFor(() => {
      expect(result.current.session?.guestName).toBe('홍길동');
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/guestsnap/session', { method: 'GET' });
  });

  it('createSession exposes the server error message on failure', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: false,
            sessionId: '',
            guestName: '',
            guestFolder: '',
            uploadCount: 0,
            uploadLimit: 50,
            expiresAt: '',
            error: {
              code: 'NO_SESSION',
              message: '세션이 없습니다',
            },
          },
          404
        )
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: false,
            sessionId: '',
            guestName: '',
            guestFolder: '',
            uploadCount: 0,
            uploadLimit: 50,
            expiresAt: '',
            error: {
              code: 'INVALID_NAME',
              message: '이름은 2자 이상이어야 해요',
            },
          },
          400
        )
      );

    const { result } = renderHook(() => useGuestSnapUpload());

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    let created = false;
    await act(async () => {
      created = await result.current.createSession('ㅎ');
    });

    expect(created).toBe(false);
    expect(result.current.sessionError).toBe('이름은 2자 이상이어야 해요');
  });

  it('uploads queued files and reports the completed summary', async () => {
    const onUploadComplete = vi.fn();
    const onAllComplete = vi.fn();
    const files = [
      createQueuedFile({ id: 'file-1', name: 'photo-1.jpg' }),
      createQueuedFile({ id: 'file-2', name: 'photo-2.jpg' }),
    ];

    fetchMock.mockImplementation(async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method ?? (typeof input === 'string' ? 'GET' : input.method);

      if (url === '/api/guestsnap/session' && method === 'GET') {
        return jsonResponse(
          {
            success: false,
            sessionId: '',
            guestName: '',
            guestFolder: '',
            uploadCount: 0,
            uploadLimit: 50,
            expiresAt: '',
            error: { code: 'NO_SESSION', message: '세션이 없습니다' },
          },
          404
        );
      }

      if (url === '/api/guestsnap/upload') {
        const nextIndex = fetchMock.mock.calls.filter(([callInput]) => {
          const callUrl = typeof callInput === 'string' ? callInput : callInput.url;
          return callUrl === '/api/guestsnap/upload';
        }).length;

        return jsonResponse({
          success: true,
          fileId: `guest-folder/file-${nextIndex}.jpg`,
          fileName: `file-${nextIndex}.jpg`,
          uploadedAt: new Date().toISOString(),
        });
      }

      throw new Error(`Unexpected fetch call: ${method} ${url}`);
    });

    const { result } = renderHook(() =>
      useGuestSnapUpload({
        onUploadComplete,
        onAllComplete,
      })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.addFiles(files);
    });

    await waitFor(() => {
      expect(result.current.queueState.queue).toHaveLength(2);
    });

    act(() => {
      result.current.startUpload();
    });

    await waitFor(() => {
      expect(result.current.uploadedCount).toBe(2);
    });

    expect(result.current.failedCount).toBe(0);
    expect(result.current.uploadState).toBe('completed');
    expect(onUploadComplete).toHaveBeenCalledTimes(2);
    expect(onAllComplete).toHaveBeenCalledWith({
      uploadedCount: 2,
      failedCount: 0,
      totalCount: 2,
    });
  });

  it('retries transient upload failures and eventually succeeds', async () => {
    const file = createQueuedFile({ id: 'file-1', name: 'retry.jpg' });
    let uploadAttempts = 0;

    fetchMock.mockImplementation(async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method ?? (typeof input === 'string' ? 'GET' : input.method);

      if (url === '/api/guestsnap/session' && method === 'GET') {
        return jsonResponse(
          {
            success: false,
            sessionId: '',
            guestName: '',
            guestFolder: '',
            uploadCount: 0,
            uploadLimit: 50,
            expiresAt: '',
            error: { code: 'NO_SESSION', message: '세션이 없습니다' },
          },
          404
        );
      }

      if (url === '/api/guestsnap/upload') {
        uploadAttempts += 1;

        if (uploadAttempts === 1) {
          return jsonResponse(
            {
              success: false,
              error: {
                code: 'UPLOAD_FAILED',
                message: '일시적인 오류',
              },
            },
            500
          );
        }

        return jsonResponse({
          success: true,
          fileId: 'guest-folder/retry.jpg',
          fileName: 'retry.jpg',
          uploadedAt: new Date().toISOString(),
        });
      }

      throw new Error(`Unexpected fetch call: ${method} ${url}`);
    });

    const { result } = renderHook(() => useGuestSnapUpload());

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.addFiles([file]);
    });

    await waitFor(() => {
      expect(result.current.queueState.queue).toHaveLength(1);
    });

    act(() => {
      result.current.startUpload();
    });

    await waitFor(() => {
      expect(result.current.uploadedCount).toBe(1);
    });

    expect(result.current.failedCount).toBe(0);
    expect(uploadAttempts).toBe(2);
  });

  it('does not retry terminal upload errors and moves the file to the failed queue', async () => {
    const onUploadError = vi.fn();
    const file = createQueuedFile({ id: 'file-1', name: 'invalid.jpg' });
    let uploadAttempts = 0;

    fetchMock.mockImplementation(async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method ?? (typeof input === 'string' ? 'GET' : input.method);

      if (url === '/api/guestsnap/session' && method === 'GET') {
        return jsonResponse(
          {
            success: false,
            sessionId: '',
            guestName: '',
            guestFolder: '',
            uploadCount: 0,
            uploadLimit: 50,
            expiresAt: '',
            error: { code: 'NO_SESSION', message: '세션이 없습니다' },
          },
          404
        );
      }

      if (url === '/api/guestsnap/upload') {
        uploadAttempts += 1;

        return jsonResponse(
          {
            success: false,
            error: {
              code: 'INVALID_FILE',
              message: '파일 형식이 올바르지 않아요',
            },
          },
          400
        );
      }

      throw new Error(`Unexpected fetch call: ${method} ${url}`);
    });

    const { result } = renderHook(() =>
      useGuestSnapUpload({
        onUploadError,
      })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.addFiles([file]);
    });

    await waitFor(() => {
      expect(result.current.queueState.queue).toHaveLength(1);
    });

    act(() => {
      result.current.startUpload();
    });

    await waitFor(() => {
      expect(result.current.failedCount).toBe(1);
    });

    expect(uploadAttempts).toBe(1);
    expect(result.current.uploadedCount).toBe(0);
    expect(result.current.queueState.failed[0]?.error).toBe('파일 형식이 올바르지 않아요');
    expect(onUploadError).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'file-1' }),
      '파일 형식이 올바르지 않아요'
    );
  });
});
