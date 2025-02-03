import { axios } from "@/lib/axios";
import { TruckDataResponse } from "@/types";
import { AxiosResponse } from "axios";

export const postTransporter = (payload: any): Promise<AxiosResponse<any>> => {
  console.log("api triggered", payload);

  return axios.post(
    "/truck/transporter",
    {
      companyName: payload.companyName,
      homeBase: payload.homebase,
      operatingCities: payload.operatingCities
    },
    {
      headers: {
        app: "supply",
      },
    },
  );
};

export const updateTransporter = (payload: any): Promise<AxiosResponse<any>> => {
  console.log("api triggered", payload);

  return axios.put(
    `/truck/transporter${payload.id}`,
    {
      companyName: payload.companyName,
      homeBase: payload.homebase
    },
    {
      headers: {
        app: "demand",
      },
    },
  );
};

export const getTransporter = (payload: string): Promise<TruckDataResponse> => {
  console.log("api triggered", payload);

  return axios.get(`/truck/transporter${payload}`, {
    headers: {
      app: "supply",
    },
  });
};

export const getGooglePlaces = (
  payload: string,
): Promise<AxiosResponse<any>> => {
  return axios.post(
    "/google/places",
    { location: payload },
    {
      headers: {
        app: "demand",
      },
    },
  );
};
