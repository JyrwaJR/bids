import { create } from 'zustand';

interface UploadStoreType {
  proofOfIdUploaded: boolean;
  setProofOfIdUploaded: (open: boolean) => void;

  residentProofUploaded: boolean;
  setResidentProofUploaded: (open: boolean) => void;

  ageProofUploaded: boolean;
  setAgeProofUploaded: (open: boolean) => void;

  castProofUploaded: boolean;
  setCastProofUploaded: (open: boolean) => void;

  otherProofUploaded: boolean;
  setOtherProofUploaded: (open: boolean) => void;

  isSelectedFilterType: string;
  setSelectedFilterType: (type: string) => void;

  open: boolean;
  setOpen: (open: boolean) => void;
}
export const useUploadDocStore = create<UploadStoreType>((set) => ({
  proofOfIdUploaded: false,
  setProofOfIdUploaded: (open: boolean) => set({ proofOfIdUploaded: open }),

  residentProofUploaded: false,
  setResidentProofUploaded: (open: boolean) =>
    set({ residentProofUploaded: open }),

  ageProofUploaded: false,
  setAgeProofUploaded: (open: boolean) => set({ ageProofUploaded: open }),

  castProofUploaded: false,
  setCastProofUploaded: (open: boolean) => set({ castProofUploaded: open }),

  otherProofUploaded: false,
  setOtherProofUploaded: (open: boolean) => set({ otherProofUploaded: open }),

  isSelectedFilterType: '',
  setSelectedFilterType: (type: string) => set({ isSelectedFilterType: type }),
  open: false,
  setOpen: (open: boolean) => set({ open: open })
}));
