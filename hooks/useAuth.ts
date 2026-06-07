import { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';
import type { Models } from 'appwrite';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [current, setCurrent] = useState<Models.User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const register = async (name: string, email: string, password: string): Promise<void> => {
        try {
            await account.create({
                userId: ID.unique(),
                name,
                email,
                password
            } as any); 
            
            await login(email, password);
        } catch (error: any) {
            // On récupère le message d'erreur d'Appwrite et on le renvoie au formulaire
            throw new Error(error.message || "Registration failed. Please try again.");
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            await account.createEmailPasswordSession({
                email,
                password
            } as any);
            
            const user = await account.get();
            setCurrent(user);
            router.push('/dashboard');
        } catch (error: any) {
            // Même chose pour la connexion
            throw new Error(error.message || "Invalid email or password.");
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await account.deleteSessions();
            setCurrent(null);
            router.push('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getCurrentUser = async () => {
        try {
            const user = await account.get();
            setCurrent(user);
        } catch (error) {
            setCurrent(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    return {
        current,
        loading,
        login,
        logout,
        register,
    };
}
