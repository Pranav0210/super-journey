import { create } from "zustand";
import { StepperFormState } from "./types";

const useStepperFormStore = create<StepperFormState>((set) => ({
  step1Data: { pickupPoint: { name: "", place_id: "" }, dropPoint: { name: "", place_id: "" } },
  step2Data: {
    regNo: "",
    minPrice: "",
    expirationTime: "",
    quantity: "",
    unit: "TN",
    body: "",
    length: ""
  },
  step3Data: { body: "", length: "" },

  setStep1Data: (data) =>
    set((state) => ({ step1Data: { ...state.step1Data, ...data } })),
  setStep2Data: (data) =>
    set((state) => ({ step2Data: { ...state.step2Data, ...data } })),

  resetForm: () =>
    set({
      step1Data: { pickupPoint: { name: "", place_id: "" }, dropPoint: { name: "", place_id: "" } },
      step2Data: {
        regNo: "",
        minPrice: "",
        expirationTime: "",
        quantity: "",
        unit: "TN",
        body: "",
        length: ""
      },
    }),
}));

export default useStepperFormStore;
