import { create } from "zustand";
import { StepperFormState } from "./types";

const useStepperFormStore = create<StepperFormState>((set) => ({
  step1Data: { pickupPoint: "", dropPoint: "" },
  step2Data: {
    material: "",
    quantity: "",
    unit: "TN",
    approxFare: "",
    expirationTime: "",
  },
  step3Data: { body: "", length: "" },

  setStep1Data: (data) =>
    set((state) => ({ step1Data: { ...state.step1Data, ...data } })),
  setStep2Data: (data) =>
    set((state) => ({ step2Data: { ...state.step2Data, ...data } })),
  setStep3Data: (data) =>
    set((state) => ({ step3Data: { ...state.step3Data, ...data } })),

  resetForm: () =>
    set({
      step1Data: { pickupPoint: "", dropPoint: "" },
      step2Data: {
        material: "",
        quantity: "",
        unit: "TN",
        approxFare: "",
        expirationTime: "",
      },
      step3Data: { body: "", length: "" },
    }),
}));

export default useStepperFormStore;
