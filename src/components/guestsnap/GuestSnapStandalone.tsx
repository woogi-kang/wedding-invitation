'use client';

import { useCallback, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { GuestUploadSheet } from './GuestUploadSheet';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';

export function GuestSnapStandalone() {
  const { limits } = GUEST_SNAP_CONFIG;
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);

  const limitItems = [
    `사진 ${limits.maxImageSizeMB}MB 이하`,
    `영상 ${limits.maxVideoSizeMB}MB 이하`,
    `최대 ${limits.maxFilesPerSession}개`,
  ];

  const handleUploadClick = useCallback(() => {
    setIsUploadSheetOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsUploadSheetOpen(false);
  }, []);

  return (
    <>
      <main
        className="min-h-screen px-5 py-12 sm:px-8"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <section
            className="relative overflow-hidden rounded-[2rem] bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at top, rgba(198,173,143,0.18), transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,1))',
            }}
          >
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <div className="mb-5 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-secondary)] shadow-[0_10px_30px_rgba(198,173,143,0.18)]">
                  <Camera className="h-7 w-7 text-[var(--color-primary)]" />
                </div>
              </div>

              <p
                className="text-[11px] uppercase tracking-[0.35em]"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-primary)',
                }}
              >
                Guest Snap
              </p>
              <h1
                className="mt-3 text-3xl leading-tight sm:text-[2.3rem]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                퇴장 전, 찍어주신 사진을
                <br />
                바로 올려주세요
              </h1>
              <p
                className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-light)',
                }}
              >
                예식 사진과 영상은 예식 후 정리해 신랑신부에게 전달됩니다.
                함께 남겨주신 장면들을 오래도록 소중히 간직할게요.
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleUploadClick}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white shadow-[0_16px_32px_rgba(128,88,62,0.22)] transition-colors hover:bg-[var(--color-primary-dark)]"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Upload className="h-4 w-4" />
                  사진/영상 올리기
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {limitItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-xs sm:text-sm"
                    style={{
                      color: 'var(--color-text-light)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <GuestUploadSheet isOpen={isUploadSheetOpen} onClose={handleCloseModal} />
    </>
  );
}
