import { firestore } from "@/firebaseConfig";
import {
    DocumentData,
    FirestoreError,
    QueryDocumentSnapshot,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    TransactionFilter,
    TransactionItemProps,
} from "../classes/models/transaction";
import {
    formatDate,
    formatDateISO,
    parseDateString,
    toDateFromFirestore,
} from "../helpers/formatDate";
import { getCategoryById } from "../services/categoryService";
import { getMethodById } from "../services/methodService";

export interface TransactionsResponse {
  transactions: TransactionItemProps[];
  isLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  hasMore: boolean;
  error: string | null;
  filters: TransactionFilter;
  setFilters: (f: TransactionFilter) => void;
  refetch: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addTransaction?: (data: Partial<TransactionItemProps>) => Promise<void>;
  editTransaction?: (
    id: string,
    data: Partial<TransactionItemProps>
  ) => Promise<void>;
}

export function useTransactions(
  initial: TransactionFilter = {},
  pageSize: number = 10
): TransactionsResponse {
  const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);
  const [filters, setFilters] = useState<TransactionFilter>(initial);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const lastVisibleRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { userId, categoryId, startDate, endDate } = filters;

  const mapDoc = async (
    doc: QueryDocumentSnapshot<DocumentData>
  ): Promise<TransactionItemProps> => {
    const data = doc.data();
    const formattedCreatedAt = toDateFromFirestore(data.createdAt);

    const category = await getCategoryById(data.categoryId);
    const method = await getMethodById(data.methodId);

    return {
      id: doc.id,
      userId: data.userId,
      categoryId: data.categoryId,
      methodId: data.methodId,
      categoryName: category?.name,
      methodName: method?.name,
      type: data.type,
      value: typeof data.value === "number" ? data.value : Number(data.value),
      createdAt: formatDateISO(formattedCreatedAt),
      createdAtDisplay: formatDate(formattedCreatedAt),
      ...data,
    };
  };

  const buildBaseQuery = useCallback(
    (forMore: boolean = false) => {
      const base = collection(firestore, "transactions");
      const constraints = [];

      if (userId) constraints.push(where("userId", "==", userId));
      if (categoryId) constraints.push(where("categoryId", "==", categoryId));

      const start = parseDateString(startDate);
      const end = parseDateString(endDate);
      const endWithTime = end
        ? new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate(),
            23,
            59,
            59,
            999
          )
        : undefined;

      if (start) constraints.push(where("createdAt", ">=", start));
      if (endWithTime) constraints.push(where("createdAt", "<=", endWithTime));

      constraints.push(orderBy("createdAt", "desc"));
      constraints.push(limit(pageSize));

      if (forMore && lastVisibleRef.current) {
        constraints.push(startAfter(lastVisibleRef.current));
      }

      return query(base, ...constraints);
    },
    [userId, categoryId, startDate, endDate, pageSize]
  );

  const fetchFirstPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHasMore(true);
    lastVisibleRef.current = null;
    
    try {
      const qRef = buildBaseQuery(false);
      const snap = await getDocs(qRef);
      const list = await Promise.all(snap.docs.map(mapDoc));
      setTransactions(list);
      if (snap.docs.length < pageSize) {
        setHasMore(false);
      } else {
        lastVisibleRef.current = snap.docs[snap.docs.length - 1] || null;
      }
    } catch (e) {
      const err = e as FirestoreError;
      console.error("Erro ao buscar transações", err);
      setError(err.message ?? "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [buildBaseQuery, pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) return;

    setIsLoadingMore(true);
    try {
      const qRef = buildBaseQuery(true);
      const snap = await getDocs(qRef);
      const list = await Promise.all(snap.docs.map(mapDoc));
      if (list.length === 0) {
        setHasMore(false);
        return;
      }
      setTransactions((prev) => [...prev, ...list]);
      if (snap.docs.length < pageSize) {
        setHasMore(false);
      } else {
        lastVisibleRef.current =
          snap.docs[snap.docs.length - 1] || lastVisibleRef.current;
      }
    } catch (e) {
      const err = e as FirestoreError;
      setError(
        err.message ??
          "Não foi possível carregar mais dados, tente novamente mais tarde."
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [buildBaseQuery, hasMore, isLoadingMore, isLoading, pageSize]);

  const refetch = useCallback(async () => {
    await fetchFirstPage();
  }, [fetchFirstPage]);

  const addTransaction = async (data: Partial<TransactionItemProps>) => {
    try {
      setIsLoading(true);
      await addDoc(collection(firestore, "transactions"), { ...data });
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const editTransaction = async (
    id: string,
    data: Partial<TransactionItemProps>
  ) => {
    try {
      setIsLoading(true);
      const refCard = doc(firestore, "transactions", id);
      await updateDoc(refCard, { ...data });
    } catch (error) {
      console.error("Erro ao editar transação: ", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!id) throw new Error("ID inválido");
    try {
      setIsLoading(true);
      const refCard = doc(firestore, "transactions", id);
      await deleteDoc(refCard);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
    } catch (e: unknown) {
      console.error("Erro ao excluir transação", e);
      setError(
        (e as Error).message ??
          "Ocorreu um erro ao excluir esta transação, tente novamente por favor."
      );
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  return {
    transactions,
    isLoading,
    isLoadingMore,
    error,
    filters,
    setFilters,
    refetch,
    loadMore,
    deleteTransaction,
    addTransaction,
    editTransaction,
    hasMore,
  };
}
