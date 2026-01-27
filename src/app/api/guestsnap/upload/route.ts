/**
 * Guest Snap Upload API Route
 * POST: Upload a file to Synology NAS
 *
 * Handles:
 * - File validation (type, size, magic bytes)
 * - Rate limiting
 * - Session verification
 * - Chunked upload for large files (Vercel 4.5MB limit)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  uploadFile,
  validateFileServer,
  checkRateLimit,
  getGuestUploadCount,
} from '@/lib/guestsnap';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type { UploadResponse, GuestSnapFileType } from '@/types/guestsnap';

// Get client IP for rate limiting
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

// Parse session from cookies
async function getSession(): Promise<{
  id: string;
  guestName: string;
  guestFolder: string;
  uploadCount: number;
} | null> {
  try {
    const cookieStore = await cookies();
    const sessionDataStr = cookieStore.get(
      `${GUEST_SNAP_CONFIG.session.cookieName}_data`
    )?.value;

    if (!sessionDataStr) {
      return null;
    }

    return JSON.parse(sessionDataStr);
  } catch {
    return null;
  }
}

// Update session upload count
async function updateSessionUploadCount(newCount: number): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionDataStr = cookieStore.get(
      `${GUEST_SNAP_CONFIG.session.cookieName}_data`
    )?.value;

    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      sessionData.uploadCount = newCount;

      const expiresAt = new Date(
        sessionData.createdAt +
          GUEST_SNAP_CONFIG.session.durationHours * 60 * 60 * 1000
      );

      cookieStore.set(
        `${GUEST_SNAP_CONFIG.session.cookieName}_data`,
        JSON.stringify(sessionData),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: expiresAt,
          path: '/',
        }
      );
    }
  } catch (error) {
    console.error('Failed to update session upload count:', error);
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, 30, 60000); // 30 uploads per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: GUEST_SNAP_CONFIG.messages.retryingText.replace(
              '{{attempt}}',
              '...'
            ),
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

    // Verify session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_SESSION',
            message: '세션이 만료되었어요. 이름을 다시 입력해주세요.',
          },
        },
        { status: 401 }
      );
    }

    // Check upload limit
    const currentCount = await getGuestUploadCount(session.guestFolder);
    if (currentCount >= GUEST_SNAP_CONFIG.limits.maxFilesPerSession) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'LIMIT_REACHED',
            message: GUEST_SNAP_CONFIG.messages.limitReached,
          },
        },
        { status: 400 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_FILE',
            message: '파일이 없어요',
          },
        },
        { status: 400 }
      );
    }

    // Validate file on server side
    const validation = await validateFileServer(file);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE',
            message: validation.error || GUEST_SNAP_CONFIG.messages.invalidFileType,
          },
        },
        { status: 400 }
      );
    }

    // Get file buffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to NAS
    const uploadResult = await uploadFile(
      fileBuffer,
      file.name,
      session.guestFolder,
      validation.type as GuestSnapFileType
    );

    if (!uploadResult.success) {
      console.error('Upload failed:', uploadResult.error);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPLOAD_FAILED',
            message: GUEST_SNAP_CONFIG.messages.uploadFailed,
          },
        },
        { status: 500 }
      );
    }

    // Update session upload count
    await updateSessionUploadCount(currentCount + 1);

    return NextResponse.json({
      success: true,
      fileId: `${session.guestFolder}/${uploadResult.fileName}`,
      fileName: uploadResult.fileName,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Upload error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '업로드 중 오류가 발생했어요. 다시 시도해주세요.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS: Handle CORS preflight
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
