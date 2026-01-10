import { useCategory } from '@/hooks/useCategory'
import * as Icons from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import FormField from './FormField'
import { useAuth } from '@/hooks/useAuth'
import useTransactions from '@/hooks/useTransaction'
import { toast } from 'sonner'
import { Spinner } from './ui/spinner'
import { Skeleton } from './ui/skeleton'

interface DynamicIconProps extends Icons.LucideProps {
    name: string
}

type DataToSubmit = {
    userId: string | undefined,
    description: string,
    amount: number,
    categoryId: string
}

type DataToReceive = {
    description: string,
    amount: number,
}

interface FormVals {
    periode: string,
    category: string
}

interface TransactionFormsProps {
    section: string,
    onSubmitTransactions: Dispatch<SetStateAction<FormVals>>,
    initialData?: {
        $id: string,
        description: string,
        amount: number,
        categoryId: string
    }
}

// Loads the icon from lucide when the icon column in the db matches a Icon's name  
const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {

    const IconItem = (Icons as any)[name]

    if (!IconItem) {
        return <Icons.HelpCircle />
    };

    return <IconItem />
}

export default function TransactionsForm({ section, onSubmitTransactions, initialData }: TransactionFormsProps) {

    const { currentExpenses: expensesCat, currentRevuenues: revenuesCat, isLoading, error } = useCategory()
    const [categorySelected, setCategorySelected] = useState(initialData?.categoryId || '')
    const { current: user } = useAuth()
    const { add, update, TransactionError } = useTransactions()
    const [adding, setAdding] = useState(false)

    const handleCatSelection = (el: string) => {
        if (categorySelected === '' || categorySelected !== el)
            setCategorySelected(el)
        else if (categorySelected === el)
            setCategorySelected('')
    }

    const handleFormData = async ({ description, amount }: DataToReceive) => {

        const finalData: DataToSubmit = {
            userId: user?.$id,
            description,
            amount,
            categoryId: categorySelected
        }

        try {
            setAdding(true)
            if (!user) return

            if (initialData) {
                // Update mode
                await update(initialData.$id, finalData, section)
                toast.success(`Transaction updated successfully`)
            } else {
                // Add mode
                await add(finalData, section)
                toast.success(`your ${section} have been added`)
            }

            if (!initialData) {
                setCategorySelected('')
            }

            onSubmitTransactions({
                periode: '',
                category: 'all'
            })
        } catch (error) {
            toast.error(`Failed : ${TransactionError}`)
        } finally {
            setAdding(false)
        }

    }

    return <div className="w-fit h-fit flex justify-center items-center ">
        <div className="bg-white rounded-lg w-fit">
            <p className='text-sm font-semibold text-gray-400 mb-1'>Choose a category</p>
            <div className='w-full border border-gray-300 rounded-lg p-2'>
                {isLoading && (
                    <div className='grid grid-cols-3 gap-1'>
                        <Skeleton className='w-20 h-20 rounded-sm' />
                        <Skeleton className='w-20 h-20 rounded-sm' />
                        <Skeleton className='w-20 h-20 rounded-sm' />
                    </div>
                )}
                {
                    section === 'expense' ?
                        <div className='grid grid-cols-3 gap-1'>
                            {expensesCat.map((cat) => (
                                <button key={cat.$id}
                                    className={
                                        `w-20 h-20 text-gray-600 rounded-sm border
                                    hover:bg-gray-100 cursor-pointer border-gray-300 flex 
                                    flex-col gap-1 justify-center items-center p-2
                                    ${categorySelected === cat.$id ? 'bg-gray-200' : 'bg-white'}`
                                    }

                                    onClick={() => { handleCatSelection(cat.$id) }}
                                >
                                    <DynamicIcon name={cat.icon} size={20} />
                                    <span className='text-xs'>{cat.name}</span>
                                </button>
                            ))}
                        </div> :
                        <div className='grid grid-cols-3 gap-1 md:gap-2'>
                            {revenuesCat.map((cat) => (
                                <button key={cat.$id}
                                    className={
                                        `w-20 h-20 text-gray-600 rounded-sm border
                                    hover:bg-gray-100 cursor-pointer border-gray-300 flex 
                                    flex-col gap-1 justify-center items-center p-2
                                    ${categorySelected === cat.$id ? 'bg-gray-200' : 'bg-white'}`
                                    }

                                    onClick={() => { handleCatSelection(cat.$id) }}
                                >
                                    <DynamicIcon name={cat.icon} size={20} />
                                    <span className='text-xs'>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                }
            </div>
            {categorySelected !== '' && (<FormField type={section} onSubmit={handleFormData} initialData={initialData ? { description: initialData.description, amount: initialData.amount } : undefined} />)}
            {adding && (
                <div className='w-full flex justify-center items-center gap-1'>
                    <Spinner />
                    Adding your ${section}
                </div>
            )}
        </div>
    </div>
}