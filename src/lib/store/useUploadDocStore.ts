import { create } from 'zustand';

interface UploadStoreType {
  educationalProofUploaded: boolean;
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

  onUploadedImage: (name: string) => void;
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
  setOpen: (open: boolean) => set({ open: open }),
  educationalProofUploaded: false,
  onUploadedImage: (name: string) => {
    console.log(name);
    switch (name) {
      case 'ID Proof':
        return set({ proofOfIdUploaded: true });
      case 'Residence Proof':
        return set({ residentProofUploaded: true });
      case 'Age Proof':
        return set({ ageProofUploaded: true });
      case 'Proof of Caste':
        return set({ castProofUploaded: true });
      case 'Exceptional Proof':
        return set({ otherProofUploaded: true });
      case 'Education Qaulification Proof':
        return set({ educationalProofUploaded: true });
      default:
        break;
    }
  }
}));
