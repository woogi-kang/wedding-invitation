'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  RefreshCw,
  Upload,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { FilePreview } from './FilePreview';
import { UploadProgress } from './UploadProgress';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { useGuestSnapUpload } from '@/hooks/useGuestSnapUpload';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import {
  getStaggerConfig,
  useHapticFeedback,
  usePrefersReducedMotion,
} from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import type { GuestSnapFile, GuestSnapFileType } from '@/types/guestsnap';

type GuestUploadSheetStep = 'name' | 'select';

interface GuestUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
}

export function GuestUploadSheet({
  isOpen,
  onClose,
  initialName = '',
}: GuestUploadSheetProps) {
  const { messages, limits, allowedTypes, allowedExtensions } = GUEST_SNAP_CONFIG;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const validationTimeoutRef = useRef<number | null>(null);
  const sessionAttemptNameRef = useRef('');

  const [step, setStep] = useState<GuestUploadSheetStep>(
    initialName.trim() ? 'select' : 'name'
  );
  const [guestName, setGuestName] = useState(initialName);
  const [nameInput, setNameInput] = useState(initialName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<GuestSnapFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startRequested, setStartRequested] = useState(false);

  const haptic = useHapticFeedback();
  const prefersReducedMotion = usePrefersReducedMotion();
  const staggerConfig = getStaggerConfig(prefersReducedMotion);

  const notifyBatchUploadComplete = useCallback(
    async (summary: { uploadedCount: number; failedCount: number; totalCount: number }) => {
      try {
        await fetch('/api/guestsnap/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(summary),
        });
      } catch (error) {
        console.error('Failed to send GuestSnap batch notify:', error);
      }
    },
    []
  );

  const {
    session,
    isSessionLoading,
    sessionError,
    queueState,
    createSession,
    addFiles,
    startUpload,
    pauseUpload,
    retryFile,
    retryAllFailed,
    removeFile,
    clearQueue,
    totalProgress,
    uploadedCount,
    failedCount,
  } = useGuestSnapUpload({
    onUploadComplete: (file) => {
      console.log('File uploaded:', file.name);
      haptic.light();
    },
    onUploadError: (file, error) => {
      console.error('Upload failed:', file.name, error);
      haptic.error();
      toast.error(`${file.name} 업로드 실패`, {
        description: error || '다시 시도해 주세요',
      });
    },
    onAllComplete: (summary) => {
      haptic.success();

      const description =
        summary.failedCount > 0
          ? `${summary.uploadedCount}개 성공, ${summary.failedCount}개 실패`
          : `${summary.uploadedCount}개 파일이 업로드되었어요`;

      toast.success(messages.uploadComplete, {
        description,
      });

      void notifyBatchUploadComplete(summary);
    },
  });

  const trackedFiles = useMemo(
    () => [
      ...queueState.activeFiles,
      ...queueState.queue,
      ...queueState.completed,
      ...queueState.failed,
    ],
    [queueState.activeFiles, queueState.queue, queueState.completed, queueState.failed]
  );
  const isSessionReady = session?.guestName === guestName;

  const hasUploadState =
    startRequested ||
    queueState.isProcessing ||
    queueState.activeFiles.length > 0 ||
    trackedFiles.length > 0;
  const isUploading =
    startRequested ||
    queueState.isProcessing ||
    queueState.activeFiles.length > 0;
  const hasCompletedResults = queueState.completed.length > 0 || queueState.failed.length > 0;
  const isSuccessState = !isUploading && hasCompletedResults && failedCount === 0;
  const isFailureState = !isUploading && failedCount > 0;

  useBeforeUnload({
    enabled: isUploading,
    message: messages.confirmLeave,
  });

  useEffect(() => {
    if (!isOpen || step === 'name' || !guestName || isSessionLoading) {
      return;
    }

    if (session?.guestName === guestName) {
      sessionAttemptNameRef.current = guestName;
      return;
    }

    if (sessionAttemptNameRef.current === guestName) {
      return;
    }

    sessionAttemptNameRef.current = guestName;
    void createSession(guestName);
  }, [isOpen, step, guestName, isSessionLoading, session, createSession]);

  useEffect(() => {
    if (!startRequested || isSessionLoading || !!sessionError) {
      return;
    }

    if (queueState.isProcessing || queueState.activeFiles.length > 0) {
      return;
    }

    if (queueState.queue.length === 0) {
      return;
    }

    startUpload();
    setStartRequested(false);
  }, [
    startRequested,
    isSessionLoading,
    sessionError,
    queueState.isProcessing,
    queueState.activeFiles.length,
    queueState.queue.length,
    startUpload,
  ]);

  useEffect(() => {
    if (!isOpen || step !== 'name') {
      return;
    }

    const timer = window.setTimeout(() => nameInputRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, [isOpen, step]);

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        window.clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  const clearValidationErrors = useCallback(() => {
    if (validationTimeoutRef.current) {
      window.clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = window.setTimeout(() => {
      setValidationErrors([]);
    }, 5000);
  }, []);

  const resetForNextUpload = useCallback(() => {
    clearQueue();
    setSelectedFiles([]);
    setValidationErrors([]);
    setStartRequested(false);
    setIsDragging(false);
    setStep('select');
  }, [clearQueue]);

  const handleClose = useCallback(() => {
    if (queueState.isProcessing || queueState.activeFiles.length > 0) {
      pauseUpload();
    }

    sessionAttemptNameRef.current = '';
    clearQueue();
    setSelectedFiles([]);
    setValidationErrors([]);
    setNameError(null);
    setStartRequested(false);
    setIsDragging(false);
    setStep(guestName.trim() ? 'select' : 'name');
    setNameInput(guestName);
    onClose();
  }, [
    clearQueue,
    guestName,
    onClose,
    pauseUpload,
    queueState.activeFiles.length,
    queueState.isProcessing,
  ]);

  const validateName = useCallback((value: string): boolean => {
    const trimmed = value.trim();

    if (!trimmed) {
      setNameError('존함을 입력해주세요');
      return false;
    }

    if (trimmed.length < 2) {
      setNameError('2글자 이상 입력해주세요');
      return false;
    }

    if (trimmed.length > 20) {
      setNameError('20글자 이하로 입력해주세요');
      return false;
    }

    const validPattern = /^[\p{L}\p{N}\s-]+$/u;
    if (!validPattern.test(trimmed)) {
      setNameError('한글, 영문, 숫자만 입력 가능해요');
      return false;
    }

    setNameError(null);
    return true;
  }, []);

  const handleNameSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateName(nameInput)) {
        haptic.error();
        return;
      }

      const nextName = nameInput.trim();
      setGuestName(nextName);
      setNameInput(nextName);
      setStep('select');
      haptic.medium();
    },
    [haptic, nameInput, validateName]
  );

  const generateFileId = useCallback(() => {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  const getFileType = useCallback(
    (mimeType: string): GuestSnapFileType | null => {
      if (allowedTypes.images.includes(mimeType)) {
        return 'image';
      }
      if (allowedTypes.videos.includes(mimeType)) {
        return 'video';
      }
      return null;
    },
    [allowedTypes]
  );

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string; type?: GuestSnapFileType } => {
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedExtensions.includes(extension)) {
        return { valid: false, error: messages.invalidFileType };
      }

      const fileType = getFileType(file.type);
      if (!fileType) {
        return { valid: false, error: messages.invalidFileType };
      }

      if (file.size === 0) {
        return { valid: false, error: '파일이 비어있어요' };
      }

      return { valid: true, type: fileType };
    },
    [allowedExtensions, getFileType, messages]
  );

  const createThumbnail = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const errors: string[] = [];
      const newFiles: GuestSnapFile[] = [];

      const totalCount = selectedFiles.length + fileArray.length;
      if (totalCount > limits.maxFilesPerSession) {
        errors.push(`최대 ${limits.maxFilesPerSession}개까지만 선택할 수 있어요`);
        const allowedCount = limits.maxFilesPerSession - selectedFiles.length;
        fileArray.splice(allowedCount);
      }

      for (const file of fileArray) {
        const validation = validateFile(file);

        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }

        const thumbnail = await createThumbnail(file);

        newFiles.push({
          id: generateFileId(),
          name: file.name,
          size: file.size,
          type: validation.type!,
          mimeType: file.type,
          status: 'pending',
          progress: 0,
          retryCount: 0,
          createdAt: new Date(),
          thumbnail,
          file,
        });
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        clearValidationErrors();
      }

      if (newFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [
      clearValidationErrors,
      createThumbnail,
      generateFileId,
      limits.maxFilesPerSession,
      selectedFiles.length,
      validateFile,
    ]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        void processFiles(files);
      }
      e.target.value = '';
    },
    [processFiles]
  );

  const handleSelectClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCameraClick = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        void processFiles(files);
      }
    },
    [processFiles]
  );

  const handleRemoveSelectedFile = useCallback(
    (fileId: string) => {
      setSelectedFiles((prev) => prev.filter((file) => file.id !== fileId));
      removeFile(fileId);
    },
    [removeFile]
  );

  const handleStartUpload = useCallback(() => {
    if (!isSessionReady || selectedFiles.length === 0) {
      return;
    }

    clearQueue();
    addFiles(selectedFiles);
    setStartRequested(true);
    haptic.medium();
    toast.info('업로드를 시작합니다', {
      description: `${selectedFiles.length}개 파일`,
    });
  }, [addFiles, clearQueue, haptic, isSessionReady, selectedFiles]);

  const handleRetryAll = useCallback(() => {
    haptic.medium();
    retryAllFailed();
    toast.info('실패한 파일 재시도', {
      description: `${failedCount}개 파일`,
    });
  }, [failedCount, haptic, retryAllFailed]);

  const handleRetrySession = useCallback(() => {
    if (!guestName) {
      return;
    }

    sessionAttemptNameRef.current = guestName;
    void createSession(guestName);
  }, [createSession, guestName]);

  const handleRetryFile = useCallback(
    (fileId: string) => {
      haptic.light();
      retryFile(fileId);
    },
    [haptic, retryFile]
  );

  const acceptedTypes = [...allowedTypes.images, ...allowedTypes.videos].join(',');

  const renderSheetHeader = () => {
    if (hasUploadState) {
      return (
        <div className="flex items-center justify-end border-b border-[var(--color-secondary)] px-5 py-4 sm:px-6">
          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-[var(--color-secondary)]"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-[var(--color-text-light)]" />
          </button>
        </div>
      );
    }

    if (step === 'select') {
      return (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-secondary)] px-5 py-4 sm:px-6">
          <button
            onClick={() => {
              haptic.light();
              setNameInput(guestName);
              setNameError(null);
              setStep('name');
            }}
            className="inline-flex items-center gap-1 text-sm text-[var(--color-text-light)] transition-colors hover:text-[var(--color-text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            이름 변경
          </button>

          <div className="rounded-full bg-[var(--color-secondary)] px-4 py-1.5 text-sm font-medium text-[var(--color-primary)]">
            {guestName}님
          </div>

          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-[var(--color-secondary)]"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-[var(--color-text-light)]" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end border-b border-[var(--color-secondary)] px-5 py-4 sm:px-6">
        <button
          onClick={handleClose}
          className="rounded-full p-2 transition-colors hover:bg-[var(--color-secondary)]"
          aria-label="닫기"
        >
          <X className="h-5 w-5 text-[var(--color-text-light)]" />
        </button>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      hideHeader
      className="w-[92%] max-w-3xl overflow-hidden rounded-[2rem] bg-white p-0 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      contentClassName="flex max-h-[88vh] flex-col"
    >
      {renderSheetHeader()}

      {hasUploadState ? (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
            {isSuccessState && (
              <div className="mb-6 rounded-[1.75rem] bg-[var(--color-secondary)]/45 px-6 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-7 w-7 text-green-600" />
                </div>
                <p
                  className="mt-4 text-xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                  }}
                >
                  예쁘게 찍어주셔서 정말 감사합니다 :)
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-light)]">
                  {uploadedCount}개 파일이 안전하게 업로드되었어요.
                </p>
              </div>
            )}

            {isFailureState && (
              <div className="mb-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      업로드는 일부 완료됐고, 재시도할 파일이 남아 있어요.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-700">
                      {uploadedCount}개 성공, {failedCount}개 실패
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isSuccessState && (
              <UploadProgress
                files={trackedFiles}
                completedCount={uploadedCount}
                failedCount={failedCount}
                totalProgress={totalProgress}
                currentRetryAttempt={
                  queueState.activeFiles.length === 1 &&
                  queueState.activeFiles[0]?.retryCount
                    ? queueState.activeFiles[0].retryCount + 1
                    : undefined
                }
                onRetryFile={handleRetryFile}
                onRetryAll={isFailureState ? handleRetryAll : undefined}
                onRemoveFile={handleRemoveSelectedFile}
              />
            )}
          </div>

          <div className="border-t border-[var(--color-secondary)] px-5 py-4 sm:px-6">
            {isSuccessState ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={resetForNextUpload}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-secondary)]"
                >
                  <RefreshCw className="h-4 w-4" />
                  더 올리기
                </button>
                <button
                  onClick={handleClose}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                >
                  <Check className="h-4 w-4" />
                  완료
                </button>
              </div>
            ) : isFailureState ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleRetryAll}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-secondary)]"
                >
                  <RefreshCw className="h-4 w-4" />
                  실패한 파일 다시 시도
                </button>
                <button
                  onClick={handleClose}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                >
                  완료
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-[var(--color-secondary)]/35 px-4 py-3 text-center text-sm text-[var(--color-text-light)]">
                업로드가 끝날 때까지 잠시만 기다려주세요.
              </div>
            )}
          </div>
        </>
      ) : step === 'name' ? (
        <div className="px-5 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center" aria-hidden="true">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                <User className="h-8 w-8 text-[var(--color-primary)]" />
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Step 1
            </p>
            <h3
              className="mt-3 text-2xl leading-tight"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              먼저 존함을 알려주세요
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-light)]">
              입력하신 이름으로 업로드된 사진과 영상을 정리해 둘게요.
            </p>

            <form onSubmit={handleNameSubmit} className="mt-8">
              <div>
                <label htmlFor="guest-upload-name" className="sr-only">
                  존함 입력
                </label>
                <input
                  id="guest-upload-name"
                  ref={nameInputRef}
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (nameError) {
                      setNameError(null);
                    }
                  }}
                  placeholder={messages.nameModalPlaceholder}
                  maxLength={20}
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? 'guest-upload-name-error' : undefined}
                  className={cn(
                    'w-full rounded-2xl border-2 px-4 py-4 text-center text-base transition-colors',
                    'placeholder:text-[var(--color-text-light)]/60 focus:outline-none',
                    nameError
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-[var(--color-botanical-light)] focus:border-[var(--color-primary)]'
                  )}
                />
                {nameError && (
                  <p
                    id="guest-upload-name-error"
                    role="alert"
                    className="mt-2 text-sm text-red-500"
                  >
                    {nameError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!nameInput.trim()}
              >
                다음으로
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Step 2
              </p>
              <h3
                className="mt-3 text-2xl leading-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                사진과 영상을 선택해주세요
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-light)]">
                앨범에서 골라도 되고, 지금 바로 촬영한 파일도 올릴 수 있어요.
              </p>
            </div>

            <div className="mb-5 flex flex-wrap justify-center gap-2">
              <div className="rounded-full bg-[var(--color-secondary)] px-4 py-2 text-xs text-[var(--color-primary)] sm:text-sm">
                최대 {limits.maxFilesPerSession}개
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="mb-4 rounded-2xl bg-red-50 p-4">
                {validationErrors.map((error, index) => (
                  <div key={`${error}-${index}`} className="flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                'rounded-[1.75rem] border-2 border-dashed p-6 transition-colors sm:p-8',
                isDragging
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-botanical-light)] bg-[var(--color-secondary)]/30'
              )}
            >
              {selectedFiles.length === 0 ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                    <ImagePlus className="h-8 w-8 text-[var(--color-primary)]" />
                  </div>
                  <p
                    className="text-base"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    소중한 순간을 바로 담아 올려주세요
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-light)]">
                    {messages.uploadModalDragText}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => {
                        haptic.light();
                        handleSelectClick();
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                      <Upload className="h-4 w-4" />
                      {messages.uploadModalSelectButton}
                    </button>
                    <button
                      onClick={() => {
                        haptic.light();
                        handleCameraClick();
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--color-primary)] px-4 py-4 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
                    >
                      <Camera className="h-4 w-4" />
                      {messages.uploadModalCameraButton}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p
                        className="text-lg"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: 'var(--color-text)',
                        }}
                      >
                        선택된 파일 {selectedFiles.length}개
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-light)]">
                        업로드 전에 삭제하거나 파일을 더 추가할 수 있어요.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        haptic.light();
                        handleSelectClick();
                      }}
                      className="hidden rounded-full border border-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5 sm:inline-flex"
                    >
                      파일 더 선택
                    </button>
                  </div>

                  <motion.div
                    className="grid grid-cols-3 gap-3 sm:grid-cols-4"
                    variants={staggerConfig.container}
                    initial="initial"
                    animate="animate"
                  >
                    <AnimatePresence mode="popLayout">
                      {selectedFiles.map((file, index) => (
                        <motion.div
                          key={file.id}
                          variants={staggerConfig.item}
                          layout
                          custom={index}
                        >
                          <FilePreview
                            file={file}
                            onRemove={() => {
                              haptic.light();
                              handleRemoveSelectedFile(file.id);
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {selectedFiles.length < limits.maxFilesPerSession && (
                      <motion.button
                        whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}
                        whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                        onClick={() => {
                          haptic.light();
                          handleSelectClick();
                        }}
                        className="aspect-square rounded-xl border-2 border-dashed border-[var(--color-botanical-light)] bg-white/80 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                      >
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--color-text-light)]">
                          <ImagePlus className="h-5 w-5" />
                          <span className="text-xs">추가</span>
                        </div>
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*,video/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          <div className="border-t border-[var(--color-secondary)] px-5 py-4 sm:px-6">
            {sessionError && (
              <div className="mb-3 flex items-start gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p>{sessionError}</p>
                  <button
                    onClick={handleRetrySession}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-dark)]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    다시 연결하기
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleStartUpload}
              disabled={
                selectedFiles.length === 0 ||
                !isSessionReady ||
                isSessionLoading ||
                !!sessionError
              }
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium transition-colors',
                selectedFiles.length === 0 || !isSessionReady || isSessionLoading || !!sessionError
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
              )}
            >
              {!isSessionReady || isSessionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  세션 준비 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {selectedFiles.length}개 파일 업로드하기
                </>
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
