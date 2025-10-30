// src/helpers/toast.ts
import { useToast } from "vue-toastification";

const toast = useToast();

export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastError = (message: string) => {
  toast.error(message);
};

export const toastInfo = (message: string) => {
  toast.info(message);
};

export const toastWarning = (message: string) => {
  toast.warning(message);
};
