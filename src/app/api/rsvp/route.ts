import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, attendance, guestCount, mealType, message, side } = body;

    // Validate required fields
    if (!name || !attendance || !side) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    const attendanceText = attendance === 'yes' ? '참석' : '불참';
    const sideText = side === 'groom' ? '신랑측' : '신부측';
    const mealText = mealType === 'yes' ? '예정' : mealType === 'no' ? '안함' : '미정';

    const emailHtml = `
      <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #8B7355; text-align: center; font-size: 24px; margin-bottom: 30px;">
          결혼식 참석 여부 알림
        </h1>

        <div style="background: #FAF9F6; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #666; width: 100px;">성함</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #333; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #666;">하객 구분</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #333; font-weight: 500;">${sideText}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #666;">참석 여부</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: ${attendance === 'yes' ? '#4A7C59' : '#C75050'}; font-weight: 600;">${attendanceText}</td>
            </tr>
            ${attendance === 'yes' ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #666;">참석 인원</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #333; font-weight: 500;">${guestCount || 1}명</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #666;">식사 여부</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #E8E4DE; color: #333; font-weight: 500;">${mealText}</td>
            </tr>
            ` : ''}
            ${message ? `
            <tr>
              <td style="padding: 12px 0; color: #666; vertical-align: top;">메시지</td>
              <td style="padding: 12px 0; color: #333;">${message}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <p style="text-align: center; color: #999; font-size: 12px;">
          이 메일은 결혼식 청첩장에서 자동 발송되었습니다.
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: 'Wedding RSVP <onboarding@resend.dev>',
      to: process.env.RSVP_EMAIL_TO || '',
      subject: `[결혼식 참석] ${name}님 - ${attendanceText} (${sideText})`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: '이메일 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
