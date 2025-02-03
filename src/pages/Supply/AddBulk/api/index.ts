import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const postBulkTrucks = (payload): Promise<AxiosResponse<any>> => {
  console.log("api triggered", typeof payload.toneage, typeof payload.unit);

  return axios.post("/truck/bulktruck", payload, {
    headers: {
      app: "supply",
    },
  });
};

export const getUserBulkTrucks = (): Promise<AxiosResponse<any>> => {
  return axios.get("/truck/all-bulk-truck?pageNo=1&pageSize=10", {
    headers: {
      app: "supply",
    },
  });
};
