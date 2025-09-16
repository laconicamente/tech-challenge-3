export interface BankCardProps {
  number: string;
  type: BankCardType;
  color: string;
  name: string;
  cvv: number;
  expireDate: string;
}

export type BankCardType = "Platinum" | "Gold" | "Black" | "Standard";
