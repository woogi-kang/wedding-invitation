'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Film, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GuestSnapFile } from '@/types/guestsnap';

interface FilePreviewProps {
  file: GuestSnapFile;
  onRemove?: () => void;
  showStatus?: boolean;
  /** Show skeleton loader while thumbnail is loading */
  showSkeleton?: boolean;
}

/**
 * Skeleton loader for thumbnail
 */
function ThumbnailSkeleton() {
  return (
    <div className="h-full w-full animate-pulse bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-botanical-light)]">
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10" />
      </div>
    </div>
  );
}

/**
 * FilePreview - Thumbnail preview for selected/uploading files
 */
export const FilePreview = memo(function FilePreview({
  file,
  onRemove,
  showStatus = false,
  showSkeleton = false,
}: FilePreviewProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // Check if this is a HEIC/HEIF file that may not render
  const isHeicFile = file.mimeType?.includes('heic') || file.mimeType?.includes('heif') ||
    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

  // Get status badge color
  const getStatusColor = () => {
    switch (file.status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Determine what to show for thumbnail
  const shouldShowPlaceholder = !file.thumbnail || imageError || isHeicFile;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--color-secondary)]"
      role="listitem"
      aria-label={`${file.type === 'video' ? '영상' : '사진'} 파일: ${file.name}, 크기: ${formatFileSize(file.size)}`}
    >
      {/* Skeleton loader */}
      {showSkeleton && !isImageLoaded && file.thumbnail && !shouldShowPlaceholder && (
        <ThumbnailSkeleton />
      )}

      {/* Thumbnail or placeholder */}
      {file.thumbnail && !shouldShowPlaceholder ? (
        <img
          src={file.thumbnail}
          alt={file.name}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-200',
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-botanical-light)]">
          {file.type === 'video' ? (
            <Film className="h-8 w-8 text-[var(--color-primary)]/60" aria-hidden="true" />
          ) : isHeicFile ? (
            // Special HEIC indicator
            <div className="flex flex-col items-center">
              <ImageIcon className="h-6 w-6 text-[var(--color-primary)]/60" aria-hidden="true" />
              <span className="text-[8px] text-[var(--color-primary)]/60 mt-0.5">HEIC</span>
            </div>
          ) : (
            <ImageIcon className="h-8 w-8 text-[var(--color-primary)]/60" aria-hidden="true" />
          )}
        </div>
      )}

      {/* Video indicator badge */}
      {file.type === 'video' && (
        <div
          className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5"
          aria-hidden="true"
        >
          <Film className="h-3 w-3 text-white" />
          <span className="text-[10px] text-white">영상</span>
        </div>
      )}

      {/* File size badge */}
      <div
        className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5"
        aria-hidden="true"
      >
        <span className="text-[10px] text-white">{formatFileSize(file.size)}</span>
      </div>

      {/* Upload progress overlay */}
      {showStatus && file.status === 'uploading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12 -rotate-90 transform">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${(file.progress / 100) * 125.6} 125.6`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {file.progress}%
            </span>
          </div>
        </div>
      )}

      {/* Status badge */}
      {showStatus && file.status !== 'pending' && file.status !== 'uploading' && (
        <div
          className={cn(
            'absolute left-1 top-1 rounded-full p-1',
            getStatusColor()
          )}
        >
          {file.status === 'completed' && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {file.status === 'failed' && (
            <X className="h-3 w-3 text-white" />
          )}
        </div>
      )}

      {/* Remove button */}
      {onRemove && file.status !== 'uploading' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="파일 제거"
        >
          <X className="h-3 w-3" />
        </motion.button>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
    </motion.div>
  );
});
