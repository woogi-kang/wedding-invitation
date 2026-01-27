/**
 * useUploadQueue Hook
 * Queue management with IndexedDB persistence and offline support
 * Based on SPEC-GUESTSNAP-001 M3.1, M3.3
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { queueManager, type SessionData } from '@/lib/guestsnap/queue-manager';
import { useOfflineSync } from './useOfflineSync';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type {
  GuestSnapFile,
  UploadQueueState,
  UploadState,
  UploadResponse,
} from '@/types/guestsnap';

interface UseUploadQueueOptions {
  /** Callback when a file upload completes */
  onFileComplete?: (file: GuestSnapFile) => void;
  /** Callback when a file upload fails */
  onFileFailed?: (file: GuestSnapFile, error: string) => void;
  /** Callback when all uploads complete */
  onAllComplete?: () => void;
  /** Callback when incomplete uploads are found */
  onIncompleteUploadsFound?: (count: number) => void;
  /** Whether to auto-resume uploads on mount */
  autoResume?: boolean;
}

interface UseUploadQueueReturn {
  // State
  queueState: UploadQueueState;
  uploadState: UploadState;
  isOnline: boolean;
  isOffline: boolean;
  hasIncompleteUploads: boolean;

  // Session
  session: SessionData | null;
  saveSession: (session: SessionData) => Promise<void>;
  clearSession: () => Promise<void>;

  // Queue operations
  addFiles: (files: GuestSnapFile[]) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  clearAll: () => Promise<void>;

  // Upload control
  startUpload: () => Promise<void>;
  pauseUpload: () => void;
  resumeUpload: () => void;
  retryFile: (fileId: string) => Promise<void>;
  retryAllFailed: () => Promise<void>;

  // Stats
  totalProgress: number;
  uploadedCount: number;
  failedCount: number;
  pendingCount: number;
  totalCount: number;
}

/**
 * Hook for managing upload queue with persistence
 */
