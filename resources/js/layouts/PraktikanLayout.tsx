import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/app-footer";
import { Toaster } from "@/components/ui/toaster";
import { PraktikanSidebar } from "@/components/praktikan-sidebar";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";

export const PraktikanLayout = ({ auth, children }: PageProps<{
    children: ReactNode;
}>) => {
    return (
        <SidebarProvider>
            <Head>
                <meta name="description" content="Majestic Mahiru Shiina ❤️"/>
                <meta name="author" content="Laboratorium Teknik Informatika ITATS"/>
            </Head>
            <PraktikanSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
                    <div className="flex items-center space-x-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="h-4"/>
                        <h3 className="text-sm hidden sm:block font-medium text-muted-foreground/80 italic select-none">JARKOM JAYA</h3>
                    </div>
                    <ProfileDropdown auth={auth} />
                </header>
                <div className="p-3 bg-muted">
                    <Card className="p-5 md:p-6 space-y-4 bg-white rounded-md border min-h-[calc(100vh-10rem)]">
                        { children }
                    </Card>
                </div>
                <Footer/>
                <Toaster/>
            </SidebarInset>
        </SidebarProvider>
    )
}
