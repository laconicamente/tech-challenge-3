import { useCallback, useEffect, useState } from 'react';
import { MethodItemProps } from '../classes/models/method';
import { TransactionType } from '../classes/models/transaction';
import { fetchMethods } from '../services/methodService';

export const useMethods = (filterType: TransactionType = 'income') => {
  const [methods, setMethods] = useState<MethodItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMethods = useCallback(async () => {
    try {
      setIsLoading(true);
      const methods = await fetchMethods(filterType);
      setMethods(methods);
    } catch (e: unknown) {
      console.error('Erro ao buscar os métodos de pagamento', e);
      setError((e as Error).message ?? 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    getMethods();
  }, [getMethods]);

  return { methods, isLoading, error };
};