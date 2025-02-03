export interface Step1Data {
  companyName: string;
  description?: string;
  homebase?: OperatingCity;
  operatingCities: OperatingCity[]
}

export interface OperatingCity {
  name: string;
  placeId: string;
}

export interface Step2Data {
  operatingCities: OperatingCity[]
}

export interface StepperFormState {
  step1Data: Step1Data;

  setStep1Data: (data: Step1Data) => void;

  resetForm: () => void;
}
