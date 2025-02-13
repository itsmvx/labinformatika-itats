import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown, Check, MoreHorizontal, Pencil, Loader2, Trash2, Plus, X, Users2 } from "lucide-react"
import { FormEvent, useState } from "react";
import { TableSearchForm } from "@/components/table-search-form";
import { cn, romanToNumber } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { IconSwitch } from "@/components/icon-switch";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import DataTable from "@/components/data-table";

type Praktikum = {
    id: string;
    nama: string;
    tahun: string;
    status: boolean;
    periode: {
        id: string;
        nama: string;
    } | null;
};

export default function AdminPraktikumIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Praktikum[]>;
}>) {
    console.log(pagination.data);
    const { toast } = useToast();
    type DeleteForm = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    type UpdateStatus = {
        id: string;
        onSubmit: boolean;
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false
    };
    const updateStatusInit: UpdateStatus = {
        id: '',
        onSubmit: false
    };

    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);
    const [ updateStatus, setUpdateStatus ] = useState<UpdateStatus>(updateStatusInit);

    const handleUpdateStatus = (id: string, newStatus: boolean) => {
        setUpdateStatus({
            id: id,
            onSubmit: true
        });

        axios.post(route('praktikum.update-status'), {
            id: id,
            status: newStatus,
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['pagination'] });
            })
            .catch((err) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
            .finally(() => setUpdateStatus(updateStatusInit));
    };

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
            accessorFn: (row) => row.periode?.nama || "-",
            id: "periode.nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Periode
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize min-w-20 indent-4">
                        {row.getValue<string>("periode.nama")}
                    </div>
                );
            },
            sortingFn: (rowA, rowB) => {
                const valueA = romanToNumber(rowA.getValue<string>("periode.nama"));
                const valueB = romanToNumber(rowB.getValue<string>("periode.nama"));
                return valueA - valueB;
            },
        },
        {
            accessorKey: "tahun",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Tahun
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-20 indent-4">
                    {row.getValue("tahun")}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Status Aktif
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const originalRow = row.original;
                const currStatus = Boolean(originalRow.status);
                const isCurrStatusSubmit = updateStatus.id === originalRow.id && updateStatus.onSubmit;
                return (
                    <>
                        <div className="flex flex-row items-center gap-1 min-w-20 px-2 capitalize ">
                            <IconSwitch
                                checkedIcon={ isCurrStatusSubmit ? <Loader2 className="animate-spin w-4 h-4 text-blue-600" /> : <Check className="w-4 h-4 text-green-500" /> }
                                uncheckedIcon={ isCurrStatusSubmit ? <Loader2 className="animate-spin w-4 h-4 text-blue-600" /> : <X className="w-4 h-4 text-red-600" /> }
                                className="data-[state=checked]:bg-green-500"
                                aria-label="Status Praktikum"
                                checked={ currStatus }
                                onCheckedChange={ (value) => handleUpdateStatus(originalRow.id, value) }
                            />
                            <p className="font-medium text-xs tracking-wider">{ currStatus ? 'Aktif' : 'Nonaktif' }</p>
                        </div>
                    </>
                )
            },
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
                            <DropdownMenuItem onClick={ () => router.visit(route('admin.praktikum.details', { q: originalRow.id })) }>
                                <Pencil /> Ubah data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={ () => router.visit(route('admin.praktikum.praktikan.index', { q: originalRow.id })) }>
                                <Users2 /> Data Praktikan
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={ () => {
                                setOpenDeleteForm(true);
                                setDeleteForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama
                                }));
                            } }>
                                <Trash2 /> Hapus data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleDeleteFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteForm;
        const deleteSchema = z.object({
            id: z.string({ message: 'Format Praktikum tidak valid! '}).min(1, { message: 'Format Praktikum tidak valid!' }),
        });
        const deleteParse = deleteSchema.safeParse({
            id: id,
        });
        if (!deleteParse.success) {
            const errMsg = deleteParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setDeleteForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('praktikum.delete'), {
            id: id,
        })
            .then((res) => {
                setDeleteForm(deleteFormInit);
                setOpenDeleteForm(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['pagination'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setDeleteForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };


    return (
        <AdminLayout auth={auth}>
            <Head title="Admin - Manajemen Praktikum" />
            <CardTitle>
                Manajemen Praktikum
            </CardTitle>
            <CardDescription>
                Data Praktikum yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <Button className="mt-4" onClick={ () => router.visit(route('admin.praktikum.create')) }>
                    Buat <Plus />
                </Button>
                <TableSearchForm />
            </div>
            <DataTable<Praktikum>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*--DELETE-FORM--*/ }
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Periode Praktikum
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Anda akan menghapus Praktikum!
                            </p>
                            <p className="*:text-red-600">
                                Semua data praktikum <strong>{ deleteForm.nama }</strong> seperti nilai kuis dan sebagainya akan kehilangan keterangannya.
                            </p>
                            <br/>
                            <p className="text-red-600">
                                Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleDeleteFormSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="validation">Validasi aksi anda</Label>
                            <Input
                                type="text"
                                name="validation"
                                id="validation"
                                value={ deleteForm.validation }
                                placeholder="JARKOM JAYA"
                                onChange={ (event) =>
                                    setDeleteForm((prevState) => ({
                                        ...prevState,
                                        validation: event.target.value,
                                    }))
                                }
                                autoComplete="off"
                            />
                            <p>Ketik <strong>JARKOM JAYA</strong> untuk melanjutkan</p>
                        </div>
                        <Button type="submit"
                                disabled={ deleteForm.onSubmit || deleteForm.validation !== 'JARKOM JAYA' }>
                            { deleteForm.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin"/></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </form>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            {/*---DELETE-FORM---*/ }
        </AdminLayout>
    );
}
