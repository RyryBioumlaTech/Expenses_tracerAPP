import { useState } from "react";
import { Button } from "./ui/button";

interface AuthFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    submitType: string;
}

export default function AuthForm({ handleSubmit, submitType }: AuthFormProps) {
    // 1. Déclaration de l'état de chargement
    const [isLoading, setIsLoading] = useState(false);

    // 2. Fonction intermédiaire pour gérer l'état pendant la soumission
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Empêche le rechargement de la page si ce n'est pas fait dans handleSubmit
        setIsLoading(true);
        
        try {
            await handleSubmit(event);
        } finally {
            // S'exécute que la promesse soit résolue ou rejetée
            setIsLoading(false);
        }
    };

    return (
        <form
            className="w-full flex flex-col gap-4"
            onSubmit={onSubmit} // Utilisation de la nouvelle fonction
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

            <Button
                type="submit"
                disabled={isLoading} // 3. Désactive le bouton pendant le chargement
                aria-label={submitType}
                className="w-full py-5 mt-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
                {/* 4. Affichage conditionnel du SVG de chargement */}
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
