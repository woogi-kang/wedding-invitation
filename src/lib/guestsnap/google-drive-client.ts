/**
 * Google Drive API Client for Guest Snap feature
 * Server-side only - handles authentication, folder creation, and file upload
 */

import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { google, type drive_v3 } from 'googleapis';
import { sanitizeGuestName, generateUniqueFileName } from './file-validator';
import {
  GOOGLE_DRIVE_ENV,
  resolveGoogleDriveConfiguration,
  type GuestSnapStorageErrorCode,
  type GoogleDriveResolvedAuthMode,
} from './drive-config';
import type { GuestSnapFileType } from '@/types/guestsnap';

const DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const DRIVE_SCOPE = ['https://www.googleapis.com/auth/drive'];

let cachedDriveClient: drive_v3.Drive | null = null;
type GoogleAuthClient =
  | InstanceType<typeof google.auth.JWT>
  | InstanceType<typeof google.auth.OAuth2>;
let cachedAuthClient: GoogleAuthClient | null = null;

type ServiceAccountCredentials = {
  clientEmail: string;
  privateKey: string;
};

type OAuthCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

type ServiceAccountPayload = {
  client_email?: string;
  private_key?: string;
};

function normalizePrivateKey(value: string): string {
  return value.replace(/\\n/g, '\n');
}

function parseServiceAccountJson(
  jsonText: string,
  source: string
): ServiceAccountCredentials {
  let parsed: ServiceAccountPayload;

  try {
    parsed = JSON.parse(jsonText) as ServiceAccountPayload;
  } catch {
    throw new Error(`Invalid service account JSON (${source})`);
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      `Service account JSON missing client_email/private_key (${source})`
    );
  }

  return {
    clientEmail: parsed.client_email,
    privateKey: normalizePrivateKey(parsed.private_key),
  };
}

async function getServiceAccountCredentials(): Promise<ServiceAccountCredentials> {
  if (GOOGLE_DRIVE_ENV.serviceAccountJsonBase64) {
    let decoded = '';

    try {
      decoded = Buffer.from(GOOGLE_DRIVE_ENV.serviceAccountJsonBase64, 'base64').toString(
        'utf8'
      );
    } catch {
      throw new Error(
        'Invalid service account JSON (GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64)'
      );
    }

    return parseServiceAccountJson(
      decoded,
      'GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64'
    );
  }

  if (GOOGLE_DRIVE_ENV.serviceAccountJson) {
    return parseServiceAccountJson(
      GOOGLE_DRIVE_ENV.serviceAccountJson,
      'GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON'
    );
  }

  if (GOOGLE_DRIVE_ENV.serviceAccountJsonPath) {
    const content = await readFile(GOOGLE_DRIVE_ENV.serviceAccountJsonPath, 'utf8');
    return parseServiceAccountJson(
      content,
      `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH (${GOOGLE_DRIVE_ENV.serviceAccountJsonPath})`
    );
  }

  if (GOOGLE_DRIVE_ENV.clientEmail && GOOGLE_DRIVE_ENV.privateKey) {
    return {
      clientEmail: GOOGLE_DRIVE_ENV.clientEmail,
      privateKey: normalizePrivateKey(GOOGLE_DRIVE_ENV.privateKey),
    };
  }

  throw new Error(
    'Google Drive credentials not configured. Set OAuth vars (GOOGLE_DRIVE_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN) or service-account vars.'
  );
}

