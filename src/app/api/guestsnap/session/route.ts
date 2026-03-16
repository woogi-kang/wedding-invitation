/**
 * Guest Snap Session API Route
 * POST: Create a new session and guest folder on Google Drive
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createGuestFolder,
  validateGuestName,
  sanitizeGuestName,
  checkRateLimit,
} from '@/lib/guestsnap';
import {
  getGuestSnapSessionCookieData,
  getGuestSnapSessionExpiry,
  setGuestSnapSessionCookies,
} from '@/lib/guestsnap/session-cookie';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type { SessionResponse } from '@/types/guestsnap';

// Generate a unique session ID
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `gs_${timestamp}_${randomPart}`;
}

// Get client IP for rate limiting
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function getSessionCreationErrorMessage(errorCode?: string): string {
  if (errorCode === 'service_account_requires_shared_drive') {
    return '업로드 저장소 연결을 확인하고 있어요. 관리자에게 문의해주세요.';
  }

  return '서버 연결에 실패했어요. 잠시 후 다시 시도해주세요.';
}

export async function POST(request: NextRequest): Promise<NextResponse<SessionResponse>> {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(
      clientIp,
      GUEST_SNAP_CONFIG.rateLimits.sessionCreationsPerMinute,
      60000,
      'guestsnap:session'
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          sessionId: '',
          guestName: '',
          guestFolder: '',
          uploadCount: 0,
          uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
          expiresAt: '',
          error: {
            code: 'RATE_LIMITED',
            message: '잠시 후 다시 시도해주세요',
          },
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { guestName } = body;

    // Validate guest name
    const nameValidation = validateGuestName(guestName || '');
    if (!nameValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          sessionId: '',
          guestName: '',
          guestFolder: '',
          uploadCount: 0,
          uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
          expiresAt: '',
          error: {
            code: 'INVALID_NAME',
            message: nameValidation.error || '올바른 이름을 입력해주세요',
          },
        },
        { status: 400 }
      );
    }

    // Sanitize the name
    const sanitizedName = sanitizeGuestName(guestName);

    // Create guest folder on Google Drive
    const folderResult = await createGuestFolder(sanitizedName);

    if (!folderResult.success) {
      console.error(
        'Failed to create guest folder:',
        folderResult.errorCode || 'unknown',
        folderResult.error
      );

      return NextResponse.json(
        {
          success: false,
          sessionId: '',
          guestName: sanitizedName,
          guestFolder: '',
          uploadCount: 0,
          uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
          expiresAt: '',
          error: {
            code: folderResult.errorCode || 'FOLDER_CREATION_FAILED',
            message: getSessionCreationErrorMessage(folderResult.errorCode),
          },
        },
        { status: 503 }
      );
    }

    const sessionId = generateSessionId();
    const createdAt = Date.now();
    const expiresAt = getGuestSnapSessionExpiry(createdAt);

    await setGuestSnapSessionCookies({
      id: sessionId,
      guestName: sanitizedName,
      guestFolder: folderResult.folderPath,
      uploadCount: 0,
      createdAt,
    });

    return NextResponse.json({
      success: true,
      sessionId,
      guestName: sanitizedName,
      guestFolder: folderResult.folderPath,
      uploadCount: 0,
      uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Session creation error:', error);

    return NextResponse.json(
      {
        success: false,
        sessionId: '',
        guestName: '',
        guestFolder: '',
        uploadCount: 0,
        uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
        expiresAt: '',
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve current session information
 */
export async function GET(): Promise<NextResponse<SessionResponse>> {
  try {
    const sessionData = await getGuestSnapSessionCookieData();

    if (!sessionData) {
      return NextResponse.json(
        {
          success: false,
          sessionId: '',
          guestName: '',
          guestFolder: '',
          uploadCount: 0,
          uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
          expiresAt: '',
          error: {
            code: 'NO_SESSION',
            message: '세션이 없습니다',
          },
        },
        { status: 404 }
      );
    }

    const expiresAt = getGuestSnapSessionExpiry(sessionData.createdAt);

    // Check if session expired
    if (expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          sessionId: '',
          guestName: '',
          guestFolder: '',
          uploadCount: 0,
          uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
          expiresAt: '',
          error: {
            code: 'SESSION_EXPIRED',
            message: '세션이 만료되었습니다. 다시 이름을 입력해주세요.',
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionData.id,
      guestName: sessionData.guestName,
      guestFolder: sessionData.guestFolder,
      uploadCount: sessionData.uploadCount || 0,
      uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Session retrieval error:', error);

    return NextResponse.json(
      {
        success: false,
        sessionId: '',
        guestName: '',
        guestFolder: '',
        uploadCount: 0,
        uploadLimit: GUEST_SNAP_CONFIG.limits.maxFilesPerSession,
        expiresAt: '',
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했어요',
        },
      },
      { status: 500 }
    );
  }
}
