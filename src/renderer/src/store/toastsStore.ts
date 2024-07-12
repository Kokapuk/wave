import { Toast } from '@renderer/utils/types';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';

interface ToastsStore {
  toasts: (Toast & { id: string })[];
  addToast(toast: Toast): void;
}

const useToastsStore = create<ToastsStore>()((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = uuid();

    set({ toasts: [...get().toasts, { id, ...toast }] });

    setTimeout(() => {
      set({ toasts: get().toasts.filter((i) => i.id !== id) });
    }, toast.duration);
  },
}));

export default useToastsStore;
