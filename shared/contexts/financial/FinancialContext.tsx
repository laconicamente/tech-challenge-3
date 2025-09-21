import { TransactionFilter, TransactionItemProps } from "@/shared/classes/models/transaction";
import { useBalanceValue } from "@/shared/hooks/useBalanceValue";
import { useTransactions } from "@/shared/hooks/useTransactions";
import { User } from "firebase/auth";
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export interface FinancialContextProps {
    transactions: TransactionItemProps[];
    balanceValue: number;
}

interface FinancialContextType extends FinancialContextProps {
    fetchTransactions: (user: User, params?: any) => void;
    isLoading: boolean;
    isLoadingMore?: boolean;
    error?: string | null;
    filters?: any;
    setFilters?: (f: any) => void;
    refetch?: () => Promise<void>;
    refetchBalanceValue?: () => Promise<void>;
    loadMore?: () => Promise<void> | void;
    hasMore?: boolean;
    isBalanceVisible?: boolean;
    isLoadingBalance?: boolean;
    setBalanceVisible: (visible: boolean) => void;
}

const FinancialContext = createContext<FinancialContextType>({
    balanceValue: 0,
    transactions: [],
    fetchTransactions: () => {
        console.warn("fetchTransactions method is not implemented.");
    },
    isLoading: true,
    setBalanceVisible: () => false
});

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        transactions,
        isLoading,
        isLoadingMore,
        error,
        filters,
        setFilters,
        refetch,
        loadMore,
        hasMore
    } = useTransactions({}, 5);
    const { user } = useAuth();
    const { total: balanceValue, isLoadingBalance, refetchBalanceValue } = useBalanceValue({userId: user?.uid});
    const [isBalanceVisible, setBalanceVisible] = useState(false);

    const fetchTransactions = (user: User, params?: TransactionFilter) => {
        if (!setFilters) return;
        setFilters({
          userId: user.uid,
          categoryId: params?.categoryId,
          startDate: params?.startDate,
          endDate: params?.endDate,
        });
      };
    
      return (
        <FinancialContext.Provider
          value={{
            transactions,
            balanceValue,
            fetchTransactions,
            isLoading,
            isLoadingMore,
            error,
            filters,
            setFilters,
            refetch,
            refetchBalanceValue,
            loadMore,
            hasMore,
            isBalanceVisible, 
            isLoadingBalance,
            setBalanceVisible,
          }}
        >
          {children}
        </FinancialContext.Provider>
      );
};

export const useFinancial = () => useContext(FinancialContext);
