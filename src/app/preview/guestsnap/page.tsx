'use client';

import { GuestSnapSamplesPreview } from '@/components/sections/GuestSnapSamples';

export default function GuestSnapPreviewPage() {
  return (
    <main className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          GuestSnap 레이아웃 샘플
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          마음에 드는 디자인 번호를 알려주세요!
        </p>
      </div>
      <GuestSnapSamplesPreview />
    </main>
  );
}
