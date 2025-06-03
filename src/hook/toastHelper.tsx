// toastHelper.ts
import type { MessageInstance } from "antd/es/message/interface";

let toastApi: MessageInstance | null = null;

export const setToastApi = (api: MessageInstance) => {
  toastApi = api;
};

export const showError = (msg: string) => {
  if (toastApi) {
    toastApi.error(msg);
  } else {
    console.error("Toast API not initialized", msg);
  }
};
