import { firestore } from '@/firebaseConfig';
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { CategoryItemProps } from '../classes/models/category';
import { TransactionType } from '../classes/models/transaction';

export const useCategories = (filterType: TransactionType = 'income') => {
  const [categories, setCategories] = useState<CategoryItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapDoc = (doc: QueryDocumentSnapshot<DocumentData>): CategoryItemProps => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
    };
  };

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const colRef = collection(firestore, 'categories');
      const snapshot = await getDocs(colRef);

      const all = snapshot.docs.map(mapDoc);
      const filtered = filterType ? all.filter(c => c.type === filterType) : all;

      setCategories(filtered);
    } catch (e: unknown) {
      console.error('Erro ao buscar categorias', e);
      setError((e as Error).message ?? 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
};