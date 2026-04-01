'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/stores/editor-store';
import { SECTION_CONFIGS, isSectionAvailable, calculateSectionCompletion } from '@/lib/editor/section-config';

interface SectionItemProps {
  sectionType: string;
  enabled: boolean;
  data: Record<string, unknown>;
}

export default function SectionItem({ sectionType, enabled, data }: SectionItemProps) {
  const { setActiveSection, toggleSection, selectedTier } = useEditorStore();
  const config = SECTION_CONFIGS.find((c) => c.type === sectionType);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionType,
  });

  if (!config) return null;

  const isAvailable = isSectionAvailable(config.requiredTier, selectedTier);
  const status = enabled ? calculateSectionCompletion(sectionType, data) : 'disabled';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    if (!isAvailable) {
      // TODO: 업그레이드 모달 표시
      return;
    }
    setActiveSection(sectionType);
  };

  const statusIndicator = () => {
    if (!enabled) return <span className="text-xs text-gray-400">비활성</span>;
    if (status === 'complete') return <span className="text-xs text-green-600">입력 완료</span>;
    return <span className="text-xs text-amber-500">입력 필요</span>;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-3 px-3 py-3 rounded-lg border transition-all cursor-pointer
        ${isDragging ? 'shadow-lg' : ''}
        ${!isAvailable ? 'bg-gray-50 border-gray-200 opacity-70' : enabled ? 'bg-white border-gray-200 hover:border-rose-300 hover:shadow-sm' : 'bg-gray-50 border-gray-100'}
      `}
    >
      {/* 드래그 핸들 */}
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing shrink-0"
        aria-label="드래그하여 순서 변경"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      {/* 섹션 정보 */}
      <div className="flex-1 min-w-0" onClick={handleClick}>
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-label={config.name}>{config.icon}</span>
          <span className="text-sm font-medium text-gray-900 truncate">{config.name}</span>
          {!isAvailable && (
            <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-gray-200 text-gray-600 rounded">
              {config.requiredTier === 'arcade' ? 'Arcade' : 'Premium'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{config.description}</span>
          {isAvailable && statusIndicator()}
        </div>
      </div>

      {/* ON/OFF 토글 */}
      {config.canDisable && isAvailable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSection(sectionType);
          }}
          className={`
            relative w-9 h-5 rounded-full transition-colors shrink-0
            ${enabled ? 'bg-rose-500' : 'bg-gray-300'}
          `}
          aria-label={`${config.name} ${enabled ? '비활성화' : '활성화'}`}
          aria-checked={enabled}
          role="switch"
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm
              ${enabled ? 'translate-x-4' : 'translate-x-0'}
            `}
          />
        </button>
      )}
    </div>
  );
}
