import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminLayout } from "@/layouts/AdminLayout";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Plus, Loader2, Upload } from "lucide-react"
import { FormEvent, useState } from "react";
import { TableSearchForm } from "@/components/table-search-form";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { deltaParse, RenderQuillDelta } from "@/components/delta-parse";
import DataTable from "@/components/data-table";

type Soal = {
    id: string;
    pertanyaan: string;
    pilihan_jawaban: {
        value: string;
        label: string;
    }[];
    kunci_jawaban: string;
    label: {
        id: string;
        nama: string;
    }[];
};
export default function AdminSoalIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Soal[]>;
}>) {
    const { toast } = useToast();

    type DeleteForm = {
        id: string;
        validation: string;
        onSubmit: boolean;
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        validation: '',
        onSubmit: false
    };
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<Soal>[] = [
        {
            accessorKey: "label",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start "
                    >
                        Label
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const labelArr = row.original.label;
                return (
                    <div className="pl-3 flex flex-wrap gap-2 min-w-40 max-w-60 w-auto overflow-hidden">
                        { labelArr && labelArr.length > 0 ? (
                            labelArr.map((label) => (
                                <Badge key={ label.id } className="py-1 px-2 text-xs">
                                    { label.nama }
                                </Badge>
                            ))
                        ) : (
                            <span className="text-gray-500 italic">Tidak ada label</span>
                        ) }
                    </div>
                );
            },
        },
        {
            accessorKey: "pertanyaan",
            header: () => <div className="min-w-64">Pertanyaan</div>,
            cell: ({ row }) => {
                return (
                    <>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Lihat pertanyaan</AccordionTrigger>
                                <AccordionContent>
                                    <RenderQuillDelta
                                        delta={deltaParse(row.original.pertanyaan)}
                                        className="!items-start justify-center"
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
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
                            <DropdownMenuItem onClick={ () => router.visit(route('admin.kuis.soal.update', { q: originalRow.id })) }>
                                <Pencil /> Ubah data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={ () => {
                                setOpenDeleteForm(true);
                                setDeleteForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
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
            id: z.string({ message: 'Format Soal Kuis tidak valid! '}).min(1, { message: 'Format Soal Kuis tidak valid!' }),
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
        }>(route('soal.delete'), {
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
            <Head title="Admin - Manajemen SoalKuis" />
            <CardTitle>
                Manajemen Soal Kuis
            </CardTitle>
            <CardDescription>
                Data Soal Kuis
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <div className="space-x-2">
                    <Button className="mt-4" onClick={ () => router.visit(route('admin.kuis.soal.create')) }>
                        Buat <Plus />
                    </Button>
                    <Button className="mt-4" onClick={ () => router.visit(route('admin.kuis.soal.create-upload')) }>
                        Upload <Upload />
                    </Button>
                </div>
                <TableSearchForm />
            </div>
            <DataTable<Soal>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*--DELETE-FORM--*/ }
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Soal Kuis
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                                <span className="text-red-600 font-bold">
                                    Anda akan menghapus Soal Kuis!
                                </span>
                            <span className="*:text-red-600">
                                    Data Soal Kuis akan dihapus
                                </span>
                            <br/>
                            <span className="text-red-600">
                                    Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                                </span>
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
                        <Button type="submit" disabled={ deleteForm.onSubmit || deleteForm.validation !== 'JARKOM JAYA' }>
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
