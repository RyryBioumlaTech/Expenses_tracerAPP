'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm';
import { Receipt } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const { login, register } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        // Le event.preventDefault() est déjà fait dans le composant AuthForm,
        // mais on récupère bien la cible pour le FormData
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        // Si login échoue, la méthode "login" de useAuth doit lever (throw) une erreur
        // pour qu'elle soit attrapée par le try/catch de AuthForm.
        await login(
            formData.get('email') as string,
            formData.get('password') as string
        );

        // On réinitialise le formulaire UNIQUEMENT si la connexion a réussi
        form.reset();
    };

    const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm_password') as string;

        // 1. On lève explicitement une erreur si les mots de passe ne correspondent pas
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match. Please try again.");
        }

        // 2. Si ça correspond, on lance l'inscription
        await register(
            formData.get('name') as string,
            formData.get('email') as string,
            password
        );

        // On réinitialise uniquement si l'inscription a réussi
        form.reset();
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col justify-center items-center bg-slate-900 overflow-hidden font-sans selection:bg-emerald-500/30">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Glow Effect */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md px-4">
                <Link href="/" className="flex items-center justify-center gap-2 mb-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                        <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">PennyTracer</span>
                </Link>

                <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">
                        {isSignUp ? 'Create an account' : 'Welcome back'}
                    </h2>
                    <p className="text-center text-slate-400 mb-6 text-sm">
                        {isSignUp ? 'Start tracking your expenses today' : 'Enter your details to access your account'}
                    </p>

                    <AuthForm
                        handleSubmit={isSignUp ? handleRegistration : handleLogin}
                        submitType={isSignUp ? 'Sign Up' : 'Log In'}
                    />

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
                        >
                            {isSignUp
                                ? 'Already have an account? Log in'
                                : "Don't have an account? Sign up"
                            }
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
