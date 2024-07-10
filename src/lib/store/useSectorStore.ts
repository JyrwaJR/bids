import { create } from 'zustand';

type SectorStoreType = {
  id: string;
  setId: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useSectorStore = create<SectorStoreType>((set) => ({
  id: '',
  setId: (id: string) => set({ id: id }),
  open: false,
  onOpenChange: (open: boolean) => set({ open: open })
}));
