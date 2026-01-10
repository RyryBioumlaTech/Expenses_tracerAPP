'use client'

import React from 'react';
import { ChartDataPoint } from '@/hooks/useDashboardChartData';

interface TransactionChartProps {
    data: ChartDataPoint[];
    isLoading?: boolean;
}

export default function TransactionChart({ data, isLoading }: TransactionChartProps) {
    // Find max value for scaling
    const maxValue = Math.max(
        ...data.map(d => Math.max(d.expense, d.revenue)),
        1 // Prevent division by zero
    );

    if (isLoading) {
        return (
            <div className="border border-gray-300 rounded-lg p-6 flex-1 min-h-[300px] flex items-center justify-center">
                <span className="text-gray-400">Loading chart...</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg p-6 flex-1 min-h-[300px] flex items-center justify-center">
                <span className="text-gray-400">No data available</span>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg p-4 sm:p-6 flex-1 min-h-[300px]">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Expenses vs Revenue</h3>

            {/* Legend */}
            <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <span className="text-xs text-gray-500">Expenses</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-xs text-gray-500">Revenue</span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
                {data.map((point, idx) => {
                    const expenseHeight = (point.expense / maxValue) * 100;
                    const revenueHeight = (point.revenue / maxValue) * 100;

                    return (
                        <div key={idx} className="flex flex-col items-center min-w-[40px]">
                            {/* Bars container */}
                            <div className="flex items-end gap-[2px] h-36">
                                {/* Expense bar (red) */}
                                <div
                                    className="w-3 bg-red-500 rounded-t-sm transition-all duration-300"
                                    style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                                    title={`Expense: ${point.expense.toLocaleString()}`}
                                />
                                {/* Revenue bar (green) */}
                                <div
                                    className="w-3 bg-green-500 rounded-t-sm transition-hall duration-300"
                                    style={{ height: `${Math.max(revenueHeight, 2)}%` }}
                                    title={`Revenue: ${point.revenue.toLocaleString()}`}
                                />
                            </div>
                            {/* Label */}
                            <span className="text-[10px] text-gray-400 mt-8 whitespace-nowrap transform -rotate-45 origin-top-left translate-y-2">
                                {point.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
