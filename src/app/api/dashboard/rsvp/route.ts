import { NextRequest, NextResponse } from 'next/server';
import { MOCK_RSVP_RESPONSES, MOCK_RSVP_SUMMARY } from '@/lib/dashboard/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const invitationId = searchParams.get('invitationId');
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId는 필수 파라미터입니다' },
        { status: 400 },
      );
    }

    let responses = [...MOCK_RSVP_RESPONSES];

    // 이름 검색 필터
    if (search) {
      responses = responses.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 참석 상태 필터
    if (filter === 'attending') {
      responses = responses.filter((r) => r.attending);
    } else if (filter === 'declined') {
      responses = responses.filter((r) => !r.attending);
    }

    return NextResponse.json({
      responses,
      summary: MOCK_RSVP_SUMMARY,
    });
  } catch (error) {
    console.error('RSVP API error:', error);
    return NextResponse.json(
      { error: 'RSVP 데이터를 불러오는 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}
