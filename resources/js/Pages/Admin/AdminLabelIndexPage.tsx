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
import { ArrowUpDown, MoreHorizontal, Plus, Loader2, Pencil, Trash2 } from "lucide-react"
import { FormEvent, useState } from "react";
import { TableSearchForm } from "@/components/table-search-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Head, router } from "@inertiajs/react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { PageProps, PaginationData } from "@/types";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import DataTable from "@/components/data-table";

type DataLabel = {
    id: string;
    nama: string;
};
export default function AdminLabelIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<DataLabel[]>;
}>) {
    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        onSubmit: boolean;
    };
    type UpdateForm = {
        id: string;
        nama: string;
        onSubmit: boolean;
    };
    type DeleteForm = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        onSubmit: false
    };
    const updateFormInit: UpdateForm = {
        id: '',
        nama: '',
        onSubmit: false
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false
    };
    const [ openCreateForm, setOpenCreateForm ] = useState(false);
    const [ openUpdateForm, setOpenUpdateForm ] = useState(false);
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const [ updateForm, setUpdateForm ] = useState<UpdateForm>(updateFormInit);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<{
        id: string;
        nama: string;
    }>[] = [
        {
            accessorKey: "nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Nama Label
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="indent-2 min-w-36 px-2">
                    {row.getValue("nama")}
                </div>
            ),
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
                            <DropdownMenuItem onClick={ () => {
                                setOpenUpdateForm(true);
                                setUpdateForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama
                                }));
                            } }>
                                <Pencil /> Ubah data
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

    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama } = createForm;
        const namaSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Label wajib diisi!' }),
        });
        const namaParse = namaSchema.safeParse({
            nama: nama
        });
        if (!namaParse.success) {
            const errMsg = namaParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreateForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('label.create'), {
            nama: nama
        })
            .then((res) => {
                setCreateForm(createFormInit);
                setOpenCreateForm(false);
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
                setCreateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id, nama } = updateForm;
        const updateSchema = z.object({
            id: z.string({ message: 'Format Label tidak valid! '}).min(1, { message: 'Format Label tidak valid!' }),
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Label wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            id: id,
            nama: nama
        });
        if (!updateParse.success) {
            const errMsg = updateParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('label.update'), {
            id: id,
            nama: nama
        })
            .then((res) => {
                setUpdateForm(updateFormInit);
                setOpenUpdateForm(false);
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
                setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleDeleteFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteForm;
        const deleteSchema = z.object({
            id: z.string({ message: 'Format Label tidak valid! '}).min(1, { message: 'Format Label tidak valid!' }),
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
        }>(route('label.delete'), {
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
            <Head title="Admin - Manajemen Label" />
            <CardTitle>
                Manajemen Label
            </CardTitle>
            <CardDescription>
                Data Label yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <AlertDialog open={ openCreateForm } onOpenChange={ setOpenCreateForm }>
                    <AlertDialogTrigger asChild>
                        <Button className="mt-4">
                            Buat <Plus/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Tambah Label
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Label seperti <strong>Sistem Operasi</strong> dan <strong>Modul 1</strong>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Label</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ createForm.nama }
                                    onChange={ (event) => setCreateForm((prevState) => ({
                                        ...prevState,
                                        nama: event.target.value
                                    })) }
                                />
                            </div>
                            <Button type="submit" disabled={createForm.onSubmit}>
                                { createForm.onSubmit
                                    ? (
                                        <>Memproses <Loader2 className="animate-spin" /></>
                                    ) : (
                                        <span>Simpan</span>
                                    )
                                }
                            </Button>
                        </form>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                    </AlertDialogContent>
                </AlertDialog>
                <TableSearchForm />
            </div>
            <DataTable<DataLabel>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*--UPDATE-FORM--*/}
            <AlertDialog open={ openUpdateForm } onOpenChange={ setOpenUpdateForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Update Label
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan mengubah nama Label
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Label</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                onChange={ (event) => setUpdateForm((prevState) => ({
                                    ...prevState,
                                    nama: event.target.value
                                })) }
                            />
                        </div>
                        <Button type="submit" disabled={updateForm.onSubmit}>
                            { updateForm.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin" /></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </form>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            {/*---UPDATE-FORM---*/}

            {/*--DELETE-FORM--*/}
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Label
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Anda akan menghapus Label!
                            </p>
                            <p className="*:text-red-600">
                                Semua data praktikum yang termasuk periode <strong>{ deleteForm.nama }</strong> akan
                                kehilangan keterangannya.
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
                        <Button type="submit" disabled={ deleteForm.onSubmit || deleteForm.validation !== 'JARKOM JAYA'}>
                            { deleteForm.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin" /></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
            {/*---DELETE-FORM---*/}
        </AdminLayout>
    );
}

