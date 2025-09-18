import { TransactionType } from "./transaction";

export interface CategoryItemProps {
  id: string;
  name: string;
  type?: TransactionType;
}
