"use client"

import { ChartPie, ChevronUp, LogOut, NotebookPen, Sun, User2 } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const items = [
    {
        title: 'Dashboard',
        link: '/dashboard',
        icon: ChartPie
    },
    {
        title: 'Manage',
        link: '/dashboard/manage',
        icon: NotebookPen
    }
]

export default function AppSidebar() {

    const { current, logout } = useAuth()
    const navigate = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        logout()
        navigate.push('/login')
    }

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg md:text-bold mt-6 mb-2 mx-2">Main menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-2">
                            {items.map((item) => {
                                const isActive = item.link === '/dashboard'
                                    ? pathname === '/dashboard'
                                    : pathname.startsWith(item.link);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className={`py-2 transition-colors ${isActive ? 'bg-slate-200 hover:bg-slate-200' : ''}`}>
                                            <Link href={item.link} className={`text-sm font-normal ${isActive ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                <item.icon className={isActive ? 'text-emerald-600' : ''} />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> {current?.name}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}