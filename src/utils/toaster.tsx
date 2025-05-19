import { toast } from "react-toastify";

const showToast = (type: "success" | "error", message: string) => {
  toast[type](message, {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

export const showSuccessToast = (message: string) => showToast("success", message);
export const showErrorToast = (message: string) => showToast("error", message);
