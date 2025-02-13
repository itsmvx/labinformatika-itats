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
    ColumnDef, Row,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Plus, Loader2, UserRound, Check, X } from "lucide-react"
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
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import DataTable from "@/components/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSwitch } from "@/components/icon-switch";
import ErrorPage from "@/Pages/ErrorPage";

type Aslab = {
    id: string;
    nama: string;
    username: string;
    no_hp: string | null;
    avatar: string | null;
    jabatan: string;
    aktif: boolean;
    laboratorium: {
        id: string;
        nama: string;
    };
};
export default function AdminAslabIndexPage({ auth, pagination, laboratoriums }: PageProps<{
    pagination: PaginationData<Aslab[]>;
    laboratoriums: {
        id: string;
        nama: string;
    }[];
}>) {

    const authAdmin = auth.user;
    if (!authAdmin && auth.role !== "admin") {
        return (
            <ErrorPage status={401} />
        );
    }

    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        username: string;
        no_hp: string;
        jabatan: string;
        laboratorium_id: string;
        onSubmit: boolean;
    };
    type UpdateForm = {
        id: string;
        nama: string;
        username: string;
        no_hp: string;
        jabatan: string;
        laboratorium_id: string;
        onSubmit: boolean;
    };
    type DeleteForm = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    type UpdateAktif = {
        id: string;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        username: '',
        no_hp: '',
        jabatan: '',
        laboratorium_id: auth.user?.laboratorium_id ?? '',
        onSubmit: false
    };
    const updateFormInit: UpdateForm = {
        id: '',
        nama: '',
        username: '',
        no_hp: '',
        jabatan: '',
        laboratorium_id: '',
        onSubmit: false
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false
    };
    const updateAktifInit: UpdateAktif = {
        id: '',
        onSubmit: false
    };

    const [ openCreateForm, setOpenCreateForm ] = useState(false);
    const [ openUpdateForm, setOpenUpdateForm ] = useState(false);
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const [ updateForm, setUpdateForm ] = useState<UpdateForm>(updateFormInit);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const [ updateAktif, setUpdateAktif ] = useState<UpdateAktif>(updateAktifInit);
    const handleUpdateStatus = (id: string, newStatus: boolean) => {
        setUpdateAktif({
            id: id,
            onSubmit: true
        });

        axios.post(route('aslab.update-aktif'), {
            id: id,
            aktif: newStatus,
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
            .finally(() => setUpdateAktif(updateAktifInit));
    };

    const columns: ColumnDef<Aslab>[] = [
        {
            accessorKey: "nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start "
                    >
                        Nama
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return (
                    <>
                        <div className="capitalize min-w-52 ml-2 flex items-center gap-2">
                            <div className={ `justify-between min-w-11 w-11 h-11 rounded-full overflow-hidden content-center ${!row.original.avatar ? 'bg-gray-100 shadow' : ''}` }>
                                { row.original.avatar ? (
                                    <img
                                        src={`/storage/aslab/${row.original.avatar}`}
                                        alt="aslab-avatar"
                                    />
                                ) : (
                                    <UserRound className="mx-auto" />
                                )}
                            </div>
                            <p className="line-clamp-2">{row.getValue("nama")}</p>
                        </div>
                    </>
                )
            },
        },
        {
            accessorKey: "username",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start items-start"
                    >
                        NPM
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase min-w-20 ml-4">{row.getValue("username")}</div>,
        },
        ...(!auth.user?.laboratorium_id ? [
            {
                accessorKey: "laboratorium",
                header: () => <div className="select-none">Laboratorium</div>,
                cell: ({ row }: { row: Row<Aslab>}) => <div className="w-44">{row.original.laboratorium.nama}</div>,
            },
        ] : [] ),
        {
            accessorKey: "jabatan",
            header: () => <div className="select-none">Jabatan</div>,
            cell: ({ row }) => <div className="min-w-28">{row.getValue("jabatan")}</div>,
        },
        {
            accessorKey: "no_hp",
            header: () => <div className="select-none">No.HP/Wangsaff</div>,
            cell: ({ row }) => <div className={ `w-24 ${row.getValue('no_hp') ? 'indent-0' : 'indent-4'}` }>{row.getValue("no_hp") ?? '-'}</div>,
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
                const isAktif = Boolean(originalRow.aktif);
                const isCurrAktifSubmit = updateAktif.id === originalRow.id && updateAktif.onSubmit;
                return (
                    <>
                        <div className="flex flex-row items-center gap-1 min-w-20 px-2 capitalize ">
                            <IconSwitch
                                checkedIcon={ isCurrAktifSubmit ? <Loader2 className="animate-spin w-4 h-4 text-blue-600" /> : <Check className="w-4 h-4 text-green-500" /> }
                                uncheckedIcon={ isCurrAktifSubmit ? <Loader2 className="animate-spin w-4 h-4 text-blue-600" /> : <X className="w-4 h-4 text-red-600" /> }
                                className="data-[state=checked]:bg-green-500"
                                aria-label="Status Praktikum"
                                checked={ isAktif }
                                onCheckedChange={ (value) => handleUpdateStatus(originalRow.id, value) }
                            />
                            <p className="font-medium text-xs tracking-wider">{ isAktif ? 'Aktif' : 'Nonaktif' }</p>
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
                            <DropdownMenuItem disabled={!auth.user?.id} onClick={ () => {
                                setOpenUpdateForm(true);
                                setUpdateForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama,
                                    username: originalRow.username,
                                    jabatan: originalRow.jabatan,
                                    no_hp: originalRow.no_hp ?? '',
                                    laboratorium_id: originalRow.laboratorium.id,
                                }));
                            } }>
                                <Pencil /> Ubah data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={ () => {
                                setOpenDeleteForm(true);
                                setDeleteForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama,
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
        const { nama, username, no_hp, jabatan, laboratorium_id } = createForm;
        const namaSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Asisten Lab. wajib diisi!' }),
            username: z.string({ message: 'Format NPM tidak valid! '}).min(1, { message: 'NPM Asisten Lab. wajib diisi!' }),
            no_hp: z.union([
                z.string().regex(/^08\d{6,12}$/, { message: "Nomor HP / Wangsaff tidak valid" }),
                z.string().length(0)
            ]),
            jabatan: z.string({ message: 'Format Jabatan tidak valid! '}).min(1, { message: 'Jabatan Asisten Lab. wajib diisi!' }),
        });
        const createParse = namaSchema.safeParse({
            nama: nama,
            username: username,
            jabatan: jabatan,
            no_hp: no_hp,
        });
        if (!createParse.success) {
            const errMsg = createParse.error.issues[0]?.message;
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
        }>(route('aslab.create'), {
            nama: nama,
            username: username,
            no_hp: no_hp,
            jabatan: jabatan,
            laboratorium_id: laboratorium_id,
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
        const { id, nama, username, no_hp, jabatan, laboratorium_id } = updateForm;
        const updateSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Asisten Lab. wajib diisi!' }),
            username: z.string({ message: 'Format Username tidak valid! '}).min(1, { message: 'Username Asisten Lab. wajib diisi!' }),
            no_hp: z.union([
                z.string().regex(/^08\d{6,12}$/, { message: "Nomor HP / Wangsaff tidak valid" }),
                z.string().length(0)
            ]),
            jabatan: z.string({ message: 'Format Jabatan tidak valid! '}).min(1, { message: 'Jabatan Asisten Lab. wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            nama: nama,
            username: username,
            jabatan: jabatan,
            no_hp: no_hp,
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
        }>(route('aslab.update'), {
            id: id,
            nama: nama,
            username: username,
            no_hp: no_hp,
            jabatan: jabatan,
            laboratorium_id: laboratorium_id,
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
            id: z.string({ message: 'Format Aslab tidak valid! '}).min(1, { message: 'Format Aslab tidak valid!' }),
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
        }>(route('aslab.delete'), {
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
    const handleOpenCreateFormChange = (open: boolean) => {
        setOpenCreateForm(open);
        setCreateForm(createFormInit);
    };
    const handleOpenUpdateFormChange = (open: boolean) => {
        setOpenUpdateForm(open);
        setCreateForm(updateFormInit);
    };
    const handleDeleteFormCancel = () => {
        setOpenDeleteForm(false);
        setDeleteForm(deleteFormInit);
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Asisten Lab. - Manajemen Aslab" />
            <CardTitle>
                Manajemen Asisten Laboratorium
            </CardTitle>
            <CardDescription>
                Data Asisten Laboratorium yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <AlertDialog open={ openCreateForm } onOpenChange={ handleOpenCreateFormChange }>
                    <AlertDialogTrigger asChild>
                        <Button className="mt-4">
                            Buat <Plus />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Menambahkan Asisten Lab.
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                <strong>Password</strong> default akun adalah NPM
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                            <div className="grid gap-2">
                                <Label>Laboratorium</Label>
                                <Select disabled={auth.user?.laboratorium_id !== null} value={createForm.laboratorium_id} onValueChange={(val) => setCreateForm((prevState) => ({ ...prevState, laboratorium_id: val }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Laboratorium" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {laboratoriums.map((lab) => ((
                                            <SelectItem key={lab.id} value={lab.id}>{lab.nama}</SelectItem>
                                        )))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Asisten Lab.</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ createForm.nama }
                                    onChange={ (event) => setCreateForm((prevState) => ({ ...prevState, nama: event.target.value })) }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">NPM</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="06.xxxx.1.xxxxx"
                                    value={ createForm.username }
                                    onChange={ (event) => setCreateForm((prevState) => ({ ...prevState, username: event.target.value })) }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="no_hp">No.HP / Wangsaff (tidak wajib)</Label>
                                <Input
                                    id="no_hp"
                                    name="no_hp"
                                    type="text"
                                    placeholder="08xxxxxxxxxx"
                                    value={ createForm.no_hp }
                                    onChange={ (event) => setCreateForm((prevState) => ({ ...prevState, no_hp: event.target.value.replace(/\D/g, "") })) }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="jabatan">Jabatan Asisten Lab.</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    type="text"
                                    placeholder="Koordinator / Sekretaris / Bendahara / Lainnya..."
                                    value={ createForm.jabatan }
                                    onChange={ (event) => setCreateForm((prevState) => ({ ...prevState, jabatan: event.target.value })) }
                                />
                            </div>
                            <Button type="submit" disabled={createForm.onSubmit || !createForm.laboratorium_id || !createForm.nama || !createForm.username || !createForm.jabatan }>
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
            <DataTable<Aslab>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*UPDATE FORM*/}
            <AlertDialog open={ openUpdateForm } onOpenChange={ handleOpenUpdateFormChange }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Memperbarui data Asisten Lab.
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ...
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                        <div className="grid gap-2">
                            <Label>Laboratorium</Label>
                            <Select disabled={auth.user?.laboratorium_id !== null} value={updateForm.laboratorium_id} onValueChange={(val) => setUpdateForm((prevState) => ({ ...prevState, laboratorium_id: val }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Laboratorium" />
                                </SelectTrigger>
                                <SelectContent>
                                    {laboratoriums.map((lab) => ((
                                        <SelectItem key={lab.id} value={lab.id}>{lab.nama}</SelectItem>
                                    )))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Asisten Lab.</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                onChange={ (event) => setUpdateForm((prevState) => ({ ...prevState, nama: event.target.value })) }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">NPM</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="06.xxxx.1.xxxxx"
                                value={ updateForm.username }
                                onChange={ (event) => setUpdateForm((prevState) => ({ ...prevState, username: event.target.value })) }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="no_hp">No.HP / Wangsaff (tidak wajib)</Label>
                            <Input
                                id="no_hp"
                                name="no_hp"
                                type="text"
                                placeholder="08xxxxxxxxxx"
                                value={ updateForm.no_hp }
                                onChange={ (event) => setUpdateForm((prevState) => ({ ...prevState, no_hp: event.target.value.replace(/\D/g, "") })) }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="jabatan">Jabatan Asisten Lab.</Label>
                            <Input
                                id="nama"
                                name="nama"
                                type="text"
                                placeholder="Koordinator / Sekretaris / Bendahara / Lainnya..."
                                value={ updateForm.jabatan }
                                onChange={ (event) => setUpdateForm((prevState) => ({ ...prevState, jabatan: event.target.value })) }
                            />
                        </div>
                        <Button type="submit" disabled={updateForm.onSubmit || !updateForm.laboratorium_id || !updateForm.nama || !updateForm.username || !updateForm.jabatan }>
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
            {/*END OF UPDATE FORM*/}

            {/*--DELETE-FORM--*/ }
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Aslab
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <span className="text-red-600 font-bold">
                                Anda akan menghapus Aslab!
                            </span>
                            <span className="*:text-red-600">
                                Semua data Aslab <strong>{ deleteForm.nama }</strong> seperti keterangan asisten lab. Praktikum akan hilang
                            </span>
                            <span className="*:text-red-600">
                                Mencoba menghilangkan keikutsertaan Asisten ini pada Praktikum? <strong className="!text-gray-800">Nonaktifkan</strong> saja
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
