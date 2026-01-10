import { useMemo } from 'react';
import { Transaction, parsePeriodString } from './useDashboardSummary';

export interface ChartDataPoint {
    label: string;
    expense: number;
    revenue: number;
}

// Get the start of a week (Monday)
function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Format day label
function formatDayLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format week label
function formatWeekLabel(date: Date): string {
    const endOfWeek = new Date(date);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { day: 'numeric' })}`;
}

// Get day key for grouping
function getDayKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Get week key for grouping
function getWeekKey(date: Date): string {
    const weekStart = getWeekStart(date);
    return `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
}

export default function useDashboardChartData(
    expenses: Transaction[],
    revenues: Transaction[],
    periode: string
) {
    const chartData = useMemo<ChartDataPoint[]>(() => {
        const parsed = parsePeriodString(periode);
        if (!parsed) return [];

        const { from, to } = parsed;
        const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
        const useWeekly = daysDiff > 14;

        // Create a map to store accumulated values
        const dataMap = new Map<string, { label: string; expense: number; revenue: number; sortKey: number }>();

        // Initialize all periods in range
        if (useWeekly) {
            let current = getWeekStart(from);
            while (current <= to) {
                const key = getWeekKey(current);
                if (!dataMap.has(key)) {
                    dataMap.set(key, {
                        label: formatWeekLabel(current),
                        expense: 0,
                        revenue: 0,
                        sortKey: current.getTime()
                    });
                }
                current = new Date(current);
                current.setDate(current.getDate() + 7);
            }
        } else {
            let current = new Date(from);
            while (current <= to) {
                const key = getDayKey(current);
                dataMap.set(key, {
                    label: formatDayLabel(current),
                    expense: 0,
                    revenue: 0,
                    sortKey: current.getTime()
                });
                current = new Date(current);
                current.setDate(current.getDate() + 1);
            }
        }

        // Aggregate expenses
        expenses.forEach(tx => {
            const date = new Date(tx.$createdAt);
            const key = useWeekly ? getWeekKey(date) : getDayKey(date);
            const existing = dataMap.get(key);
            if (existing) {
                existing.expense += tx.amount || 0;
            }
        });

        // Aggregate revenues
        revenues.forEach(tx => {
            const date = new Date(tx.$createdAt);
            const key = useWeekly ? getWeekKey(date) : getDayKey(date);
            const existing = dataMap.get(key);
            if (existing) {
                existing.revenue += tx.amount || 0;
            }
        });

        // Sort by date and return without sortKey
        return Array.from(dataMap.values())
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(({ label, expense, revenue }) => ({ label, expense, revenue }));
    }, [expenses, revenues, periode]);

    return chartData;
}
