export interface Step1Data {
  pickupPoint: LocationPoint;
  dropPoint: LocationPoint;
}

export interface Step2Data {
  regNo: string;
  minPrice?: string;
  expirationTime?: string;
  body: string;
  quantity: string;
  length: string;
  unit?: string
}

export interface LocationPoint {
  name: string;
  placeId: string;
}

export interface StepperFormState {
  step1Data: Step1Data;
  step2Data: Step2Data;

  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;

  resetForm: () => void;
}
