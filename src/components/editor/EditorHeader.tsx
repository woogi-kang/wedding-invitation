'use client';

import { useEditorStore } from '@/stores/editor-store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export default function EditorHeader() {
  const router = useRouter();
  const { saveStatus, lastSavedAt, save, undo, redo, isDirty } = useEditorStore();

  // Cmd+S 저장, Cmd+Z 되돌리기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [save, undo, redo]);

  // 페이지 이탈 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleBack = useCallback(() => {
    if (isDirty && !window.confirm('편집 중인 내용이 있습니다. 나가시겠습니까?')) return;
    router.push('/');
  }, [isDirty, router]);

  const statusLabel = () => {
    switch (saveStatus) {
      case 'saved': {
        const ago = lastSavedAt
          ? `${Math.round((Date.now() - new Date(lastSavedAt).getTime()) / 1000)}초 전`
          : '';
        return { text: `저장됨 ${ago}`, color: 'text-green-600' };
      }
      case 'saving':
        return { text: '저장 중...', color: 'text-yellow-600' };
      case 'unsaved':
        return { text: '변경사항 있음', color: 'text-orange-500' };
      case 'error':
        return { text: '저장 실패', color: 'text-red-600' };
    }
  };

  const status = statusLabel();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shrink-0">
      {/* 왼쪽: 뒤로가기 + 로고 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">대시보드</span>
        </button>
        <div className="h-5 w-px bg-gray-300 hidden sm:block" />
        <h1 className="text-sm font-semibold text-gray-900 hidden sm:block">WeddingCraft 에디터</h1>
      </div>

      {/* 오른쪽: 저장 상태 + 결제 버튼 */}
      <div className="flex items-center gap-3">
        <span className={`text-xs ${status.color}`}>{status.text}</span>
        <button
          onClick={() => save()}
          disabled={!isDirty}
          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          저장
        </button>
        <button className="px-4 py-1.5 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors font-medium">
          결제하기
        </button>
      </div>
    </header>
  );
}
