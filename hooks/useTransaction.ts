import { useState, useCallback } from "react";
import { ID, Query, Permission, type Models } from 'appwrite';
import { databases } from '../lib/appwrite';

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const expenseId = process.env.NEXT_PUBLIC_EXPENSE_ID!;
const revenueId = process.env.NEXT_PUBLIC_REVENUE_ID!;
const queryLimit = 30;

interface Transaction extends Models.Document {
    id: string,
    userId: string,
    description: string,
    amount: number,
    categoryId: string,
    createdAt: string
}

interface NewTransaction {
    userId: string | undefined,
    description: string,
    amount: number,
    categoryId: string
}

interface FullFilter {
    periode: string,
    category: string
}

export default function useTransactions() {

    const [transaction, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [TransactionError, setError] = useState<Error | null>(null)

    const fetchExpense = useCallback(
        async (): Promise<Transaction[]> => {
            setIsLoading(true);

            try {
                const response = await databases.listDocuments<Transaction>(
                    databaseId,
                    expenseId,
                    [Query.orderDesc('$createdAt'), Query.limit(queryLimit)]
                );
                setTransactions(response.documents);
                return response.documents;
            } catch (error) {
                setError(error as Error)
                return []
            } finally {
                setIsLoading(false);
            }
        }, [])

    const fetchRevenue = useCallback(
        async (): Promise<Transaction[]> => {
            setIsLoading(true);

            try {
                const response = await databases.listDocuments<Transaction>(
                    databaseId,
                    revenueId,
                    [Query.orderDesc('$createdAt'), Query.limit(queryLimit)]
                );
                setTransactions(response.documents);
                return response.documents;
            } catch (error) {
                setError(error as Error)
                return []
            } finally {
                setIsLoading(false);
            }
        }, [])

    const fetchPerDate = useCallback(
        async ({ type, periode }: { type: string, periode: string }): Promise<Transaction[]> => {

            setIsLoading(true);
            setError(null);

            const [fromDate, toDate] = periode.split('#');

            let tableId;

            if (type === 'expense')
                tableId = expenseId
            else
                tableId = revenueId

            try {
                const response = await databases.listDocuments<Transaction>(
                    databaseId,
                    tableId,
                    [Query.orderDesc('$createdAt'),
                    Query.greaterThanEqual('$createdAt', fromDate),
                    Query.lessThanEqual('$createdAt', toDate)
                    ]
                );
                setTransactions(response.documents);
                return response.documents;
            } catch (error) {
                setError(error as Error)
                return []
            } finally {
                setIsLoading(false);
            }
        }, [])

    const fetchPerCategory = useCallback(
        async ({ type, category }: { type: string, category: string }): Promise<Transaction[]> => {

            setIsLoading(true);
            setError(null);

            let tableId;

            if (type === 'expense')
                tableId = expenseId
            else
                tableId = revenueId

            try {
                const response = await databases.listDocuments<Transaction>(
                    databaseId,
                    tableId,
                    [Query.orderDesc('$createdAt'),
                    Query.equal('categoryId', category)
                    ]
                );
                setTransactions(response.documents);
                return response.documents;
            } catch (error) {
                setError(error as Error)
                return []
            } finally {
                setIsLoading(false);
            }
        }, [])

    const fecthPerFullFilter = useCallback(
        async (type: string, { periode, category }: FullFilter): Promise<Transaction[]> => {

            setIsLoading(true);
            setError(null);

            const [fromDate, toDate] = periode.split('#');

            let tableId;

            if (type === 'expense')
                tableId = expenseId
            else
                tableId = revenueId

            try {
                const response = await databases.listDocuments<Transaction>(
                    databaseId,
                    tableId,
                    [Query.orderDesc('$createdAt'),
                    Query.equal('categoryId', category),
                    Query.greaterThanEqual('$createdAt', fromDate),
                    Query.lessThanEqual('$createdAt', toDate)
                    ]
                );
                setTransactions(response.documents);
                return response.documents;
            } catch (error) {
                setError(error as Error)
                return []
            } finally {
                setIsLoading(false);
            }
        }, [])

    const add = async (transaction: NewTransaction, type: string): Promise<void> => {
        setIsLoading(true)
        let tableId
        if (type === 'expense')
            tableId = expenseId
        else
            tableId = revenueId
        try {
            const response = await databases.createDocument(
                databaseId,
                tableId,
                ID.unique(),
                transaction,
                [
                    Permission.read(`user:${transaction.userId}`),
                    Permission.update(`user:${transaction.userId}`),
                    Permission.delete(`user:${transaction.userId}`)
                ]
            );
            setTransactions(prev => [
                (response as unknown as Transaction),
                ...prev
            ].slice(0, queryLimit));
        } catch (error) {
            setError(error as Error)
        } finally {
            setIsLoading(false)
        }
    };

    const remove = async (id: string, type: string): Promise<void> => {
        let tableId
        if (type === 'expense')
            tableId = expenseId
        else
            tableId = revenueId
        try {
            await databases.deleteDocument(databaseId, tableId, id);
            if (type === 'expense')
                await fetchExpense()
            else
                await fetchRevenue()
        } catch (error) {
            console.error('Error removing idea:', error);
        }
    };

    const update = async (id: string, data: Partial<NewTransaction>, type: string): Promise<void> => {
        setIsLoading(true)
        let tableId
        if (type === 'expense')
            tableId = expenseId
        else
            tableId = revenueId
        try {
            const response = await databases.updateDocument(
                databaseId,
                tableId,
                id,
                data
            );
            setTransactions(prev => prev.map(t =>
                t.$id === id ? { ...t, ...response } as unknown as Transaction : t
            ));
        } catch (error) {
            setError(error as Error)
            throw error;
        } finally {
            setIsLoading(false)
        }
    };

    return {
        fetchExpense,
        fetchRevenue,
        add,
        remove,
        update,
        fecthPerFullFilter,
        fetchPerCategory,
        fetchPerDate,
        transaction,
        isLoading,
        TransactionError
    }
}