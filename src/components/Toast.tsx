import React, { useState } from "react";
import cn from "classnames";
import { ToastProps } from "@/types";
import { Toastvariant } from "@/types/variants";

const Toast: React.FC<ToastProps> = ({
  message,
  duration = 3000,
  classNames,
}) => {
  const [visible, setVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        classNames,
        "fixed top-5 z-50 bg-blue-500 text-white px-4 py-2 rounded-3xl shadow-lg animate-fade-in",
      )}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Toast;
