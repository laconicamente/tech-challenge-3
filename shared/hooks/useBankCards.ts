import { firestore } from "@/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { BankCardFlag, BankCardProps } from "../classes/models/bank-card";
import { useAuth } from "../contexts/auth/AuthContext";
import { formatDateISO, toDateFromFirestore } from "../helpers/formatDate";

export const useBankCards = () => {
  const { user } = useAuth();
  const [bankCards, setBankCards] = useState<BankCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapDoc = (doc: QueryDocumentSnapshot<DocumentData>): BankCardProps => {
    const data = doc.data();
    const formattedCreatedAt = toDateFromFirestore(data.createdAt);

    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      color: data.color,
      cvv: data.cvv,
      expiredAt: data.expiredAt,
      userId: data.userId,
      blocked: data.blocked,
      principal: data.principal,
      number: data.number,
      flag: data.flag ?? BankCardFlag.Visa,
      createdAt: formatDateISO(formattedCreatedAt),
    };
  };

  const fetchBankCards = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const constraints: QueryFieldFilterConstraint[] = [
        where("userId", "==", user.uid),
      ];

      const qRef = query(collection(firestore, "cards"), ...constraints);
      const snap = await getDocs(qRef);
      const docData = snap.docs.map(mapDoc);

      setBankCards(docData);
    } catch (e: unknown) {
      console.error("Erro ao buscar os cartões do usuário.", e);
      setError(
        (e as Error).message ??
          "Ocorreu um erro desconhecido, tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankCards();
  }, [fetchBankCards]);

  const updateBankCard = useCallback(
    async (id: string, partial: Partial<BankCardProps>) => {
      if (!id) throw new Error("ID inválido");
      try {
        setIsLoading(true);

        const clean = Object.fromEntries(
          Object.entries(partial).filter(([, v]) => v !== undefined)
        );

        const refCard = doc(firestore, "cards", id);

        if (clean.principal === true) {
          await runTransaction(firestore, async (trx) => {
            const qRef = query(
              collection(firestore, "cards"),
              where("userId", "==", user?.uid ?? "")
            );
            const snap = await getDocs(qRef);
            for (const d of snap.docs) {
              if (d.id !== id && d.data().principal) {
                trx.update(d.ref, { principal: false });
              }
            }
            trx.update(refCard, { ...clean });
          });
        } else {
          await updateDoc(refCard, { ...clean });
        }

        setBankCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...clean } : c))
        );
      } catch (e: unknown) {
        console.error("Erro ao atualizar cartão", e);
        setError((e as Error).message ?? "Erro ao atualizar cartão.");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const deleteBankCard = useCallback(
    async (id: string) => {
      if (!id) throw new Error("ID inválido");
      try {
        setIsLoading(true);
        const refCard = doc(firestore, "cards", id);
        await deleteDoc(refCard);
        setBankCards((prev) => prev.filter((card) => card.id !== id));
      } catch (e: unknown) {
        console.error("Erro ao excluir cartão", e);
        setError((e as Error).message ?? "Erro ao excluir cartão.");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    bankCards,
    isLoading,
    error,
    refetch: fetchBankCards,
    updateBankCard,
    deleteBankCard,
  };
};
