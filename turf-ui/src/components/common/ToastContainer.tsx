import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { removeToast } from "../../store/slices/uiSlice";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";

const ToastContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.ui.toast);

  useEffect(() => {
    messages.forEach((message) => {
      if (message.duration) {
        const timer = setTimeout(() => {
          dispatch(removeToast(message.id));
        }, message.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [messages, dispatch]);

  const handleRemove = (message: any) => {
    dispatch(removeToast(message.id));
  };

  return (
    <Toast
      position="top-right"
      baseZIndex={1000}
      className="z-50"
      onRemove={handleRemove}
    />
  );
};

export default ToastContainer; 