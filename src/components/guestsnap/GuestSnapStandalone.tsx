'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Camera, Check, ChevronDown, ChevronUp, QrCode, Upload } from 'lucide-react';
import { GuestUploadSheet } from './GuestUploadSheet';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';

interface GuestSnapStandaloneProps {
  qrDataUrl: string;
  pageUrl: string;
}

export function GuestSnapStandalone({
  qrDataUrl,
  pageUrl,
}: GuestSnapStandaloneProps) {
  const { limits } = GUEST_SNAP_CONFIG;
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [isHostSectionOpen, setIsHostSectionOpen] = useState(false);

  const limitItems = [
    `사진 ${limits.maxImageSizeMB}MB 이하`,
    `영상 ${limits.maxVideoSizeMB}MB 이하`,
    `최대 ${limits.maxFilesPerSession}개`,
  ];

  const uploadSteps = [
    {
      number: '01',
      title: '이름 입력',
      description: '사진을 정리할 때 표시될 이름을 먼저 입력해요.',
    },
    {
      number: '02',
      title: '사진/영상 선택',
      description: '앨범에서 고르거나 바로 촬영한 파일도 올릴 수 있어요.',
    },
    {
      number: '03',
      title: '업로드 완료',
      description: '전송이 끝나면 완료 안내가 바로 표시됩니다.',
    },
  ];

  const inspirationItems = [
    '친구들과 셀카',
    '테이블 단체 사진',
    '식장 분위기',
    '신랑신부 순간 컷',
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

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
            <section className="rounded-[2rem] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.28em]"
                    style={{
                      fontFamily: 'var(--font-accent)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    How It Works
                  </p>
                  <h2
                    className="mt-3 text-2xl leading-tight"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    올리는 방법은
                    <br />
                    딱 세 단계예요
                  </h2>
                </div>
                <div
                  className="hidden rounded-full px-4 py-2 text-xs sm:block"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  모바일 업로드 최적화
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {uploadSteps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-secondary)]/35 p-5"
                  >
                    <p
                      className="text-xs tracking-[0.2em]"
                      style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-accent)',
                      }}
                    >
                      STEP {step.number}
                    </p>
                    <h3
                      className="mt-3 text-lg"
                      style={{
                        color: 'var(--color-text)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{
                        color: 'var(--color-text-light)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border)] bg-white p-5">
                <p
                  className="text-xs uppercase tracking-[0.28em]"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    color: 'var(--color-primary)',
                  }}
                >
                  Photo Ideas
                </p>
                <h3
                  className="mt-3 text-xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                  }}
                >
                  이런 사진도 좋아요
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {inspirationItems.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-[var(--color-secondary)]/50 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                        <Check className="h-4 w-4 text-[var(--color-primary)]" />
                      </div>
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-8">
              <button
                type="button"
                onClick={() => setIsHostSectionOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isHostSectionOpen}
                aria-controls="guestsnap-host-tools"
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.28em]"
                    style={{
                      fontFamily: 'var(--font-accent)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    Host Tools
                  </p>
                  <h2
                    className="mt-3 text-2xl leading-tight"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text)',
                    }}
                  >
                    안내판용 QR과 포스터는
                    <br />
                    여기에서 확인하세요
                  </h2>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-light)',
                    }}
                  >
                    하객 업로드 흐름은 위에서 바로 시작하고, 운영용 자료는 필요할 때만
                    펼쳐보면 됩니다.
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
                  {isHostSectionOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {isHostSectionOpen ? (
                <div id="guestsnap-host-tools" className="mt-6 space-y-5">
                  <div className="flex flex-col items-center justify-center rounded-[1.75rem] bg-[var(--color-secondary)] p-4">
                    <Image
                      src={qrDataUrl}
                      alt="GuestSnap 페이지 QR 코드"
                      className="h-56 w-56 rounded-xl border border-[var(--color-border)] bg-white p-2"
                      width={224}
                      height={224}
                      unoptimized
                    />
                    <p className="mt-3 text-center text-xs text-[var(--color-text-light)] break-all">
                      {pageUrl}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={pageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-secondary)]"
                    >
                      <QrCode className="h-4 w-4" />
                      QR 페이지 열기
                    </a>
                    <Link
                      href="/guestsnap/poster"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                      <QrCode className="h-4 w-4" />
                      포스터 페이지 열기
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  id="guestsnap-host-tools"
                  className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--color-border)] bg-[var(--color-secondary)]/25 px-5 py-4 text-sm leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-light)',
                  }}
                >
                  QR 이미지를 안내판에 넣거나 포스터 페이지에서 인쇄용 레이아웃을 확인할 수 있어요.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <GuestUploadSheet isOpen={isUploadSheetOpen} onClose={handleCloseModal} />
    </>
  );
}
