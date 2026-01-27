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
  UploadQueueState,
  UploadState,
  SessionResponse,
  UploadResponse,
} from '@/types/guestsnap';

interface UseGuestSnapUploadOptions {
  onUploadComplete?: (file: GuestSnapFile) => void;
  onUploadError?: (file: GuestSnapFile, error: string) => void;
  onAllComplete?: () => void;
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
    setQueueState((prev) => ({
      ...prev,
      queue: [...prev.queue, ...files],
    }));
    setUploadState('selecting');
  }, []);

  /**
   * Remove a file from the queue
   */
  const removeFile = useCallback((fileId: string) => {
    setQueueState((prev) => ({
      ...prev,
      queue: prev.queue.filter((f) => f.id !== fileId),
      failed: prev.failed.filter((f) => f.id !== fileId),
    }));
  }, []);

  /**
   * Clear the entire queue
   */
  const clearQueue = useCallback(() => {
    setQueueState({
      isProcessing: false,
      currentFile: null,
      queue: [],
      completed: [],
      failed: [],
    });
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

      const formData = new FormData();
      formData.append('file', file.file);

      let lastError = '';

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

          const response = await fetch('/api/guestsnap/upload', {
            method: 'POST',
            body: formData,
            signal: abortControllerRef.current.signal,
          });

          const data: UploadResponse = await response.json();

          if (data.success) {
            return { success: true };
          }

          lastError = data.error?.message || '업로드에 실패했어요';

          // Don't retry on certain errors
          if (
            data.error?.code === 'NO_SESSION' ||
            data.error?.code === 'LIMIT_REACHED' ||
            data.error?.code === 'INVALID_FILE'
          ) {
            return { success: false, error: lastError };
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              return { success: false, error: '업로드가 취소되었어요' };
            }
            lastError = error.message;
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
    isProcessingRef.current = true;

    setQueueState((prev) => ({ ...prev, isProcessing: true }));
    setUploadState('uploading');

    while (true) {
      // Get next file from queue
      let nextFile: GuestSnapFile | undefined;

      setQueueState((prev) => {
        if (prev.queue.length === 0) {
          return prev;
        }

        nextFile = prev.queue[0];
        return {
          ...prev,
          currentFile: { ...nextFile, status: 'uploading', progress: 0 },
          queue: prev.queue.slice(1),
        };
      });

      // Check if queue is empty
      if (!nextFile) {
        break;
      }

      // Upload the file
      const result = await uploadFile(nextFile);

      if (result.success) {
        // Move to completed
        setQueueState((prev) => ({
          ...prev,
          currentFile: null,
          completed: [
            ...prev.completed,
            {
              ...nextFile!,
              status: 'completed',
              progress: 100,
              uploadedAt: new Date(),
            },
          ],
        }));

        onUploadComplete?.({
          ...nextFile,
          status: 'completed',
          progress: 100,
          uploadedAt: new Date(),
        });
      } else {
        // Move to failed
        setQueueState((prev) => ({
          ...prev,
          currentFile: null,
          failed: [
            ...prev.failed,
            {
              ...nextFile!,
              status: 'failed',
              error: result.error,
            },
          ],
        }));

        onUploadError?.(nextFile, result.error || '업로드 실패');
      }
    }

    // All files processed
    isProcessingRef.current = false;
    setQueueState((prev) => ({ ...prev, isProcessing: false, currentFile: null }));

    // Determine final state
    setQueueState((prev) => {
      if (prev.failed.length > 0 && prev.completed.length === 0) {
        setUploadState('error');
      } else if (prev.failed.length === 0) {
        setUploadState('completed');
        onAllComplete?.();
      } else {
        setUploadState('completed');
        onAllComplete?.();
      }
      return prev;
    });
  }, [uploadFile, onUploadComplete, onUploadError, onAllComplete]);

  /**
   * Start uploading files
   */
  const startUpload = useCallback(() => {
    if (queueState.queue.length === 0) return;
    processQueue();
  }, [queueState.queue.length, processQueue]);

  /**
   * Pause the upload
   */
  const pauseUpload = useCallback(() => {
    abortControllerRef.current?.abort();
    isProcessingRef.current = false;
    setUploadState('paused');
    setQueueState((prev) => ({
      ...prev,
      isProcessing: false,
      // Move current file back to queue
      queue: prev.currentFile
        ? [{ ...prev.currentFile, status: 'pending', progress: 0 }, ...prev.queue]
        : prev.queue,
      currentFile: null,
    }));
  }, []);

  /**
   * Resume the upload
   */
  const resumeUpload = useCallback(() => {
    if (queueState.queue.length > 0) {
      processQueue();
    }
  }, [queueState.queue.length, processQueue]);

  /**
   * Retry a specific failed file
   */
  const retryFile = useCallback(
    (fileId: string) => {
      setQueueState((prev) => {
        const failedFile = prev.failed.find((f) => f.id === fileId);
        if (!failedFile) return prev;

        return {
          ...prev,
          failed: prev.failed.filter((f) => f.id !== fileId),
          queue: [...prev.queue, { ...failedFile, status: 'pending', progress: 0, error: undefined }],
        };
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
    setQueueState((prev) => ({
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
