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
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Loader2, Trash2, Plus, Users2 } from "lucide-react"
import { FormEvent, useState } from "react";
import { TableSearchForm } from "@/components/table-search-form";
import { cn } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import DataTable from "@/components/data-table";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type Berita = {
    id: string;
    judul: string;
    admin: {
        id: string;
        nama: string;
    } | null;
    updated_at: string | null;
};

export default function AdminBeritaIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Berita[]>;
}>) {
    console.log(pagination.data);
    const { toast } = useToast();
    type DeleteForm = {
        id: string;
        judul: string;
        validation: string;
        onSubmit: boolean;
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        judul: '',
        validation: '',
        onSubmit: false
    };

    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<Berita>[] = [
        {
            accessorKey: "judul",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Judul
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-52 max-w-96 truncate px-2 ml-2">
                    {row.getValue("judul")}
                </div>
            ),
        },
        {
            accessorKey: "admin",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Admin
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="min-w-20 ml-4">
                    { row.original.admin ? row.original.admin.nama : "-" }
                </div>
            ),
        },
        {
            accessorKey: "updated_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Terakhir diperbarui
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const updatedAtFormatted = row.original.updated_at
                    ? format(new Date(row.original.updated_at), 'PPpp', { locale: localeId })
                    : ''
                return (
                    <div className="min-w-20 ml-4">
                        { updatedAtFormatted }
                    </div>
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
                                    judul: originalRow.judul
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
            id: z.string({ message: 'Format Berita tidak valid! '}).min(1, { message: 'Format Berita tidak valid!' }),
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
            <Head title="Admin - Manajemen Berita" />
            <CardTitle>
                Manajemen Berita
            </CardTitle>
            <CardDescription>
                Data Berita yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <Button className="mt-4" onClick={ () => router.visit(route('admin.berita.create')) }>
                    Buat <Plus />
                </Button>
                <TableSearchForm />
            </div>
            <DataTable<Berita>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*--DELETE-FORM--*/ }
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Berita ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Anda akan menghapus Berita!
                            </p>
                            <p className="*:text-red-600">
                                Data berita <strong>{ deleteForm.judul }</strong> akan dihapus.
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
