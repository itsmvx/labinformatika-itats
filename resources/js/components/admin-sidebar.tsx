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

export function AdminSidebar({ isMaster = false, ...props }: React.ComponentProps<typeof Sidebar> & {
    isMaster?: boolean
}) {
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
            ...(isMaster ? [
                {
                    title: "Laboratorium",
                    url: "#",
                    items: [
                        {
                            title: "Manajemen Lab.",
                            url: route('admin.laboratorium.index'),
                            route: 'admin.laboratorium.index'
                        },
                    ],
                },
                {
                    title: "Admin",
                    url: "#",
                    items: [
                        {
                            title: "Manajemen Admin",
                            url: route('admin.admin.index'),
                            route: 'admin.admin.index'
                        },
                    ],
                }
            ] : []),
            {
                title: "Asisten Laboratorium",
                url: "#",
                items: [
                    {
                        title: "Manajemen Asisten Lab.",
                        url: route('admin.aslab.index'),
                        route: 'admin.aslab.index'
                    },
                ],
            },
            ...(isMaster ? [
                {
                    title: "Dosen",
                    url: "#",
                    items: [
                        {
                            title: "Manajemen Dosen",
                            url: route('admin.dosen.index'),
                            route: 'admin.dosen.index'
                        },
                    ],
                },
            ] : []),
            ...(isMaster ? [
                {
                    title: "Praktikan",
                    url: "#",
                    items: [
                        {
                            title: "Manajemen Praktikan",
                            url: route('admin.praktikan.index'),
                            route: 'admin.praktikan.index'
                        },
                    ],
                },
            ] : []),
            {
                title: "Praktikum",
                url: "#",
                items: [
                    {
                        title: "Jenis Praktikum",
                        url: route('admin.jenis-praktikum.index'),
                        route: 'admin.jenis-praktikum.index'
                    },
                    {
                        title: "Periode Praktikum",
                        url: route('admin.periode-praktikum.index'),
                        route: 'admin.periode-praktikum.index'
                    },
                    {
                        title: "Manajemen Praktikum",
                        url: route('admin.praktikum.index'),
                        route: 'admin.praktikum.index'
                    },
                ],
            },
            {
                title: "Kuis",
                url: "#",
                items: [
                    {
                        title: "Manajemen Label",
                        url: route('admin.kuis.label.index'),
                        route: 'admin.kuis.label.index'
                    },
                    {
                        title: "Manajemen Soal",
                        url: route('admin.kuis.soal.index'),
                        route: 'admin.kuis.soal.index'
                    },
                    {
                        title: "Manajemen Kuis",
                        url: route('admin.kuis.index'),
                        route: 'admin.kuis.index'
                    },
                ],
            },
            {
                title: "Berita",
                url: "#",
                items: [
                    {
                        title: "Manajemen Berita",
                        url: route('admin.berita.index'),
                        route: 'admin.berita.index'
                    },
                ],
            },
        ],
    };

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
                            <SidebarMenuButton asChild isActive={ route().current() === 'admin.dashboard' }>
                                <Link href={route('admin.dashboard')}>
                                    Dashboard
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
