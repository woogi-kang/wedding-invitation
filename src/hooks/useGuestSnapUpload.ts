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
    currentFile: null,
    queue: [],
    completed: [],
    failed: [],
  });

  // Refs for managing upload process
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const uploadRequestRef = useRef<XMLHttpRequest | null>(null);
  const queueStateRef = useRef<UploadQueueState>(queueState);

  // Keep a ref to the latest queue state for async upload loop logic.
  useEffect(() => {
    queueStateRef.current = queueState;
  }, [queueState]);

  // Calculate total progress
  const totalProgress = useCallback(() => {
    const { queue, completed, failed, currentFile } = queueState;
    const total = queue.length + completed.length + failed.length + (currentFile ? 1 : 0);

    if (total === 0) return 0;

    const completedProgress = completed.length * 100;
    const currentProgress = currentFile?.progress || 0;

    return Math.round((completedProgress + currentProgress) / total);
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
            setSession({
              id: data.sessionId,
              guestName: data.guestName,
              guestFolder: data.guestFolder,
              uploadCount: data.uploadCount,
              uploadLimit: data.uploadLimit,
              files: [],
              createdAt: new Date(),
              expiresAt: new Date(data.expiresAt),
            });
          }
        }
      } catch {
        // No existing session, that's fine
      }
    };

    checkExistingSession();
  }, []);

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

      setSession({
        id: data.sessionId,
        guestName: data.guestName,
        guestFolder: data.guestFolder,
        uploadCount: data.uploadCount,
        uploadLimit: data.uploadLimit,
        files: [],
        createdAt: new Date(),
        expiresAt: new Date(data.expiresAt),
      });

      return true;
    } catch {
      setSessionError('서버 연결에 실패했어요. 잠시 후 다시 시도해주세요.');
      return false;
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  /**
   * Add files to the upload queue
   */
  const addFiles = useCallback((files: GuestSnapFile[]) => {
    setQueueState((prev) => {
      const nextState: UploadQueueState = {
        ...prev,
        queue: [...prev.queue, ...files],
      };
      queueStateRef.current = nextState;
      return nextState;
    });
    setUploadState('selecting');
  }, []);

  /**
   * Remove a file from the queue
   */
  const removeFile = useCallback((fileId: string) => {
    setQueueState((prev) => {
      const nextState: UploadQueueState = {
        ...prev,
        queue: prev.queue.filter((f) => f.id !== fileId),
        failed: prev.failed.filter((f) => f.id !== fileId),
      };
      queueStateRef.current = nextState;
      return nextState;
    });
  }, []);

  /**
   * Clear the entire queue
   */
  const clearQueue = useCallback(() => {
    const nextState: UploadQueueState = {
      isProcessing: false,
      currentFile: null,
      queue: [],
      completed: [],
      failed: [],
    };
    queueStateRef.current = nextState;
    setQueueState(nextState);
    setUploadState('idle');
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
            setQueueState((prev) => ({
              ...prev,
              currentFile: prev.currentFile
                ? {
                    ...prev.currentFile,
                    retryCount: attempt - 1,
                    status: 'uploading',
                  }
                : null,
            }));
          }

          // Create abort controller for this request
          abortControllerRef.current = new AbortController();

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
              signal: abortControllerRef.current.signal,
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
              uploadRequestRef.current = xhr;

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

                setQueueState((prev) => ({
                  ...prev,
                  currentFile: prev.currentFile
                    ? {
                        ...prev.currentFile,
                        progress,
                      }
                    : null,
                }));
              };

              xhr.onerror = () => {
                reject(new UploadError('업로드 전송 중 오류가 발생했어요'));
              };

              xhr.onabort = () => {
                reject(new DOMException('Upload aborted', 'AbortError'));
              };

              xhr.onload = () => {
                uploadRequestRef.current = null;

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
            signal: abortControllerRef.current.signal,
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
    [retryConfig]
  );

  /**
   * Process the upload queue
   */
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current) return;
    if (queueStateRef.current.queue.length === 0) return;

    isProcessingRef.current = true;

    const processingState: UploadQueueState = {
      ...queueStateRef.current,
      isProcessing: true,
    };
    queueStateRef.current = processingState;
    setQueueState(processingState);
    setUploadState('uploading');

    while (true) {
      const queueSnapshot = queueStateRef.current;
      if (queueSnapshot.queue.length === 0) {
        break;
      }

      const nextFile = queueSnapshot.queue[0];
      const nextQueueState: UploadQueueState = {
        ...queueSnapshot,
        currentFile: { ...nextFile, status: 'uploading', progress: 0 },
        queue: queueSnapshot.queue.slice(1),
      };
      queueStateRef.current = nextQueueState;
      setQueueState(nextQueueState);

      // Upload the file
      const result = await uploadFile(nextFile);

      if (result.success) {
        const completedFile: GuestSnapFile = {
          ...nextFile,
          status: 'completed',
          progress: 100,
          uploadedAt: new Date(),
        };

        const successState: UploadQueueState = {
          ...queueStateRef.current,
          currentFile: null,
          completed: [...queueStateRef.current.completed, completedFile],
        };
        queueStateRef.current = successState;
        setQueueState(successState);

        // Move to completed
        onUploadComplete?.(completedFile);
      } else {
        const failedFile: GuestSnapFile = {
          ...nextFile,
          status: 'failed',
          error: result.error,
        };

        const failedState: UploadQueueState = {
          ...queueStateRef.current,
          currentFile: null,
          failed: [...queueStateRef.current.failed, failedFile],
        };
        queueStateRef.current = failedState;
        setQueueState(failedState);

        // Move to failed
        onUploadError?.(nextFile, result.error || '업로드 실패');
      }
    }

    // All files processed
    isProcessingRef.current = false;
    const finalizedState: UploadQueueState = {
      ...queueStateRef.current,
      isProcessing: false,
      currentFile: null,
    };
    queueStateRef.current = finalizedState;
    setQueueState(finalizedState);

    // Determine final state
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
  }, [uploadFile, onUploadComplete, onUploadError, onAllComplete]);

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
    uploadRequestRef.current?.abort();
    abortControllerRef.current?.abort();
    isProcessingRef.current = false;
    setUploadState('paused');
    setQueueState((prev) => {
      const nextState: UploadQueueState = {
        ...prev,
        isProcessing: false,
        // Move current file back to queue
        queue: prev.currentFile
          ? [{ ...prev.currentFile, status: 'pending' as const, progress: 0 }, ...prev.queue]
          : prev.queue,
        currentFile: null,
      };
      queueStateRef.current = nextState;
      return nextState;
    });
  }, []);

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
      setQueueState((prev) => {
        const failedFile = prev.failed.find((f) => f.id === fileId);
        if (!failedFile) return prev;

        const nextState: UploadQueueState = {
          ...prev,
          failed: prev.failed.filter((f) => f.id !== fileId),
          queue: [
            ...prev.queue,
            { ...failedFile, status: 'pending' as const, progress: 0, error: undefined },
          ],
        };
        queueStateRef.current = nextState;
        return nextState;
      });

      // Start processing if not already
      if (!isProcessingRef.current) {
        setTimeout(processQueue, 0);
      }
    },
    [processQueue]
  );

  /**
   * Retry all failed files
   */
  const retryAllFailed = useCallback(() => {
    setQueueState((prev) => {
      const nextState: UploadQueueState = {
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
      };
      queueStateRef.current = nextState;
      return nextState;
    });

    // Start processing if not already
    if (!isProcessingRef.current) {
      setTimeout(processQueue, 0);
    }
  }, [processQueue]);

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
