import { Masks } from "react-native-mask-input";

export type InputMask = "currency" | "date" | "card" | "expiry" | "cvv";

const onlyDigits = (v: string) => v.replace(/\D/g, "");
export const currencyMask = Masks.BRL_CURRENCY;
export const dateMask = Masks.DATE_DDMMYYYY;
export const cardMask: any[] = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const expiryMask: any[] = [/\d/, /\d/, "/", /\d/, /\d/];
export const cvvMask: any[] = [/\d/, /\d/, /\d/];

export const formatCardNumber = (v: string) => {
  const digits = onlyDigits(v).slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
};

export const unmaskCardNumber = (v: string) => v.replace(/\s/g, "");

export const formatExpiredDate = (v: string) => {
  let digits = onlyDigits(v).slice(0, 4); // MMYY
  if (digits.length === 0) return "";
  if (digits.length <= 2) {
    const mm = digits;
    if (mm.length === 2) {
      let mNum = parseInt(mm, 10);
      if (mNum === 0) mNum = 1;
      if (mNum > 12) mNum = 12;
      return mNum.toString().padStart(2, "0");
    }
    return mm;
  }
  const mm = digits.slice(0, 2);
  let mNum = parseInt(mm, 10);
  if (mNum === 0) mNum = 1;
  if (mNum > 12) mNum = 12;
  const yy = digits.slice(2);
  return `${mNum.toString().padStart(2, "0")}/${yy}`;
};

export const formatCVV = (v: string) => onlyDigits(v).slice(0, 4);
