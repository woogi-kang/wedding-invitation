/**
 * useGuestSnapUpload Hook
 * Core upload logic with progress tracking, retry mechanism, and session management
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type {
  GuestSnapFile,
  GuestSnapSession,
  UploadInitResponse,
  UploadQueueState,
  UploadState,
  SessionResponse,
  UploadResponse,
} from '@/types/guestsnap';

interface UseGuestSnapUploadOptions {
  onUploadComplete?: (file: GuestSnapFile) => void;
  onUploadError?: (file: GuestSnapFile, error: string) => void;
  onAllComplete?: (summary: {
    uploadedCount: number;
    failedCount: number;
    totalCount: number;
  }) => void;
}

interface UseGuestSnapUploadReturn {
  // Session state
  session: GuestSnapSession | null;
  isSessionLoading: boolean;
  sessionError: string | null;

  // Upload state
  uploadState: UploadState;
  queueState: UploadQueueState;

  // Actions
  createSession: (guestName: string) => Promise<boolean>;
  addFiles: (files: GuestSnapFile[]) => void;
  startUpload: () => void;
  pauseUpload: () => void;
  resumeUpload: () => void;
  retryFile: (fileId: string) => void;
  retryAllFailed: () => void;
  removeFile: (fileId: string) => void;
  clearQueue: () => void;

  // Status
  totalProgress: number;
  uploadedCount: number;
  failedCount: number;
}

type GoogleDirectUploadResponse = {
  id: string;
  name: string;
};

type DirectUploadResult = {
  fileId: string;
  fileName: string;
};

class UploadError extends Error {
  code?: string;
  retryable: boolean;

  constructor(message: string, options: { code?: string; retryable?: boolean } = {}) {
    super(message);
    this.name = 'UploadError';
    this.code = options.code;
    this.retryable = options.retryable ?? true;
  }
}

function isTerminalUploadCode(code?: string): boolean {
  return (
    code === 'NO_SESSION' ||
    code === 'LIMIT_REACHED' ||
    code === 'INVALID_FILE' ||
    code === 'NO_FILE_ID'
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index] || 0);
  }

  return btoa(binary);
}

async function readBlobArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }

  return new Response(blob).arrayBuffer();
}

export function useGuestSnapUpload(
  options: UseGuestSnapUploadOptions = {}
): UseGuestSnapUploadReturn {
  const { onUploadComplete, onUploadError, onAllComplete } = options;
  const { retry: retryConfig } = GUEST_SNAP_CONFIG;

  // Session state
  const [session, setSession] = useState<GuestSnapSession | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Upload state
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [queueState, setQueueState] = useState<UploadQueueState>({
    isProcessing: false,
    activeFiles: [],
    currentFile: null,
    queue: [],
    completed: [],
    failed: [],
  });

  // Refs for managing upload process
  const isProcessingRef = useRef(false);
  const sessionRef = useRef<GuestSnapSession | null>(session);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const uploadRequestsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const activeRunRef = useRef<{ cancelled: boolean } | null>(null);
  const queueStateRef = useRef<UploadQueueState>(queueState);

  // Keep a ref to the latest queue state for async upload loop logic.
  useEffect(() => {
    queueStateRef.current = queueState;
  }, [queueState]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const syncCurrentFile = useCallback((activeFiles: GuestSnapFile[]): GuestSnapFile | null => {
    return activeFiles[0] || null;
  }, []);

  const updateQueueState = useCallback(
    (updater: (prev: UploadQueueState) => UploadQueueState) => {
      const nextState = updater(queueStateRef.current);
      queueStateRef.current = nextState;
      setQueueState(nextState);
      return nextState;
    },
    []
  );

  const updateSessionState = useCallback(
    (updater: (prev: GuestSnapSession | null) => GuestSnapSession | null) => {
      const nextSession = updater(sessionRef.current);
      sessionRef.current = nextSession;
      setSession(nextSession);
      return nextSession;
    },
    []
  );

  // Calculate total progress
  const totalProgress = useCallback(() => {
    const { queue, completed, failed, activeFiles } = queueState;
    const total = queue.length + completed.length + failed.length + activeFiles.length;

    if (total === 0) return 0;

    const completedProgress = completed.length * 100;
    const activeProgress = activeFiles.reduce((sum, file) => sum + file.progress, 0);

    return Math.round((completedProgress + activeProgress) / total);
  }, [queueState]);

  /**
   * Check for existing session on mount
   */
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const response = await fetch('/api/guestsnap/session', {
          method: 'GET',
        });

        if (response.ok) {
          const data: SessionResponse = await response.json();
          if (data.success) {
            updateSessionState(() => ({
              id: data.sessionId,
              guestName: data.guestName,
              guestFolder: data.guestFolder,
              uploadCount: data.uploadCount,
              uploadLimit: data.uploadLimit,
              files: [],
              createdAt: new Date(),
              expiresAt: new Date(data.expiresAt),
            }));
          }
        }
      } catch {
        // No existing session, that's fine
      }
    };

    checkExistingSession();
  }, [updateSessionState]);

  /**
   * Create a new session with guest name
   */
  const createSession = useCallback(async (guestName: string): Promise<boolean> => {
    setIsSessionLoading(true);
    setSessionError(null);

    try {
      const response = await fetch('/api/guestsnap/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestName }),
      });

      const data: SessionResponse = await response.json();

      if (!data.success) {
        setSessionError(data.error?.message || '세션 생성에 실패했어요');
        return false;
      }

      updateSessionState(() => ({
        id: data.sessionId,
        guestName: data.guestName,
        guestFolder: data.guestFolder,
        uploadCount: data.uploadCount,
        uploadLimit: data.uploadLimit,
        files: [],
        createdAt: new Date(),
        expiresAt: new Date(data.expiresAt),
      }));

      return true;
    } catch {
      setSessionError('서버 연결에 실패했어요. 잠시 후 다시 시도해주세요.');
      return false;
    } finally {
      setIsSessionLoading(false);
    }
  }, [updateSessionState]);

  /**
   * Add files to the upload queue
   */
  const addFiles = useCallback((files: GuestSnapFile[]) => {
    updateQueueState((prev) => ({
        ...prev,
        queue: [...prev.queue, ...files],
      }));
    setUploadState('selecting');
  }, [updateQueueState]);

  /**
   * Remove a file from the queue
   */
  const removeFile = useCallback((fileId: string) => {
    updateQueueState((prev) => {
      const activeFiles = prev.activeFiles.filter((f) => f.id !== fileId);
      return {
        ...prev,
        activeFiles,
        currentFile: syncCurrentFile(activeFiles),
        queue: prev.queue.filter((f) => f.id !== fileId),
        completed: prev.completed.filter((f) => f.id !== fileId),
        failed: prev.failed.filter((f) => f.id !== fileId),
      };
    });
  }, [syncCurrentFile, updateQueueState]);

  /**
   * Clear the entire queue
   */
  const clearQueue = useCallback(() => {
    const nextState: UploadQueueState = {
      isProcessing: false,
      activeFiles: [],
      currentFile: null,
      queue: [],
      completed: [],
      failed: [],
    };
    queueStateRef.current = nextState;
    setQueueState(nextState);
    setUploadState('idle');
    activeRunRef.current = null;
    isProcessingRef.current = false;
    abortControllersRef.current.clear();
    uploadRequestsRef.current.clear();
  }, []);

  /**
   * Upload a single file with retry logic
   */
  const uploadFile = useCallback(
    async (file: GuestSnapFile): Promise<{ success: boolean; error?: string }> => {
      if (!file.file) {
        return { success: false, error: '파일 데이터가 없어요' };
      }

      let lastError = '';
      let uploadedFile: DirectUploadResult | null = null;

      // Retry loop
      for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
        try {
          // Update progress to show retry status
          if (attempt > 1) {
            updateQueueState((prev) => {
              const activeFiles = prev.activeFiles.map((activeFile) =>
                activeFile.id === file.id
                  ? {
                      ...activeFile,
                      retryCount: attempt - 1,
                      status: 'uploading' as const,
                    }
                  : activeFile
              );

              return {
                ...prev,
                activeFiles,
                currentFile: syncCurrentFile(activeFiles),
              };
            });
          }

          // Create abort controller for this request
          const abortController = new AbortController();
          abortControllersRef.current.set(file.id, abortController);

          if (!uploadedFile) {
            const headerBuffer = await readBlobArrayBuffer(file.file.slice(0, 20));
            const initResponse = await fetch('/api/guestsnap/upload/init', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fileName: file.name,
                mimeType: file.mimeType,
                size: file.size,
                headerBase64: arrayBufferToBase64(headerBuffer),
              }),
              signal: abortController.signal,
            });

            const initData: UploadInitResponse = await initResponse.json();

            if (!initData.success || !initData.uploadUrl) {
              lastError = initData.error?.message || '업로드 준비에 실패했어요';

              if (isTerminalUploadCode(initData.error?.code)) {
                return { success: false, error: lastError };
              }

              throw new UploadError(lastError, {
                code: initData.error?.code,
                retryable: true,
              });
            }

            const uploadUrl = initData.uploadUrl;
            const resolvedFileName = initData.fileName || file.name;

            uploadedFile = await new Promise<DirectUploadResult>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              uploadRequestsRef.current.set(file.id, xhr);

              xhr.open('PUT', uploadUrl);
              xhr.setRequestHeader(
                'Content-Type',
                file.mimeType || 'application/octet-stream'
              );

              xhr.upload.onprogress = (event) => {
                if (!event.lengthComputable) {
                  return;
                }

                const progress = Math.max(
                  1,
                  Math.min(99, Math.round((event.loaded / event.total) * 100))
                );

                updateQueueState((prev) => {
                  const activeFiles = prev.activeFiles.map((activeFile) =>
                    activeFile.id === file.id
                      ? {
                          ...activeFile,
                          progress,
                        }
                      : activeFile
                  );

                  return {
                    ...prev,
                    activeFiles,
                    currentFile: syncCurrentFile(activeFiles),
                  };
                });
              };

              xhr.onerror = () => {
                uploadRequestsRef.current.delete(file.id);
                reject(new UploadError('업로드 전송 중 오류가 발생했어요'));
              };

              xhr.onabort = () => {
                uploadRequestsRef.current.delete(file.id);
                reject(new DOMException('Upload aborted', 'AbortError'));
              };

              xhr.onload = () => {
                uploadRequestsRef.current.delete(file.id);

                if (xhr.status < 200 || xhr.status >= 300) {
                  reject(
                    new UploadError('업로드에 실패했어요', {
                      retryable: xhr.status === 408 || xhr.status === 429 || xhr.status >= 500,
                    })
                  );
                  return;
                }

                try {
                  const responseData = JSON.parse(xhr.responseText) as GoogleDirectUploadResponse;
                  resolve({
                    fileId: responseData.id,
                    fileName: responseData.name || resolvedFileName,
                  });
                } catch {
                  reject(new UploadError('업로드 결과를 읽을 수 없어요'));
                }
              };

              xhr.send(file.file);
            });
          }

          const completeResponse = await fetch('/api/guestsnap/upload/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileId: uploadedFile.fileId,
              fileName: uploadedFile.fileName,
            }),
            signal: abortController.signal,
          });

          const completeData: UploadResponse = await completeResponse.json();

          if (completeData.success) {
            return { success: true };
          }

          lastError = completeData.error?.message || '업로드에 실패했어요';

          if (isTerminalUploadCode(completeData.error?.code)) {
            return { success: false, error: lastError };
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              return { success: false, error: '업로드가 취소되었어요' };
            }

            if (error instanceof UploadError) {
              lastError = error.message;

              if (!error.retryable) {
                return { success: false, error: lastError };
              }
            } else {
              lastError = error.message;
            }
          } else {
            lastError = '알 수 없는 오류가 발생했어요';
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt < retryConfig.maxAttempts) {
          const delay = Math.min(
            retryConfig.baseDelayMs * Math.pow(2, attempt - 1),
            retryConfig.maxDelayMs
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      return { success: false, error: lastError };
    },
    [retryConfig, syncCurrentFile, updateQueueState]
  );

  /**
   * Move queued files that no longer fit in the session capacity to failed.
   */
  const failRemainingQueueForLimit = useCallback(() => {
    const message = GUEST_SNAP_CONFIG.messages.limitReached;
    let overflowFiles: GuestSnapFile[] = [];

    updateQueueState((prev) => {
      if (prev.queue.length === 0) {
        return prev;
      }

      overflowFiles = prev.queue.map((queuedFile) => ({
        ...queuedFile,
        status: 'failed' as const,
        error: message,
      }));

      return {
        ...prev,
        queue: [],
        failed: [...prev.failed, ...overflowFiles],
        currentFile: syncCurrentFile(prev.activeFiles),
      };
    });

    for (const file of overflowFiles) {
      onUploadError?.(file, message);
    }
  }, [onUploadError, syncCurrentFile, updateQueueState]);

  /**
   * Reserve the next file and move it to the active worker pool.
   */
  const takeNextFileForUpload = useCallback((): GuestSnapFile | null => {
    let nextFile: GuestSnapFile | null = null;
    let limitReached = false;

    updateQueueState((prev) => {
      if (prev.queue.length === 0) {
        return prev;
      }

      const sessionSnapshot = sessionRef.current;
      const uploadLimit =
        sessionSnapshot?.uploadLimit || GUEST_SNAP_CONFIG.limits.maxFilesPerSession;
      const uploadCount = sessionSnapshot?.uploadCount || 0;

      if (uploadCount + prev.activeFiles.length >= uploadLimit) {
        limitReached = true;
        return prev;
      }

      nextFile = {
        ...prev.queue[0],
        status: 'uploading' as const,
        progress: 0,
        error: undefined,
      };
      const activeFiles = [...prev.activeFiles, nextFile];

      return {
        ...prev,
        activeFiles,
        currentFile: syncCurrentFile(activeFiles),
        queue: prev.queue.slice(1),
      };
    });

    if (limitReached) {
      failRemainingQueueForLimit();
    }

    return nextFile;
  }, [failRemainingQueueForLimit, syncCurrentFile, updateQueueState]);

  /**
   * Mark a finished active upload as completed or failed.
   */
  const finalizeActiveFile = useCallback(
    (
      file: GuestSnapFile,
      result: { success: boolean; error?: string }
    ): boolean => {
      let finalized = false;

      if (result.success) {
        const completedFile: GuestSnapFile = {
          ...file,
          status: 'completed',
          progress: 100,
          error: undefined,
          uploadedAt: new Date(),
        };

        updateQueueState((prev) => {
          const exists = prev.activeFiles.some((activeFile) => activeFile.id === file.id);
          if (!exists) {
            return prev;
          }

          finalized = true;
          const activeFiles = prev.activeFiles.filter((activeFile) => activeFile.id !== file.id);
          return {
            ...prev,
            activeFiles,
            currentFile: syncCurrentFile(activeFiles),
            completed: [...prev.completed, completedFile],
          };
        });

        if (finalized) {
          updateSessionState((prev) =>
            prev
              ? {
                  ...prev,
                  uploadCount: Math.min(prev.uploadLimit, prev.uploadCount + 1),
                  files: [...prev.files, completedFile],
                }
              : prev
          );
          onUploadComplete?.(completedFile);
        }

        return finalized;
      }

      const failedFile: GuestSnapFile = {
        ...file,
        status: 'failed',
        error: result.error,
      };

      updateQueueState((prev) => {
        const exists = prev.activeFiles.some((activeFile) => activeFile.id === file.id);
        if (!exists) {
          return prev;
        }

        finalized = true;
        const activeFiles = prev.activeFiles.filter((activeFile) => activeFile.id !== file.id);
        return {
          ...prev,
          activeFiles,
          currentFile: syncCurrentFile(activeFiles),
          failed: [...prev.failed, failedFile],
        };
      });

      if (finalized) {
        onUploadError?.(file, result.error || '업로드 실패');
      }

      return finalized;
    },
    [onUploadComplete, onUploadError, syncCurrentFile, updateQueueState, updateSessionState]
  );

  /**
   * Process the upload queue with a bounded worker pool.
   */
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current) return;
    if (queueStateRef.current.queue.length === 0) return;

    isProcessingRef.current = true;
    const runToken = { cancelled: false };
    activeRunRef.current = runToken;

    updateQueueState((prev) => ({
      ...prev,
      isProcessing: true,
    }));
    setUploadState('uploading');

    const worker = async () => {
      while (!runToken.cancelled) {
        const nextFile = takeNextFileForUpload();

        if (!nextFile) {
          return;
        }

        const result = await uploadFile(nextFile);
        abortControllersRef.current.delete(nextFile.id);
        uploadRequestsRef.current.delete(nextFile.id);

        if (runToken.cancelled) {
          return;
        }

        finalizeActiveFile(nextFile, result);
      }
    };

    const workerCount = Math.min(
      GUEST_SNAP_CONFIG.limits.maxConcurrentUploads,
      queueStateRef.current.queue.length
    );

    await Promise.all(Array.from({ length: workerCount }, () => worker()));

    if (activeRunRef.current !== runToken) {
      return;
    }

    activeRunRef.current = null;
    isProcessingRef.current = false;

    if (runToken.cancelled) {
      return;
    }

    const finalizedState = updateQueueState((prev) => ({
      ...prev,
      isProcessing: false,
      currentFile: syncCurrentFile(prev.activeFiles),
    }));

    const summary = {
      uploadedCount: finalizedState.completed.length,
      failedCount: finalizedState.failed.length,
      totalCount: finalizedState.completed.length + finalizedState.failed.length,
    };

    if (finalizedState.failed.length > 0 && finalizedState.completed.length === 0) {
      setUploadState('error');
      return;
    }

    setUploadState('completed');
    onAllComplete?.(summary);
  }, [
    finalizeActiveFile,
    onAllComplete,
    syncCurrentFile,
    takeNextFileForUpload,
    updateQueueState,
    uploadFile,
  ]);

  /**
   * Start uploading files
   */
  const startUpload = useCallback(() => {
    if (queueStateRef.current.queue.length === 0) return;
    processQueue();
  }, [processQueue]);

  /**
   * Pause the upload
   */
  const pauseUpload = useCallback(() => {
    if (activeRunRef.current) {
      activeRunRef.current.cancelled = true;
    }
    uploadRequestsRef.current.forEach((xhr) => xhr.abort());
    abortControllersRef.current.forEach((controller) => controller.abort());
    uploadRequestsRef.current.clear();
    abortControllersRef.current.clear();
    isProcessingRef.current = false;
    setUploadState('paused');
    updateQueueState((prev) => {
      const requeuedActiveFiles = prev.activeFiles.map((file) => ({
        ...file,
        status: 'pending' as const,
        progress: 0,
        error: undefined,
      }));

      return {
        ...prev,
        isProcessing: false,
        queue: [...requeuedActiveFiles, ...prev.queue],
        activeFiles: [],
        currentFile: null,
      };
    });
  }, [updateQueueState]);

  /**
   * Resume the upload
   */
  const resumeUpload = useCallback(() => {
    if (queueStateRef.current.queue.length > 0) {
      processQueue();
    }
  }, [processQueue]);

  /**
   * Retry a specific failed file
   */
  const retryFile = useCallback(
    (fileId: string) => {
      updateQueueState((prev) => {
        const failedFile = prev.failed.find((f) => f.id === fileId);
        if (!failedFile) return prev;

        return {
          ...prev,
          failed: prev.failed.filter((f) => f.id !== fileId),
          queue: [
            ...prev.queue,
            { ...failedFile, status: 'pending' as const, progress: 0, error: undefined },
          ],
        };
      });

      // Start processing if not already
      if (!isProcessingRef.current) {
        setTimeout(processQueue, 0);
      }
    },
    [processQueue, updateQueueState]
  );

  /**
   * Retry all failed files
   */
  const retryAllFailed = useCallback(() => {
    updateQueueState((prev) => ({
        ...prev,
        queue: [
          ...prev.queue,
          ...prev.failed.map((f) => ({
            ...f,
            status: 'pending' as const,
            progress: 0,
            error: undefined,
          })),
        ],
        failed: [],
      }));

      // Start processing if not already
    if (!isProcessingRef.current) {
      setTimeout(processQueue, 0);
    }
  }, [processQueue, updateQueueState]);

  return {
    // Session state
    session,
    isSessionLoading,
    sessionError,

    // Upload state
    uploadState,
    queueState,

    // Actions
    createSession,
    addFiles,
    startUpload,
    pauseUpload,
    resumeUpload,
    retryFile,
    retryAllFailed,
    removeFile,
    clearQueue,

    // Status
    totalProgress: totalProgress(),
    uploadedCount: queueState.completed.length,
    failedCount: queueState.failed.length,
  };
}