function getOAuthCredentials(): OAuthCredentials | null {
  const hasAnyOAuthValue =
    GOOGLE_DRIVE_ENV.oauthClientId ||
    GOOGLE_DRIVE_ENV.oauthClientSecret ||
    GOOGLE_DRIVE_ENV.oauthRefreshToken;

  if (!hasAnyOAuthValue) {
    return null;
  }

  if (
    !GOOGLE_DRIVE_ENV.oauthClientId ||
    !GOOGLE_DRIVE_ENV.oauthClientSecret ||
    !GOOGLE_DRIVE_ENV.oauthRefreshToken
  ) {
    // Keep running with service-account fallback until all OAuth values are present.
    return null;
  }

  return {
    clientId: GOOGLE_DRIVE_ENV.oauthClientId,
    clientSecret: GOOGLE_DRIVE_ENV.oauthClientSecret,
    refreshToken: GOOGLE_DRIVE_ENV.oauthRefreshToken,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}

function getStorageErrorCode(error: unknown): GuestSnapStorageErrorCode {
  const message = getErrorMessage(error).toLowerCase();

  if (message.includes('root folder id is missing') || message.includes('root_folder_id')) {
    return 'missing_root_folder_id';
  }

  if (message.includes('auth mode must be auto') || message.includes('invalid auth mode')) {
    return 'invalid_auth_mode';
  }

  if (message.includes('no google drive credentials are configured')) {
    return 'missing_auth_configuration';
  }

  if (message.includes('oauth credentials are incomplete')) {
    return 'missing_oauth_credentials';
  }

  if (
    message.includes('service account credentials are incomplete') ||
    message.includes('service account json missing')
  ) {
    return 'missing_service_account_credentials';
  }

  if (
    message.includes('invalid service account json') ||
    message.includes('missing client_email/private_key')
  ) {
    return 'invalid_service_account_json';
  }

  if (
    message.includes('service account uploads require a shared drive') ||
    message.includes('service accounts do not have storage quota')
  ) {
    return 'service_account_requires_shared_drive';
  }

  if (message.includes('invalid_grant')) {
    return 'drive_auth_invalid_grant';
  }

  if (
    message.includes('permission') ||
    message.includes('forbidden') ||
    message.includes('insufficient') ||
    message.includes('unauthorized')
  ) {
    return 'drive_access_failed';
  }

  return 'unknown';
}

function buildListParams(
  q: string,
  pageSize: number = 1000
): drive_v3.Params$Resource$Files$List {
  const params: drive_v3.Params$Resource$Files$List = {
    q,
    fields: 'files(id,name),nextPageToken',
    pageSize,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    spaces: 'drive',
  };

  if (GOOGLE_DRIVE_ENV.sharedDriveId) {
    params.corpora = 'drive';
    params.driveId = GOOGLE_DRIVE_ENV.sharedDriveId;
  }

  return params;
}

async function getRootFolderMetadata(
  drive: drive_v3.Drive
): Promise<drive_v3.Schema$File | null> {
  const response = await drive.files.get({
    fileId: GOOGLE_DRIVE_ENV.rootFolderId,
    fields: 'id,name,trashed,driveId',
    supportsAllDrives: true,
  });

  return response.data;
}

async function validateRootFolderForAuthMode(
  drive: drive_v3.Drive,
  authMode: GoogleDriveResolvedAuthMode
): Promise<{ valid: boolean; error?: string; errorCode?: GuestSnapStorageErrorCode }> {
  const rootInfo = await getRootFolderMetadata(drive);

  if (!rootInfo?.id || rootInfo.trashed) {
    return {
      valid: false,
      error: 'Google Drive root folder is not accessible',
      errorCode: 'drive_root_inaccessible',
    };
  }

  if (
    (authMode === 'service_account' || authMode === 'legacy_service_account') &&
    !rootInfo.driveId
  ) {
    return {
      valid: false,
      error: 'Service account uploads require a Shared Drive root folder',
      errorCode: 'service_account_requires_shared_drive',
    };
  }

  return { valid: true };
}

async function getAuthClient(): Promise<GoogleAuthClient> {
  if (cachedAuthClient) {
    return cachedAuthClient;
  }

  const configuration = resolveGoogleDriveConfiguration();

  if (!configuration.configurationValid) {
    throw new Error(configuration.error || 'Google Drive configuration is invalid');
  }

  if (configuration.authMode === 'oauth') {
    const oauthCredentials = getOAuthCredentials();

    if (!oauthCredentials) {
      throw new Error('OAuth credentials are incomplete');
    }

    const oauth2Client = new google.auth.OAuth2(
      oauthCredentials.clientId,
      oauthCredentials.clientSecret
    );
    oauth2Client.setCredentials({
      refresh_token: oauthCredentials.refreshToken,
    });
    await oauth2Client.getAccessToken();
    cachedAuthClient = oauth2Client;
    return oauth2Client;
  } else {
    const serviceAccountCredentials = await getServiceAccountCredentials();
    const jwtClient = new google.auth.JWT({
      email: serviceAccountCredentials.clientEmail,
      key: serviceAccountCredentials.privateKey,
      scopes: DRIVE_SCOPE,
    });
    await jwtClient.authorize();
    cachedAuthClient = jwtClient;
    return jwtClient;
  }
}

async function getDriveClient(): Promise<drive_v3.Drive> {
  if (cachedDriveClient) {
    return cachedDriveClient;
  }

  const auth = await getAuthClient();

  cachedDriveClient = google.drive({
    version: 'v3',
    auth,
  });

  return cachedDriveClient;
}

async function getAccessToken(): Promise<string> {
  const auth = await getAuthClient();
  const tokenResult = await auth.getAccessToken();
  const accessToken =
    typeof tokenResult === 'string' ? tokenResult : tokenResult?.token || '';

  if (!accessToken) {
    throw new Error('Failed to obtain Google Drive access token');
  }

  return accessToken;
}

async function listFolders(
  drive: drive_v3.Drive,
  parentId: string
): Promise<Array<{ id: string; name: string }>> {
  const folders: Array<{ id: string; name: string }> = [];
  let pageToken: string | undefined;

  do {
    const response = await drive.files.list({
      ...buildListParams(
        `'${parentId}' in parents and mimeType='${DRIVE_FOLDER_MIME_TYPE}' and trashed=false`
      ),
      pageToken,
    });

    for (const folder of response.data.files || []) {
      if (folder.id && folder.name) {
        folders.push({ id: folder.id, name: folder.name });
      }
    }

    pageToken = response.data.nextPageToken || undefined;
  } while (pageToken);

  return folders;
}

async function createFolder(
  drive: drive_v3.Drive,
  parentId: string,
  folderName: string
): Promise<{
  success: boolean;
  id: string;
  error?: string;
  errorCode?: GuestSnapStorageErrorCode;
}> {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: DRIVE_FOLDER_MIME_TYPE,
        parents: [parentId],
      },
      fields: 'id,name',
      supportsAllDrives: true,
    });

    if (!response.data.id) {
      return {
        success: false,
        id: '',
        error: 'Folder ID was not returned by Google Drive',
      };
    }

    return {
      success: true,
      id: response.data.id,
    };
  } catch (error) {
    return {
      success: false,
      id: '',
      error: getErrorMessage(error),
      errorCode: getStorageErrorCode(error),
    };
  }
}