export function useUploadQueue(
  options: UseUploadQueueOptions = {}
): UseUploadQueueReturn {
  const {
    onFileComplete,
    onFileFailed,
    onAllComplete,
    onIncompleteUploadsFound,
    autoResume = true,
  } = options;

  const { retry: retryConfig } = GUEST_SNAP_CONFIG;

  // State
  const [queueState, setQueueState] = useState<UploadQueueState>({
    isProcessing: false,
    currentFile: null,
    queue: [],
    completed: [],
    failed: [],
  });
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [session, setSession] = useState<SessionData | null>(null);
  const [hasIncompleteUploads, setHasIncompleteUploads] = useState(false);

  // Refs
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPausedRef = useRef(false);

  // Refs for options to avoid stale closures in useEffect
  const autoResumeRef = useRef(autoResume);
  const onIncompleteUploadsFoundRef = useRef(onIncompleteUploadsFound);

  // Update refs when options change
  useEffect(() => {
    autoResumeRef.current = autoResume;
    onIncompleteUploadsFoundRef.current = onIncompleteUploadsFound;
  }, [autoResume, onIncompleteUploadsFound]);

  // Offline sync
  const { isOnline, isOffline } = useOfflineSync({
    onOnline: () => {
      // Auto-resume uploads when back online
      if (isPausedRef.current && queueState.queue.length > 0) {
        resumeUpload();
      }
    },
    onOffline: () => {
      // Pause uploads when going offline
      if (isProcessingRef.current) {
        pauseUpload();
      }
    },
  });

  /**
   * Load queue from IndexedDB on mount
   */
  useEffect(() => {
    let isMounted = true;

    const loadQueue = async () => {
      try {
        // Load session
        const savedSession = await queueManager.getSession();
        if (savedSession && isMounted) {
          setSession(savedSession);
        }

        // Load queue items
        const allItems = await queueManager.getAllItems();

        if (allItems.length > 0 && isMounted) {
          const pending = allItems.filter((f) => f.status === 'pending' || f.status === 'uploading');
          const completed = allItems.filter((f) => f.status === 'completed');
          const failed = allItems.filter((f) => f.status === 'failed');

          setQueueState({
            isProcessing: false,
            currentFile: null,
            queue: pending,
            completed,
            failed,
          });

          // Check for incomplete uploads
          const hasIncomplete = await queueManager.hasIncompleteUploads();
          if (isMounted) {
            setHasIncompleteUploads(hasIncomplete);
          }

          if (hasIncomplete && isMounted) {
            const incompleteCount = pending.length + failed.length;
            onIncompleteUploadsFoundRef.current?.(incompleteCount);

            // Auto-resume if enabled and online
            if (autoResumeRef.current && pending.length > 0 && navigator.onLine) {
              // Delay to allow UI to mount
              setTimeout(() => {
                if (isMounted && !isProcessingRef.current) {
                  isPausedRef.current = false;
                  // Trigger processQueue via state update
                  setUploadState('uploading');
                }
              }, 1000);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load queue from IndexedDB:', error);
      }
    };

    loadQueue();

    // Set up queue update listener
    queueManager.setOnQueueUpdate((items) => {
      if (!isMounted) return;
      const pending = items.filter((f) => f.status === 'pending');
      const completed = items.filter((f) => f.status === 'completed');
      const failed = items.filter((f) => f.status === 'failed');

      setQueueState((prev) => ({
        ...prev,
        queue: pending,
        completed,
        failed,
      }));
    });

    // Cleanup
    return () => {
      isMounted = false;
      queueManager.setOnQueueUpdate(() => {});
    };
  }, []);

  /**
   * Save session to IndexedDB
   */
  const saveSession = useCallback(async (sessionData: SessionData) => {
    await queueManager.saveSession(sessionData);
    setSession(sessionData);
  }, []);

  /**
   * Clear session from IndexedDB
   */
  const clearSession = useCallback(async () => {
    await queueManager.clearSession();
    setSession(null);
  }, []);

  /**
   * Add files to the queue
   */
  const addFiles = useCallback(async (files: GuestSnapFile[]) => {
    await queueManager.addItems(files);
    setQueueState((prev) => ({
      ...prev,
      queue: [...prev.queue, ...files],
    }));
    setUploadState('selecting');
  }, []);

  /**
   * Remove a file from the queue
   */
  const removeFile = useCallback(async (fileId: string) => {
    await queueManager.removeItem(fileId);
    setQueueState((prev) => ({
      ...prev,
      queue: prev.queue.filter((f) => f.id !== fileId),
      failed: prev.failed.filter((f) => f.id !== fileId),
      completed: prev.completed.filter((f) => f.id !== fileId),
    }));
  }, []);

  /**
   * Clear completed files
   */
  const clearCompleted = useCallback(async () => {
    await queueManager.removeCompletedItems();
    setQueueState((prev) => ({
      ...prev,
      completed: [],
    }));
  }, []);

  /**
   * Clear all files
   */
  const clearAll = useCallback(async () => {
    await queueManager.clearAll();
    setQueueState({
      isProcessing: false,
      currentFile: null,
      queue: [],
      completed: [],
      failed: [],
    });
    setUploadState('idle');
    setHasIncompleteUploads(false);
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

      // Retry loop
      for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
        // Check if paused or offline
        if (isPausedRef.current || isOffline) {
          return { success: false, error: '업로드가 일시 중지되었어요' };
        }

        try {
          // Update retry status
          if (attempt > 1) {
            await queueManager.updateItemStatus(file.id, 'uploading', {
              retryCount: attempt - 1,
            });
            setQueueState((prev) => ({
              ...prev,
              currentFile: prev.currentFile
                ? { ...prev.currentFile, retryCount: attempt - 1 }
                : null,
            }));
          }

          // Create form data
          const formData = new FormData();
          formData.append('file', file.file);

          // Create abort controller
          abortControllerRef.current = new AbortController();

          // Upload
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
    [retryConfig, isOffline]
  );

  /**
   * Process the upload queue
   */
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || isPausedRef.current) return;

    isProcessingRef.current = true;
    setQueueState((prev) => ({ ...prev, isProcessing: true }));
    setUploadState('uploading');

    while (!isPausedRef.current) {
      // Get next file from queue
      const pendingItems = await queueManager.getPendingItems();
      const nextFile = pendingItems[0];

      if (!nextFile) {
        break;
      }

      // Update current file
      await queueManager.updateItemStatus(nextFile.id, 'uploading');
      setQueueState((prev) => ({
        ...prev,
        currentFile: { ...nextFile, status: 'uploading', progress: 0 },
        queue: prev.queue.filter((f) => f.id !== nextFile.id),
      }));

      // Upload the file
      const result = await uploadFile(nextFile);

      if (result.success) {
        // Mark as completed
        await queueManager.markItemCompleted(nextFile.id);
        setQueueState((prev) => ({
          ...prev,
          currentFile: null,
          completed: [
            ...prev.completed,
            { ...nextFile, status: 'completed', progress: 100, uploadedAt: new Date() },
          ],
        }));
        onFileComplete?.({ ...nextFile, status: 'completed', progress: 100 });
      } else {
        // Mark as failed
        await queueManager.markItemFailed(nextFile.id, result.error || '알 수 없는 오류', nextFile.retryCount);
        setQueueState((prev) => ({
          ...prev,
          currentFile: null,
          failed: [
            ...prev.failed,
            { ...nextFile, status: 'failed', error: result.error },
          ],
        }));
        onFileFailed?.(nextFile, result.error || '알 수 없는 오류');
      }
    }

    // All files processed
    isProcessingRef.current = false;
    setQueueState((prev) => ({ ...prev, isProcessing: false, currentFile: null }));

    // Check final state
    const stats = await queueManager.getQueueStats();

    if (stats.failed > 0 && stats.completed === 0) {
      setUploadState('error');
    } else if (stats.pending === 0 && stats.uploading === 0) {
      setUploadState('completed');
      setHasIncompleteUploads(false);
      onAllComplete?.();
    }
  }, [uploadFile, onFileComplete, onFileFailed, onAllComplete]);

  /**
   * Start uploading
   */
  const startUpload = useCallback(async () => {
    if (queueState.queue.length === 0 && queueState.failed.length === 0) return;

    isPausedRef.current = false;
    await processQueue();
  }, [queueState.queue.length, queueState.failed.length, processQueue]);

  /**
   * Pause uploading
   */
  const pauseUpload = useCallback(() => {
    isPausedRef.current = true;
    abortControllerRef.current?.abort();
    isProcessingRef.current = false;
    setUploadState('paused');

    // Move current file back to queue
    setQueueState((prev) => {
      if (prev.currentFile) {
        queueManager.updateItemStatus(prev.currentFile.id, 'pending');
        return {
          ...prev,
          isProcessing: false,
          currentFile: null,
          queue: [{ ...prev.currentFile, status: 'pending', progress: 0 }, ...prev.queue],
        };
      }
      return { ...prev, isProcessing: false };
    });
  }, []);

  /**
   * Resume uploading
   */
  const resumeUpload = useCallback(() => {
    isPausedRef.current = false;
    processQueue();
  }, [processQueue]);

  /**
   * Retry a specific file
   */
  const retryFile = useCallback(async (fileId: string) => {
    await queueManager.resetItemForRetry(fileId);
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
  }, [processQueue]);

  /**
   * Retry all failed files
   */
  const retryAllFailed = useCallback(async () => {
    await queueManager.resetAllFailedItems();
    setQueueState((prev) => ({
      ...prev,
      queue: [
        ...prev.queue,
        ...prev.failed.map((f) => ({ ...f, status: 'pending' as const, progress: 0, error: undefined })),
      ],
      failed: [],
    }));

    // Start processing if not already
    if (!isProcessingRef.current) {
      setTimeout(processQueue, 0);
    }
  }, [processQueue]);

  // Calculate stats
  const totalCount = queueState.queue.length + queueState.completed.length + queueState.failed.length +
    (queueState.currentFile ? 1 : 0);
  const uploadedCount = queueState.completed.length;
  const failedCount = queueState.failed.length;
  const pendingCount = queueState.queue.length;

  const totalProgress = totalCount === 0 ? 0 : Math.round(
    (uploadedCount * 100 + (queueState.currentFile?.progress || 0)) / totalCount
  );

  return {
    // State
    queueState,
    uploadState,
    isOnline,
    isOffline,
    hasIncompleteUploads,

    // Session
    session,
    saveSession,
    clearSession,

    // Queue operations
    addFiles,
    removeFile,
    clearCompleted,
    clearAll,

    // Upload control
    startUpload,
    pauseUpload,
    resumeUpload,
    retryFile,
    retryAllFailed,

    // Stats
    totalProgress,
    uploadedCount,
    failedCount,
    pendingCount,
    totalCount,
  };
}
