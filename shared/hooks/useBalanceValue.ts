import { firestore } from '@/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export interface BalanceValueFilters {
  userId?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

/**
 * Hook para calcular o total de valores de transações do tipo "income" com base em filtros.
 * Reexecuta sempre que filtros mudarem.
 */
export function useBalanceValue(filters: BalanceValueFilters) {
  const { userId, startDate, endDate, categoryId } = filters || {};
  const [total, setTotal] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [errorTotal, setErrorTotal] = useState<string | null>(null);
  
  const fetchTotal = useCallback(async () => {
    if (!userId) {
      setTotal(0);
      return;
    }
    setLoadingTotal(true);
    setErrorTotal(null);
    try {
      const constraints: any[] = [
        where('userId', '==', userId)
      ];

    const qRef = query(collection(firestore, 'transactions'), ...constraints);
    const snap = await getDocs(qRef);
   
    let incomeSum = 0;
      let expenseSum = 0;

      snap.docs.forEach(d => {
        const data: any = d.data();
        const value = Number(data.value) || 0;
        if (data.type === 'income') incomeSum += value;
        else if (data.type === 'expense') expenseSum += value;
      });

      const totalValue = incomeSum - expenseSum;
      setTotal(totalValue);
    } catch (e: any) {
      setErrorTotal(e.message ?? 'Erro desconhecido ao calcular o saldo total.');
      setTotal(0);
    } finally {
      setLoadingTotal(false);
    }
  }, [userId, startDate, endDate, categoryId]);

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  return { total, loadingTotal, errorTotal, refetchBalanceValue: fetchTotal };
}
