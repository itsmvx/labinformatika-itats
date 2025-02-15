import { PraktikanLayout } from "@/layouts/PraktikanLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CircleAlert, CircleCheckBig, MoreHorizontal, Users2 } from "lucide-react";
import { TableSearchForm } from "@/components/table-search-form";
import {
    ColumnDef,
} from "@tanstack/react-table";
import { parseSesiTime } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DataTable from "@/components/data-table";

type Praktikum = {
    id: string;
    nama: string;
    terverifikasi: boolean;
    sesi: {
        id: string;
        nama: string;
        hari: string;
        waktu_mulai: string;
        waktu_selesai: string;
    } | null;
    aslab: {
        id: string;
        nama: string;
    } | null;
};
export default function PraktikanPraktikumIndexPage({ auth, praktikums, currentDate }: PageProps<{
    praktikums: Praktikum[];
    currentDate: string;
}>) {
    console.log(praktikums);
    const columns: ColumnDef<Praktikum>[] = [
        {
            accessorKey: "nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Praktikum
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-48 truncate px-2">
                    {row.getValue("nama")}
                </div>
            ),
        },
        {
            accessorFn: (row) => row.sesi?.nama || "-",
            id: "sesi.nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Sesi
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const sesi = row.original.sesi;
                return (
                    <div className="capitalize min-w-40 ml-4 flex flex-col md:flex-row flex-wrap gap-x-0.5">
                        <p>{ sesi ? `${sesi.nama} - ${sesi.hari} ` : '-'}</p>
                        <p>{ sesi ? `(${parseSesiTime(sesi.waktu_mulai, currentDate)} - ${parseSesiTime(sesi.waktu_selesai, currentDate)})` : ""}</p>
                    </div>
                );
            },
        },
        {
            accessorFn: (row) => row.aslab?.nama || "-",
            id: "aslab.nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="min-w-48 justify-start"
                    >
                        Asisten Laboratorium
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const aslab = row.original.aslab;
                return (
                    <div className="capitalize w-48 ml-4 flex items-center gap-2">
                        <p className="truncate">{ aslab ? `${aslab.nama}` : '-'  }</p>
                        { aslab && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="ml-auto group">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" className="text-gray-700 group-hover:text-green-600">
                                            <path fill="currentColor" d="M8 0a8 8 0 1 1-4.075 14.886L.658 15.974a.5.5 0 0 1-.632-.632l1.089-3.266A8 8 0 0 1 8 0M5.214 4.004a.7.7 0 0 0-.526.266C4.508 4.481 4 4.995 4 6.037c0 1.044.705 2.054.804 2.196c.098.138 1.388 2.28 3.363 3.2q.55.255 1.12.446c.472.16.902.139 1.242.085c.379-.06 1.164-.513 1.329-1.01c.163-.493.163-.918.113-1.007c-.049-.088-.18-.142-.378-.25c-.196-.105-1.165-.618-1.345-.687c-.18-.073-.312-.106-.443.105c-.132.213-.507.691-.623.832c-.113.139-.23.159-.425.053c-.198-.105-.831-.33-1.584-1.054c-.585-.561-.98-1.258-1.094-1.469c-.116-.213-.013-.326.085-.433c.09-.094.198-.246.296-.371c.097-.122.132-.21.198-.353c.064-.141.031-.266-.018-.371s-.443-1.152-.607-1.577c-.16-.413-.323-.355-.443-.363c-.114-.005-.245-.005-.376-.005"></path>
                                        </svg>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Wangsaff kan</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) }
                    </div>
                );
            },
        },
        {
            accessorKey: "terverifikasi",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-40 justify-start"
                >
                    Status Verifikasi
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const terverifikasi = row.original.terverifikasi;
                return (
                    <div className={ `ml-3 w-28 text-sm font-medium flex gap-1 items-center justify-center ${terverifikasi ? 'text-green-600' : 'text-red-500'} text-sm` }>
                        { row.original.terverifikasi
                            ? (
                                <>
                                    <CircleCheckBig size={20} strokeWidth={2.5} color="green" />
                                    <p>Terverifikasi</p>
                                </>
                            ) : (
                                <>
                                    <CircleAlert size={20} strokeWidth={2.5} />
                                    <p>Menunggu</p>
                                </>
                            )
                        }
                    </div>
                )
            }
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const originalRow = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem disabled onClick={ () => router.visit(route('admin.praktikum.praktikan.index', { q: originalRow.id })) }>
                                <Users2 /> Detail Praktikum
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <PraktikanLayout auth={ auth }>
                <Head title="Praktikan - Histori Praktikum"/>
                <CardTitle>
                    Histori Praktikum
                </CardTitle>
                <CardDescription>
                    Menampilkan data Praktikum yang telah terdaftar
                </CardDescription>
                <div className="flex flex-col lg:flex-row gap-2 items-start justify-end">
                    <TableSearchForm />
                </div>
                <DataTable<Praktikum>
                    columns={columns}
                    data={praktikums}
                />
            </PraktikanLayout>
        </>
    );
}
