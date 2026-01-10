'use client'
import ExpensesInterface from "@/components/ExpensesInterface";
import { Button } from "@/components/ui/button";
import FilterCard from "@/components/FilterCard";
import FilterCardMobile from "@/components/FilterCardMobile";
import { useState } from "react";
import { PopoverFormButton } from "@/components/PopoverFormButton";

interface FormVals {
  periode: string,
  category: string
}

export default function Page() {
  const [section, setSection] = useState('expense')
  const [filterVars, setFilterVars] = useState<FormVals>({
    periode: '',
    category: 'all'
  })
  const [filterToSubmit, setFilterToSubmit] = useState<FormVals>({
    periode: '',
    category: 'all'
  })

  const handleSubmitFilter = () => {
    setFilterToSubmit(filterVars)
  }

  return (
    <div>
      <main className="flex flex-col justify-center gap-2 w-full py-2 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            My transactions
          </h1>
          <div className="flex w-fit border gap-1 border-gray-300 items-center p-1 rounded-lg">
            <Button
              className={
                `text-gray-400 hover:bg-gray-400 cursor-pointer hover:text-white 
                    ${section === 'expense' ? 'bg-slate-800 text-white' : 'bg-white '}`
              }
              onClick={() => { setSection('expense') }}
            >
              Expenses
            </Button>
            <Button
              className={
                `bg-white text-gray-400 hover:bg-gray-400 cursor-pointer hover:text-white 
                    ${section === 'revenue' ? 'bg-slate-800 text-white' : 'bg-white'}`
              }
              onClick={() => { setSection('revenue') }}
            >
              Revenues
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="w-full lg:w-auto">
            <FilterCardMobile selected={section} filterVals={filterVars} setFilterVal={setFilterVars} onSubmit={handleSubmitFilter} />
            <FilterCard selected={section} filterVals={filterVars} setFilterVal={setFilterVars} onSubmit={handleSubmitFilter} />
          </div>
          <div className="w-full border border-gray-300 rounded-xl flex justify-center pt-4 px-4 overflow-hidden">
            <ExpensesInterface formVals={filterToSubmit} section={section} />
          </div>
        </div>
        <div className="absolute z-50 bottom-12 right-20">
          <PopoverFormButton section={section} setSection={setSection} setFilterToSubmit={setFilterToSubmit} />
        </div>
      </main>
    </div>
  )
}