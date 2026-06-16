import { create } from "zustand";

export type ToastVariant = "default" | "success" | "destructive";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
  icon?: any;
  image?: any;
}

interface ToastStore {
  toast: ToastProps | null;
  showToast: (props: Omit<ToastProps, "id">) => void;
  dismissToast: () => void;
}

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (props) => {
    const id = Math.random().toString(36).substring(7);
    const duration = props.duration ?? 4000;

    // Clear any active timeouts to avoid premature dismissal of the new toast
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    set({
      toast: {
        ...props,
        id,
        duration,
      },
    });

    toastTimeout = setTimeout(() => {
      set({ toast: null });
      toastTimeout = null;
    }, duration);
  },
  dismissToast: () => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }
    set({ toast: null });
  },
}));
