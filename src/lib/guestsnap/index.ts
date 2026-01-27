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

// Synology NAS client
export {
  authenticate,
  logout,
  folderExists,
  createFolder,
  listFolders,
  getUniqueGuestFolderName,
  createGuestFolder,
  uploadFile,
  checkNasStatus,
  getGuestUploadCount,
} from './synology-client';

// Queue manager (client-side only)
export {
  queueManager,
  QueueManager,
  type QueueItem,
  type SessionData,
} from './queue-manager';
