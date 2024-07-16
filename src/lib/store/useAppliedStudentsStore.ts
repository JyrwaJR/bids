import { create } from 'zustand';

type AppliedStudentType = {
  id: string;
  ids: string[];
  setIds: (ids: string[]) => void;
  open: boolean;
  openUpdate: boolean;
  onOpenChange: (open: boolean) => void;
  setOpenUpdate: (open: boolean) => void;
  setId: (id: string) => void;
};
export const useAppliedStudentsStore = create<AppliedStudentType>((set) => ({
  id: '',
  ids: [],
  open: false,
  openUpdate: false,
  setId: (idx: string) => set({ id: idx }),
  setIds: (ids: string[]) => set({ ids }),
  setOpenUpdate: (open: boolean) => set({ openUpdate: open }),
  onOpenChange: (open: boolean) => set({ open })
}));
