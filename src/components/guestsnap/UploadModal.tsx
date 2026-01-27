'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, ImagePlus, ArrowLeft, Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { FilePreview } from './FilePreview';
import { useGuestSnapUpload } from '@/hooks/useGuestSnapUpload';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { useHapticFeedback, usePrefersReducedMotion, getStaggerConfig } from '@/hooks/useHapticFeedback';
import type { GuestSnapFile, GuestSnapFileType } from '@/types/guestsnap';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  guestName: string;
  selectedFiles: GuestSnapFile[];
  onFilesSelected: (files: GuestSnapFile[]) => void;
}

/**
 * UploadModal - SECOND STEP in the upload flow
 * User selects files to upload after entering their name
 */
export function UploadModal({
  isOpen,
  onClose,
  onBack,
  guestName,
  selectedFiles,
  onFilesSelected,
}: UploadModalProps) {
  const { messages, limits, allowedTypes, allowedExtensions } = GUEST_SNAP_CONFIG;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Haptic feedback and accessibility hooks
  const haptic = useHapticFeedback();
  const prefersReducedMotion = usePrefersReducedMotion();
  const staggerConfig = getStaggerConfig(prefersReducedMotion);

  // Warn user when leaving during upload
  useBeforeUnload({
    enabled: isUploading && !uploadComplete,
    message: messages.confirmLeave,
  });

  // Initialize upload hook
  const {
    session,
    isSessionLoading,
    sessionError,
    uploadState,
    queueState,
    createSession,
    addFiles,
    startUpload,
    retryAllFailed,
    totalProgress,
    uploadedCount,
    failedCount,
  } = useGuestSnapUpload({
    onUploadComplete: (file) => {
      console.log('File uploaded:', file.name);
      // Light haptic on each file completion
      haptic.light();
    },
    onUploadError: (file, error) => {
      console.error('Upload failed:', file.name, error);
      // Error haptic and toast on failure
      haptic.error();
      toast.error(`${file.name} 업로드 실패`, {
        description: error || '다시 시도해 주세요',
      });
    },
    onAllComplete: () => {
      setUploadComplete(true);
      setIsUploading(false);
      // Success haptic and toast on completion
      haptic.success();
      toast.success(messages.uploadComplete, {
        description: `${uploadedCount}개 파일이 업로드되었어요`,
      });
    },
  });

  // Create session when modal opens with guest name
  useEffect(() => {
    if (isOpen && guestName && !session && !isSessionLoading) {
      createSession(guestName);
    }
  }, [isOpen, guestName, session, isSessionLoading, createSession]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsUploading(false);
      setUploadComplete(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Generate unique ID for file
  const generateFileId = useCallback(() => {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Determine file type
  const getFileType = useCallback((mimeType: string): GuestSnapFileType | null => {
    if (allowedTypes.images.includes(mimeType)) {
      return 'image';
    }
    if (allowedTypes.videos.includes(mimeType)) {
      return 'video';
    }
    return null;
  }, [allowedTypes]);

  // Validate single file
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string; type?: GuestSnapFileType } => {
      // Check file extension
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!allowedExtensions.includes(extension)) {
        return { valid: false, error: messages.invalidFileType };
      }

      // Check MIME type
      const fileType = getFileType(file.type);
      if (!fileType) {
        return { valid: false, error: messages.invalidFileType };
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (fileType === 'image' && sizeMB > limits.maxImageSizeMB) {
        return { valid: false, error: `사진 파일이 너무 커요 (최대 ${limits.maxImageSizeMB}MB)` };
      }
      if (fileType === 'video' && sizeMB > limits.maxVideoSizeMB) {
        return { valid: false, error: `영상 파일이 너무 커요 (최대 ${limits.maxVideoSizeMB}MB)` };
      }

      // Check for zero-byte files
      if (file.size === 0) {
        return { valid: false, error: '파일이 비어있어요' };
      }

      return { valid: true, type: fileType };
    },
    [allowedExtensions, getFileType, limits, messages]
  );

  // Create thumbnail for image files
  const createThumbnail = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  // Process selected files
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const errors: string[] = [];
      const newFiles: GuestSnapFile[] = [];

      // Check total file count limit
      const totalCount = selectedFiles.length + fileArray.length;
      if (totalCount > limits.maxFilesPerSession) {
        errors.push(`최대 ${limits.maxFilesPerSession}개까지만 선택할 수 있어요`);
        // Truncate to allowed count
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

        const guestSnapFile: GuestSnapFile = {
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
          file, // Store reference for retry functionality
        };

        newFiles.push(guestSnapFile);
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        // Auto-clear errors after 5 seconds
        setTimeout(() => setValidationErrors([]), 5000);
      }

      if (newFiles.length > 0) {
        onFilesSelected([...selectedFiles, ...newFiles]);
      }
    },
    [selectedFiles, limits, validateFile, createThumbnail, generateFileId, onFilesSelected]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input value to allow selecting same file again
      e.target.value = '';
    },
    [processFiles]
  );

  // Handle select button click
  const handleSelectClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle camera button click
  const handleCameraClick = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  // Handle drag events
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
        processFiles(files);
      }
    },
    [processFiles]
  );

  // Handle file removal
  const handleRemoveFile = useCallback(
    (fileId: string) => {
      onFilesSelected(selectedFiles.filter((f) => f.id !== fileId));
    },
    [selectedFiles, onFilesSelected]
  );

  // Get accepted file types for input
  const acceptedTypes = [...allowedTypes.images, ...allowedTypes.videos].join(',');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2',
              'rounded-2xl bg-white shadow-xl',
              'max-h-[85vh] flex flex-col'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-secondary)]">
              {/* Back button */}
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>이름 변경</span>
              </button>

              {/* Guest name badge */}
              <div className="text-sm font-medium text-[var(--color-primary)]">
                {guestName}님
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-[var(--color-secondary)] transition-colors"
                aria-label="닫기"
              >
                <X className="h-5 w-5 text-[var(--color-text-light)]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Title */}
              <div className="mb-6 text-center">
                <h3
                  id="upload-modal-title"
                  className="font-serif text-lg font-medium text-[var(--color-text)]"
                >
                  {messages.uploadModalTitle}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-light)]">
                  {messages.uploadModalSubtitle}
                </p>
              </div>

              {/* Validation errors */}
              {validationErrors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl bg-red-50 p-3"
                >
                  {validationErrors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Drop zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  'relative rounded-xl border-2 border-dashed p-6 transition-all duration-200',
                  isDragging
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-botanical-light)] bg-[var(--color-secondary)]/30'
                )}
              >
                {selectedFiles.length === 0 ? (
                  // Empty state
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                      <ImagePlus className="h-8 w-8 text-[var(--color-primary)]" />
                    </div>
                    <p className="mb-4 text-sm text-[var(--color-text-light)]">
                      {messages.uploadModalDragText}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          haptic.light();
                          handleSelectClick();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                        aria-label="사진 또는 영상 파일 선택"
                      >
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        {messages.uploadModalSelectButton}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          haptic.light();
                          handleCameraClick();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-primary)] py-3 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
                        aria-label="카메라로 사진 또는 영상 촬영"
                      >
                        <Camera className="h-4 w-4" aria-hidden="true" />
                        {messages.uploadModalCameraButton}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  // Files selected
                  <div role="region" aria-label="선택된 파일 목록">
                    {/* File preview grid with stagger animation */}
                    <motion.div
                      className="grid grid-cols-4 gap-2 mb-4"
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
                                handleRemoveFile(file.id);
                              }}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Add more button */}
                      {selectedFiles.length < limits.maxFilesPerSession && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            haptic.light();
                            handleSelectClick();
                          }}
                          className="aspect-square rounded-lg border-2 border-dashed border-[var(--color-botanical-light)] bg-[var(--color-secondary)]/50 flex flex-col items-center justify-center hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
                          aria-label="추가 파일 선택"
                        >
                          <ImagePlus className="h-5 w-5 text-[var(--color-text-light)]" />
                        </motion.button>
                      )}
                    </motion.div>

                    {/* File count - screen reader announcement */}
                    <p
                      className="text-center text-xs text-[var(--color-text-light)]"
                      aria-live="polite"
                    >
                      {selectedFiles.length}/{limits.maxFilesPerSession}개 선택됨
                    </p>
                  </div>
                )}
              </div>

              {/* Hidden file inputs */}
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

            {/* Footer - Upload button / Progress / Completion */}
            {selectedFiles.length > 0 && (
              <div className="p-4 border-t border-[var(--color-secondary)]">
                {/* Session error */}
                {sessionError && (
                  <div className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{sessionError}</span>
                  </div>
                )}

                {/* Upload complete state */}
                {uploadComplete && failedCount === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="mb-3 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {messages.uploadComplete}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-light)]">
                      {uploadedCount}개 파일이 업로드되었어요
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-3 font-medium text-white"
                    >
                      완료
                    </motion.button>
                  </motion.div>
                )}

                {/* Upload complete with failures */}
                {uploadComplete && failedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="mb-3 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      일부 파일 업로드 실패
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-light)]">
                      {uploadedCount}개 성공, {failedCount}개 실패
                    </p>
                    <div className="mt-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          haptic.medium();
                          setUploadComplete(false);
                          setIsUploading(true);
                          retryAllFailed();
                          toast.info('실패한 파일 재시도', {
                            description: `${failedCount}개 파일`,
                          });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-primary)] py-3 font-medium text-[var(--color-primary)]"
                        aria-label={`${failedCount}개 실패한 파일 다시 업로드`}
                      >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        재시도
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-[var(--color-primary)] py-3 font-medium text-white"
                      >
                        완료
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Uploading state */}
                {isUploading && !uploadComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    role="status"
                    aria-live="polite"
                    aria-label={`업로드 진행 중 ${totalProgress}%`}
                  >
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-text-light)]">
                          업로드 중...
                        </span>
                        <span className="font-medium text-[var(--color-primary)]">
                          {totalProgress}%
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full bg-[var(--color-secondary)] overflow-hidden"
                        role="progressbar"
                        aria-valuenow={totalProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="업로드 진행률"
                      >
                        <motion.div
                          className="h-full bg-[var(--color-primary)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${totalProgress}%` }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                        />
                      </div>
                    </div>
                    <p className="text-center text-xs text-[var(--color-text-light)]">
                      {queueState.currentFile
                        ? `${queueState.currentFile.name} 업로드 중...`
                        : `${uploadedCount}/${selectedFiles.length}개 완료`}
                    </p>
                  </motion.div>
                )}

                {/* Ready to upload state */}
                {!isUploading && !uploadComplete && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSessionLoading || !!sessionError}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-medium transition-colors',
                      isSessionLoading || sessionError
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                    )}
                    onClick={() => {
                      if (!session) {
                        console.error('No session available');
                        return;
                      }
                      haptic.medium();
                      setIsUploading(true);
                      addFiles(selectedFiles);
                      startUpload();
                      toast.info('업로드를 시작합니다', {
                        description: `${selectedFiles.length}개 파일`,
                      });
                    }}
                  >
                    {isSessionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        세션 생성 중...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {selectedFiles.length}개 파일 업로드하기
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
