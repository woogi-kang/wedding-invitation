/**
 * Synology NAS API Client for Guest Snap feature
 * Server-side only - handles authentication, folder creation, and file upload
 */

import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import { sanitizeGuestName, generateUniqueFileName } from './file-validator';
import type { GuestSnapFileType } from '@/types/guestsnap';

// Environment variables (server-side only)
const SYNOLOGY_HOST = process.env.SYNOLOGY_HOST || '';
const SYNOLOGY_PORT = process.env.SYNOLOGY_PORT || '5001';
const SYNOLOGY_USERNAME = process.env.SYNOLOGY_USERNAME || '';
const SYNOLOGY_PASSWORD = process.env.SYNOLOGY_PASSWORD || '';
const SYNOLOGY_SHARED_FOLDER = process.env.SYNOLOGY_SHARED_FOLDER || 'GuestSnap';

/**
 * Synology API error codes
 */
const SYNOLOGY_ERRORS: Record<number, string> = {
  100: 'Unknown error',
  101: 'No parameter of API, method or version',
  102: 'Requested API does not exist',
  103: 'Requested method does not exist',
  104: 'Requested version does not support',
  105: 'Insufficient user privilege',
  106: 'Connection time out',
  107: 'Multiple login detected',
  400: 'Invalid parameter of file operation',
  401: 'Unknown error of file operation',
  402: 'System is too busy',
  403: 'Invalid user does this file operation',
  404: 'Invalid group does this file operation',
  405: 'Invalid user and group does this file operation',
  406: 'Cannot get user/group information from the account server',
  407: 'Operation not permitted',
  408: 'No such file or directory',
  409: 'Non-supported file system',
  410: 'Failed to connect internet-based file system (ex: CIFS)',
  411: 'Read-only file system',
  412: 'Filename too long in the non-encrypted file system',
  413: 'Filename too long in the encrypted file system',
  414: 'File already exists',
  415: 'Disk quota exceeded',
  416: 'No space left on device',
  417: 'Input/output error',
  418: 'Illegal name or path',
  419: 'Illegal file name',
  420: 'Illegal file name on FAT file system',
  421: 'Device or resource busy',
  599: 'No such task of the file operation',
};

/**
 * Session cache for Synology authentication
 * Reuse session within TTL to reduce auth calls
 */
let cachedSession: { sid: string; expiresAt: number } | null = null;
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Build Synology API URL
 */
function buildApiUrl(endpoint: string): string {
  const baseUrl = SYNOLOGY_HOST.endsWith('/')
    ? SYNOLOGY_HOST.slice(0, -1)
    : SYNOLOGY_HOST;

  // Use port if not already in the host
  const url = baseUrl.includes(':')
    ? baseUrl
    : `${baseUrl}:${SYNOLOGY_PORT}`;

  return `${url}/webapi/${endpoint}`;
}

/**
 * Authenticate with Synology NAS
 * Returns session ID (sid) for subsequent requests
 */
