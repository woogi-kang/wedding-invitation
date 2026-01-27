/**
 * Queue Manager with IndexedDB Persistence
 * Manages upload queue with persistence for offline support and recovery
 * Based on SPEC-GUESTSNAP-001 M3.1
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { GuestSnapFile, GuestSnapFileStatus } from '@/types/guestsnap';

// Database schema for IndexedDB
interface GuestSnapQueueDB extends DBSchema {
  uploads: {
    key: string;
    value: QueueItem;
    indexes: {
      'by-status': GuestSnapFileStatus;
      'by-created': Date;
    };
  };
  session: {
    key: string;
    value: SessionData;
  };
}

// Queue item stored in IndexedDB
export interface QueueItem {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'video';
  mimeType: string;
  status: GuestSnapFileStatus;
  progress: number;
  error?: string;
  retryCount: number;
  createdAt: Date;
  uploadedAt?: Date;
  thumbnail?: string;
  // File blob stored as ArrayBuffer for persistence
  fileData?: ArrayBuffer;
}

// Session data stored in IndexedDB
export interface SessionData {
  sessionId: string;
  guestName: string;
  guestFolder: string;
  uploadCount: number;
  uploadLimit: number;
  expiresAt: string;
  createdAt: string;
}

// BroadcastChannel for multi-tab coordination
const BROADCAST_CHANNEL_NAME = 'guestsnap-queue';

// Database name and version
const DB_NAME = 'guestsnap-queue';
const DB_VERSION = 1;

// Singleton database instance
let dbPromise: Promise<IDBPDatabase<GuestSnapQueueDB>> | null = null;

/**
 * Get or create database connection
 */
async function getDB(): Promise<IDBPDatabase<GuestSnapQueueDB>> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in browser environment');
  }

  if (!dbPromise) {
    dbPromise = openDB<GuestSnapQueueDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create uploads store
        if (!db.objectStoreNames.contains('uploads')) {
          const uploadStore = db.createObjectStore('uploads', { keyPath: 'id' });
          uploadStore.createIndex('by-status', 'status');
          uploadStore.createIndex('by-created', 'createdAt');
        }

        // Create session store
        if (!db.objectStoreNames.contains('session')) {
          db.createObjectStore('session', { keyPath: 'sessionId' });
        }
      },
      blocked() {
        console.warn('GuestSnap queue database blocked by older version');
      },
      blocking() {
        console.warn('GuestSnap queue database is blocking a newer version');
      },
      terminated() {
        console.error('GuestSnap queue database connection terminated');
        dbPromise = null;
      },
    });
  }

  return dbPromise;
}

/**
 * Convert File to ArrayBuffer for storage
 */
async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert ArrayBuffer back to File
 */
function arrayBufferToFile(buffer: ArrayBuffer, name: string, mimeType: string): File {
  const blob = new Blob([buffer], { type: mimeType });
  return new File([blob], name, { type: mimeType });
}

/**
 * Convert GuestSnapFile to QueueItem for storage
 */
async function toQueueItem(file: GuestSnapFile): Promise<QueueItem> {
  const item: QueueItem = {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    mimeType: file.mimeType,
    status: file.status,
    progress: file.progress,
    error: file.error,
    retryCount: file.retryCount,
    createdAt: file.createdAt,
    uploadedAt: file.uploadedAt,
    thumbnail: file.thumbnail,
  };

  // Store file data if available
  if (file.file) {
    try {
      item.fileData = await fileToArrayBuffer(file.file);
    } catch (error) {
      console.error('Failed to convert file to ArrayBuffer:', error);
    }
  }

  return item;
}

/**
 * Convert QueueItem back to GuestSnapFile
 */
function fromQueueItem(item: QueueItem): GuestSnapFile {
  const file: GuestSnapFile = {
    id: item.id,
    name: item.name,
    size: item.size,
    type: item.type,
    mimeType: item.mimeType,
    status: item.status,
    progress: item.progress,
    error: item.error,
    retryCount: item.retryCount,
    createdAt: new Date(item.createdAt),
    uploadedAt: item.uploadedAt ? new Date(item.uploadedAt) : undefined,
    thumbnail: item.thumbnail,
  };

  // Restore File object if data is available
  if (item.fileData) {
    file.file = arrayBufferToFile(item.fileData, item.name, item.mimeType);
  }

  return file;
}

