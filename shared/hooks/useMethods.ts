import { firestore } from '@/firebaseConfig';
import { collection, doc, DocumentData, getDoc, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { MethodItemProps } from '../classes/models/method';
import { TransactionType } from '../classes/models/transaction';

export const useMethods = (filterType: TransactionType = 'income') => {
  const [methods, setMethods] = useState<MethodItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapDoc = (doc: QueryDocumentSnapshot<DocumentData>): MethodItemProps => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
    };
  };

  const fetchMethods = useCallback(async () => {
    try {
      setIsLoading(true);
      const colRef = collection(firestore, 'methods');
      const snapshot = await getDocs(colRef);

      const all = snapshot.docs.map(mapDoc);
      const filtered = filterType ? all.filter(c => c.type === filterType) : all;

      setMethods(filtered);
    } catch (e: unknown) {
      console.error('Erro ao buscar os métodos de pagamento', e);
      setError((e as Error).message ?? 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const getMethodById = useCallback(async (id: string) => {
      try {
        if (id) {
          const ref = doc(firestore, 'methods', id);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            return mapDoc(snap as any);
          } else {
            return null;
          }
        }
      } catch (e: unknown) {
        console.error('Erro ao buscar método por ID', e);
        setError((e as Error).message ?? 'Erro desconhecido');
      }
    }, []);

  return { methods, isLoading, error, getMethodById, refetch: fetchMethods };
};