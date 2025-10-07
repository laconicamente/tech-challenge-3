import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/auth/AuthContext";
import { BalanceValueFilters, fetchBalanceValue } from "../services/balanceService";

export function useBalanceValue(filters: BalanceValueFilters = {}) {
  const {user } = useAuth();
  const { startDate, endDate, categoryId } = filters || {};
  const [total, setTotal] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [errorTotal, setErrorTotal] = useState<string | null>(null);

  const fetchTotal = useCallback(async () => {
    if (!user) {
      setTotal(0);
      return;
    }
    setIsLoadingBalance(true);
    setErrorTotal(null);
    try {
      filters.userId = user.uid;
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
  }, [user, startDate, endDate, categoryId]);

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
