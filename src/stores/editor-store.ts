'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SectionState, InvitationDraft, SaveStatus, Tier, MobileView } from '@/types/editor';
import { createInitialSections, calculateSectionCompletion, SECTION_CONFIGS } from '@/lib/editor/section-config';

interface EditorStore {
  // 청첩장 기본 정보
  invitation: InvitationDraft | null;

  // 섹션 목록
  sections: SectionState[];

  // UI 상태
  activeSectionId: string | null;
  activeTab: 'sections' | 'design';
  selectedTier: Tier;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  previewZoom: number;
  mobileView: MobileView;

  // 편집 상태
  isDirty: boolean;
  isSaving: boolean;

  // 편집 진행률
  completionRate: number;

  // 히스토리
  history: SectionState[][];
  historyIndex: number;

  // 온보딩
  isOnboarding: boolean;
  onboardingStep: number;

  // 액션
  initializeEditor: (draft?: Partial<InvitationDraft>) => void;
  setInvitation: (invitation: Partial<InvitationDraft>) => void;
  setSections: (sections: SectionState[]) => void;
  toggleSection: (sectionType: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  updateSectionData: (sectionType: string, data: Record<string, unknown>) => void;
  setActiveSection: (sectionType: string | null) => void;
  setActiveTab: (tab: 'sections' | 'design') => void;
  setSelectedTier: (tier: Tier) => void;
  setPreviewZoom: (zoom: number) => void;
  setMobileView: (view: MobileView) => void;
  setSaveStatus: (status: SaveStatus) => void;

  // 온보딩
  setOnboarding: (isOnboarding: boolean) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: (data: { groomName: string; brideName: string; weddingDate: string; venueName: string }) => void;

  // 히스토리
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // 진행률 계산
  calculateCompletion: () => void;

  // 저장
  save: () => Promise<void>;
  loadFromLocal: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      invitation: null,
      sections: [],
      activeSectionId: null,
      activeTab: 'sections',
      selectedTier: 'basic',
      saveStatus: 'saved',
      lastSavedAt: null,
      previewZoom: 0.75,
      mobileView: 'edit',
      isDirty: false,
      isSaving: false,
      completionRate: 0,
      history: [],
      historyIndex: -1,
      isOnboarding: true,
      onboardingStep: 0,

      initializeEditor: (draft) => {
        const sections = createInitialSections();
        const invitation: InvitationDraft = {
          id: crypto.randomUUID(),
          slug: '',
          status: 'draft',
          tier: 'basic',
          groomName: '',
          brideName: '',
          weddingDate: '',
          weddingTime: '',
          venueName: '',
          venueAddress: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...draft,
        };
        set({
          invitation,
          sections,
          history: [sections],
          historyIndex: 0,
          isDirty: false,
          saveStatus: 'saved',
        });
        get().calculateCompletion();
      },

      setInvitation: (updates) => {
        const current = get().invitation;
        if (!current) return;
        set({
          invitation: { ...current, ...updates, updatedAt: new Date().toISOString() },
          isDirty: true,
          saveStatus: 'unsaved',
        });
      },

      setSections: (sections) => {
        set({ sections, isDirty: true, saveStatus: 'unsaved' });
        get().pushHistory();
        get().calculateCompletion();
      },

      toggleSection: (sectionType) => {
        const config = SECTION_CONFIGS.find((c) => c.type === sectionType);
        if (!config || !config.canDisable) return;

        const sections = get().sections.map((s) =>
          s.type === sectionType ? { ...s, enabled: !s.enabled } : s
        );
        set({ sections, isDirty: true, saveStatus: 'unsaved' });
        get().pushHistory();
        get().calculateCompletion();
      },

      reorderSections: (fromIndex, toIndex) => {
        const sections = [...get().sections];
        const [moved] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, moved);
        const reordered = sections.map((s, i) => ({ ...s, order: i + 1 }));
        set({ sections: reordered, isDirty: true, saveStatus: 'unsaved' });
        get().pushHistory();
      },

      updateSectionData: (sectionType, data) => {
        const sections = get().sections.map((s) =>
          s.type === sectionType ? { ...s, data: { ...s.data, ...data } } : s
        );
        set({ sections, isDirty: true, saveStatus: 'unsaved' });
        get().calculateCompletion();
      },

      setActiveSection: (sectionType) => set({ activeSectionId: sectionType }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedTier: (tier) => {
        set({ selectedTier: tier });
        const current = get().invitation;
        if (current) {
          set({ invitation: { ...current, tier } });
        }
      },
      setPreviewZoom: (zoom) => set({ previewZoom: zoom }),
      setMobileView: (view) => set({ mobileView: view }),
      setSaveStatus: (status) => set({ saveStatus: status }),

      setOnboarding: (isOnboarding) => set({ isOnboarding }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      completeOnboarding: ({ groomName, brideName, weddingDate, venueName }) => {
        const { initializeEditor, updateSectionData } = get();
        initializeEditor({ groomName, brideName, weddingDate, venueName });

        // 온보딩 데이터를 각 섹션에 반영
        updateSectionData('coupleIntro', { groomName, brideName });
        updateSectionData('weddingInfo', { date: weddingDate });
        updateSectionData('location', { venueName });

        set({ isOnboarding: false, onboardingStep: 0 });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex <= 0) return;
        const newIndex = historyIndex - 1;
        set({
          sections: history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
          saveStatus: 'unsaved',
        });
        get().calculateCompletion();
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex >= history.length - 1) return;
        const newIndex = historyIndex + 1;
        set({
          sections: history[newIndex],
          historyIndex: newIndex,
          isDirty: true,
          saveStatus: 'unsaved',
        });
        get().calculateCompletion();
      },

      pushHistory: () => {
        const { sections, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(sections)));
        // 히스토리 최대 50개 유지
        if (newHistory.length > 50) newHistory.shift();
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
      },

      calculateCompletion: () => {
        const { sections } = get();
        const enabledSections = sections.filter((s) => s.enabled);
        if (enabledSections.length === 0) {
          set({ completionRate: 0 });
          return;
        }
        const completed = enabledSections.filter(
          (s) => calculateSectionCompletion(s.type, s.data) === 'complete'
        );
        set({ completionRate: Math.round((completed.length / enabledSections.length) * 100) });
      },

      save: async () => {
        set({ isSaving: true, saveStatus: 'saving' });
        try {
          // TODO: Supabase 저장 연동
          // const { invitation, sections } = get();
          // await supabase.from('invitations').upsert({ ... });
          await new Promise((resolve) => setTimeout(resolve, 500));
          set({ isSaving: false, saveStatus: 'saved', lastSavedAt: new Date(), isDirty: false });
        } catch {
          set({ isSaving: false, saveStatus: 'error' });
        }
      },

      loadFromLocal: () => {
        // persist 미들웨어가 자동으로 처리
      },

      reset: () => {
        set({
          invitation: null,
          sections: [],
          activeSectionId: null,
          activeTab: 'sections',
          selectedTier: 'basic',
          saveStatus: 'saved',
          lastSavedAt: null,
          previewZoom: 0.75,
          mobileView: 'edit',
          isDirty: false,
          isSaving: false,
          completionRate: 0,
          history: [],
          historyIndex: -1,
          isOnboarding: true,
          onboardingStep: 0,
        });
      },
    }),
    {
      name: 'weddingcraft-editor-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        invitation: state.invitation,
        sections: state.sections,
        selectedTier: state.selectedTier,
        isOnboarding: state.isOnboarding,
      }),
    }
  )
);
