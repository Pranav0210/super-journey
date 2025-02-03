import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export interface StepperForm {
  rootClassName?: string;
  timelineContainerClassName?: string;
  stepperFormItems: StepperFormItem[];
}
export interface StepperFormItem {
  title: string;
  component: ReactNode;
}

export interface ButtonProps {
  title: any;
  onClick?: () => void;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | undefined;
  className?: string;
  disabled?: boolean;
  isIconRight?: boolean;
  iconClassName?: string;
  tooltip?: string;
  titleClassName?: string;
}

export type CardProps = React.ComponentProps<typeof Card>;

export interface Response<T> {
  some?(arg0: (obj: any) => boolean): unknown;
  map?(arg0: (item: any) => void): unknown;
  errors: any[];
  data: T;
  message: string;
  status: string;
}

export interface PaginationDataProps<T> {
  data: T[];
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
}

export interface ToastProps {
  message: string;
  duration?: number;
  classNames?: string;
}

export interface LoadDataResponse {
  id: string
  weight: string;
  materialName: string;
  pickupPoint: string;
  dropPoint: string;
  // expirationTime: payload.expirationTime,
  truckLength: string;
  truckBody: string;
  truckAxle: "OPEN";
  truckTires: 9;
  fare: string;
  unit: string;
  expirationTime: string;
}

export interface TruckDataResponse {
  id: string;
  regnNo: string;
  capacity: string;
  pickupPoint: string;
  dropPoint: string;
  postedBy: string,
  length: string;
  bodyType: string;
  axleType: "OPEN";
  tires: 9;
  fare: string;
  bulkLogId: string;
  expirationTime: string;
}

export interface MenuItem {
  icon: ReactNode;
  path: string;
  name: string;
}

export interface SidebarProps {
  menu: MenuItem[][],
  footer: string,
  containerClassNames?: string
  variant?: string
}