import { CategoryWidgetItem } from "@/shared/classes/models/category";
import { useAuth } from "@/shared/contexts/auth/AuthContext";
import { useFinancial } from "@/shared/contexts/financial/FinancialContext";
import { fetchBiggestEntries } from "@/shared/services/widgetService";
import { useEffect, useState } from "react";

export const useBiggestEntriesData = () => {
  const { user } = useAuth();
  const { transactions } = useFinancial();
  const [widgetData, setWidgetData] = useState<CategoryWidgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBiggestEntries = async () => {
    try {
      setIsLoading(true);
      const responseData = await fetchBiggestEntries(user?.uid || "");
      setWidgetData(responseData);
    } catch (e: unknown) {
      console.error("Ocorreu um erro ao buscar as maiores entradas.", e);
      setError((e as Error).message ?? "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBiggestEntries();
  }, [transactions]);

  return { widgetData, isLoading, error };
};
