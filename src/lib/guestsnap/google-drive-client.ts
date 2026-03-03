/**
 * Google Drive API Client for Guest Snap feature
 * Server-side only - handles authentication, folder creation, and file upload
 */

import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { google, type drive_v3 } from 'googleapis';
import { sanitizeGuestName, generateUniqueFileName } from './file-validator';
import type { GuestSnapFileType } from '@/types/guestsnap';

const GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON =
  process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON || '';
const GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH =
  process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH || '';
const GOOGLE_DRIVE_OAUTH_CLIENT_ID =
  process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID || '';
const GOOGLE_DRIVE_OAUTH_CLIENT_SECRET =
  process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET || '';
const GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN =
  process.env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN || '';
const GOOGLE_DRIVE_CLIENT_EMAIL = process.env.GOOGLE_DRIVE_CLIENT_EMAIL || '';
const GOOGLE_DRIVE_PRIVATE_KEY = process.env.GOOGLE_DRIVE_PRIVATE_KEY || '';
const GOOGLE_DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '';
const GOOGLE_DRIVE_SHARED_DRIVE_ID = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID || '';

const DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const DRIVE_SCOPE = ['https://www.googleapis.com/auth/drive'];

let cachedDriveClient: drive_v3.Drive | null = null;

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
  if (GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON) {
    return parseServiceAccountJson(
      GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON,
      'GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON'
    );
  }

  if (GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH) {
    const content = await readFile(GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH, 'utf8');
    return parseServiceAccountJson(
      content,
      `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH (${GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH})`
    );
  }

  if (GOOGLE_DRIVE_CLIENT_EMAIL && GOOGLE_DRIVE_PRIVATE_KEY) {
    return {
      clientEmail: GOOGLE_DRIVE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(GOOGLE_DRIVE_PRIVATE_KEY),
    };
  }

  throw new Error(
    'Google Drive credentials not configured. Set OAuth vars (GOOGLE_DRIVE_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN) or service-account vars.'
  );
}

function getOAuthCredentials(): OAuthCredentials | null {
  const hasAnyOAuthValue =
    GOOGLE_DRIVE_OAUTH_CLIENT_ID ||
    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET ||
    GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN;

  if (!hasAnyOAuthValue) {
    return null;
  }

  if (
    !GOOGLE_DRIVE_OAUTH_CLIENT_ID ||
    !GOOGLE_DRIVE_OAUTH_CLIENT_SECRET ||
    !GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN
  ) {
    // Keep running with service-account fallback until all OAuth values are present.
    return null;
  }

  return {
    clientId: GOOGLE_DRIVE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_DRIVE_OAUTH_CLIENT_SECRET,
    refreshToken: GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
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

  if (GOOGLE_DRIVE_SHARED_DRIVE_ID) {
    params.corpora = 'drive';
    params.driveId = GOOGLE_DRIVE_SHARED_DRIVE_ID;
  }

  return params;
}

async function getDriveClient(): Promise<drive_v3.Drive> {
  if (cachedDriveClient) {
    return cachedDriveClient;
  }

  if (!GOOGLE_DRIVE_ROOT_FOLDER_ID) {
    throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID is not configured');
  }

  const oauthCredentials = getOAuthCredentials();
  let auth: InstanceType<typeof google.auth.JWT> | InstanceType<typeof google.auth.OAuth2>;

  if (oauthCredentials) {
    const oauth2Client = new google.auth.OAuth2(
      oauthCredentials.clientId,
      oauthCredentials.clientSecret
    );
    oauth2Client.setCredentials({
      refresh_token: oauthCredentials.refreshToken,
    });
    await oauth2Client.getAccessToken();
    auth = oauth2Client;
  } else {
    const serviceAccountCredentials = await getServiceAccountCredentials();
    const jwtClient = new google.auth.JWT({
      email: serviceAccountCredentials.clientEmail,
      key: serviceAccountCredentials.privateKey,
      scopes: DRIVE_SCOPE,
    });
    await jwtClient.authorize();
    auth = jwtClient;
  }

  cachedDriveClient = google.drive({
    version: 'v3',
    auth,
  });

  return cachedDriveClient;
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
): Promise<{ success: boolean; id: string; error?: string }> {
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
): Promise<{ success: boolean; folderPath: string; error?: string }> {
  try {
    const drive = await getDriveClient();
    const uniqueGuestName = await getUniqueGuestFolderName(
      drive,
      GOOGLE_DRIVE_ROOT_FOLDER_ID,
      guestName
    );
    const guestFolder = await createFolder(
      drive,
      GOOGLE_DRIVE_ROOT_FOLDER_ID,
      uniqueGuestName
    );

    if (!guestFolder.success) {
      return {
        success: false,
        folderPath: '',
        error: `Failed to create guest folder: ${guestFolder.error}`,
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

/**
 * Check if Google Drive is accessible.
 */
export async function checkStorageStatus(): Promise<{
  available: boolean;
  error?: string;
}> {
  try {
    const drive = await getDriveClient();

    const rootInfo = await drive.files.get({
      fileId: GOOGLE_DRIVE_ROOT_FOLDER_ID,
      fields: 'id,name,trashed',
      supportsAllDrives: true,
    });

    if (!rootInfo.data.id || rootInfo.data.trashed) {
      return {
        available: false,
        error: 'Google Drive root folder is not accessible',
      };
    }

    return { available: true };
  } catch (error) {
    return {
      available: false,
      error: getErrorMessage(error),
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
