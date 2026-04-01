'use client';

import { useEditorStore } from '@/stores/editor-store';

export default function CompletionBar() {
  const { completionRate, sections } = useEditorStore();
  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
        <span>입력 진행률</span>
        <span>{completionRate}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-500 rounded-full transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-400 mt-1">
        활성 섹션 {enabledCount}개
      </p>
    </div>
  );
}
