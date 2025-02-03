import { axios } from "@/lib/axios";

export const getAuth = (): Promise<{
  isAuthorized: boolean;
  userId: string;
}> => {
  return axios.get("/auth/me", {
    headers: {
      app: "demand",
    },
  });
};
