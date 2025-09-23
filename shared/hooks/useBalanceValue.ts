import { useCallback, useEffect, useState } from "react";
import { BalanceValueFilters, fetchBalanceValue } from "../services/balanceService";

export function useBalanceValue(filters: BalanceValueFilters) {
  const { userId, startDate, endDate, categoryId } = filters || {};
  const [total, setTotal] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [errorTotal, setErrorTotal] = useState<string | null>(null);

  const fetchTotal = useCallback(async () => {
    if (!userId) {
      setTotal(0);
      return;
    }
    setIsLoadingBalance(true);
    setErrorTotal(null);
    try {
      const totalValue = await fetchBalanceValue(filters);
      setTotal(totalValue);
    } catch (e: any) {
      setErrorTotal(
        e.message ?? "Ocorreu um erro ao calcular o saldo total, tente novamente por favor."
      );
      setTotal(0);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [userId, startDate, endDate, categoryId]);

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  return {
    total,
    isLoadingBalance,
    errorTotal,
    refetchBalanceValue: fetchTotal,
  };
}
