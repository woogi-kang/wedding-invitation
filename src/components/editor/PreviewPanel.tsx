'use client';

import { useEditorStore } from '@/stores/editor-store';

export default function PreviewPanel() {
  const { previewZoom, setPreviewZoom, sections, invitation } = useEditorStore();

  const zoomOptions = [
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 relative">
      {/* 폰 프레임 */}
      <div
        className="relative bg-white rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden"
        style={{
          width: 375 * previewZoom,
          height: 812 * previewZoom,
        }}
      >
        {/* 상태바 */}
        <div
          className="bg-white flex items-center justify-between px-6"
          style={{
            height: 44 * previewZoom,
            fontSize: 12 * previewZoom,
          }}
        >
          <span className="text-gray-900 font-medium">12:00</span>
          <div className="flex items-center gap-1">
            <svg style={{ width: 16 * previewZoom, height: 12 * previewZoom }} viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="6" width="3" height="6" rx="0.5" />
              <rect x="4.5" y="4" width="3" height="8" rx="0.5" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" />
              <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
            </svg>
            <svg style={{ width: 16 * previewZoom, height: 10 * previewZoom }} viewBox="0 0 24 14" fill="currentColor">
              <rect x="0" y="0" width="22" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="2" y="2" width="14" height="10" rx="1.5" />
              <rect x="23" y="4" width="1.5" height="6" rx="0.5" />
            </svg>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div
          className="overflow-y-auto bg-white"
          style={{ height: (812 - 44 - 34) * previewZoom }}
        >
          <div
            style={{
              transform: `scale(${previewZoom})`,
              transformOrigin: 'top left',
              width: 375,
            }}
          >
            {/* TODO: Template-Engine의 InvitationRenderer 연동 */}
            <PreviewContent sections={sections} invitation={invitation} />
          </div>
        </div>

        {/* 홈 인디케이터 */}
        <div
          className="bg-white flex items-center justify-center"
          style={{ height: 34 * previewZoom }}
        >
          <div
            className="bg-gray-900 rounded-full"
            style={{
              width: 134 * previewZoom,
              height: 5 * previewZoom,
            }}
          />
        </div>
      </div>

      {/* 줌 컨트롤 */}
      <div className="flex items-center gap-1 mt-4">
        {zoomOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPreviewZoom(opt.value)}
            className={`
              px-3 py-1 text-xs rounded-md transition-colors
              ${previewZoom === opt.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-300'}
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 미리보기 콘텐츠 (Template-Engine 연동 전 임시)
function PreviewContent({
  sections,
  invitation,
}: {
  sections: { type: string; enabled: boolean; data: Record<string, unknown> }[];
  invitation: { groomName: string; brideName: string; weddingDate: string; venueName: string } | null;
}) {
  const enabledSections = sections.filter((s) => s.enabled).sort((a, b) => {
    const aIdx = sections.indexOf(a);
    const bIdx = sections.indexOf(b);
    return aIdx - bIdx;
  });

  if (!invitation) {
    return (
      <div className="flex items-center justify-center h-[700px] text-gray-400 text-sm">
        온보딩을 완료하면 미리보기가 표시됩니다
      </div>
    );
  }

  return (
    <div className="min-h-[700px]">
      {enabledSections.map((section) => (
        <div
          key={section.type}
          id={`preview-${section.type}`}
          className="border-b border-dashed border-gray-100 p-4"
        >
          <p className="text-xs text-gray-400 mb-2 uppercase">{section.type}</p>
          {section.type === 'hero' && (
            <div className="text-center py-8 bg-gradient-to-b from-rose-50 to-white rounded-lg">
              <p className="text-2xl font-serif text-gray-800">
                {invitation.groomName || '신랑'} & {invitation.brideName || '신부'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {(section.data.displayText as string) || '우리 결혼합니다'}
              </p>
              {invitation.weddingDate && (
                <p className="text-sm text-rose-500 mt-1">{invitation.weddingDate}</p>
              )}
            </div>
          )}
          {section.type === 'greeting' && (
            <div className="text-center py-4">
              <p className="text-sm font-medium text-gray-700">
                {(section.data.title as string) || '소중한 분들을 초대합니다'}
              </p>
              <p className="text-xs text-gray-500 mt-2 whitespace-pre-line">
                {(section.data.message as string) || '인사말을 입력해주세요'}
              </p>
            </div>
          )}
          {section.type === 'location' && (
            <div className="py-4">
              <p className="text-sm font-medium text-gray-700 text-center">
                {(section.data.venueName as string) || invitation.venueName || '예식장'}
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                {(section.data.address as string) || '주소를 입력해주세요'}
              </p>
            </div>
          )}
          {section.type !== 'hero' && section.type !== 'greeting' && section.type !== 'location' && (
            <div className="py-4 text-center text-xs text-gray-400">
              {section.type} 미리보기
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
