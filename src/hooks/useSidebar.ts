import { create } from 'zustand';

interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  isOpenSubmenu?: boolean;
  toggleSubmenu?: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: false,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  toggleSubmenu: () =>
    set((state) => ({ isOpenSubmenu: !state.isOpenSubmenu })),
  isOpenSubmenu: false
}));
