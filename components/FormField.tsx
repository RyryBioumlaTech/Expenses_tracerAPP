import { Button } from "@/components/ui/button";

type FormProps = {
    type: string,
    onSubmit: (data: DataToSend) => void,
    initialData?: {
        description: string,
        amount: number
    }
}

type DataToSend = {
    description: string,
    amount: number,
}

export default function FormField({ type, onSubmit, initialData }: FormProps) {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const dataToSubmit: DataToSend = {
            description: formData.get('description') as string,
            amount: Number(formData.get('amount'))
        }

        onSubmit(dataToSubmit)

        // Only reset if not editing, or maybe user closes dialog. For now, reset is fine but usually in edit modal closes.
        if (!initialData) {
            form.reset();
        }
    };

    return <form
        className="w-full h-fit  md:rounded-lg flex flex-col  pt-6"
        onSubmit={handleSubmit}
    >
        <ul className="flex flex-col justify-between align-center h-full gap-4 w-full mx-auto">

            <li className="text-sm font-semibold text-gray-400 flex flex-col gap-2">
                <label>
                    {
                        type === 'expense' ? 'To do what ?' : 'Coming from :'
                    }
                </label>
                <div>
                    <input
                        type="text"
                        name="description"
                        defaultValue={initialData?.description}
                        className="px-4 py-2 bg-white border w-full border-gray-300 rounded-sm"
                        placeholder={`${type === 'expense' ? 'To buy a lambo' : 'e.g: Sold a t-shirt...'}`}
                    />
                </div>
            </li>
            <li className="text-sm font-semibold text-gray-400 flex flex-col gap-2">
                <label>Amount</label>
                <div className="w-full">
                    <input
                        type="number"
                        name="amount"
                        defaultValue={initialData?.amount}
                        className="px-4 py-2 bg-white w-full border border-gray-300 rounded-sm"
                        placeholder="e.g: 5000 FCFA"
                        required
                    />
                </div>
            </li>

        </ul>
        <Button type="submit" className="text-semibold mt-6 w-full text-white">
            {initialData ? 'Update' : 'Add'}
        </Button>
    </form>
}