import type { Metadata } from 'next';
import Image from 'next/image';
import {
  generateGuestSnapQrDataUrl,
  getGuestSnapPageUrl,
} from '@/lib/guestsnap/qr-code';

export const metadata: Metadata = {
  title: 'GuestSnap 포스터',
  description: '예식장 안내판 인쇄용 GuestSnap QR 포스터 페이지',
};

export default async function GuestSnapPosterPage() {
  const pageUrl = getGuestSnapPageUrl();
  const qrDataUrl = await generateGuestSnapQrDataUrl(680);

  return (
    <main
      className="min-h-screen p-6 sm:p-10"
      style={{
        background:
          'radial-gradient(circle at top left, #f8f4ea 0%, #f2eee3 45%, #ece7dc 100%)',
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl items-center justify-center">
        <article className="w-full rounded-[36px] border border-[var(--color-border)] bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.1)] sm:p-12">
          <div className="text-center">
            <p
              className="text-xs uppercase tracking-[0.35em]"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-primary)',
              }}
            >
              Wedding Guest Snap
            </p>
            <h1
              className="mt-4 text-4xl leading-tight sm:text-5xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              퇴장 전, 찍어주신 사진을
              <br />
              공유해주세요
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-light)]">
              오늘의 순간을 오래 간직하고 싶어요.
              <br />
              QR을 스캔하고 이름 입력 후 사진/영상을 업로드해주세요.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="rounded-3xl bg-[var(--color-secondary)] p-5">
              <Image
                src={qrDataUrl}
                alt="GuestSnap 업로드 페이지 QR 코드"
                className="h-72 w-72 rounded-2xl bg-white p-3 shadow-sm sm:h-80 sm:w-80"
                width={320}
                height={320}
                unoptimized
              />
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[var(--color-secondary)] px-6 py-4 text-center">
            <p className="text-sm text-[var(--color-text-light)]">업로드 주소</p>
            <p className="mt-2 break-all font-medium text-[var(--color-text)]">
              {pageUrl}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
