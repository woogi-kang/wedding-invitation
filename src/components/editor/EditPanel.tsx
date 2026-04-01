'use client';

import { useEditorStore } from '@/stores/editor-store';
import SectionList from './SectionList';
import SectionEditForm from './SectionEditForm';

export default function EditPanel() {
  const { activeSectionId } = useEditorStore();

  return (
    <div className="h-full bg-white">
      {activeSectionId ? <SectionEditForm /> : <SectionList />}
    </div>
  );
}
