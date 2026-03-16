import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  GuestSnapFile,
  SessionResponse,
  UploadInitResponse,
  UploadResponse,
} from '@/types/guestsnap';
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

type MockXhrPlan =
  | {
      type: 'success';
      status: number;
      response: Record<string, unknown>;
    }
  | {
      type: 'http-error';
      status: number;
      response: Record<string, unknown>;
    }
  | {
      type: 'network-error';
    };

class MockXMLHttpRequest {
  static queue: MockXhrPlan[] = [];

  static enqueue(plan: MockXhrPlan) {
    MockXMLHttpRequest.queue.push(plan);
  }

  static reset() {
    MockXMLHttpRequest.queue = [];
  }

  status = 0;
  responseText = '';
  upload = {
    onprogress: null as ((event: ProgressEvent<EventTarget>) => void) | null,
  };
  onload: ((event: ProgressEvent<EventTarget>) => void) | null = null;
  onerror: ((event: ProgressEvent<EventTarget>) => void) | null = null;
  onabort: ((event: ProgressEvent<EventTarget>) => void) | null = null;

  open = vi.fn();
  setRequestHeader = vi.fn();

  send = vi.fn(() => {
    const plan = MockXMLHttpRequest.queue.shift();

    if (!plan) {
      throw new Error('No XMLHttpRequest plan queued');
    }

    queueMicrotask(() => {
      this.upload.onprogress?.({
        lengthComputable: true,
        loaded: 512,
        total: 1024,
      } as ProgressEvent<EventTarget>);

      if (plan.type === 'network-error') {
        this.onerror?.({} as ProgressEvent<EventTarget>);
        return;
      }

      this.status = plan.status;
      this.responseText = JSON.stringify(plan.response);
      this.onload?.({} as ProgressEvent<EventTarget>);
    });
  });

  abort = vi.fn(() => {
    this.onabort?.({} as ProgressEvent<EventTarget>);
  });
}

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

