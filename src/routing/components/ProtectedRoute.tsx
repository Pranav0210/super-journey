import { getAuth } from "@/routing/api";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: ["getAuth"],
    mutationFn: getAuth,
    onError() {
      // setAuth({ isAuthenticated: false, userId: null });
      navigate("/login");
    },
  });
  useEffect(() => {
    mutate();
  }, []);
  // const checkAuth = async () => {
  //     try {
  //         const response = await getAuth();
  //         console.log(response)
  //         setAuth({ isAuthenticated: response.isAuthorized, userId: response.userId });
  //     } catch {
  //         setAuth({ isAuthenticated: false, userId: null });
  //     }
  // };

  // checkAuth();
  // const { isAuthenticated } = useAuth();
  // console.log(isAuthenticated, 'isAuth')
  return <>{children}</>;
};

export default ProtectedRoute;
