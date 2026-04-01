import { NextRequest, NextResponse } from 'next/server';
import { MOCK_NOTIFICATION_SETTINGS } from '@/lib/dashboard/mock-data';
import type { NotificationSettings } from '@/types/dashboard';

export async function GET() {
  try {
    return NextResponse.json(MOCK_NOTIFICATION_SETTINGS);
  } catch (error) {
    console.error('Notification settings GET error:', error);
    return NextResponse.json(
      { error: '알림 설정을 불러오는 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: NotificationSettings = await request.json();

    // 필수 필드 검증
    if (typeof body.emailEnabled !== 'boolean' || typeof body.kakaoEnabled !== 'boolean') {
      return NextResponse.json(
        { error: '유효하지 않은 알림 설정입니다' },
        { status: 400 },
      );
    }

    if (!body.types || typeof body.types !== 'object') {
      return NextResponse.json(
        { error: '알림 유형 설정이 필요합니다' },
        { status: 400 },
      );
    }

    // Mock: 받은 설정을 그대로 반환
    // 프로덕션에서는 DB에 저장 후 업데이트된 설정 반환
    return NextResponse.json(body);
  } catch (error) {
    console.error('Notification settings PUT error:', error);
    return NextResponse.json(
      { error: '알림 설정 업데이트 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}
