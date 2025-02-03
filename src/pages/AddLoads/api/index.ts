import { axios } from "@/lib/axios";
import { LoadDataResponse } from "@/types";
import { AxiosResponse } from "axios";

export const getTruckConfigs = (payload: any): Promise<AxiosResponse<any>> => {
  console.log("api triggered", typeof payload.toneage, typeof payload.unit);

  return axios.post(
    "/load/fetch/config",
    {
      toneage: Number(payload.toneage),
      unit: payload.unit,
    },
    {
      headers: {
        app: "demand",
      },
    },
  );
};

export const postLoad = (payload: any): Promise<AxiosResponse<any>> => {
  console.log("api triggered", payload);

  return axios.post(
    "/load",
    {
      weight: payload.quantity,
      materialName: payload.material,
      pickupPoint: payload.pickupPoint.name,
      pickupPlaceId: payload.pickupPoint.placeId,
      dropPoint: payload.dropPoint.name,
      dropPlaceId: payload.dropPoint.placeId,
      truckLength: payload.length.length > 0 ? payload.length : "0",
      truckBody: payload.body,
      truckAxle: "OPEN",
      truckTires: 9,
      unit: payload.unit,
      fare: Number(payload.approxFare),
      expirationTime: payload.expirationTime,
    },
    {
      headers: {
        app: "demand",
      },
    },
  );
};

export const updateLoad = (payload: any): Promise<AxiosResponse<any>> => {
  console.log("api triggered", payload);

  return axios.put(
    `/load/${payload.id}`,
    {
      weight: payload.quantity,
      materialName: payload.material,
      pickupPoint: payload.pickupPoint,
      dropPoint: payload.dropPoint,
      // expirationTime: payload.expirationTime,
      truckLength: payload.length,
      truckBody: payload.body,
      truckAxle: "OPEN",
      truckTires: 9,
      fare: Number(payload.approxFare),
      expirationTime: payload.expirationTime,
    },
    {
      headers: {
        app: "demand",
      },
    },
  );
};

export const getLoad = (payload: string): Promise<LoadDataResponse> => {
  console.log("api triggered", payload);

  return axios.get(`/load/${payload}`, {
    headers: {
      app: "demand",
    },
  });
};

export const getLoadValues = (payload): Promise<AxiosResponse> => {
  return axios.get(`/truck/available-loads`, {
    headers: {
      app: "demand",
    },
    params: {
      unit: payload
    }
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
