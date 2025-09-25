import { TransactionType } from "./transaction";

export interface CategoryItemProps {
  id?: string;
  name: string;
  type?: TransactionType;
  icon?: string;
}

export interface CategoryWidgetItem extends CategoryItemProps {
    value: number;
    color?: string;
}