async function getUniqueGuestFolderName(
  drive: drive_v3.Drive,
  parentId: string,
  guestName: string
): Promise<string> {
  const sanitizedName = sanitizeGuestName(guestName);
  const existingFolders = await listFolders(drive, parentId);
  const existingNames = new Set(existingFolders.map((folder) => folder.name));

  if (!existingNames.has(sanitizedName)) {
    return sanitizedName;
  }

  let counter = 2;
  while (existingNames.has(`${sanitizedName}_${counter}`)) {
    counter++;
    if (counter > 100) {
      throw new Error('Too many duplicate guest folder names');
    }
  }

  return `${sanitizedName}_${counter}`;
}

/**
 * Create guest folder structure in Google Drive:
 * {ROOT_FOLDER_ID}/{guestName[_n]}
 */
export async function createGuestFolder(
  guestName: string
): Promise<{
  success: boolean;
  folderPath: string;
  error?: string;
  errorCode?: GuestSnapStorageErrorCode;
}> {
  try {
    const configuration = resolveGoogleDriveConfiguration();

    if (!configuration.configurationValid) {
      return {
        success: false,
        folderPath: '',
        error: configuration.error || 'Google Drive configuration is invalid',
        errorCode: configuration.errorCode,
      };
    }

    const drive = await getDriveClient();
    const rootValidation = await validateRootFolderForAuthMode(
      drive,
      configuration.authMode
    );

    if (!rootValidation.valid) {
      return {
        success: false,
        folderPath: '',
        error: rootValidation.error,
        errorCode: rootValidation.errorCode,
      };
    }

    const uniqueGuestName = await getUniqueGuestFolderName(
      drive,
      GOOGLE_DRIVE_ENV.rootFolderId,
      guestName
    );
    const guestFolder = await createFolder(
      drive,
      GOOGLE_DRIVE_ENV.rootFolderId,
      uniqueGuestName
    );

    if (!guestFolder.success) {
      return {
        success: false,
        folderPath: '',
        error: `Failed to create guest folder: ${guestFolder.error}`,
        errorCode: guestFolder.errorCode || 'drive_folder_creation_failed',
      };
    }

    return {
      success: true,
      // Keep API contract: this string is used by session and upload APIs.
      // For Google Drive this value is the folder ID.
      folderPath: guestFolder.id,
    };
  } catch (error) {
    return {
      success: false,
      folderPath: '',
      error: getErrorMessage(error),
      errorCode: getStorageErrorCode(error),
    };
  }
}

