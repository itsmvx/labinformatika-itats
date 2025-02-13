import { ChevronDown } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { LogoJarkom } from "@/lib/StaticImagesLib";
import { Link } from "@inertiajs/react";

const data: {
    navMain: {
        title: string;
        url: string;
        items: {
            title: string;
            url: string;
            route: string;
        }[];
    }[];
} = {
    navMain: [
        {
            title: "Praktikum",
            url: "#",
            items: [
                {
                    title: "Registrasi Praktikum",
                    url: route('praktikan.praktikum.create'),
                    route: 'praktikan.praktikum.create'
                },
                {
                    title: "Histori Praktikum",
                    url: route('praktikan.praktikum.index'),
                    route: 'praktikan.praktikum.index'
                },
            ],
        },
        {
            title: "Kuis",
            url: "#",
            items: [
                // {
                //     title: "Mulai Kuis",
                //     url: route('admin.kuis.label.index'),
                //     route: 'admin.kuis.label.index'
                // },
                // {
                //     title: "Histori Kuis",
                //     url: route('admin.kuis.soal.index'),
                //     route: 'admin.kuis.soal.index'
                // },
            ],
        },
        {
            title: "Informasi Penting",
            url: "#",
            items: [
                // {
                //     title: "Manajemen Praktikan",
                //     url: route('admin.praktikan.index'),
                //     route: 'admin.praktikan.index'
                // },
            ],
        },
    ],
}

export function PraktikanSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="bg-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="px-3 flex gap-1 items-center">
                            <div className="flex aspect-square size-16 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                <img src={ LogoJarkom } width={ 80 } alt="jarkom-jaya"/>
                            </div>
                            <p className="font-semibold text-lg select-none">
                                Jarkom Jaya
                            </p>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/">
                                    Halaman Utama
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={ route().current() === 'praktikan.dashboard' }>
                                <Link href={route('praktikan.dashboard')}>
                                    Dashboard
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={ route().current() === 'praktikan.profile' }>
                                <Link href={route('praktikan.profile')}>
                                    Profil Saya
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        { data.navMain.map((item) => (
                            <Collapsible
                                key={item.title}
                                defaultOpen={item.items.some((itm) => route().current() === itm.route)}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            {item.title}{" "}
                                            <ChevronDown className="ml-auto rotate-0 group-data-[state=open]/collapsible:-rotate-180 transition-rotate ease-in-out duration-300" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    {item.items?.length ? (
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((item) => (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={route().current() === item.route}
                                                        >
                                                            <Link href={item.url}>{item.title}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    ) : null}
                                </SidebarMenuItem>
                            </Collapsible>
                        )) }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
