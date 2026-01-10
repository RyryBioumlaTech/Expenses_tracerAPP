'use client'

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface SummaryCardProps {
    icon: LucideIcon;
    label: string;
    amount: number;
    isLoading?: boolean;
}

export default function SummaryCard({ icon: Icon, label, amount, isLoading }: SummaryCardProps) {
    const currency = useCurrency();

    const formatAmount = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="border border-gray-300 rounded-lg p-4 sm:p-6 flex flex-col gap-3 sm:min-w-[200px] flex-1">
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                <span className="text-sm text-gray-600 font-medium">{label}</span>
            </div>
            <div className="text-2xl font-semibold text-black dark:text-zinc-50">
                {isLoading ? (
                    <span className="text-gray-400">Loading...</span>
                ) : (
                    formatAmount(amount)
                )}
            </div>
        </div>
    );
}

