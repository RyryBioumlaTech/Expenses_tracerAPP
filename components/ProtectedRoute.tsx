"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { current, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !current) {
            router.push("/login");
        }
    }, [current, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
                {/* Sidebar Skeleton */}
                <div className="hidden md:flex w-64 flex-col gap-4 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <div className="flex flex-col gap-2 mt-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-md" />
                        ))}
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1 flex flex-col gap-8 p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>

                    {/* Charts/Table Area */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                        <Skeleton className="col-span-3 h-[400px] rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!current) {
        return null;
    }

    return <>{children}</>;
}
