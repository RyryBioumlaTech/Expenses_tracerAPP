import useTransactions from "@/hooks/useTransaction"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"
import { DataTable } from "./TransactionsDataTable"
import { createColumns } from "@/app/dashboard/manage/column"

interface FormVals {
    periode: string,
    category: string
}

interface ExpensesInterfaceProps {
    formVals: FormVals,
    section: string
}

export default function ExpensesInterface({ formVals, section }: ExpensesInterfaceProps) {
    const hooks = useTransactions();
    const { periode, category } = formVals;

    const handleDelete = async (id: string) => {
        try {
            await hooks.remove(id, section);
            toast.success('Transaction deleted successfully');
        } catch (error) {
            toast.error('Failed to delete transaction');
        }
    };

    const columns = useMemo(() => createColumns(handleDelete, section), [section]);

    useEffect(() => {
        const fetchData = async () => {
            if (periode !== '' && category === 'all') {
                await hooks.fetchPerDate({ type: section, periode });
            } else if (periode === '' && category !== 'all') {
                await hooks.fetchPerCategory({ type: section, category });
            } else if (periode !== '' && category !== 'all') {
                await hooks.fecthPerFullFilter(section, { periode, category });
            } else if (section === 'expense') {
                await hooks.fetchExpense();
            } else {
                await hooks.fetchRevenue();
            }
        };

        fetchData();

    }, [periode, category, section, hooks.fetchExpense, hooks.fetchRevenue]);

    useEffect(() => {
        if (hooks.TransactionError) {
            toast.error('Failed to load transactions');
        }
    }, [hooks.TransactionError]);

    if (hooks.isLoading) return <p>Loading...</p>;

    return <div className="w-full">
        <DataTable columns={columns} data={hooks.transaction} />
    </div>
}