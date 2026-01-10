import { useState, useEffect, useMemo } from 'react';
import { Query, type Models } from 'appwrite';
import { databases } from '../lib/appwrite';
import { Transaction } from './useDashboardSummary';

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const categoryTableId = process.env.NEXT_PUBLIC_CATEGORY_ID!;

interface Category extends Models.Document {
    name: string;
    type: "expense" | "revenu";
    icon: string;
    userId: string;
}

export interface TopCategory {
    categoryId: string;
    name: string;
    icon: string;
    total: number;
}

export default function useTopCategories(
    expenses: Transaction[],
    revenues: Transaction[]
) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const response = await databases.listDocuments<Category>(
                    databaseId,
                    categoryTableId,
                    [Query.limit(100)]
                );
                setCategories(response.documents);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Calculate top expense categories
    const topExpenseCategories = useMemo<TopCategory[]>(() => {
        // Group by categoryId and sum amounts
        const categoryTotals = new Map<string, number>();
        expenses.forEach(tx => {
            const current = categoryTotals.get(tx.categoryId) || 0;
            categoryTotals.set(tx.categoryId, current + (tx.amount || 0));
        });

        // Sort by total and get top 2
        const sorted = Array.from(categoryTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2);

        // Map to TopCategory with category info
        return sorted.map(([categoryId, total]) => {
            const cat = categories.find(c => c.$id === categoryId);
            return {
                categoryId,
                name: cat?.name || 'Unknown',
                icon: cat?.icon || 'circle',
                total
            };
        });
    }, [expenses, categories]);

    // Calculate top revenue categories
    const topRevenueCategories = useMemo<TopCategory[]>(() => {
        // Group by categoryId and sum amounts
        const categoryTotals = new Map<string, number>();
        revenues.forEach(tx => {
            const current = categoryTotals.get(tx.categoryId) || 0;
            categoryTotals.set(tx.categoryId, current + (tx.amount || 0));
        });

        // Sort by total and get top 2
        const sorted = Array.from(categoryTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2);

        // Map to TopCategory with category info
        return sorted.map(([categoryId, total]) => {
            const cat = categories.find(c => c.$id === categoryId);
            return {
                categoryId,
                name: cat?.name || 'Unknown',
                icon: cat?.icon || 'circle',
                total
            };
        });
    }, [revenues, categories]);

    return {
        topExpenseCategories,
        topRevenueCategories,
        isLoading
    };
}
