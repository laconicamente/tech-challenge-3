export interface TransactionItemProps {
    id?: string,
    title?: string;
    userId?: string;
    categoryId?: string;
    methodId?: string;
    value: number | string;
    createdAt: Date | string;
    createdAtDisplay?: string;
    type: TransactionType;
    fileUrl?: string | null;
    methodName?: string | undefined;
    categoryName?: string | null;
}

export type TransactionType = 'income' | 'expense';

export interface TransactionFilter {
    page?: number
    limit?: number
    userId?: string
    categoryId?: string
    minValue?: number
    maxValue?: number
    startDate?: string
    endDate?: string
}