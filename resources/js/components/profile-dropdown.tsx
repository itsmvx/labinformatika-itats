"use client"

import { useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, ChevronDown, UserRound, LogIn, PanelsTopLeft } from 'lucide-react'
import { PageProps } from "@/types";
import { Link, router } from "@inertiajs/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

export function ProfileDropdown({ className, auth }: PageProps<{
    className?: string;
}>) {

    if (!auth.user) {
        return (
            <Link href={ route('praktikan.login') } className="p-2 flex items-center justify-center gap-1.5 font-semibold bg-none hover:bg-muted transition-colors ease-in-out duration-150 rounded-md">
                <LogIn className="h-7 w-7"/>
                <p>Masuk</p>
            </Link>
        )
    }
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const handleDashboard = () => {
        if (auth.role && route().current() !== `${auth.role}.dashboard`) {
            router.visit(route(`${auth.role}.dashboard`));
        }
    };
    const handleProfile = () => {
        if (auth.role && route().current() !== `${auth.role}.profile` && isProfileAvailable) {
            router.visit(route(`${auth.role}.profile`));
        }
    };
    const isProfileAvailable = useMemo(() => {
        return auth.role !== null && auth.role !== 'admin';
    }, [auth])
    const handleLogout = () => {
        axios.post(route('auth.logout'))
            .then(() => {
                router.visit("/");
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`flex items-center justify-start space-x-1 transition-colors duration-200
            ${open ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
            focus:ring-0 focus:ring-offset-0 ${className ?? ''} w-60 !px-2`}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={auth.user.avatar && auth.role ? `/storage/${auth.role}/${auth.user.avatar}` : undefined} alt={auth.user.nama} />
                        <AvatarFallback><UserRound /></AvatarFallback>
                    </Avatar>
                    <span className="truncate flex-1 text-left">{auth.user.nama}</span>
                    <ChevronDown className={`ml-auto justify-self-end h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">{auth.user.nama}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {auth.user.username}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={ handleDashboard }>
                        <PanelsTopLeft className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={ !isProfileAvailable } onClick={ handleProfile}>
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={ handleLogout } className="focus:bg-red-300/40">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

