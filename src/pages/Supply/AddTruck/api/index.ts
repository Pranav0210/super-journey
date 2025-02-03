import { axios } from "@/lib/axios";
import { TruckDataResponse } from "@/types";
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

export const postTruck = (payload: any): Promise<AxiosResponse<any>> => {
  console.log("api triggered", payload);

  return axios.post(
    "/truck",
    {
      regnNo: payload.regNo,
      tires: 8,
      capacity: payload.quantity,
      bodyType: payload.body,
      axleType: "SMALL",
      length: Number(payload.length),
      expirationTime: payload.expirationTime ?? "2025-01-06T17:19:01.000Z",
      pickupPoint: payload.pickupPoint.name,
      pickupPlaceId: payload.pickupPoint.placeId,
      dropPoint: payload.dropPoint.name,
      dropPlaceId: payload.dropPoint.placeId,
      fare: Number(payload.minPrice)
    },
    // {
    //   weight: payload.quantity,
    //   materialName: payload.material,
    //   pickupPoint: payload.pickupPoint,  
    //   dropPoint: payload.dropPoint,
    //   // expirationTime: payload.expirationTime,
    //   truckLength: payload.length,
    //   truckBody: payload.body,
    //   truckAxle: "OPEN",
    //   truckTires: 9,
    //   unit: payload.unit,
    //   fare: Number(payload.approxFare),
    //   expirationTime: payload.expirationTime,
    // },
    {
      headers: {
        app: "demand",
      },
    },
  );
};

export const updateTruck = (payload: any): Promise<AxiosResponse<any>> => {
  console.log("api triggered", payload);

  return axios.put(
    `/truck/${payload.id}`,
    {
      regnNo: payload.regNo,
      tires: 8,
      capacity: payload.quantity,
      bodyType: payload.body,
      axleType: "SMALL",
      // length: payload.length,
      expirationTime: payload.expirationTime ?? "2025-01-06T17:19:01.000Z",
      pickupPoint: payload.pickupPoint.name,
      pickupPlaceId: payload.pickupPoint.placeId,
      dropPoint: payload.dropPoint.name,
      dropPlaceId: payload.dropPoint.placeId,
      fare: Number(payload.minPrice)
    },
    {
      headers: {
        app: "demand",
      },
    },
  );
};

export const getTruck = (payload: string): Promise<TruckDataResponse> => {
  console.log("api triggered", payload);

  return axios.get(`/truck/${payload}`, {
    headers: {
      app: "supply",
    },
  });
};

export const getLoadValues = (payload): Promise<AxiosResponse> => {
  return axios.get(`/truck/available-loads`, {
    headers: {
      app: "demand",
    },
    params:{
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
