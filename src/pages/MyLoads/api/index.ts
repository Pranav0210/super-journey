import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const getMyLoads = (pageNo): Promise<AxiosResponse<any>> => {
  return axios.get(`/load/user?pageNo=${pageNo}&pageSize=10`, {
    headers: {
      app: "demand",
    },
  });
};

export const deleteLoad = (payload: string): Promise<AxiosResponse<any>> => {
  return axios.delete(`/load/${payload}`, {
    headers: {
      app: "demand",
    },
  });
};
