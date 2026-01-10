import { useState, useCallback, useEffect } from "react";
import { Query, type Models } from 'appwrite';
import { databases } from '../lib/appwrite';

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const expenseId = process.env.NEXT_PUBLIC_EXPENSE_ID!;
const revenueId = process.env.NEXT_PUBLIC_REVENUE_ID!;

export interface Transaction extends Models.Document {
    id: string;
    userId: string;
    description: string;
    amount: number;
    categoryId: string;
    createdAt: string;
}

interface DashboardSummary {
    totalExpenses: number;
    totalRevenue: number;
    netDifference: number;
}

// Helper to get current month date range
function getCurrentMonthRange(): { from: Date; to: Date } {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    return { from, to };
}

// Helper to format period string
export function formatPeriodFromDates(from: Date, to: Date): string {
    return `${from.toISOString()}#${to.toISOString()}`;
}

// Helper to parse period string
export function parsePeriodString(periode: string): { from: Date; to: Date } | null {
    if (!periode || periode === '') return null;
    const [fromDate, toDate] = periode.split('#');
    if (!fromDate || !toDate) return null;
    return { from: new Date(fromDate), to: new Date(toDate) };
}

export default function useDashboardSummary() {
    const [summary, setSummary] = useState<DashboardSummary>({
        totalExpenses: 0,
        totalRevenue: 0,
        netDifference: 0
    });
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [revenues, setRevenues] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Initialize with current month range
    const { from: defaultFrom, to: defaultTo } = getCurrentMonthRange();
    const [periode, setPeriode] = useState<string>(
        formatPeriodFromDates(defaultFrom, defaultTo)
    );

    const fetchSummary = useCallback(async (periodeString: string) => {
        if (!periodeString || periodeString === '') return;

        setIsLoading(true);
        setError(null);

        const [fromDate, toDate] = periodeString.split('#');

        try {
            // Fetch expenses
            const expensesResponse = await databases.listDocuments<Transaction>(
                databaseId,
                expenseId,
                [
                    Query.greaterThanEqual('$createdAt', fromDate),
                    Query.lessThanEqual('$createdAt', toDate),
                    Query.limit(500)
                ]
            );

            // Fetch revenues
            const revenuesResponse = await databases.listDocuments<Transaction>(
                databaseId,
                revenueId,
                [
                    Query.greaterThanEqual('$createdAt', fromDate),
                    Query.lessThanEqual('$createdAt', toDate),
                    Query.limit(500)
                ]
            );

            // Store raw transactions
            setExpenses(expensesResponse.documents);
            setRevenues(revenuesResponse.documents);

            // Calculate totals
            const totalExpenses = expensesResponse.documents.reduce(
                (sum, doc) => sum + (doc.amount || 0),
                0
            );
            const totalRevenue = revenuesResponse.documents.reduce(
                (sum, doc) => sum + (doc.amount || 0),
                0
            );
            const netDifference = totalRevenue - totalExpenses;

            setSummary({ totalExpenses, totalRevenue, netDifference });
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch on period change
    useEffect(() => {
        fetchSummary(periode);
    }, [periode, fetchSummary]);

    return {
        summary,
        expenses,
        revenues,
        isLoading,
        error,
        periode,
        setPeriode,
        refetch: () => fetchSummary(periode)
    };
}

