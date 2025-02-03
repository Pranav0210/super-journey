import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const allowDigitsInputOnly = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  if (!/^\d*$/.test(e.target.value)) {
    e.target.value = e.target.value.replace(/\D/g, "");
  }
  return e.target.value;
  // else if (e.target.value.length == 10)
  // setQuantity(e.target.value);
};

export const allowPositiveDigitsOnly = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  // Remove any character that is not a digit
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
  return e.target.value;
};
