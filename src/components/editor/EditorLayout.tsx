'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import EditorHeader from './EditorHeader';
import EditPanel from './EditPanel';
import PreviewPanel from './PreviewPanel';
import SaveIndicator from './SaveIndicator';
import TierSelectModal from './TierSelectModal';

export default function EditorLayout() {
  const { mobileView, setMobileView, undo, redo } = useEditorStore();
  const [tierModalOpen, setTierModalOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <EditorHeader />

      {/* 데스크탑: 좌우 분할 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽 편집 패널 - 데스크탑에서만 표시 */}
        <div className="hidden md:flex w-[400px] shrink-0 border-r border-gray-200 flex-col overflow-hidden">
          <EditPanel />
        </div>

        {/* 오른쪽 미리보기 패널 - 데스크탑에서만 표시 */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <PreviewPanel />
        </div>

        {/* 모바일: 탭 전환 */}
        <div className="flex flex-col flex-1 md:hidden overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setMobileView('edit')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                mobileView === 'edit'
                  ? 'text-rose-600 border-b-2 border-rose-500'
                  : 'text-gray-500'
              }`}
            >
              편집
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                mobileView === 'preview'
                  ? 'text-rose-600 border-b-2 border-rose-500'
                  : 'text-gray-500'
              }`}
            >
              미리보기
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-hidden">
            {mobileView === 'edit' ? <EditPanel /> : <PreviewPanel />}
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <div className="h-12 bg-white border-t border-gray-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileView(mobileView === 'preview' ? 'edit' : 'preview')}
            className="md:hidden px-3 py-1.5 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {mobileView === 'preview' ? '편집' : '미리보기'}
          </button>
          <button onClick={undo} className="px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md" title="되돌리기 (Cmd+Z)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
            </svg>
          </button>
          <button onClick={redo} className="px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md" title="다시하기 (Cmd+Shift+Z)">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => setTierModalOpen(true)}
          className="px-4 py-1.5 text-xs font-medium text-white bg-rose-500 rounded-md hover:bg-rose-600 transition-colors"
        >
          결제하기
        </button>
      </div>

      {/* 자동 저장 인디케이터 */}
      <SaveIndicator />

      {/* 티어 선택 모달 */}
      <TierSelectModal open={tierModalOpen} onClose={() => setTierModalOpen(false)} />
    </div>
  );
}
