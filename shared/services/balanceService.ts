import { firestore } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  where,
} from "firebase/firestore";

export interface BalanceValueFilters {
  userId?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

export const fetchBalanceValue = async (filters: BalanceValueFilters) => {
  const constraints: QueryFieldFilterConstraint[] = [
    where("userId", "==", filters.userId),
  ];
console.log(filters.userId)
  const qRef = query(collection(firestore, "transactions"), ...constraints);
  const snap = await getDocs(qRef);

  let incomeSum = 0;
  let expenseSum = 0;

  snap.docs.forEach((d) => {
    const data = d.data();
    const value = Number(data.value) / 100 || 0;
    console.log(value)
    if (data.type === "income") incomeSum += value;
    else if (data.type === "expense") expenseSum += value;
  });

  return incomeSum - expenseSum;
};
