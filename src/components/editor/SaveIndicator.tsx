'use client';

import { useEditorStore } from '@/stores/editor-store';
import { useEffect, useRef } from 'react';

// 자동 저장: 5초 디바운스
export default function SaveIndicator() {
  const { isDirty, save, saveStatus } = useEditorStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDirty) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save();
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDirty, save]);

  if (saveStatus === 'saved') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg text-xs shadow-lg bg-white border">
      {saveStatus === 'saving' && <span className="text-yellow-600">저장 중...</span>}
      {saveStatus === 'error' && (
        <button onClick={() => save()} className="text-red-600 hover:underline">
          저장 실패 - 재시도
        </button>
      )}
    </div>
  );
}
