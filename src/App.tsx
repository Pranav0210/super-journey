import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Routing from "./routing";
import { ToastProvider, useToast } from "./components/Toast/toastProvider";
import { useEffect } from "react";
import { setToastFunction } from "./lib/axios";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ToastSetter />
          <Routing />
        </ToastProvider>
      </QueryClientProvider>
    </>
  );
}

const ToastSetter = () => {
  const { showToast } = useToast();

  useEffect(() => {
    setToastFunction(showToast);
  }, [showToast]);
  return (
    <></>
  ) 
}
export default App;
