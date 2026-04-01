import { NextRequest, NextResponse } from 'next/server';
import { MOCK_RSVP_RESPONSES } from '@/lib/dashboard/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const invitationId = searchParams.get('invitationId');
    const format = searchParams.get('format') || 'csv';

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId는 필수 파라미터입니다' },
        { status: 400 },
      );
    }

    if (format !== 'csv') {
      return NextResponse.json(
        { error: '지원하지 않는 형식입니다. csv만 지원됩니다.' },
        { status: 400 },
      );
    }

    // CSV 헤더
    const header = '이름,참석여부,인원,식사,메시지,응답일시';

    // CSV 행 생성
    const rows = MOCK_RSVP_RESPONSES.map((r) => {
      const attending = r.attending ? '참석' : '불참';
      const meal = getMealLabel(r.mealType);
      // CSV 값에 쉼표나 줄바꿈이 포함될 수 있으므로 큰따옴표로 감싸기
      const message = `"${r.message.replace(/"/g, '""')}"`;
      const respondedAt = new Date(r.respondedAt).toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
      });

      return `${r.name},${attending},${r.guestCount},${meal},${message},${respondedAt}`;
    });

    // BOM + CSV 내용 (Excel UTF-8 호환)
    const bom = '\uFEFF';
    const csv = bom + [header, ...rows].join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="rsvp_export.csv"',
      },
    });
  } catch (error) {
    console.error('RSVP export error:', error);
    return NextResponse.json(
      { error: 'RSVP 내보내기 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}

function getMealLabel(mealType: string): string {
  switch (mealType) {
    case 'western':
      return '양식';
    case 'korean':
      return '한식';
    case 'child':
      return '아동식';
    case 'none':
      return '없음';
    default:
      return mealType;
  }
}
