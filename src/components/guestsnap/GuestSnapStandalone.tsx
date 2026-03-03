'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Camera, QrCode, Upload } from 'lucide-react';
import { GuestNameModal } from './GuestNameModal';
import { UploadModal } from './UploadModal';
import type { GuestSnapFile, GuestSnapModalState } from '@/types/guestsnap';

interface GuestSnapStandaloneProps {
  qrDataUrl: string;
  pageUrl: string;
}

export function GuestSnapStandalone({
  qrDataUrl,
  pageUrl,
}: GuestSnapStandaloneProps) {
  const [modalState, setModalState] = useState<GuestSnapModalState>('closed');
  const [guestName, setGuestName] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<GuestSnapFile[]>([]);

  const handleUploadClick = useCallback(() => {
    setModalState(guestName ? 'upload' : 'name');
  }, [guestName]);

  const handleNameSubmit = useCallback((name: string) => {
    setGuestName(name);
    setModalState('upload');
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState('closed');
    setSelectedFiles([]);
  }, []);

  const handleBackToName = useCallback(() => {
    setModalState('name');
  }, []);

  const handleFilesSelected = useCallback((files: GuestSnapFile[]) => {
    setSelectedFiles(files);
  }, []);

  return (
    <>
      <main
        className="min-h-screen px-5 py-12 sm:px-8"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                <Camera className="h-7 w-7 text-[var(--color-primary)]" />
              </div>
            </div>

            <p
              className="text-center text-[11px] uppercase tracking-[0.35em]"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-primary)',
              }}
            >
              Guest Snap Upload
            </p>
            <h1
              className="mt-3 text-center text-3xl leading-tight"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              퇴장 전, 찍어주신 사진을
              <br />
              공유해주세요
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-light)',
              }}
            >
              하객분들이 남겨주신 사진/영상은 예식 후 소중히 정리해 평생 간직하겠습니다.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Upload className="h-4 w-4" />
                사진/영상 업로드하기
              </button>
            </div>
          </div>

          <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] md:grid-cols-[1.1fr_1fr] md:p-8">
            <div className="space-y-3">
              <p
                className="text-xs uppercase tracking-[0.28em]"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-primary)',
                }}
              >
                For Wedding Hall Poster
              </p>
              <h2
                className="text-2xl leading-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text)',
                }}
              >
                QR 코드를 안내판에 넣어
                <br />
                바로 업로드 받으세요
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-light)]">
                아래 QR을 그대로 사용하면 하객이 바로 전용 업로드 페이지로 이동합니다.
                인쇄용 레이아웃은 포스터 페이지에서 확인할 수 있습니다.
              </p>
              <div className="pt-2">
                <Link
                  href="/guestsnap/poster"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-secondary)]"
                >
                  <QrCode className="h-4 w-4" />
                  포스터 페이지 열기
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--color-secondary)] p-4">
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
          </div>
        </div>
      </main>

      <GuestNameModal
        isOpen={modalState === 'name'}
        onClose={handleCloseModal}
        onSubmit={handleNameSubmit}
        initialName={guestName}
      />

      <UploadModal
        isOpen={modalState === 'upload'}
        onClose={handleCloseModal}
        onBack={handleBackToName}
        guestName={guestName}
        selectedFiles={selectedFiles}
        onFilesSelected={handleFilesSelected}
      />
    </>
  );
}
