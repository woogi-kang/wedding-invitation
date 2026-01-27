// Guest Snap feature type definitions
// Based on SPEC-GUESTSNAP-001

/**
 * File type classification for uploaded media
 */
export type GuestSnapFileType = 'image' | 'video';

/**
 * Status of individual file in the upload queue
 */
export type GuestSnapFileStatus =
  | 'pending' // In queue, waiting
  | 'uploading' // Currently uploading
  | 'completed' // Successfully uploaded
  | 'failed' // Upload failed (after retries)
  | 'cancelled'; // Cancelled by user

/**
 * Individual file in the upload queue
 */
export interface GuestSnapFile {
  /** Unique identifier for the file */
  id: string;
  /** Original file name */
  name: string;
  /** File size in bytes */
  size: number;
  /** File type classification */
  type: GuestSnapFileType;
  /** MIME type of the file */
  mimeType: string;
  /** Current upload status */
  status: GuestSnapFileStatus;
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Error message if upload failed */
  error?: string;
  /** Number of retry attempts */
  retryCount: number;
  /** Timestamp when file was added to queue */
  createdAt: Date;
  /** Timestamp when file was successfully uploaded */
  uploadedAt?: Date;
  /** Thumbnail data URL for preview (images only) */
  thumbnail?: string;
  /** Reference to the actual File object for retry functionality */
  file?: File;
}

/**
 * Guest session information
 */
export interface GuestSnapSession {
  /** Session identifier */
  id: string;
  /** Guest's name (Korean or English) */
  guestName: string;
  /** Number of files uploaded in this session */
  uploadCount: number;
  /** Maximum allowed uploads */
  uploadLimit: number;
  /** NAS folder path for this guest */
  guestFolder: string;
  /** Files in the current session */
  files: GuestSnapFile[];
  /** Session creation timestamp */
  createdAt: Date;
  /** Session expiration timestamp */
  expiresAt: Date;
}

/**
 * Upload queue state
 */
export interface UploadQueueState {
  /** Whether the queue is currently processing */
  isProcessing: boolean;
  /** Currently uploading file */
  currentFile: GuestSnapFile | null;
  /** Files waiting to be uploaded */
  queue: GuestSnapFile[];
  /** Successfully uploaded files */
  completed: GuestSnapFile[];
  /** Failed files (after max retries) */
  failed: GuestSnapFile[];
}

/**
 * Upload state machine states
 */
export type UploadState =
  | 'idle' // No uploads in progress
  | 'selecting' // User selecting files
  | 'validating' // Validating selected files
  | 'uploading' // Upload in progress
  | 'paused' // Paused (offline or user action)
  | 'completed' // All uploads completed
  | 'error'; // Fatal error state

/**
 * Modal state for the upload flow
 */
export type GuestSnapModalState =
  | 'closed' // All modals closed
  | 'name' // Name input modal (FIRST STEP)
  | 'upload' // File upload modal (SECOND STEP)
  | 'progress' // Upload progress view
  | 'complete'; // Upload complete view

/**
 * API Response types
 */
export interface UploadResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  uploadedAt?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface SessionResponse {
  success: boolean;
  sessionId: string;
  guestName: string;
  guestFolder: string;
  uploadCount: number;
  uploadLimit: number;
  expiresAt: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface StatusResponse {
  serviceEnabled: boolean;
  storageAvailable: boolean;
  currentUploads: number;
  maxConcurrentUploads: number;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  file: File;
  error?: string;
  type?: GuestSnapFileType;
}
