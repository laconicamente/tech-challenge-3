import { useAuth } from "@/shared/contexts/auth/AuthContext";
import { useFinancial } from "@/shared/contexts/financial/FinancialContext";
import { fetchAnalysisMonthly } from "@/shared/services/widgetService";
import { useEffect, useState } from "react";

export const useAnalysisMonthlyData = () => {
  const { user } = useAuth();
  const { transactions } = useFinancial();
  const [widgetData, setWidgetData] = useState<{monthIncome: number; monthExpense: number; differenceValue: number; totalValue: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAnalysisMonthly = async () => {
    try {
      setIsLoading(true);
      const responseData = await fetchAnalysisMonthly(user?.uid || "");
      setWidgetData(responseData);
    } catch (e: unknown) {
      console.error("Ocorreu um erro ao buscar as entradas e saídas mensais.", e);
      setError((e as Error).message ?? "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnalysisMonthly();
  }, [transactions]);

  return { widgetData, isLoading, error };
};
