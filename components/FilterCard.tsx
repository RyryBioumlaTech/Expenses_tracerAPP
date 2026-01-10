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
    if (!periode || periode === '') return 'Select a period';

    const [fromDate, toDate] = periode.split('#');
    if (!fromDate || !toDate) return 'Select a period';

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
}

export default function FilterCard({ selected, filterVals, setFilterVal, onSubmit }: FilterCardProps) {
    const { currentExpenses: catExpenses, currentRevuenues: catRevenues, isLoading, error } = useCategory()


    const handleCategoryChange = (value: string) => {
        setFilterVal((prev) => ({
            ...prev,
            category: value
        }))
    }

    return <div className="hidden lg:block border border-gray-300 rounded-lg flex flex-col min-w-[190px] max-w-[270px] justify-center items-center space-y-4 px-4 py-4">
        <p className="text-base font-semibold">filter by : </p>
        <div className="flex flex-col space-y-2">
            <p className="text-sm" >Period</p>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-gray-500 font-normal">
                        {formatPeriodDisplay(filterVals.periode)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit rounded-xl">
                    <CalendarPicker setPeriod={setFilterVal} />
                </PopoverContent>
            </Popover>
        </div>
        <div className="flex flex-col space-y-2">
            <p className="text-sm">Category</p>
            <div>
                <Select
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            <SelectItem key="0" value="all">All</SelectItem>
                            {selected === 'expense' ? catExpenses.map((category, key) => (
                                <SelectItem key={category.$id} value={category.$id}>{category.name}</SelectItem>
                            )) : catRevenues.map((category, key) => (
                                <SelectItem key={category.$id} value={category.$id}>{category.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <Button
            className="w-full bg-slate-800"
            onClick={onSubmit}
        >Filter</Button>
    </div>
}