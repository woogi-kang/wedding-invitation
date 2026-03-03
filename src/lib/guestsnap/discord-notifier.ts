/**
 * Discord webhook notifier for Guest Snap uploads
 */

const GUEST_SNAP_DISCORD_WEBHOOK_URL =
  process.env.GUEST_SNAP_DISCORD_WEBHOOK_URL || '';

interface UploadBatchNotificationPayload {
  guestName: string;
  uploadedCount: number;
  failedCount: number;
  totalCount: number;
}

export async function notifyGuestSnapUploadBatch(
  payload: UploadBatchNotificationPayload
): Promise<void> {
  if (!GUEST_SNAP_DISCORD_WEBHOOK_URL) {
    return;
  }

  const { guestName, uploadedCount, failedCount, totalCount } = payload;
  const hasFailure = failedCount > 0;
  const resultText = hasFailure
    ? `${uploadedCount}개 성공 / ${failedCount}개 실패`
    : `${uploadedCount}개 업로드 완료`;

  try {
    await fetch(GUEST_SNAP_DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'GuestSnap Bot',
        embeds: [
          {
            title: 'GuestSnap 업로드 요약',
            color: hasFailure ? 0xf59e0b : 0x22c55e,
            fields: [
              { name: '하객', value: guestName, inline: true },
              { name: '요청 파일 수', value: `${totalCount}개`, inline: true },
              { name: '결과', value: resultText, inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (error) {
    console.error('GuestSnap Discord webhook notify failed:', error);
  }
}
