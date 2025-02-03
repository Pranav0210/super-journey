import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const postBulkLoads = (payload): Promise<AxiosResponse<any>> => {
  console.log("api triggered", typeof payload.toneage, typeof payload.unit);

  return axios.post("/load/bulkload", payload, {
    headers: {
      app: "demand",
    },
  });
};

export const getUserBulkLoads = (): Promise<AxiosResponse<any>> => {
  return axios.get("/load/allbulk?pageNo=1&pageSize=10", {
    headers: {
      app: "demand",
    },
  });
};
