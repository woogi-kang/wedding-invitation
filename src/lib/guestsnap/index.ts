/**
 * Guest Snap library exports
 * Server-side utilities for the Guest Snap feature
 */

// File validation utilities
export {
  sanitizeGuestName,
  sanitizeFileName,
  generateUniqueFileName,
  getFileType,
  validateExtension,
  validateFileSize,
  validateMagicBytes,
  validateFileServer,
  validateFileClient,
  checkRateLimit,
  validateGuestName,
} from './file-validator';

// Google Drive client
export {
  createGuestFolder,
  uploadFile,
  checkStorageStatus,
  getGuestUploadCount,
} from './google-drive-client';

// Queue manager (client-side only)
export {
  queueManager,
  QueueManager,
  type QueueItem,
  type SessionData,
} from './queue-manager';
