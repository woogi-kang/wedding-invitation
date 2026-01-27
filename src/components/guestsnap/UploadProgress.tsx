/**
 * UploadProgress Component
 * Detailed progress UI for file uploads
 * Based on SPEC-GUESTSNAP-001 M3.2
 */

'use client';

import { motion } from 'framer-motion';
import { Check, X, Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { usePrefersReducedMotion, getStaggerConfig } from '@/hooks/useHapticFeedback';
import type { GuestSnapFile, GuestSnapFileStatus } from '@/types/guestsnap';

interface UploadProgressProps {
  /** Files in the upload queue */
  files: GuestSnapFile[];
  /** Currently uploading file */
  currentFile: GuestSnapFile | null;
  /** Number of completed uploads */
  completedCount: number;
  /** Number of failed uploads */
  failedCount: number;
  /** Overall progress percentage */
  totalProgress: number;
  /** Whether currently offline */
  isOffline?: boolean;
  /** Current retry attempt (if retrying) */
  currentRetryAttempt?: number;
  /** Callback to retry a failed file */
  onRetryFile?: (fileId: string) => void;
  /** Callback to retry all failed files */
  onRetryAll?: () => void;
  /** Callback to remove a file */
  onRemoveFile?: (fileId: string) => void;
}

// Status badge component
function StatusBadge({ status }: { status: GuestSnapFileStatus }) {
  const statusConfig = {
    pending: {
      label: '대기중',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      icon: null,
    },
    uploading: {
      label: '업로드중',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    completed: {
      label: '완료',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      icon: <Check className="h-3 w-3" />,
    },
    failed: {
      label: '실패',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      icon: <AlertCircle className="h-3 w-3" />,
    },
    cancelled: {
      label: '취소됨',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500',
      icon: <X className="h-3 w-3" />,
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        config.bgColor,
        config.textColor
      )}
      role="status"
      aria-label={`상태: ${config.label}`}
    >
      {config.icon && <span aria-hidden="true">{config.icon}</span>}
      {config.label}
    </span>
  );
}

// Individual file progress item
function FileProgressItem({
  file,
  isCurrentFile,
  onRetry,
  onRemove,
}: {
  file: GuestSnapFile;
  isCurrentFile?: boolean;
  onRetry?: () => void;
  onRemove?: () => void;
}) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      role="listitem"
      aria-label={`${file.name}, ${formatFileSize(file.size)}, 상태: ${file.status === 'pending' ? '대기중' : file.status === 'uploading' ? '업로드중' : file.status === 'completed' ? '완료' : file.status === 'failed' ? '실패' : '취소됨'}`}
      className={cn(
        'rounded-lg border p-3 transition-colors',
        isCurrentFile
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
          : 'border-gray-200 bg-white'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--color-text)] truncate">
              {file.name}
            </p>
            <StatusBadge status={file.status} />
          </div>
          <p className="text-xs text-[var(--color-text-light)] mt-0.5">
            {formatFileSize(file.size)}
            {file.retryCount > 0 && (
              <span className="ml-2 text-amber-600">
                재시도 {file.retryCount}회
              </span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {file.status === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="p-1.5 rounded-full hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors"
              title="다시 시도"
              aria-label={`${file.name} 다시 업로드`}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {(file.status === 'pending' || file.status === 'failed') && onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="삭제"
              aria-label={`${file.name} 삭제`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for uploading files */}
      {(file.status === 'uploading' || isCurrentFile) && (
        <div className="mt-2">
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${file.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-[var(--color-text-light)] mt-1 text-right">
            {file.progress}%
          </p>
        </div>
      )}

      {/* Error message */}
      {file.status === 'failed' && file.error && (
        <p className="text-xs text-red-500 mt-2">{file.error}</p>
      )}
    </motion.div>
  );
}

/**
 * Main UploadProgress component
 */
export function UploadProgress({
  files,
  currentFile,
  completedCount,
  failedCount,
  totalProgress,
  isOffline = false,
  currentRetryAttempt,
  onRetryFile,
  onRetryAll,
  onRemoveFile,
}: UploadProgressProps) {
  const { messages } = GUEST_SNAP_CONFIG;
  const totalFiles = files.length;
  const pendingCount = files.filter((f) => f.status === 'pending').length;

  // Accessibility and animation hooks
  const prefersReducedMotion = usePrefersReducedMotion();
  const staggerConfig = getStaggerConfig(prefersReducedMotion);

  return (
    <div className="space-y-4">
      {/* Offline indicator */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-amber-50 border border-amber-200 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <WifiOff className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">
                {messages.offlineTitle}
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {messages.offlineSubtitle}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overall progress */}
      <div className="rounded-xl bg-[var(--color-secondary)]/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isOffline ? (
              <WifiOff className="h-4 w-4 text-amber-500" />
            ) : (
              <Wifi className="h-4 w-4 text-green-500" />
            )}
            <span className="text-sm font-medium text-[var(--color-text)]">
              {isOffline
                ? '업로드 일시 중지'
                : currentRetryAttempt
                  ? messages.retryingText
                      .replace('{{attempt}}', currentRetryAttempt.toString())
                  : messages.uploadingTitle}
            </span>
          </div>
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {totalProgress}%
          </span>
        </div>

        {/* Main progress bar */}
        <div
          className="h-3 rounded-full bg-white overflow-hidden shadow-inner"
          role="progressbar"
          aria-valuenow={totalProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`업로드 진행률 ${totalProgress}%`}
        >
          <motion.div
            className={cn(
              'h-full rounded-full',
              isOffline ? 'bg-amber-400' : 'bg-[var(--color-primary)]'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-2 text-xs text-[var(--color-text-light)]">
          <span>
            {completedCount}/{totalFiles} 완료
            {failedCount > 0 && (
              <span className="text-red-500 ml-2">({failedCount}개 실패)</span>
            )}
          </span>
          {pendingCount > 0 && (
            <span>{pendingCount}개 대기중</span>
          )}
        </div>
      </div>

      {/* Failed files section with retry all button */}
      {failedCount > 0 && onRetryAll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 p-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">
              {failedCount}개 파일 업로드 실패
            </span>
          </div>
          <button
            onClick={onRetryAll}
            className="flex items-center gap-1 rounded-lg bg-red-100 hover:bg-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            모두 다시 시도
          </button>
        </motion.div>
      )}

      {/* File list */}
      <motion.div
        className="space-y-2 max-h-60 overflow-y-auto"
        role="list"
        aria-label="업로드 파일 목록"
        variants={staggerConfig.container}
        initial="initial"
        animate="animate"
      >
        {/* Current file first */}
        {currentFile && (
          <FileProgressItem
            file={currentFile}
            isCurrentFile
          />
        )}

        {/* Rest of the files */}
        {files
          .filter((f) => f.id !== currentFile?.id)
          .map((file) => (
            <FileProgressItem
              key={file.id}
              file={file}
              onRetry={onRetryFile ? () => onRetryFile(file.id) : undefined}
              onRemove={onRemoveFile ? () => onRemoveFile(file.id) : undefined}
            />
          ))}
      </motion.div>
    </div>
  );
}

/**
 * Compact progress indicator for header/minimal display
 */
export function UploadProgressCompact({
  completedCount,
  totalCount,
  progress,
  isOffline,
}: {
  completedCount: number;
  totalCount: number;
  progress: number;
  isOffline?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden min-w-[100px]">
        <motion.div
          className={cn(
            'h-full rounded-full',
            isOffline ? 'bg-amber-400' : 'bg-[var(--color-primary)]'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="text-sm text-[var(--color-text-light)] whitespace-nowrap">
        {completedCount}/{totalCount}
      </span>
      {isOffline && (
        <WifiOff className="h-4 w-4 text-amber-500" />
      )}
    </div>
  );
}
