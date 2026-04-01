'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEditorStore } from '@/stores/editor-store';
import SectionItem from './SectionItem';
import CompletionBar from './CompletionBar';

export default function SectionList() {
  const { sections, reorderSections } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.type === active.id);
    const newIndex = sections.findIndex((s) => s.type === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex);
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col h-full">
      {/* 탭 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">섹션 관리</h2>
        <p className="text-xs text-gray-500 mt-0.5">드래그하여 순서를 변경하세요</p>
      </div>

      {/* 섹션 목록 */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sortedSections.map((s) => s.type)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSections.map((section) => (
              <SectionItem
                key={section.type}
                sectionType={section.type}
                enabled={section.enabled}
                data={section.data}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* 진행률 바 */}
      <CompletionBar />
    </div>
  );
}
