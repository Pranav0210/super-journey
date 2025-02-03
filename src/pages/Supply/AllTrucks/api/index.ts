import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import loadData from "../data";

export const getTrucks = (pageNo): Promise<AxiosResponse<any>> => {
  return axios.get(`/marketplace/truck?search&pageNo=${pageNo}&pageSize=10`, {
    headers: {
      app: "demand",
    },
  });
  // return new Promise((resolve) => {
  //   setTimeout(
  //     () =>
  //       resolve({
  //         errors: [],
  //         data: loadData,
  //         message: "Load Data fetched successfully",
  //         status: "success",
  //       }),
  //     1500,
  //   );
  // });
};

export const getContact = (loadId): Promise<AxiosResponse<any>> => {
  return axios.get(`/truck/contact/${loadId}`, {
    headers: {
      app: "demand",
    },
  });
};
