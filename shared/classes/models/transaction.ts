export interface TransactionItemProps {
    id: string,
    title: string;
    categoryId?: string;
    methodId?: string;
    value: string | number;
    createdAt: string;
    type: 'income' | 'expense';
    fileUrl?: string;
}
