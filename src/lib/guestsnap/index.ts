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

export {
  validateUploadMetadataServer,
  type UploadMetadataValidationResult,
} from './upload-metadata';

// Google Drive client
export {
  createGuestFolder,
  uploadFile,
  createResumableUploadSession,
  verifyGuestFolderFile,
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
