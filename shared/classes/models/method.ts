import { TransactionType } from "./transaction";

export interface MethodItemProps {
  id: string;
  name: string;
  type?: TransactionType;
}
