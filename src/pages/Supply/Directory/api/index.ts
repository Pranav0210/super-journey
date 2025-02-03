import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const getAllTransporters = (pageNo): Promise<AxiosResponse<any>> => {
  return axios.get(`/truck/all-transporters?pageNo=${pageNo}&pageSize=10`, {
    headers: {
      app: "supply",
    },
  });
};

export const deleteTruck = (payload: string): Promise<AxiosResponse<any>> => {
  return axios.delete(`/truck/${payload}`, {
    headers: {
      app: "supply",
    },
  });
};

export const getTransporterContact = (loadId): Promise<AxiosResponse<any>> => {
  return axios.get(`/truck/transporter/contact/${loadId}`, {
    headers: {
      app: "demand",
    },
  });
};