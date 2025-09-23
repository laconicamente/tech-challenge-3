import { FieldValue } from "firebase/firestore";

export interface BankCardProps {
  id?: string,
  number: string;
  type: BankCardType;
  color?: string;
  name: string;
  cvv: number;
  flag: BankCardFlag;
  expiredAt: string;
  userId?: string;
  blocked?: boolean;
  principal?: boolean;
  createdAt: FieldValue | string;
}

export type BankCardType = "Platinum" | "Gold" | "Black" | "Standard";

export enum BankCardFlag {
  Visa = "Visa",
  MasterCard = "MasterCard",
  Elo = "Elo",
}
