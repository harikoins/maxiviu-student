import React, { createContext, useContext, useEffect } from "react";
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { setToastApi } from "./toastHelper";

const ToastContext = createContext<MessageInstance | null>(null);

// Provider component to wrap your app
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setToastApi(messageApi);
  }, [messageApi]);

  return (
    <ToastContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return toast;
};
