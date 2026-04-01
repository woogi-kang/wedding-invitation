import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId는 필수 파라미터입니다' },
        { status: 400 },
      );
    }

    // 프로덕션에서는 ZIP 파일을 생성하고 presigned URL을 반환
    // 현재는 mock 데이터 반환
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1시간 후 만료

    return NextResponse.json({
      downloadUrl: `https://storage.weddingcraft.kr/guestsnap/${invitationId}/download.zip?token=mock_token`,
      expiresAt,
    });
  } catch (error) {
    console.error('GuestSnap download error:', error);
    return NextResponse.json(
      { error: 'GuestSnap 다운로드 URL 생성 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}
