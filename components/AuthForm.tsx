import { useState } from "react";
import { Button } from "./ui/button";

interface AuthFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    submitType: string;
}

export default function AuthForm({ handleSubmit, submitType }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    // 1. Déclaration de l'état d'erreur
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null); // 2. On réinitialise l'erreur à chaque nouvelle tentative
        
        try {
            await handleSubmit(event);
        } catch (err: any) {
            // 3. On capture l'erreur si la promesse de handleSubmit échoue
            // Ajustez "err.message" selon la structure d'erreur renvoyée par votre backend
            setError(err.message || "Une erreur inattendue est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className="w-full flex flex-col gap-4"
            onSubmit={onSubmit}
        >
            <div className="flex flex-col gap-3">
                {
                    submitType === 'Sign Up' && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    )
                }
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {
                    submitType === 'Sign Up' && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )
                }
            </div>

            {/* 4. Affichage conditionnel de la boîte d'erreur */}
            {error && (
                <div className="p-3 text-sm font-medium text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                disabled={isLoading}
                aria-label={submitType}
                className="w-full py-5 mt-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
                {isLoading && (
                    <svg 
                        className="animate-spin h-5 w-5 text-slate-900" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isLoading ? "Veuillez patienter..." : submitType}
            </Button>
        </form>
    );
}
