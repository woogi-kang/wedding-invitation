'use client';

import { useEditorStore } from '@/stores/editor-store';
import EditorLayout from '@/components/editor/EditorLayout';
import OnboardingSteps from '@/components/editor/OnboardingSteps';

export default function NewEditorPage() {
  const { isOnboarding, invitation } = useEditorStore();

  // 온보딩 미완료 또는 invitation 없으면 온보딩 표시
  if (isOnboarding || !invitation) {
    return <OnboardingSteps />;
  }

  return <EditorLayout />;
}
