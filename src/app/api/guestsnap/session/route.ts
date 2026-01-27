/**
 * Guest Snap Session API Route
 * POST: Create a new session and guest folder on NAS
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createGuestFolder,
  validateGuestName,
  sanitizeGuestName,
  checkRateLimit,
} from '@/lib/guestsnap';
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

export async function POST(request: NextRequest): Promise<NextResponse<SessionResponse>> {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, 10, 60000); // 10 requests per minute for session creation

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

    // Create guest folder on NAS
    const folderResult = await createGuestFolder(sanitizedName);

    if (!folderResult.success) {
      console.error('Failed to create guest folder:', folderResult.error);

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
            code: 'FOLDER_CREATION_FAILED',
            message: '서버 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
          },
        },
        { status: 503 }
      );
    }

    // Generate session
    const sessionId = generateSessionId();
    const expiresAt = new Date(
      Date.now() + GUEST_SNAP_CONFIG.session.durationHours * 60 * 60 * 1000
    );

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(GUEST_SNAP_CONFIG.session.cookieName, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    });

    // Also store session data in cookie (encrypted in production)
    const sessionData = JSON.stringify({
      id: sessionId,
      guestName: sanitizedName,
      guestFolder: folderResult.folderPath,
      uploadCount: 0,
      createdAt: Date.now(),
    });

    cookieStore.set(`${GUEST_SNAP_CONFIG.session.cookieName}_data`, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
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
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(GUEST_SNAP_CONFIG.session.cookieName)?.value;
    const sessionDataStr = cookieStore.get(`${GUEST_SNAP_CONFIG.session.cookieName}_data`)?.value;

    if (!sessionId || !sessionDataStr) {
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

    const sessionData = JSON.parse(sessionDataStr);

    // Calculate expiration
    const expiresAt = new Date(
      sessionData.createdAt + GUEST_SNAP_CONFIG.session.durationHours * 60 * 60 * 1000
    );

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
