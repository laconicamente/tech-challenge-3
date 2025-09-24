import { firestore } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { CategoryWidgetItem } from "../classes/models/category";
import { TransactionItemProps } from "../classes/models/transaction";
import { getCategoryById } from "./categoryService";

const generateShades = (index: number, totalItems: number) => {
    if (totalItems <= 1) return '#0f301a';

    const gStart = 50;
    const gEnd = 180;
    const ratio = index / (totalItems - 1);
    const g = Math.round(gStart - (gStart - gEnd) * ratio); 
  
    const r = Math.round(g * 0.28);
    const b = Math.round(g * 0.20);
  
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
  
    return `#${toHex(r)}${toHex(g)}${toHex(b)}2f`;
}

export const fetchSpendingByCategory = async (userId: string) => {
  const transactionsRef = collection(firestore, "transactions");

  const q = query(
    transactionsRef,
    where("userId", "==", userId),
    where("type", "==", "expense")
  );

  const querySnapshot = await getDocs(q);

  const spendingData: { [key: string]: CategoryWidgetItem } = {};

  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as TransactionItemProps;
      const categoryId = data.categoryId;
      if (categoryId) {
        const category = await getCategoryById(categoryId);

        const spendingValue =
          (spendingData[categoryId]?.value || 0) + Number(data.value) / 100;

        spendingData[categoryId] = {
          name: category?.name || "Sem categoria",
          value: spendingValue,
          color: '',
        };
      }
    })
  );

  const sortedSpending = Object.values(spendingData).sort((a, b) => b.value - a.value);

  return sortedSpending.map((item, index) => {
    return {
      ...item,
      color: generateShades(index, sortedSpending.length),
    };
  });
};