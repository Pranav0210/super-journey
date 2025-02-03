export interface Step1Data {
  pickupPoint: LocationPoint;
  dropPoint: LocationPoint;
}

export interface LocationPoint {
  name: string;
  place_id: string;
}

export interface Step2Data {
  material: string;
  quantity: string;
  unit: string;
  approxFare: string;
  expirationTime: string;
}

export interface Step3Data {
  body: string;
  // container: string;
  length: string;
}

export interface StepperFormState {
  step1Data: Step1Data;
  step2Data: Step2Data;
  step3Data: Step3Data;

  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;
  setStep3Data: (data: Step3Data) => void;

  resetForm: () => void;
}