export async function authenticate(): Promise<string> {
  // Check cached session
  if (cachedSession && cachedSession.expiresAt > Date.now()) {
    return cachedSession.sid;
  }

  if (!SYNOLOGY_HOST || !SYNOLOGY_USERNAME || !SYNOLOGY_PASSWORD) {
    throw new Error('Synology credentials not configured');
  }

  const params = new URLSearchParams({
    api: 'SYNO.API.Auth',
    version: '3',
    method: 'login',
    account: SYNOLOGY_USERNAME,
    passwd: SYNOLOGY_PASSWORD,
    session: 'FileStation',
    format: 'sid',
  });

  try {
    const response = await fetch(`${buildApiUrl('auth.cgi')}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      const errorCode = data.error?.code || 0;
      throw new Error(
        `Synology auth failed: ${SYNOLOGY_ERRORS[errorCode] || 'Unknown error'} (code: ${errorCode})`
      );
    }

    // Cache the session
    cachedSession = {
      sid: data.data.sid,
      expiresAt: Date.now() + SESSION_TTL,
    };

    return data.data.sid;
  } catch (error) {
    // Clear cache on error
    cachedSession = null;
    throw error;
  }
}

/**
 * Logout from Synology NAS (optional cleanup)
 */
export async function logout(sid: string): Promise<void> {
  try {
    const params = new URLSearchParams({
      api: 'SYNO.API.Auth',
      version: '3',
      method: 'logout',
      session: 'FileStation',
      _sid: sid,
    });

    await fetch(`${buildApiUrl('auth.cgi')}?${params}`, {
      method: 'GET',
    });

    // Clear cache
    cachedSession = null;
  } catch {
    // Ignore logout errors
  }
}

/**
 * Check if a folder exists on the NAS
 */
export async function folderExists(
  sid: string,
  folderPath: string
): Promise<boolean> {
  const params = new URLSearchParams({
    api: 'SYNO.FileStation.List',
    version: '2',
    method: 'getinfo',
    path: folderPath,
    _sid: sid,
  });

  try {
    const response = await fetch(`${buildApiUrl('entry.cgi')}?${params}`);
    const data = await response.json();

    return data.success === true;
  } catch {
    return false;
  }
}

/**
 * Create a folder on the NAS
 * Creates parent folders if they don't exist
 */
export async function createFolder(
  sid: string,
  parentPath: string,
  folderName: string
): Promise<{ success: boolean; path: string; error?: string }> {
  const params = new URLSearchParams({
    api: 'SYNO.FileStation.CreateFolder',
    version: '2',
    method: 'create',
    folder_path: parentPath,
    name: folderName,
    force_parent: 'true',
    _sid: sid,
  });

  try {
    const response = await fetch(`${buildApiUrl('entry.cgi')}?${params}`);
    const data = await response.json();

    if (!data.success) {
      const errorCode = data.error?.code || 0;

      // Folder already exists is not an error for our use case
      if (errorCode === 414) {
        return {
          success: true,
          path: `${parentPath}/${folderName}`,
        };
      }

      return {
        success: false,
        path: '',
        error: SYNOLOGY_ERRORS[errorCode] || `Error code: ${errorCode}`,
      };
    }

    return {
      success: true,
      path: data.data.folders?.[0]?.path || `${parentPath}/${folderName}`,
    };
  } catch (error) {
    return {
      success: false,
      path: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List folders in a directory to check for duplicate names
 */
export async function listFolders(
  sid: string,
  path: string
): Promise<string[]> {
  const params = new URLSearchParams({
    api: 'SYNO.FileStation.List',
    version: '2',
    method: 'list',
    folder_path: path,
    filetype: 'dir',
    _sid: sid,
  });

  try {
    const response = await fetch(`${buildApiUrl('entry.cgi')}?${params}`);
    const data = await response.json();

    if (!data.success) {
      return [];
    }

    return (data.data.files || []).map(
      (f: { name: string }) => f.name
    );
  } catch {
    return [];
  }
}

/**
 * Generate unique folder name for guest
 * If "홍길동" exists, returns "홍길동_2", etc.
 */
export async function getUniqueGuestFolderName(
  sid: string,
  basePath: string,
  guestName: string
): Promise<string> {
  const sanitizedName = sanitizeGuestName(guestName);
  const existingFolders = await listFolders(sid, basePath);

  // Check if base name exists
  if (!existingFolders.includes(sanitizedName)) {
    return sanitizedName;
  }

  // Find next available number
  let counter = 2;
  while (existingFolders.includes(`${sanitizedName}_${counter}`)) {
    counter++;
    // Safety limit
    if (counter > 100) {
      throw new Error('Too many duplicate names');
    }
  }

  return `${sanitizedName}_${counter}`;
}

/**
 * Create guest folder structure
 * /GuestSnap/{weddingDate}/{guestName}/
 */
export async function createGuestFolder(
  guestName: string
): Promise<{ success: boolean; folderPath: string; error?: string }> {
  try {
    const sid = await authenticate();
    const { weddingDate, nas } = GUEST_SNAP_CONFIG;

    // Base path: /volume1/GuestSnap (or configured shared folder)
    const basePath = `/${SYNOLOGY_SHARED_FOLDER}`;

    // Date folder: /volume1/GuestSnap/2026-04-05
    const dateFolderPath = `${basePath}/${weddingDate}`;

    // Ensure date folder exists
    const dateResult = await createFolder(sid, basePath, weddingDate);
    if (!dateResult.success) {
      return {
        success: false,
        folderPath: '',
        error: `Failed to create date folder: ${dateResult.error}`,
      };
    }

    // Get unique guest folder name (handles duplicates)
    const uniqueGuestName = await getUniqueGuestFolderName(
      sid,
      dateFolderPath,
      guestName
    );

    // Create guest folder
    const guestResult = await createFolder(
      sid,
      dateFolderPath,
      uniqueGuestName
    );

    if (!guestResult.success) {
      return {
        success: false,
        folderPath: '',
        error: `Failed to create guest folder: ${guestResult.error}`,
      };
    }

    // Return the relative path for session storage
    const relativePath = `${nas.basePath}/${weddingDate}/${uniqueGuestName}`;

    return {
      success: true,
      folderPath: relativePath,
    };
  } catch (error) {
    return {
      success: false,
      folderPath: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload a file to Synology NAS
 * Uses multipart/form-data upload
 */
export async function uploadFile(
  fileBuffer: ArrayBuffer,
  fileName: string,
  destPath: string,
  fileType: GuestSnapFileType,
  onProgress?: (progress: number) => void
): Promise<{
  success: boolean;
  fileName?: string;
  error?: string;
}> {
  try {
    const sid = await authenticate();

    // Generate unique filename
    const uniqueFileName = generateUniqueFileName(fileName, fileType);

    // Build full destination path with shared folder prefix
    const fullDestPath = destPath.startsWith('/')
      ? `/${SYNOLOGY_SHARED_FOLDER}${destPath.substring(destPath.indexOf('/', 1))}`
      : `/${SYNOLOGY_SHARED_FOLDER}/${destPath}`;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('api', 'SYNO.FileStation.Upload');
    formData.append('version', '2');
    formData.append('method', 'upload');
    formData.append('path', fullDestPath);
    formData.append('create_parents', 'true');
    formData.append('overwrite', 'false');
    formData.append('_sid', sid);

    // Convert ArrayBuffer to Uint8Array for Blob creation
    const uint8Array = new Uint8Array(fileBuffer);
    const blob = new Blob([uint8Array]);
    formData.append('file', blob, uniqueFileName);

    // Upload the file
    const response = await fetch(buildApiUrl('entry.cgi'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      const errorCode = data.error?.code || 0;
      return {
        success: false,
        error: SYNOLOGY_ERRORS[errorCode] || `Error code: ${errorCode}`,
      };
    }

    // Report 100% progress
    onProgress?.(100);

    return {
      success: true,
      fileName: uniqueFileName,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if Synology NAS is accessible and has storage available
 */
export async function checkNasStatus(): Promise<{
  available: boolean;
  storageInfo?: {
    total: number;
    free: number;
    used: number;
  };
  error?: string;
}> {
  try {
    const sid = await authenticate();

    // Get share info to check storage
    const params = new URLSearchParams({
      api: 'SYNO.FileStation.Info',
      version: '2',
      method: 'get',
      _sid: sid,
    });

    const response = await fetch(`${buildApiUrl('entry.cgi')}?${params}`);
    const data = await response.json();

    if (!data.success) {
      return {
        available: false,
        error: 'Cannot get NAS info',
      };
    }

    return {
      available: true,
      storageInfo: {
        total: data.data?.total || 0,
        free: data.data?.free || 0,
        used: (data.data?.total || 0) - (data.data?.free || 0),
      },
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Get the number of files in a guest folder
 */
export async function getGuestUploadCount(
  guestFolder: string
): Promise<number> {
  try {
    const sid = await authenticate();

    const fullPath = guestFolder.startsWith('/')
      ? `/${SYNOLOGY_SHARED_FOLDER}${guestFolder.substring(guestFolder.indexOf('/', 1))}`
      : `/${SYNOLOGY_SHARED_FOLDER}/${guestFolder}`;

    const params = new URLSearchParams({
      api: 'SYNO.FileStation.List',
      version: '2',
      method: 'list',
      folder_path: fullPath,
      filetype: 'file',
      _sid: sid,
    });

    const response = await fetch(`${buildApiUrl('entry.cgi')}?${params}`);
    const data = await response.json();

    if (!data.success) {
      return 0;
    }

    return data.data?.total || 0;
  } catch {
    return 0;
  }
}
