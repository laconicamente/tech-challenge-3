export interface TransactionItemProps {
    id: string,
    title: string;
    description: string;
    value: string | number;
    createdAt: string;
    type: 'income' | 'expense';
}
