export type GoogleDriveAuthMode = 'auto' | 'oauth' | 'service_account';

export type GoogleDriveResolvedAuthMode =
  | 'oauth'
  | 'service_account'
  | 'legacy_service_account'
  | 'unconfigured';

export type GuestSnapStorageErrorCode =
  | 'missing_root_folder_id'
  | 'invalid_auth_mode'
  | 'missing_auth_configuration'
  | 'missing_oauth_credentials'
  | 'missing_service_account_credentials'
  | 'invalid_service_account_json'
  | 'service_account_requires_shared_drive'
  | 'drive_auth_invalid_grant'
  | 'drive_access_failed'
  | 'drive_root_inaccessible'
  | 'drive_folder_creation_failed'
  | 'unknown';

export const GOOGLE_DRIVE_ENV = {
  authMode: process.env.GOOGLE_DRIVE_AUTH_MODE || '',
  serviceAccountJsonBase64: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64 || '',
  serviceAccountJson: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON || '',
  serviceAccountJsonPath: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_PATH || '',
  oauthClientId: process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID || '',
  oauthClientSecret: process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET || '',
  oauthRefreshToken: process.env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN || '',
  clientEmail: process.env.GOOGLE_DRIVE_CLIENT_EMAIL || '',
  privateKey: process.env.GOOGLE_DRIVE_PRIVATE_KEY || '',
  rootFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '',
  sharedDriveId: process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID || '',
} as const;

interface GoogleDriveConfigurationStatus {
  authMode: GoogleDriveResolvedAuthMode;
  configurationValid: boolean;
  errorCode?: GuestSnapStorageErrorCode;
  error?: string;
}

function normalizeAuthMode(value: string): GoogleDriveAuthMode | null {
  if (!value) {
    return 'auto';
  }

  if (value === 'auto' || value === 'oauth' || value === 'service_account') {
    return value;
  }

  return null;
}

function hasCompleteOAuthCredentials(): boolean {
  return Boolean(
    GOOGLE_DRIVE_ENV.oauthClientId &&
      GOOGLE_DRIVE_ENV.oauthClientSecret &&
      GOOGLE_DRIVE_ENV.oauthRefreshToken
  );
}

function hasPartialOAuthCredentials(): boolean {
  const values = [
    GOOGLE_DRIVE_ENV.oauthClientId,
    GOOGLE_DRIVE_ENV.oauthClientSecret,
    GOOGLE_DRIVE_ENV.oauthRefreshToken,
  ];

  const populatedCount = values.filter(Boolean).length;
  return populatedCount > 0 && populatedCount < values.length;
}

function hasDirectServiceAccountCredentials(): boolean {
  return Boolean(
    GOOGLE_DRIVE_ENV.serviceAccountJsonBase64 ||
      GOOGLE_DRIVE_ENV.serviceAccountJson ||
      GOOGLE_DRIVE_ENV.serviceAccountJsonPath
  );
}

function hasCompleteLegacyServiceAccountCredentials(): boolean {
  return Boolean(GOOGLE_DRIVE_ENV.clientEmail && GOOGLE_DRIVE_ENV.privateKey);
}

function hasPartialLegacyServiceAccountCredentials(): boolean {
  const hasAny = Boolean(GOOGLE_DRIVE_ENV.clientEmail || GOOGLE_DRIVE_ENV.privateKey);
  return hasAny && !hasCompleteLegacyServiceAccountCredentials();
}

function resolveServiceAccountMode(): GoogleDriveResolvedAuthMode | null {
  if (hasDirectServiceAccountCredentials()) {
    return 'service_account';
  }

  if (hasCompleteLegacyServiceAccountCredentials()) {
    return 'legacy_service_account';
  }

  return null;
}

export function resolveGoogleDriveConfiguration(): GoogleDriveConfigurationStatus {
  if (!GOOGLE_DRIVE_ENV.rootFolderId) {
    return {
      authMode: 'unconfigured',
      configurationValid: false,
      errorCode: 'missing_root_folder_id',
      error: 'Google Drive root folder ID is missing',
    };
  }

  const normalizedAuthMode = normalizeAuthMode(GOOGLE_DRIVE_ENV.authMode.trim().toLowerCase());

  if (!normalizedAuthMode) {
    return {
      authMode: 'unconfigured',
      configurationValid: false,
      errorCode: 'invalid_auth_mode',
      error: 'GOOGLE_DRIVE_AUTH_MODE must be auto, oauth, or service_account',
    };
  }

  if (normalizedAuthMode === 'oauth') {
    if (!hasCompleteOAuthCredentials()) {
      return {
        authMode: 'unconfigured',
        configurationValid: false,
        errorCode: 'missing_oauth_credentials',
        error: 'OAuth credentials are incomplete',
      };
    }

    return {
      authMode: 'oauth',
      configurationValid: true,
    };
  }

  if (normalizedAuthMode === 'service_account') {
    const serviceAccountMode = resolveServiceAccountMode();

    if (!serviceAccountMode) {
      return {
        authMode: 'unconfigured',
        configurationValid: false,
        errorCode: 'missing_service_account_credentials',
        error: 'Service account credentials are incomplete',
      };
    }

    return {
      authMode: serviceAccountMode,
      configurationValid: true,
    };
  }

  const autoServiceAccountMode = resolveServiceAccountMode();
  if (autoServiceAccountMode) {
    return {
      authMode: autoServiceAccountMode,
      configurationValid: true,
    };
  }

  if (hasCompleteOAuthCredentials()) {
    return {
      authMode: 'oauth',
      configurationValid: true,
    };
  }

  if (hasPartialLegacyServiceAccountCredentials()) {
    return {
      authMode: 'unconfigured',
      configurationValid: false,
      errorCode: 'missing_service_account_credentials',
      error: 'Service account credentials are incomplete',
    };
  }

  if (hasPartialOAuthCredentials()) {
    return {
      authMode: 'unconfigured',
      configurationValid: false,
      errorCode: 'missing_oauth_credentials',
      error: 'OAuth credentials are incomplete',
    };
  }

  return {
    authMode: 'unconfigured',
    configurationValid: false,
    errorCode: 'missing_auth_configuration',
    error: 'No Google Drive credentials are configured',
  };
}
