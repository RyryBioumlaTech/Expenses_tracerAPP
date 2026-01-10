"use client"

import useDashboardSummary from "@/hooks/useDashboardSummary";
import useDashboardChartData from "@/hooks/useDashboardChartData";
import useTopCategories from "@/hooks/useTopCategories";
import SummaryCard from "@/components/SummaryCard";
import DashboardPeriodFilter from "@/components/DashboardPeriodFilter";
import TransactionChart from "@/components/TransactionChart";
import TopCategoriesSummary from "@/components/TopCategoriesSummary";
import { Wallet, TrendingUp, Scale } from "lucide-react";

export default function Dashboard() {
    const { summary, expenses, revenues, isLoading, periode, setPeriode } = useDashboardSummary();
    const chartData = useDashboardChartData(expenses, revenues, periode);
    const { topExpenseCategories, topRevenueCategories, isLoading: categoriesLoading } = useTopCategories(expenses, revenues);

    return (
        <div>
            <main className="flex flex-col gap-6 w-full py-2 px-4 md:px-8 lg:px-16">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    Overview
                </h1>
                <DashboardPeriodFilter periode={periode} setPeriode={setPeriode} />

                <div className="flex flex-col md:flex-row gap-4">
                    <SummaryCard
                        icon={Wallet}
                        label="Total Expenses"
                        amount={summary.totalExpenses}
                        isLoading={isLoading}
                    />
                    <SummaryCard
                        icon={TrendingUp}
                        label="Total Revenue"
                        amount={summary.totalRevenue}
                        isLoading={isLoading}
                    />
                    <SummaryCard
                        icon={Scale}
                        label="Net Difference"
                        amount={summary.netDifference}
                        isLoading={isLoading}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <TransactionChart data={chartData} isLoading={isLoading} />
                    <TopCategoriesSummary
                        topExpenses={topExpenseCategories}
                        topRevenues={topRevenueCategories}
                        periode={periode}
                        isLoading={categoriesLoading}
                    />
                </div>
            </main>
        </div>
    );
}