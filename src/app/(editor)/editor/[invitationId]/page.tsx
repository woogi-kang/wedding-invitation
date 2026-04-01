'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useEditorStore } from '@/stores/editor-store';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditExistingPage() {
  const params = useParams();
  const invitationId = params.invitationId as string;
  const { invitation, initializeEditor } = useEditorStore();

  useEffect(() => {
    if (!invitation || invitation.id !== invitationId) {
      // TODO: Supabase에서 기존 청첩장 데이터 로드
      // 현재는 새로 초기화 (mock)
      initializeEditor({ id: invitationId });
    }
  }, [invitationId, invitation, initializeEditor]);

  if (!invitation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">청첩장을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return <EditorLayout />;
}
