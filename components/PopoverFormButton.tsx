import { Button } from "@/components/ui/button"
import {Minus, Plus} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, SetStateAction } from "react"
import TransactionsForm from "./TransactionsForm"

interface FormVals {
  periode : string,
  category : string
}

interface SetSection {
    section :string,
    setSection : Dispatch<SetStateAction<string>>
    setFilterToSubmit : Dispatch<SetStateAction<FormVals>>
}

export function PopoverFormButton({ section, setSection, setFilterToSubmit}: SetSection) {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button 
                className= {
                  `rounded-full py-6 shadow-md ${section === 'expense' ? 'bg-red-400 hover:bg-red-500':'bg-green-400 hover:bg-green-500'}`
                }
              >
                {section === 'expense' ? (<div 
                    className="flex gap-2 justify-center items-center mx-2 text-white font-semibold text-lg">
                    <Minus
                      className="w-6 h-6 md:w-8 md:h-8 text-white-200"
                    />
                    <span className="hidden md:block">
                      Add an expense
                    </span>
                  </div>):(<div 
                    className="flex gap-2 justify-center items-center mx-4 text-lg text-white font-semibold">
                      <Plus className="w-6 h-6 md:w-16 md:h-16 text-white-200"/>
                      <span className="hidden md:block">
                        Add a Revenu
                      </span>
                  </div>)}
              </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit mr-10 rounded-xl">
            <TransactionsForm onSubmitTransactions={setFilterToSubmit} section={section}/>
        </PopoverContent>
    </Popover>
  )
}
