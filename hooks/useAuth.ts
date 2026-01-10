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
        await account.create({
            userId: ID.unique(),
            name,
            email,
            password
        });
        await login(email, password);
    };

    const login = async (email: string, password: string): Promise<void> => {
        await account.createEmailPasswordSession({
            email,
            password
        });
        const user = await account.get();
        setCurrent(user);
        router.push('/dashboard');
    };

    const logout = async (): Promise<void> => {
        await account.deleteSessions();
        setCurrent(null);
        router.push('/login');
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
