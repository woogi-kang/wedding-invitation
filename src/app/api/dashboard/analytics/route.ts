import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ANALYTICS } from '@/lib/dashboard/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const period = searchParams.get('period') || '7d';
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId는 필수 파라미터입니다' },
        { status: 400 },
      );
    }

    // period에 따라 dailyVisitors 데이터 필터링
    let filteredAnalytics = { ...MOCK_ANALYTICS };

    if (period === '7d') {
      filteredAnalytics = {
        ...filteredAnalytics,
        dailyVisitors: filteredAnalytics.dailyVisitors.slice(-7),
      };
    } else if (period === '30d') {
      filteredAnalytics = {
        ...filteredAnalytics,
        dailyVisitors: filteredAnalytics.dailyVisitors.slice(-30),
      };
    }
    // 'all'인 경우 전체 데이터 반환

    return NextResponse.json(filteredAnalytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: '통계 데이터를 불러오는 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}
