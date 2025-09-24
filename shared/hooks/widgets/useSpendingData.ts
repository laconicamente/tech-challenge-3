import { CategoryWidgetItem } from "@/shared/classes/models/category";
import { TransactionType } from "@/shared/classes/models/transaction";
import { useAuth } from "@/shared/contexts/auth/AuthContext";
import { useFinancial } from "@/shared/contexts/financial/FinancialContext";
import { fetchSpendingByCategory } from "@/shared/services/widgetService";
import { useCallback, useEffect, useState } from "react";

export const useWidgetSpendingByCategory = (
  filterType: TransactionType = "income"
) => {
  const { user } = useAuth();
  const { transactions } = useFinancial();
  const [widgetData, setWidgetData] = useState<CategoryWidgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSpendingByCategory = useCallback(async () => {
    try {
      setIsLoading(true);
      const responseData = await fetchSpendingByCategory(user?.uid || "");
      setWidgetData(responseData);
    } catch (e: unknown) {
      console.error("Ocorreu um erro ao buscar o widget de gastos por categoria.", e);
      setError((e as Error).message ?? "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    getSpendingByCategory();
  }, [getSpendingByCategory, transactions]);

  return { widgetData, isLoading, error };
};
