import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { Response } from "src/types";
import { SendOtpDto, VerifyOtpDto } from "../dto/login.dto";
import { APP_TYPE } from "@/config";

export const sendOTP = (
  payload: SendOtpDto,
): Promise<AxiosResponse<any, any>> => {
  // console.log("test-send-api triggered");
  // console.log(phone.length, 'length')
  return axios.post(
    "/auth/otp",
    {
      phoneNumber: `+91${payload.phone}`,
    },
    {
      headers: {
        app: APP_TYPE,
      },
    },
  );
  // }
  // else {

  // }
  // return new Promise((resolve, reject) => {
  //   if (phone.length == 10)
  //     setTimeout(
  //       () =>
  //         resolve({
  //           errors: [],
  //           data: null,
  //           message: "OTP sent successfully",
  //           status: "success",
  //         }),
  //       1000,
  //     );
  //   else
  //     setTimeout(
  //       () =>
  //         reject({
  //           errors: ["Invalid Phone"],
  //           data: null,
  //           message: "Failed to send OTP",
  //           status: "error",
  //         }),
  //       1000,
  //     );
  // });
};

export const reSendOTP = (
  payload: SendOtpDto,
): Promise<AxiosResponse<any, any>> => {
  return axios.post(
    "/auth/resendotp",
    {
      phoneNumber: `+91${payload.phone}`,
    },
    {
      headers: {
        app: "demand",
      },
    },
  );
};

export const verifyOTP = (payload: VerifyOtpDto): Promise<Response<any>> => {
  console.log("test-verify-api triggered", payload.phone, payload.otp);

  return axios.post(
    "/auth/verify",
    {
      phoneNumber: `+91${payload.phone}`,
      otp: payload.otp,
    },
    {
      headers: {
        app: "demand",
      },
    },
  );
  return new Promise((resolve, reject) => {
    if (payload.otp == "123456" && payload.phone == "7894561230")
      setTimeout(
        () =>
          resolve({
            errors: [],
            data: {
              id: 1,
              name: "Demo User",
              phone: "7894561230",
              role: "admin",
            },
            message: "Demo login successful",
            status: "success",
          }),
        1000,
      );
    else
      setTimeout(
        () =>
          reject({
            errors: ["Invalid OTP"],
            data: null,
            message: "Demo login failed",
            status: "error",
          }),
        1000,
      );
  });
};
