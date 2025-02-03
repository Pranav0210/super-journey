import { createContext, useContext, useState, useCallback } from "react";
import Toast from "./Toast";
import cn from "classnames";
// Create the context
const ToastContext = createContext(null);

// Custom hook for using the Toast context
export const useToast = () => {
  return useContext(ToastContext);
};

// Provider component
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [startTransition, setStartTransition] = useState<boolean>(true);

  const showToast = useCallback(
    ({ message, type = "success", duration = 3000 }) => {
      setToast({ message, type, duration });
      setStartTransition(true);
      setTimeout(() => setStartTransition(false), duration - 300);
      setTimeout(() => setToast(null), duration);
    },
    [],
  );

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          classNames={cn("transition-all duration-300 ease-in-out transform", {
            "opacity-90 translate-y-0": startTransition,
            "opacity-0 -translate-y-5": !startTransition,
          })}
        />
      )}
    </ToastContext.Provider>
  );
};
