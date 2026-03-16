import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  getGuestUploadCount,
  verifyGuestFolderFile,
} from '@/lib/guestsnap';
import { updateGuestSnapSessionUploadCount, getGuestSnapSessionCookieData } from '@/lib/guestsnap/session-cookie';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type { UploadResponse } from '@/types/guestsnap';

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, 30, 60000);

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

    const session = await getGuestSnapSessionCookieData();
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

    const body = (await request.json()) as {
      fileId?: string;
      fileName?: string;
    };

    if (!body.fileId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_FILE_ID',
            message: '업로드 결과를 확인할 수 없어요.',
          },
        },
        { status: 400 }
      );
    }

    const verification = await verifyGuestFolderFile(body.fileId, session.guestFolder);
    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPLOAD_VERIFICATION_FAILED',
            message: GUEST_SNAP_CONFIG.messages.uploadFailed,
          },
        },
        { status: 500 }
      );
    }

    const newUploadCount = await getGuestUploadCount(session.guestFolder);
    await updateGuestSnapSessionUploadCount(newUploadCount);

    return NextResponse.json({
      success: true,
      fileId: body.fileId,
      fileName: verification.fileName || body.fileName,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Upload completion error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '업로드 확인 중 오류가 발생했어요. 다시 시도해주세요.',
        },
      },
      { status: 500 }
    );
  }
}