/**
 * Queue Manager class for managing upload queue
 */
export class QueueManager {
  private broadcastChannel: BroadcastChannel | null = null;
  private onQueueUpdate: ((items: GuestSnapFile[]) => void) | null = null;

  constructor() {
    // Initialize BroadcastChannel for multi-tab coordination
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'queue-update') {
          this.notifyQueueUpdate();
        }
      };
    }
  }

  /**
   * Set callback for queue updates
   */
  setOnQueueUpdate(callback: (items: GuestSnapFile[]) => void): void {
    this.onQueueUpdate = callback;
  }

  /**
   * Broadcast queue update to other tabs
   */
  private broadcastUpdate(): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'queue-update' });
    }
  }

  /**
   * Notify listeners about queue update
   */
  private async notifyQueueUpdate(): Promise<void> {
    if (this.onQueueUpdate) {
      const items = await this.getAllItems();
      this.onQueueUpdate(items);
    }
  }

  /**
   * Add a file to the queue
   */
  async addItem(file: GuestSnapFile): Promise<void> {
    const db = await getDB();
    const item = await toQueueItem(file);
    await db.put('uploads', item);
    this.broadcastUpdate();
    await this.notifyQueueUpdate();
  }

  /**
   * Add multiple files to the queue
   */
  async addItems(files: GuestSnapFile[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('uploads', 'readwrite');

    for (const file of files) {
      const item = await toQueueItem(file);
      tx.store.put(item);
    }

    await tx.done;
    this.broadcastUpdate();
    await this.notifyQueueUpdate();
  }

  /**
   * Get a single item by ID
   */
  async getItem(id: string): Promise<GuestSnapFile | null> {
    const db = await getDB();
    const item = await db.get('uploads', id);
    return item ? fromQueueItem(item) : null;
  }

  /**
   * Get all items in the queue
   */
  async getAllItems(): Promise<GuestSnapFile[]> {
    const db = await getDB();
    const items = await db.getAll('uploads');
    return items.map(fromQueueItem);
  }

  /**
   * Get items by status
   */
  async getItemsByStatus(status: GuestSnapFileStatus): Promise<GuestSnapFile[]> {
    const db = await getDB();
    const items = await db.getAllFromIndex('uploads', 'by-status', status);
    return items.map(fromQueueItem);
  }

  /**
   * Get pending items (not yet uploaded)
   */
  async getPendingItems(): Promise<GuestSnapFile[]> {
    return this.getItemsByStatus('pending');
  }

  /**
   * Get failed items
   */
  async getFailedItems(): Promise<GuestSnapFile[]> {
    return this.getItemsByStatus('failed');
  }

  /**
   * Get completed items
   */
  async getCompletedItems(): Promise<GuestSnapFile[]> {
    return this.getItemsByStatus('completed');
  }

  /**
   * Update item status
   */
  async updateItemStatus(
    id: string,
    status: GuestSnapFileStatus,
    additionalData?: Partial<QueueItem>
  ): Promise<void> {
    const db = await getDB();
    const item = await db.get('uploads', id);

    if (item) {
      const updatedItem: QueueItem = {
        ...item,
        status,
        ...additionalData,
      };
      await db.put('uploads', updatedItem);
      this.broadcastUpdate();
      await this.notifyQueueUpdate();
    }
  }

  /**
   * Update item progress
   */
  async updateItemProgress(id: string, progress: number): Promise<void> {
    const db = await getDB();
    const item = await db.get('uploads', id);

    if (item) {
      item.progress = progress;
      await db.put('uploads', item);
      // Don't broadcast for progress updates (too frequent)
      await this.notifyQueueUpdate();
    }
  }

  /**
   * Mark item as completed
   */
  async markItemCompleted(id: string): Promise<void> {
    await this.updateItemStatus(id, 'completed', {
      progress: 100,
      uploadedAt: new Date(),
      error: undefined,
    });
  }

  /**
   * Mark item as failed
   */
  async markItemFailed(id: string, error: string, retryCount: number): Promise<void> {
    await this.updateItemStatus(id, 'failed', {
      error,
      retryCount,
      progress: 0,
    });
  }

  /**
   * Reset item for retry
   */
  async resetItemForRetry(id: string): Promise<void> {
    await this.updateItemStatus(id, 'pending', {
      error: undefined,
      progress: 0,
    });
  }

  /**
   * Reset all failed items for retry
   */
  async resetAllFailedItems(): Promise<void> {
    const db = await getDB();
    const failedItems = await db.getAllFromIndex('uploads', 'by-status', 'failed');

    const tx = db.transaction('uploads', 'readwrite');

    for (const item of failedItems) {
      item.status = 'pending';
      item.error = undefined;
      item.progress = 0;
      tx.store.put(item);
    }

    await tx.done;
    this.broadcastUpdate();
    await this.notifyQueueUpdate();
  }

  /**
   * Remove an item from the queue
   */
  async removeItem(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('uploads', id);
    this.broadcastUpdate();
    await this.notifyQueueUpdate();
  }

  /**
   * Remove completed items from the queue
   */
  async removeCompletedItems(): Promise<void> {
    const db = await getDB();
    const completedItems = await db.getAllFromIndex('uploads', 'by-status', 'completed');

    const tx = db.transaction('uploads', 'readwrite');

    for (const item of completedItems) {
      tx.store.delete(item.id);
    }

    await tx.done;
    this.broadcastUpdate();
    await this.notifyQueueUpdate();
  }

  /**
   * Clear all items from the queue
   */
  async clearAll(): Promise<void> {
    const db = await getDB();
    await db.clear('uploads');
    this.broadcastUpdate();
    await this.notifyQueueUpdate();
  }

  /**
   * Check if there are incomplete uploads
   */
  async hasIncompleteUploads(): Promise<boolean> {
    const db = await getDB();
    const pendingCount = await db.countFromIndex('uploads', 'by-status', 'pending');
    const failedCount = await db.countFromIndex('uploads', 'by-status', 'failed');
    const uploadingCount = await db.countFromIndex('uploads', 'by-status', 'uploading');

    return pendingCount > 0 || failedCount > 0 || uploadingCount > 0;
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    pending: number;
    uploading: number;
    completed: number;
    failed: number;
    total: number;
  }> {
    const db = await getDB();
    const pending = await db.countFromIndex('uploads', 'by-status', 'pending');
    const uploading = await db.countFromIndex('uploads', 'by-status', 'uploading');
    const completed = await db.countFromIndex('uploads', 'by-status', 'completed');
    const failed = await db.countFromIndex('uploads', 'by-status', 'failed');

    return {
      pending,
      uploading,
      completed,
      failed,
      total: pending + uploading + completed + failed,
    };
  }

  // Session management methods

  /**
   * Save session data
   */
  async saveSession(session: SessionData): Promise<void> {
    const db = await getDB();
    await db.put('session', session);
  }

  /**
   * Get saved session
   */
  async getSession(): Promise<SessionData | null> {
    const db = await getDB();
    const sessions = await db.getAll('session');

    if (sessions.length === 0) {
      return null;
    }

    // Get the most recent session
    const session = sessions[0];

    // Check if session is expired
    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
      await this.clearSession();
      return null;
    }

    return session;
  }

  /**
   * Clear session data
   */
  async clearSession(): Promise<void> {
    const db = await getDB();
    await db.clear('session');
  }

  /**
   * Update session upload count
   */
  async updateSessionUploadCount(count: number): Promise<void> {
    const db = await getDB();
    const sessions = await db.getAll('session');

    if (sessions.length > 0) {
      const session = sessions[0];
      session.uploadCount = count;
      await db.put('session', session);
    }
  }

  /**
   * Cleanup - close BroadcastChannel
   */
  cleanup(): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }
}

// Export singleton instance
export const queueManager = new QueueManager();

// Export utility functions
export { getDB, fileToArrayBuffer, arrayBufferToFile };
