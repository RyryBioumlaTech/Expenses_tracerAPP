"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

interface FormVals {
  periode: string,
  category: string
}

interface SetPeriod {
  setPeriod: React.Dispatch<React.SetStateAction<FormVals>>
}

export function CalendarPicker({ setPeriod }: SetPeriod) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const today = new Date()
    const previousMonth = new Date(today)

    previousMonth.setMonth(today.getMonth() - 1);

    return {
      from: previousMonth,
      to: today,
    }
  })
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  React.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Set the "to" date to end of day (23:59:59.999) to include all transactions from that day
      const endOfDay = new Date(dateRange.to);
      endOfDay.setHours(23, 59, 59, 999);

      // Format the period with from as-is and to as end of day
      const periodeString = `${dateRange.from.toISOString()}#${endOfDay.toISOString()}`;

      // Update the parent state
      setPeriod((prev: FormVals) => ({
        ...prev,
        periode: periodeString,
      }));
    }
  }, [dateRange, setPeriod])

  const handleClearSelection = () => {
    setDateRange(undefined);
    setPeriod((prev: FormVals) => ({
      ...prev,
      periode: '',
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        timeZone={timeZone}
        numberOfMonths={2}
        className="rounded-lg border shadow-sm"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleClearSelection}
        className="w-full text-gray-500"
      >
        Clear selection
      </Button>
    </div>
  )
}