/**
 * Upload a file to a guest folder in Google Drive.
 */
export async function uploadFile(
  fileBuffer: ArrayBuffer,
  fileName: string,
  destFolderId: string,
  fileType: GuestSnapFileType,
  onProgress?: (progress: number) => void
): Promise<{
  success: boolean;
  fileName?: string;
  error?: string;
}> {
  try {
    const drive = await getDriveClient();
    const uniqueFileName = generateUniqueFileName(fileName, fileType);

    await drive.files.create({
      requestBody: {
        name: uniqueFileName,
        parents: [destFolderId],
      },
      media: {
        mimeType: 'application/octet-stream',
        body: Readable.from(Buffer.from(fileBuffer)),
      },
      fields: 'id,name',
      supportsAllDrives: true,
    });

    onProgress?.(100);

    return {
      success: true,
      fileName: uniqueFileName,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function createResumableUploadSession(
  fileName: string,
  mimeType: string,
  destFolderId: string,
  fileType: GuestSnapFileType,
  fileSize: number
): Promise<{
  success: boolean;
  uploadUrl?: string;
  fileName?: string;
  error?: string;
}> {
  try {
    const uniqueFileName = generateUniqueFileName(fileName, fileType);
    const accessToken = await getAccessToken();

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': mimeType || 'application/octet-stream',
          'X-Upload-Content-Length': String(fileSize),
        },
        body: JSON.stringify({
          name: uniqueFileName,
          parents: [destFolderId],
        }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to create resumable upload session (${response.status})`,
      };
    }

    const uploadUrl = response.headers.get('location');
    if (!uploadUrl) {
      return {
        success: false,
        error: 'Google Drive did not return an upload URL',
      };
    }

    return {
      success: true,
      uploadUrl,
      fileName: uniqueFileName,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function verifyGuestFolderFile(
  fileId: string,
  guestFolderId: string
): Promise<{
  success: boolean;
  fileName?: string;
  error?: string;
}> {
  try {
    const drive = await getDriveClient();
    const response = await drive.files.get({
      fileId,
      fields: 'id,name,parents,trashed',
      supportsAllDrives: true,
    });

    const file = response.data;

    if (!file.id || file.trashed) {
      return {
        success: false,
        error: 'Uploaded file was not found in Google Drive',
      };
    }

    if (!file.parents?.includes(guestFolderId)) {
      return {
        success: false,
        error: 'Uploaded file does not belong to the current guest folder',
      };
    }

    return {
      success: true,
      fileName: file.name || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * Check if Google Drive is accessible.
 */
export async function checkStorageStatus(): Promise<{
  available: boolean;
  error?: string;
  errorCode?: GuestSnapStorageErrorCode;
  authMode?: GoogleDriveResolvedAuthMode;
  configurationValid?: boolean;
}> {
  const configuration = resolveGoogleDriveConfiguration();

  if (!configuration.configurationValid) {
    return {
      available: false,
      error: configuration.error,
      errorCode: configuration.errorCode,
      authMode: configuration.authMode,
      configurationValid: false,
    };
  }

  try {
    const drive = await getDriveClient();
    const rootValidation = await validateRootFolderForAuthMode(
      drive,
      configuration.authMode
    );

    if (!rootValidation.valid) {
      return {
        available: false,
        error: rootValidation.error,
        errorCode: rootValidation.errorCode,
        authMode: configuration.authMode,
        configurationValid: true,
      };
    }

    return {
      available: true,
      authMode: configuration.authMode,
      configurationValid: true,
    };
  } catch (error) {
    return {
      available: false,
      error: getErrorMessage(error),
      errorCode: getStorageErrorCode(error),
      authMode: configuration.authMode,
      configurationValid: true,
    };
  }
}

/**
 * Get the number of uploaded files in a guest folder.
 */
export async function getGuestUploadCount(guestFolderId: string): Promise<number> {
  try {
    const drive = await getDriveClient();
    let count = 0;
    let pageToken: string | undefined;

    do {
      const response = await drive.files.list({
        ...buildListParams(
          `'${guestFolderId}' in parents and mimeType!='${DRIVE_FOLDER_MIME_TYPE}' and trashed=false`,
          200
        ),
        pageToken,
      });

      count += response.data.files?.length || 0;
      pageToken = response.data.nextPageToken || undefined;
    } while (pageToken);

    return count;
  } catch {
    return 0;
  }
}
