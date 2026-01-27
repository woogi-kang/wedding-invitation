/**
 * File validation utilities for Guest Snap feature
 * Server-side and client-side file validation
 */

import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type { GuestSnapFileType, FileValidationResult } from '@/types/guestsnap';

// Magic bytes for file type validation
const MAGIC_BYTES: Record<string, number[][]> = {
  // JPEG
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  // PNG
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  // WebP
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header (WebP starts with RIFF)
  // HEIC (various signatures)
  'image/heic': [
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // ftyp at offset 4
    [0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70],
  ],
  // MP4
  'video/mp4': [
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70],
  ],
  // QuickTime MOV
  'video/quicktime': [
    [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70],
    [0x6d, 0x6f, 0x6f, 0x76], // moov
  ],
};

// Dangerous file extensions that should never be allowed
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.sh', '.js', '.php', '.py', '.rb', '.pl',
  '.cmd', '.com', '.scr', '.msi', '.vbs', '.ps1', '.jar',
  '.app', '.dmg', '.apk', '.deb', '.rpm',
];

/**
 * Sanitize guest name for folder creation
 * Removes special characters, keeps Korean/English/numbers/spaces/hyphens
 */
export function sanitizeGuestName(name: string): string {
  return name
    .trim()
    // Allow Korean, English letters, numbers, spaces, and hyphens
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Limit length for folder name
    .substring(0, 30)
    .trim();
}

/**
 * Sanitize filename for upload
 * Preserves extension, sanitizes the base name
 */
export function sanitizeFileName(name: string): string {
  const lastDotIndex = name.lastIndexOf('.');
  const extension = lastDotIndex > 0 ? name.substring(lastDotIndex) : '';
  const baseName = lastDotIndex > 0 ? name.substring(0, lastDotIndex) : name;

  const sanitizedBase = baseName
    // Allow Korean, English letters, numbers, underscores, hyphens
    .replace(/[^\p{L}\p{N}_-]/gu, '_')
    // Replace multiple underscores with single
    .replace(/_+/g, '_')
    // Limit length
    .substring(0, 80);

  return (sanitizedBase + extension.toLowerCase()).substring(0, 100);
}

/**
 * Generate unique filename with timestamp
 * Format: {TYPE}_{SEQ}_{TIMESTAMP}.{EXT}
 */
export function generateUniqueFileName(
  originalName: string,
  fileType: GuestSnapFileType,
  sequence: number = 1
): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'dat';
  const timestamp = Date.now();
  const prefix = fileType === 'image' ? 'IMG' : 'VID';

  return `${prefix}_${String(sequence).padStart(3, '0')}_${timestamp}.${extension}`;
}

/**
 * Determine file type from MIME type
 */
export function getFileType(mimeType: string): GuestSnapFileType | null {
  const { allowedTypes } = GUEST_SNAP_CONFIG;

  if (allowedTypes.images.includes(mimeType)) {
    return 'image';
  }
  if (allowedTypes.videos.includes(mimeType)) {
    return 'video';
  }

  return null;
}

/**
 * Validate file extension
 */
export function validateExtension(filename: string): boolean {
  const { allowedExtensions } = GUEST_SNAP_CONFIG;
  const extension = `.${filename.split('.').pop()?.toLowerCase()}`;

  // Check against dangerous extensions first
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    return false;
  }

  return allowedExtensions.includes(extension);
}

/**
 * Validate file size
 */
export function validateFileSize(
  size: number,
  fileType: GuestSnapFileType
): { valid: boolean; error?: string } {
  const { limits } = GUEST_SNAP_CONFIG;

  if (size === 0) {
    return { valid: false, error: '파일이 비어있어요' };
  }

  const sizeMB = size / (1024 * 1024);

  if (fileType === 'image' && sizeMB > limits.maxImageSizeMB) {
    return {
      valid: false,
      error: `사진 파일이 너무 커요 (최대 ${limits.maxImageSizeMB}MB)`,
    };
  }

  if (fileType === 'video' && sizeMB > limits.maxVideoSizeMB) {
    return {
      valid: false,
      error: `영상 파일이 너무 커요 (최대 ${limits.maxVideoSizeMB}MB)`,
    };
  }

  return { valid: true };
}