function jsonResponse(
  body: SessionResponse | UploadResponse | UploadInitResponse,
  status = 200
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe('useGuestSnapUpload', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.clearAllMocks();
    MockXMLHttpRequest.reset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest as unknown as typeof XMLHttpRequest);
    vi.stubGlobal('btoa', (value: string) => Buffer.from(value, 'binary').toString('base64'));
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

  it('uploads queued files through Google direct upload and reports the completed summary', async () => {
    const onUploadComplete = vi.fn();
    const onAllComplete = vi.fn();
    const files = [
      createQueuedFile({ id: 'file-1', name: 'photo-1.jpg' }),
      createQueuedFile({ id: 'file-2', name: 'photo-2.jpg' }),
    ];

    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-1', name: 'IMG_001.jpg' },
    });
    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-2', name: 'IMG_002.jpg' },
    });

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

      if (url === '/api/guestsnap/upload/init') {
        const initCount = fetchMock.mock.calls.filter(([callInput, callInit]) => {
          const callUrl = typeof callInput === 'string' ? callInput : callInput.url;
          const callMethod =
            callInit?.method ?? (typeof callInput === 'string' ? 'GET' : callInput.method);
          return callUrl === '/api/guestsnap/upload/init' && callMethod === 'POST';
        }).length;

        return jsonResponse({
          success: true,
          uploadUrl: `https://google-upload.test/session-${initCount}`,
          fileName: `IMG_00${initCount}.jpg`,
        });
      }

      if (url === '/api/guestsnap/upload/complete') {
        const completeCount = fetchMock.mock.calls.filter(([callInput, callInit]) => {
          const callUrl = typeof callInput === 'string' ? callInput : callInput.url;
          const callMethod =
            callInit?.method ?? (typeof callInput === 'string' ? 'GET' : callInput.method);
          return callUrl === '/api/guestsnap/upload/complete' && callMethod === 'POST';
        }).length;

        return jsonResponse({
          success: true,
          fileId: `google-file-${completeCount}`,
          fileName: `IMG_00${completeCount}.jpg`,
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

  it('retries transient direct upload failures and eventually succeeds', async () => {
    const file = createQueuedFile({ id: 'file-1', name: 'retry.jpg' });
    let initAttempts = 0;

    MockXMLHttpRequest.enqueue({
      type: 'http-error',
      status: 500,
      response: { error: { message: 'temporary failure' } },
    });
    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-1', name: 'IMG_retry.jpg' },
    });

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

      if (url === '/api/guestsnap/upload/init') {
        initAttempts += 1;
        return jsonResponse({
          success: true,
          uploadUrl: `https://google-upload.test/session-${initAttempts}`,
          fileName: 'IMG_retry.jpg',
        });
      }

      if (url === '/api/guestsnap/upload/complete') {
        return jsonResponse({
          success: true,
          fileId: 'google-file-1',
          fileName: 'IMG_retry.jpg',
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
    expect(initAttempts).toBe(2);
  });

  it('does not retry terminal init errors and moves the file to the failed queue', async () => {
    const onUploadError = vi.fn();
    const file = createQueuedFile({ id: 'file-1', name: 'invalid.jpg' });
    let initAttempts = 0;

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

      if (url === '/api/guestsnap/upload/init') {
        initAttempts += 1;
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

    expect(initAttempts).toBe(1);
    expect(result.current.uploadedCount).toBe(0);
    expect(result.current.queueState.failed[0]?.error).toBe('파일 형식이 올바르지 않아요');
    expect(onUploadError).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'file-1' }),
      '파일 형식이 올바르지 않아요'
    );
  });

  it('processes up to three uploads in parallel', async () => {
    const files = [
      createQueuedFile({ id: 'file-1', name: 'photo-1.jpg' }),
      createQueuedFile({ id: 'file-2', name: 'photo-2.jpg' }),
      createQueuedFile({ id: 'file-3', name: 'photo-3.jpg' }),
      createQueuedFile({ id: 'file-4', name: 'photo-4.jpg' }),
    ];
    const deferredInits = [
      createDeferred<Response>(),
      createDeferred<Response>(),
      createDeferred<Response>(),
    ];
    let initCount = 0;

    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-1', name: 'IMG_001.jpg' },
    });
    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-2', name: 'IMG_002.jpg' },
    });
    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-3', name: 'IMG_003.jpg' },
    });
    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-4', name: 'IMG_004.jpg' },
    });

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

      if (url === '/api/guestsnap/upload/init') {
        initCount += 1;

        if (initCount <= 3) {
          return deferredInits[initCount - 1]!.promise;
        }

        return jsonResponse({
          success: true,
          uploadUrl: `https://google-upload.test/session-${initCount}`,
          fileName: `IMG_00${initCount}.jpg`,
        });
      }

      if (url === '/api/guestsnap/upload/complete') {
        const completeCount = fetchMock.mock.calls.filter(([callInput, callInit]) => {
          const callUrl = typeof callInput === 'string' ? callInput : callInput.url;
          const callMethod =
            callInit?.method ?? (typeof callInput === 'string' ? 'GET' : callInput.method);
          return callUrl === '/api/guestsnap/upload/complete' && callMethod === 'POST';
        }).length;

        return jsonResponse({
          success: true,
          fileId: `google-file-${completeCount}`,
          fileName: `IMG_00${completeCount}.jpg`,
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
      result.current.addFiles(files);
    });

    act(() => {
      result.current.startUpload();
    });

    await waitFor(() => {
      expect(result.current.queueState.activeFiles).toHaveLength(3);
    });

    expect(result.current.queueState.queue).toHaveLength(1);

    deferredInits.forEach((deferred, index) => {
      deferred.resolve(
        jsonResponse({
          success: true,
          uploadUrl: `https://google-upload.test/session-${index + 1}`,
          fileName: `IMG_00${index + 1}.jpg`,
        })
      );
    });

    await waitFor(() => {
      expect(result.current.uploadedCount).toBe(4);
    });

    expect(initCount).toBe(4);
    expect(result.current.failedCount).toBe(0);
  });

  it('reserves the last remaining slot before starting parallel uploads', async () => {
    const files = [
      createQueuedFile({ id: 'file-1', name: 'last-slot.jpg' }),
      createQueuedFile({ id: 'file-2', name: 'overflow-1.jpg' }),
      createQueuedFile({ id: 'file-3', name: 'overflow-2.jpg' }),
    ];

    MockXMLHttpRequest.enqueue({
      type: 'success',
      status: 200,
      response: { id: 'google-file-1', name: 'IMG_last-slot.jpg' },
    });

    fetchMock.mockImplementation(async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method ?? (typeof input === 'string' ? 'GET' : input.method);

      if (url === '/api/guestsnap/session' && method === 'GET') {
        return jsonResponse({
          success: true,
          sessionId: 'gs_existing',
          guestName: '홍길동',
          guestFolder: 'guest-folder-id',
          uploadCount: 49,
          uploadLimit: 50,
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
        });
      }

      if (url === '/api/guestsnap/upload/init') {
        return jsonResponse({
          success: true,
          uploadUrl: 'https://google-upload.test/session-1',
          fileName: 'IMG_last-slot.jpg',
        });
      }

      if (url === '/api/guestsnap/upload/complete') {
        return jsonResponse({
          success: true,
          fileId: 'google-file-1',
          fileName: 'IMG_last-slot.jpg',
          uploadedAt: new Date().toISOString(),
        });
      }

      throw new Error(`Unexpected fetch call: ${method} ${url}`);
    });

    const { result } = renderHook(() => useGuestSnapUpload());

    await waitFor(() => {
      expect(result.current.session?.uploadCount).toBe(49);
    });

    act(() => {
      result.current.addFiles(files);
      result.current.startUpload();
    });

    await waitFor(() => {
      expect(result.current.uploadedCount).toBe(1);
    });

    expect(result.current.failedCount).toBe(2);
    expect(result.current.queueState.failed.map((file) => file.name)).toEqual([
      'overflow-1.jpg',
      'overflow-2.jpg',
    ]);
  });
});
