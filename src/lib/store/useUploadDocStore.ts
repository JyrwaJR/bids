import { create } from 'zustand';

interface UploadStoreType {
  educationalProofUploaded: boolean;
  setEducationalProofUploaded: (uploaded: boolean) => void;
  educationImageUrl: string;
  setEducationImageUrl: (url: string) => void;

  proofOfIdUploaded: boolean;
  setProofOfIdUploaded: (uploaded: boolean) => void;
  proofOfIdImageUrl: string;
  setProofOfIdImageUrl: (url: string) => void;

  residentProofUploaded: boolean;
  setResidentProofUploaded: (uploaded: boolean) => void;
  residentProofImageUrl: string;
  setResidentProofImageUrl: (url: string) => void;

  ageProofUploaded: boolean;
  setAgeProofUploaded: (uploaded: boolean) => void;
  ageProofImageUrl: string;
  setAgeProofImageUrl: (url: string) => void;

  castProofUploaded: boolean;
  setCastProofUploaded: (uploaded: boolean) => void;
  castProofImageUrl: string;
  setCastProofImageUrl: (url: string) => void;

  otherProofUploaded: boolean;
  setOtherProofUploaded: (uploaded: boolean) => void;
  otherProofImageUrl: string;
  setOtherProofImageUrl: (url: string) => void;

  isSelectedFilterType: string;
  setSelectedFilterType: (type: string) => void;

  open: boolean;
  setOpen: (open: boolean) => void;

  onUploadedImage: (name: string) => void;
}

export const useUploadDocStore = create<UploadStoreType>((set) => ({
  educationalProofUploaded: false,
  setEducationalProofUploaded: (uploaded: boolean) =>
    set({ educationalProofUploaded: uploaded }),
  educationImageUrl: '',
  setEducationImageUrl: (url: string) => set({ educationImageUrl: url }),

  proofOfIdUploaded: false,
  setProofOfIdUploaded: (uploaded: boolean) =>
    set({ proofOfIdUploaded: uploaded }),
  proofOfIdImageUrl: '',
  setProofOfIdImageUrl: (url: string) => set({ proofOfIdImageUrl: url }),

  residentProofUploaded: false,
  setResidentProofUploaded: (uploaded: boolean) =>
    set({ residentProofUploaded: uploaded }),
  residentProofImageUrl: '',
  setResidentProofImageUrl: (url: string) =>
    set({ residentProofImageUrl: url }),

  ageProofUploaded: false,
  setAgeProofUploaded: (uploaded: boolean) =>
    set({ ageProofUploaded: uploaded }),
  ageProofImageUrl: '',
  setAgeProofImageUrl: (url: string) => set({ ageProofImageUrl: url }),

  castProofUploaded: false,
  setCastProofUploaded: (uploaded: boolean) =>
    set({ castProofUploaded: uploaded }),
  castProofImageUrl: '',
  setCastProofImageUrl: (url: string) => set({ castProofImageUrl: url }),

  otherProofUploaded: false,
  setOtherProofUploaded: (uploaded: boolean) =>
    set({ otherProofUploaded: uploaded }),
  otherProofImageUrl: '',
  setOtherProofImageUrl: (url: string) => set({ otherProofImageUrl: url }),

  isSelectedFilterType: '',
  setSelectedFilterType: (type: string) => set({ isSelectedFilterType: type }),

  open: false,
  setOpen: (open: boolean) => set({ open }),

  onUploadedImage: (name: string) => {
    switch (name) {
      case 'ID Proof':
        set({ proofOfIdUploaded: true });
        break;
      case 'Residence Proof':
        set({ residentProofUploaded: true });
        break;
      case 'Age Proof':
        set({ ageProofUploaded: true });
        break;
      case 'Proof of Caste':
        set({ castProofUploaded: true });
        break;
      case 'Exceptional Proof':
        set({ otherProofUploaded: true });
        break;
      case 'Education Qualification Proof':
        set({ educationalProofUploaded: true });
        break;
      default:
        break;
    }
  }
}));
