/**
 * Guest Snap Notify API Route
 * POST: Send one batched Discord notification after a guest finishes upload flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkRateLimit } from '@/lib/guestsnap';
import { notifyGuestSnapUploadBatch } from '@/lib/guestsnap/discord-notifier';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';

type NotifyResponse = {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
};

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

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

export async function POST(
  request: NextRequest
): Promise<NextResponse<NotifyResponse>> {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, 20, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: '잠시 후 다시 시도해주세요',
          },
        },
        { status: 429 }
      );
    }

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

    const body = await request.json();
    const uploadedCount = Number(body.uploadedCount ?? 0);
    const failedCount = Number(body.failedCount ?? 0);
    const totalCountInput = Number(body.totalCount ?? uploadedCount + failedCount);

    if (
      !Number.isInteger(uploadedCount) ||
      !Number.isInteger(failedCount) ||
      !Number.isInteger(totalCountInput) ||
      uploadedCount < 0 ||
      failedCount < 0 ||
      totalCountInput < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PAYLOAD',
            message: '알림 요청 데이터가 올바르지 않습니다.',
          },
        },
        { status: 400 }
      );
    }

    if (uploadedCount === 0 && failedCount === 0) {
      return NextResponse.json({ success: true });
    }

    const totalCount = Math.max(totalCountInput, uploadedCount + failedCount);

    // Best-effort notification
    await notifyGuestSnapUploadBatch({
      guestName: session.guestName,
      uploadedCount,
      failedCount,
      totalCount,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('GuestSnap notify error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '알림 전송 중 오류가 발생했어요.',
        },
      },
      { status: 500 }
    );
  }
}

