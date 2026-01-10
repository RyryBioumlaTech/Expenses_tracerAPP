'use client'

import React, { Dispatch, SetStateAction } from 'react';
import { useCategory } from "@/hooks/useCategory"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "./ui/button"
import { CalendarPicker } from "./CalenderPicker"
import { Filter, Calendar } from 'lucide-react';

interface FilterCardProps {
    selected: string
    filterVals: FormVals
    setFilterVal: Dispatch<SetStateAction<FormVals>>
    onSubmit: () => void
}
interface FormVals {
    periode: string,
    category: string
}

// Helper function to format period display
function formatPeriodDisplay(periode: string): string {
    if (!periode || periode === '') return 'Select Period';

    const [fromDate, toDate] = periode.split('#');
    if (!fromDate || !toDate) return 'Select Period';

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
}

export default function FilterCardMobile({ selected, filterVals, setFilterVal, onSubmit }: FilterCardProps) {
    const { currentExpenses: catExpenses, currentRevuenues: catRevenues } = useCategory()

    const handleCategoryChange = (value: string) => {
        setFilterVal((prev) => ({
            ...prev,
            category: value
        }))
    }

    return (
        <div className="lg:hidden w-full border border-gray-300 rounded-lg p-3 bg-white dark:bg-slate-900 mb-4">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Period Filter */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-gray-500">Period</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-xs h-9 justify-start px-3 font-normal text-gray-600">
                                    <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />
                                    <span className="truncate">{formatPeriodDisplay(filterVals.periode)}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-fit p-0" align="start">
                                <CalendarPicker setPeriod={setFilterVal} />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-gray-500">Category</span>
                        <Select onValueChange={handleCategoryChange} value={filterVals.category || undefined}>
                            <SelectTrigger className="w-full h-9 text-xs">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    {selected === 'expense' ? catExpenses.map((category) => (
                                        <SelectItem key={category.$id} value={category.$id}>{category.name}</SelectItem>
                                    )) : catRevenues.map((category) => (
                                        <SelectItem key={category.$id} value={category.$id}>{category.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    className="w-full bg-slate-800 h-9 text-sm mt-1"
                    onClick={onSubmit}
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}
