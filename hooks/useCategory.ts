import { useState, useCallback, useEffect } from "react";
import { Query, type Models } from 'appwrite';
import { databases } from '../lib/appwrite';

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const tableId = process.env.NEXT_PUBLIC_CATEGORY_ID!;


interface Category extends Models.Document {
    name: string,
    type: "expense" | "revenu",
    icon: string,
    userId: string
}

export function useCategory() {
    const [currentExpenses, setCurrentExpenses] = useState<Category[]>([])
    const [currentRevuenues, setCurrentRevenues] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchExpenses = useCallback(
        async (): Promise<void> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await databases.listDocuments<Category>(
                    databaseId,
                    tableId,
                    [Query.orderDesc('$createdAt'), Query.equal('type', 'expense')]
                );
                setCurrentExpenses(response.documents as Category[]);
            } catch (error) {
                setError(error as Error)
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }, [])

    const fetchRevenues = useCallback(
        async (): Promise<void> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await databases.listDocuments<Category>(
                    databaseId,
                    tableId,
                    [Query.orderDesc('$createdAt'), Query.equal('type', 'revenue')]
                );
                setCurrentRevenues(response.documents as Category[]);
            } catch (error) {
                setError(error as Error)
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }, [])

    useEffect(() => {
        fetchExpenses();
        fetchRevenues();
    }, [fetchExpenses, fetchRevenues])

    return {
        currentExpenses,
        currentRevuenues,
        isLoading,
        error
    }
}