/**
 * Validate magic bytes to verify file type matches content
 * This prevents extension spoofing attacks
 */
export async function validateMagicBytes(
  buffer: ArrayBuffer,
  claimedMimeType: string
): Promise<boolean> {
  const signatures = MAGIC_BYTES[claimedMimeType];

  // If we don't have signatures for this type, allow it (but validate other ways)
  if (!signatures) {
    return true;
  }

  const bytes = new Uint8Array(buffer.slice(0, 20));

  return signatures.some((signature) => {
    return signature.every((byte, index) => bytes[index] === byte);
  });
}

/**
 * Validate a file on the server side
 * More thorough validation including magic bytes
 */
export async function validateFileServer(
  file: File
): Promise<FileValidationResult> {
  const { messages } = GUEST_SNAP_CONFIG;

  // Check filename
  if (!file.name || file.name.trim() === '') {
    return { valid: false, file, error: '파일 이름이 없어요' };
  }

  // Check extension
  if (!validateExtension(file.name)) {
    return { valid: false, file, error: messages.invalidFileType };
  }

  // Check MIME type and determine file type
  const fileType = getFileType(file.type);
  if (!fileType) {
    return { valid: false, file, error: messages.invalidFileType };
  }

  // Check file size
  const sizeValidation = validateFileSize(file.size, fileType);
  if (!sizeValidation.valid) {
    return { valid: false, file, error: sizeValidation.error };
  }

  // Validate magic bytes (first 20 bytes)
  try {
    const headerBuffer = await file.slice(0, 20).arrayBuffer();
    const magicBytesValid = await validateMagicBytes(headerBuffer, file.type);

    if (!magicBytesValid) {
      return {
        valid: false,
        file,
        error: '파일 형식이 올바르지 않아요',
      };
    }
  } catch {
    // If we can't read the file, fail validation
    return { valid: false, file, error: '파일을 읽을 수 없어요' };
  }

  return { valid: true, file, type: fileType };
}

/**
 * Validate a file on the client side (quick validation)
 * Used for immediate feedback before upload
 */
export function validateFileClient(file: File): FileValidationResult {
  const { messages } = GUEST_SNAP_CONFIG;

  // Check filename
  if (!file.name || file.name.trim() === '') {
    return { valid: false, file, error: '파일 이름이 없어요' };
  }

  // Check extension
  if (!validateExtension(file.name)) {
    return { valid: false, file, error: messages.invalidFileType };
  }

  // Check MIME type and determine file type
  const fileType = getFileType(file.type);
  if (!fileType) {
    return { valid: false, file, error: messages.invalidFileType };
  }

  // Check file size
  const sizeValidation = validateFileSize(file.size, fileType);
  if (!sizeValidation.valid) {
    return { valid: false, file, error: sizeValidation.error };
  }

  return { valid: true, file, type: fileType };
}

/**
 * Rate limiting state (in-memory for serverless)
 * In production, consider using Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for a given IP or session
 * Returns true if request is allowed
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    // New window
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  rateLimitMap.set(identifier, record);

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Validate guest name for session creation
 */
export function validateGuestName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: '존함을 입력해주세요' };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: '2글자 이상 입력해주세요' };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: '20글자 이하로 입력해주세요' };
  }

  // Allow only Korean, English, numbers, spaces, and hyphens
  const validPattern = /^[\p{L}\p{N}\s-]+$/u;
  if (!validPattern.test(trimmed)) {
    return { valid: false, error: '한글, 영문, 숫자만 입력 가능해요' };
  }

  return { valid: true };
}
