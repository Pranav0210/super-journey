import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const getMyTrucks = (pageNo): Promise<AxiosResponse<any>> => {
  return axios.get(`/truck/user?pageNo=${pageNo}&pageSize=10`, {
    headers: {
      app: "demand",
    },
  });
};

export const deleteTruck = (payload: string): Promise<AxiosResponse<any>> => {
  return axios.delete(`/truck/${payload}`, {
    headers: {
      app: "demand",
    },
  });
};
