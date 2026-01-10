'use client'

import React from 'react';
import { TopCategory } from '@/hooks/useTopCategories';
import { useCurrency } from '@/hooks/useCurrency';
import { parsePeriodString } from '@/hooks/useDashboardSummary';
import { LucideIcon, Circle, Wallet, Briefcase, ShoppingCart, Home, Car, Utensils, Heart, Gift, DollarSign, CreditCard, TrendingUp, Banknote } from 'lucide-react';

interface TopCategoriesSummaryProps {
    topExpenses: TopCategory[];
    topRevenues: TopCategory[];
    periode: string;
    isLoading?: boolean;
}

// Icon mapping for common category icons
const iconMap: Record<string, LucideIcon> = {
    circle: Circle,
    wallet: Wallet,
    briefcase: Briefcase,
    shoppingcart: ShoppingCart,
    home: Home,
    car: Car,
    utensils: Utensils,
    heart: Heart,
    gift: Gift,
    dollarsign: DollarSign,
    creditcard: CreditCard,
    trendingup: TrendingUp,
    banknote: Banknote,
};

// Helper to get lucide icon by name
function getIcon(iconName: string): React.ReactNode {
    const normalizedName = iconName.toLowerCase().replace(/[-_\s]/g, '');
    const IconComponent = iconMap[normalizedName] || Circle;
    return <IconComponent className="w-4 h-4" strokeWidth={1.5} />;
}

// Format period display
function formatPeriodDisplay(periode: string): string {
    const parsed = parsePeriodString(periode);
    if (!parsed) return '';

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return `${formatDate(parsed.from)} - ${formatDate(parsed.to)}`;
}

export default function TopCategoriesSummary({
    topExpenses,
    topRevenues,
    periode,
    isLoading
}: TopCategoriesSummaryProps) {
    const currency = useCurrency();

    const formatAmount = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    if (isLoading) {
        return (
            <div className="border border-gray-300 rounded-lg p-6 min-w-[280px] flex items-center justify-center">
                <span className="text-gray-400">Loading categories...</span>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg p-4 sm:p-6 min-w-full sm:min-w-[280px]">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Top Categories</h3>

            {/* Top Expenses */}
            <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Highest Expenses</p>
                {topExpenses.length === 0 ? (
                    <p className="text-sm text-gray-400">No expenses</p>
                ) : (
                    <div className="space-y-2">
                        {topExpenses.map((cat, idx) => (
                            <div key={cat.categoryId || idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500">{getIcon(cat.icon)}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                                </div>
                                <span className="text-sm font-medium text-red-600">{formatAmount(cat.total)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Top Revenue */}
            <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Highest Revenue</p>
                {topRevenues.length === 0 ? (
                    <p className="text-sm text-gray-400">No revenue</p>
                ) : (
                    <div className="space-y-2">
                        {topRevenues.map((cat, idx) => (
                            <div key={cat.categoryId || idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500">{getIcon(cat.icon)}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                                </div>
                                <span className="text-sm font-medium text-green-600">{formatAmount(cat.total)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Period */}
            <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                    Period: {formatPeriodDisplay(periode)}
                </p>
            </div>
        </div>
    );
}
