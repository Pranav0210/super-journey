import { create } from "zustand";
import { StepperFormState } from "./types";

const useStepperFormStore = create<StepperFormState>((set) => ({
  step1Data: { operatingCities: [], companyName: "", homebase: { name: "", placeId: "" } },

  setStep1Data: (data) =>
    set((state) => ({ step1Data: { ...state.step1Data, ...data } })),
  // setStep2Data: (data) =>
  //   set((state) => ({ step2Data: { ...state.step2Data, ...data } })),

  resetForm: () =>
    set({
      step1Data: { operatingCities: [], companyName: "", homebase: { name: "", placeId: "" } },
      // step2Data: {
      //   regNo: "",
      //   minPrice: "",
      //   expirationTime: "",
      // },
    }),
}));

export default useStepperFormStore;
