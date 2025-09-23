export interface BankCardProps {
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
}

export type BankCardType = "Platinum" | "Gold" | "Black" | "Standard";

export enum BankCardFlag {
  Visa = "Visa",
  MasterCard = "MasterCard",
  Elo = "Elo",
}
