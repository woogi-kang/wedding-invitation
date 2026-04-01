// 대시보드 상태 관리 (Zustand)

import { create } from 'zustand';
import type { Invitation } from '@/types/dashboard';
import { MOCK_INVITATION } from '@/lib/dashboard/mock-data';

interface DashboardState {
  invitation: Invitation | null;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  setInvitation: (invitation: Invitation) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  invitation: MOCK_INVITATION,
  sidebarOpen: true,
  mobileMenuOpen: false,
  setInvitation: (invitation) => set({ invitation }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
