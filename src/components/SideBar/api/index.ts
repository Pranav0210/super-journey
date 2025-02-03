import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const logout = (): Promise<AxiosResponse<any>> => {
  return axios.get(`/auth/logout`, {
    headers: {
      app: "demand",
    },
  });
};
