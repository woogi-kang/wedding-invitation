import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  createResumableUploadSession,
  getGuestUploadCount,
  validateUploadMetadataServer,
} from '@/lib/guestsnap';
import { getGuestSnapSessionCookieData } from '@/lib/guestsnap/session-cookie';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type { UploadInitResponse } from '@/types/guestsnap';

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadInitResponse>> {
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
      fileName?: string;
      mimeType?: string;
      size?: number;
      headerBase64?: string;
    };

    const validation = await validateUploadMetadataServer({
      fileName: body.fileName || '',
      mimeType: body.mimeType || '',
      size: Number(body.size || 0),
      headerBase64: body.headerBase64 || '',
    });

    if (!validation.valid || !validation.type) {
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

    const uploadSession = await createResumableUploadSession(
      body.fileName || '',
      body.mimeType || 'application/octet-stream',
      session.guestFolder,
      validation.type,
      Number(body.size || 0)
    );

    if (!uploadSession.success || !uploadSession.uploadUrl || !uploadSession.fileName) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPLOAD_INIT_FAILED',
            message: GUEST_SNAP_CONFIG.messages.uploadFailed,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      uploadUrl: uploadSession.uploadUrl,
      fileName: uploadSession.fileName,
    });
  } catch (error) {
    console.error('Upload init error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '업로드 준비 중 오류가 발생했어요. 다시 시도해주세요.',
        },
      },
      { status: 500 }
    );
  }
}
