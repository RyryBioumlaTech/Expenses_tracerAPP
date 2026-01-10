'use client'

import React, { Dispatch, SetStateAction } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button"
import { CalendarPicker } from "./CalenderPicker"
import { Calendar } from 'lucide-react';

interface FormVals {
    periode: string;
    category: string;
}

interface DashboardPeriodFilterProps {
    periode: string;
    setPeriode: Dispatch<SetStateAction<string>>;
}

// Helper function to format period display
function formatPeriodDisplay(periode: string): string {
    if (!periode || periode === '') return 'Select a period';

    const [fromDate, toDate] = periode.split('#');
    if (!fromDate || !toDate) return 'Select a period';

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
}

export default function DashboardPeriodFilter({ periode, setPeriode }: DashboardPeriodFilterProps) {
    // Create a wrapper to adapt the CalendarPicker's expected format
    const handleSetPeriod = (setter: React.SetStateAction<FormVals>) => {
        if (typeof setter === 'function') {
            // We need to wrap this for the CalendarPicker
            const result = setter({ periode, category: '' });
            setPeriode(result.periode);
        }
    };

    // Create a FormVals-compatible setter for CalendarPicker
    const formValsSetter: Dispatch<SetStateAction<FormVals>> = (action) => {
        if (typeof action === 'function') {
            const result = action({ periode, category: '' });
            setPeriode(result.periode);
        } else {
            setPeriode(action.periode);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Period:</span>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="text-gray-600 font-normal gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatPeriodDisplay(periode)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit rounded-xl">
                    <CalendarPicker setPeriod={formValsSetter} />
                </PopoverContent>
            </Popover>
        </div>
    );
}
