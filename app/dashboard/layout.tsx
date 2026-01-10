"use client"
import AppSideBar from "@/components/AppSideBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <Toaster />
            <SidebarProvider>
                <AppSideBar />
                <main className="w-full">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </ProtectedRoute>
    );
}