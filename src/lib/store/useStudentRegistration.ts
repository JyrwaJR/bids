import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface RegisterType {
  isOpen: boolean;
  isUpdate: boolean;
  id: string;
  onOpen: () => void;
  onClose: () => void;
  onUpdate: () => void;
  onRegister: () => void;
  setId: (id: string) => void;
}

export const useRegisterStudentStore = create<RegisterType>()(
  persist(
    (set) => ({
      isOpen: false,
      isUpdate: false,
      id: '',
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
      onUpdate: () => set({ isUpdate: true }),
      onRegister: () => set({ isUpdate: false }),
      setId: (id: string) => set({ id: id })
    }),
    {
      name: 'register-student',
      partialize: (state: RegisterType) => ({
        id: state.id
      })
    }
  )
);
