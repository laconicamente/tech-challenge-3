import { firestore } from "@/firebaseConfig";
import {
    DocumentData,
    FirestoreError,
    QueryDocumentSnapshot,
    Timestamp,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    TransactionFilter,
    TransactionItemProps,
} from "../classes/models/transaction";
import { useCategories } from "./useCategories";
import { useMethods } from "./useMethods";

interface TransactionsResponse {
  transactions: TransactionItemProps[];
  isLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  hasMore: boolean;
  error: string | null;
  filters: TransactionFilter;
  setFilters: (f: TransactionFilter) => void;
  refetch: () => Promise<void>;
}

const toDateFromFirestore = (raw: any): Date | null => {
    if (!raw) return null;
    // Firestore Timestamp instance
    if (raw instanceof Timestamp) return raw.toDate();
    // Serialized plain object { seconds, nanoseconds }
    if (
      typeof raw === 'object' &&
      typeof raw.seconds === 'number' &&
      typeof raw.nanoseconds === 'number'
    ) {
      return new Date(raw.seconds * 1000 + Math.floor(raw.nanoseconds / 1_000_000));
    }
    // ISO/string fallback
    if (typeof raw === 'string') {
      const d = new Date(raw);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  };
  
  const formatDateISO = (d: Date | null) => (d ? d.toISOString() : '');
  const formatDate = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString('pt-BR') : '';
  
  function parseDateString(input?: string): Date | undefined {
    if (!input) return undefined;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
      const [d, m, y] = input.split("/").map(Number);
      const dt = new Date(y, (m ?? 1) - 1, d);
      return isNaN(dt.getTime()) ? undefined : dt;
    }
    const dt = new Date(input);
    return isNaN(dt.getTime()) ? undefined : dt;
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
  const { getCategoryById } = useCategories();
  const { getMethodById } = useMethods();
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
    hasMore,
  };
}
