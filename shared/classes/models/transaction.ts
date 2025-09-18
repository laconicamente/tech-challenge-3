export interface TransactionItemProps {
    id?: string,
    title?: string;
    categoryId?: string;
    methodId?: string;
    value: string | number;
    createdAt: string;
    type: TransactionType;
    fileUrl?: string | null;
}

export type TransactionType = 'income' | 'expense';