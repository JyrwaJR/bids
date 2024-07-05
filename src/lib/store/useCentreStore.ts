import { create } from 'zustand';

interface CenterT {
  id: string;
  isDeleting: boolean;
  isUpdating: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  setId: (id: string) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setIsUpdating: (isUpdating: boolean) => void;
}

export const useCenterStore = create<CenterT>((set) => ({
  id: '',
  isDeleting: false,
  isUpdating: false,
  setId: (id: string) => set({ id }),
  setIsDeleting: (isDeleting: boolean) => set({ isDeleting: isDeleting }),
  setIsUpdating: (isUpdating: boolean) => set({ isUpdating: isUpdating }),
  open: false,
  setOpen: (open: boolean) => set({ open: open })
}));
