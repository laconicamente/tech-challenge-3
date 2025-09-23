import { useCallback, useEffect, useState } from 'react';
import { CategoryItemProps } from '../classes/models/category';
import { TransactionType } from '../classes/models/transaction';
import { fetchCategories } from '../services/categoryService';

export const useCategories = (filterType?: TransactionType) => {
  const [categories, setCategories] = useState<CategoryItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const categories = await fetchCategories(filterType);
      setCategories(categories);
    } catch (e: unknown) {
      console.error('Erro ao buscar categorias', e);
      setError((e as Error).message ?? 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return { categories, isLoading, error, getCategories };
};