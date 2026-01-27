/**
 * UploadQueue Component
 * Visual list of all files in queue with status management
 * Based on SPEC-GUESTSNAP-001 M3.4
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  Image as ImageIcon,
  Video,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GuestSnapFile, GuestSnapFileStatus } from '@/types/guestsnap';

interface UploadQueueProps {
  /** All files in the queue */
  files: GuestSnapFile[];
  /** Currently uploading file */
  currentFile: GuestSnapFile | null;
  /** Callback to retry a single file */
  onRetryFile?: (fileId: string) => void;
  /** Callback to retry all failed files */
  onRetryAllFailed?: () => void;
  /** Callback to remove a file */
  onRemoveFile?: (fileId: string) => void;
  /** Callback to clear completed files */
  onClearCompleted?: () => void;
  /** Whether to show in compact mode */
  compact?: boolean;
}

// Status configuration
const STATUS_CONFIG: Record<
  GuestSnapFileStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    label: '대기중',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    icon: <Clock className="h-4 w-4" />,
  },
  uploading: {
    label: '업로드중',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
  },
  completed: {
    label: '완료',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    icon: <Check className="h-4 w-4" />,
  },
  failed: {
    label: '실패',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  cancelled: {
    label: '취소됨',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-200',
    icon: <X className="h-4 w-4" />,
  },
};

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// Individual queue item component
function QueueItem({
  file,
  isCurrentFile,
  onRetry,
  onRemove,
  compact,
}: {
  file: GuestSnapFile;
  isCurrentFile?: boolean;
  onRetry?: () => void;
  onRemove?: () => void;
  compact?: boolean;
}) {
  const config = STATUS_CONFIG[file.status];
  const FileTypeIcon = file.type === 'video' ? Video : ImageIcon;

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          'flex items-center gap-2 rounded-lg border p-2',
          config.borderColor,
          config.bgColor,
          isCurrentFile && 'ring-2 ring-[var(--color-primary)]/50'
        )}
      >
        {/* Thumbnail or icon */}
        <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100 shrink-0">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <FileTypeIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          {/* Status overlay for uploading */}
          {file.status === 'uploading' && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--color-text)] truncate">
            {file.name}
          </p>
          <div className="flex items-center gap-2">
            <span className={cn('text-xs', config.textColor)}>
              {config.label}
            </span>
            {file.status === 'uploading' && (
              <span className="text-xs text-blue-500">{file.progress}%</span>
            )}
          </div>
        </div>

        {/* Actions */}
        {file.status === 'failed' && onRetry && (
          <button
            onClick={onRetry}
            className="p-1 rounded hover:bg-white/50 text-red-500"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'group relative rounded-xl border p-4 transition-all',
        config.borderColor,
        config.bgColor,
        isCurrentFile && 'ring-2 ring-[var(--color-primary)]'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail or icon */}
        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <FileTypeIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
          {/* Status overlay */}
          {file.status === 'uploading' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-white text-xs font-bold">{file.progress}%</div>
            </div>
          )}
          {file.status === 'completed' && (
            <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-[var(--color-text)] truncate">
              {file.name}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--color-text-light)]">
              {formatFileSize(file.size)}
            </span>
            <span className="text-gray-300">|</span>
            <span className={cn('flex items-center gap-1', config.textColor)}>
              {config.icon}
              {config.label}
            </span>
            {file.retryCount > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-amber-500">재시도 {file.retryCount}회</span>
              </>
            )}
          </div>
          {/* Error message */}
          {file.status === 'failed' && file.error && (
            <p className="text-xs text-red-500 mt-1 truncate">{file.error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {file.status === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="p-2 rounded-lg hover:bg-white text-[var(--color-primary)] transition-colors"
              title="다시 시도"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          {(file.status === 'pending' || file.status === 'failed' || file.status === 'completed') &&
            onRemove && (
              <button
                onClick={onRemove}
                className="p-2 rounded-lg hover:bg-white text-gray-400 hover:text-red-500 transition-colors"
                title="삭제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
        </div>
      </div>

      {/* Progress bar for uploading */}
      {file.status === 'uploading' && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-blue-200 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${file.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Section header component (extracted to avoid re-creation on render)
function SectionHeader({
  title,
  count,
  section,
  isExpanded,
  onToggle,
  action,
}: {
  title: string;
  count: number;
  section: string;
  isExpanded: boolean;
  onToggle: (section: string) => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <button
        onClick={() => onToggle(section)}
        className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
        {title}
        <span className="text-xs font-normal text-[var(--color-text-light)]">
          ({count})
        </span>
      </button>
      {action}
    </div>
  );
}

/**
 * Main UploadQueue component
 */
export function UploadQueue({
  files,
  currentFile,
  onRetryFile,
  onRetryAllFailed,
  onRemoveFile,
  onClearCompleted,
  compact = false,
}: UploadQueueProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['uploading', 'pending', 'failed'])
  );

  // Categorize files
  const categorizedFiles = useMemo(() => {
    const pending = files.filter((f) => f.status === 'pending');
    const uploading = currentFile ? [currentFile] : [];
    const completed = files.filter((f) => f.status === 'completed');
    const failed = files.filter((f) => f.status === 'failed');

    return { pending, uploading, completed, failed };
  }, [files, currentFile]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  if (files.length === 0 && !currentFile) {
    return (
      <div className="text-center py-8 text-[var(--color-text-light)]">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">업로드 대기 중인 파일이 없어요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Uploading section */}
      {categorizedFiles.uploading.length > 0 && (
        <div>
          <SectionHeader
            title="업로드 중"
            count={categorizedFiles.uploading.length}
            section="uploading"
            isExpanded={expandedSections.has('uploading')}
            onToggle={toggleSection}
          />
          <AnimatePresence>
            {expandedSections.has('uploading') && (
              <div className="space-y-2">
                {categorizedFiles.uploading.map((file) => (
                  <QueueItem
                    key={file.id}
                    file={file}
                    isCurrentFile
                    compact={compact}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pending section */}
      {categorizedFiles.pending.length > 0 && (
        <div>
          <SectionHeader
            title="대기 중"
            count={categorizedFiles.pending.length}
            section="pending"
            isExpanded={expandedSections.has('pending')}
            onToggle={toggleSection}
          />
          <AnimatePresence>
            {expandedSections.has('pending') && (
              <div className="space-y-2">
                {categorizedFiles.pending.map((file) => (
                  <QueueItem
                    key={file.id}
                    file={file}
                    onRemove={onRemoveFile ? () => onRemoveFile(file.id) : undefined}
                    compact={compact}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Failed section */}
      {categorizedFiles.failed.length > 0 && (
        <div>
          <SectionHeader
            title="실패"
            count={categorizedFiles.failed.length}
            section="failed"
            isExpanded={expandedSections.has('failed')}
            onToggle={toggleSection}
            action={
              onRetryAllFailed && (
                <button
                  onClick={onRetryAllFailed}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  모두 재시도
                </button>
              )
            }
          />
          <AnimatePresence>
            {expandedSections.has('failed') && (
              <div className="space-y-2">
                {categorizedFiles.failed.map((file) => (
                  <QueueItem
                    key={file.id}
                    file={file}
                    onRetry={onRetryFile ? () => onRetryFile(file.id) : undefined}
                    onRemove={onRemoveFile ? () => onRemoveFile(file.id) : undefined}
                    compact={compact}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Completed section */}
      {categorizedFiles.completed.length > 0 && (
        <div>
          <SectionHeader
            title="완료"
            count={categorizedFiles.completed.length}
            section="completed"
            isExpanded={expandedSections.has('completed')}
            onToggle={toggleSection}
            action={
              onClearCompleted && (
                <button
                  onClick={onClearCompleted}
                  className="flex items-center gap-1 text-xs text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  모두 삭제
                </button>
              )
            }
          />
          <AnimatePresence>
            {expandedSections.has('completed') && (
              <div className="space-y-2">
                {categorizedFiles.completed.map((file) => (
                  <QueueItem
                    key={file.id}
                    file={file}
                    onRemove={onRemoveFile ? () => onRemoveFile(file.id) : undefined}
                    compact={compact}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Minimal queue summary for header display
 */
export function QueueSummary({
  pendingCount,
  uploadingCount,
  completedCount,
  failedCount,
}: {
  pendingCount: number;
  uploadingCount: number;
  completedCount: number;
  failedCount: number;
}) {
  return (
    <div className="flex items-center gap-3 text-xs">
      {uploadingCount > 0 && (
        <span className="flex items-center gap-1 text-blue-600">
          <Loader2 className="h-3 w-3 animate-spin" />
          {uploadingCount}
        </span>
      )}
      {pendingCount > 0 && (
        <span className="flex items-center gap-1 text-gray-500">
          <Clock className="h-3 w-3" />
          {pendingCount}
        </span>
      )}
      {completedCount > 0 && (
        <span className="flex items-center gap-1 text-green-600">
          <Check className="h-3 w-3" />
          {completedCount}
        </span>
      )}
      {failedCount > 0 && (
        <span className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-3 w-3" />
          {failedCount}
        </span>
      )}
    </div>
  );
}
