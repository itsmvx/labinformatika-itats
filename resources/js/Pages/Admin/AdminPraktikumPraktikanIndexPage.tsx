import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { NotificationCard } from "@/components/notification-card";
import {
    ArrowUpDown, ChevronDown, CircleAlert, CircleCheckBig, Clock,
    Download, FolderCheck, FolderX,
    Loader2,
    MoreHorizontal,
    Trash2,
    TriangleAlert, UserRound, Users2
} from "lucide-react";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    ColumnDef,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn, parseSesiTime } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/data-table";
import { Separator } from "@/components/ui/separator";

type Praktikan = {
    id: string;
    username: string;
    nama: string;
    krs: string | null;
    pembayaran: string | null;
    modul: string | null;
    terverifikasi: boolean;
    aslab: {
        id: string;
        nama: string;
    } | null;
    sesi: {
        id: string;
        nama: string;
    } | null;
};
type Praktikum = {
    id: string;
    nama: string;
    tahun: number;
    praktikan: Praktikan[];
};
export default function AdminPraktikumPraktikanIndexPage({ auth, currentDate, praktikum, sesiPraktikums, aslabs }: PageProps<{
    currentDate: string;
    praktikum: Praktikum;
    sesiPraktikums: {
        id: string;
        nama: string;
        kuota: number | null;
        sisa_kuota: number | null;
        hari: string;
        waktu_mulai: string;
        waktu_selesai: string;
    }[];
    aslabs: {
        id: string;
        nama: string;
        avatar: string | null;
        username: string;
        kuota: number;
    }[];
}>) {
    const { toast } = useToast();
    type uploadFile = {
        file: File | null;
        onLoad: boolean;
        onInvalid: boolean;
        invalidMsg: string;
    };
    type uploadContents = {
        npm: string;
        nama: string;
    };
    type UploadErrors = {
        [key: number]: string[];
    };
    type DeletePraktikan = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    type VerifikasiPraktikan = {
        id: string;
        nama: string;
        username: string;
        sesi_praktikum_id: string;
        aslab_id: string;
        isRandomAslab: boolean;
        onSubmit: boolean;
    };
    const uploadFileInit: uploadFile = {
        file: null,
        onLoad: false,
        onInvalid: false,
        invalidMsg: ''
    };
    const deletePraktikanInit: DeletePraktikan = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false,
    };
    const verifikasiPraktikanInit: VerifikasiPraktikan = {
        id: '',
        nama: '',
        username: '',
        sesi_praktikum_id: '',
        aslab_id: '',
        isRandomAslab: false,
        onSubmit: false
    };

    const [uploadFile, setUploadFile] = useState<uploadFile>(uploadFileInit);
    const [uploadErrors, setUploadErrors] = useState<UploadErrors[]>([]);
    const [uploadContents, setUploadContents] = useState<uploadContents[]>([]);
    const [openUploadContents, setOpenUploadContents] = useState<boolean>(false);
    const [onFetchIdPraktikan, setOnFetchIdPraktikan] = useState(false);
    const [onSubmitUploadContents, setOnSubmitUploadContents] = useState<boolean>(false);

    const [ verifikasiPraktikan, setVerifikasiPraktikan ] = useState<VerifikasiPraktikan>(verifikasiPraktikanInit);
    const [ openVerifikasiPraktikan, setOpenVerifikasiPraktikan ] = useState<boolean>(false);
    const [ openReturnVerifikasiPraktikan, setOpenReturnVerifikasiPraktikan ] = useState<boolean>(false);
    const [ inValidVerifikasiPraktikan, setInvalidVerifikasiPraktikan ] = useState<boolean>(false);
    const [ openDeletePraktikan, setOpenDeletePraktikan ] = useState(false);
    const [ deletePraktikan, setDeletePraktikan ] = useState<DeletePraktikan>(deletePraktikanInit);
    const handleSetUploadFile = (file: File) => {
        setUploadFile({
            file,
            onLoad: true,
            onInvalid: false,
            invalidMsg: "",
        });
    };
    const handleCancelUploadFile = () => {
        setUploadFile(uploadFileInit);
        setUploadErrors([]);
        setUploadContents([]);
        setOnFetchIdPraktikan(false);
        setOnSubmitUploadContents(false);
    };
    const handleSubmitUploadContents = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnFetchIdPraktikan(true);

        axios.get<{
            message: string;
            data: {
                id: string;
                nama: string;
                npm: string;
            }[];
        }>(route('api.praktikans', {
            npm: uploadContents.map((content) => content.npm)
        }))
            .then((res) => {
                const praktikansData = res.data.data as {
                    id: string;
                    nama: string;
                    npm: string;
                }[];
                if (!Array.isArray(praktikansData)) {
                    handleCancelUploadFile();
                    setOpenUploadContents(false);
                    toast({
                        variant: "destructive",
                        title: "Permintaan gagal diproses!",
                        description: 'Data yang didapatkan dari server tidak valid! coba lagi nanti',
                    });
                    return;
                } else if (praktikansData.length < 1) {
                    handleCancelUploadFile();
                    setOpenUploadContents(false);
                    toast({
                        variant: "destructive",
                        title: "Permintaan gagal diproses!",
                        description: 'Tidak ada Praktikan yang terdaftar di sistem dari data yang diberikan',
                    });
                    return;
                }
                setOnFetchIdPraktikan(false);
                setOnSubmitUploadContents(true);

                axios.post(route('praktikum-praktikan.create-mass'), {
                    praktikum_id: praktikum.id,
                    praktikan_ids: uploadContents.map((content) => praktikansData.find((praktikan) => praktikan.npm === content.npm)?.id).filter((filt) => Boolean(filt))
                })
                    .then((res) => {
                        handleCancelUploadFile();
                        setOpenUploadContents(false);
                        toast({
                            variant: "default",
                            className: "bg-green-500 text-white",
                            title: "Berhasil!",
                            description: res.data.message,
                        });
                        router.reload({ only: ['praktikum' ]});
                    })
                    .catch((err: unknown) => {
                        handleCancelUploadFile();
                        setOpenUploadContents(false);
                        const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                            ? err.response.data.message
                            : "Error tidak diketahui terjadi!";
                        toast({
                            variant: "destructive",
                            title: "Permintaan gagal diproses!",
                            description: errMsg,
                        });
                    });
            })
            .catch((err) => {
                setOnFetchIdPraktikan(false);
                setOnSubmitUploadContents(false);
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

    const handleOpenDeletePraktikan = (praktikan: {
        id: string;
        nama: string;
    }) => {
        setDeletePraktikan((prevState) => ({
            ...prevState,
            id: praktikan.id,
            nama: praktikan.nama,
        }));
        setOpenDeletePraktikan(true);
    };
    const handleDeletePraktikanSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeletePraktikan((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deletePraktikan;
        const deleteSchema = z.object({
            praktikan_id: z.string({ message: 'Format Praktikan tidak valid! '}).min(1, { message: 'Format Praktikan tidak valid!' }),
            praktikum_id: z.string({ message: 'Format Praktikum tidak valid! '}).min(1, { message: 'Format Praktikum tidak valid!' }),
        });
        const deleteParse = deleteSchema.safeParse({
            praktikan_id: id,
            praktikum_id: praktikum.id
        });
        if (!deleteParse.success) {
            const errMsg = deleteParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setDeletePraktikan((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('praktikum-praktikan.delete'), {
            praktikan_id: id,
            praktikum_id: praktikum.id
        })
            .then((res) => {
                setDeletePraktikan(deletePraktikanInit);
                setOpenDeletePraktikan(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikum'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setDeletePraktikan((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleDownload = (url: string | null) => {
        if (url) {
            window.open(`/storage/praktikum/${url}`, "_blank");
        }
        return;
    };
    const handleOpenVerifikasi = (id: string) => {
        const praktikan = praktikum.praktikan.find((praktikan) => praktikan.id === id);
        if (!praktikan) {
            setInvalidVerifikasiPraktikan(true);
            return;
        }

        const sesiPraktikum = sesiPraktikums.find((sesi) => sesi.id === praktikan.sesi?.id);
        const isFullSesiPraktikum = sesiPraktikum
            ? sesiPraktikum.kuota !== null && (sesiPraktikum.sisa_kuota ?? 0) <= 0
            : false;
        setVerifikasiPraktikan((prevState) => ({
            ...prevState,
            id: praktikan.id,
            nama: praktikan.nama,
            username: praktikan.username,
            sesi_praktikum_id: !isFullSesiPraktikum ? (praktikan.sesi?.id ?? '') : '',
            aslab_id: praktikan.aslab?.id ?? '',
            isRandomAslab: false
        }));
        setOpenVerifikasiPraktikan(true);
    };
    const handleCancelVerifikasi = (open: boolean) => {
        if (!open) {
            setOpenVerifikasiPraktikan(false);
            setVerifikasiPraktikan(verifikasiPraktikanInit);
        }
    };
    const handleSubmitVerifikasiPraktikan = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setVerifikasiPraktikan((prevState) => ({ ...prevState, onSubmit: true }));

        const { id, sesi_praktikum_id, aslab_id, isRandomAslab } = verifikasiPraktikan;

        let selectedAslabId = aslab_id;
        if (isRandomAslab) {
            if (aslabs.length > 0) {
                const minKuota = Math.min(...aslabs.map(aslab => aslab.kuota));
                const minKuotaAslabs = aslabs.filter(aslab => aslab.kuota === minKuota);
                selectedAslabId = minKuotaAslabs[Math.floor(Math.random() * minKuotaAslabs.length)].id;
            } else {
                toast({
                    variant: "destructive",
                    title: "Aslab tidak tersedia!",
                    description: "Tidak ada data aslab yang tersedia untuk dipilih.",
                });
                setVerifikasiPraktikan((prevState) => ({ ...prevState, onSubmit: false }));
                return;
            }
        }

        axios.post(route('praktikum-praktikan.verifikasi'), {
            praktikum_id: praktikum.id,
            praktikan_id: id,
            sesi_praktikum_id: sesi_praktikum_id,
            aslab_id: selectedAslabId,
            terverifikasi: true
        })
            .then((res) => {
                setVerifikasiPraktikan(verifikasiPraktikanInit);
                setOpenVerifikasiPraktikan(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikum', 'sesiPraktikums', 'aslabs'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setVerifikasiPraktikan((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    const columns: ColumnDef<Praktikan>[] = [
        {
            accessorKey: "username",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="min-w-40 justify-start"
                >
                    NPM
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="w-32 pl-4 text-left truncate">{row.getValue("username")}</div>
            ),
        },
        {
            accessorKey: "nama",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    Nama
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="w-full ml-4 text-left truncate overflow-hidden whitespace-nowrap capitalize">
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
                        className="max-w-32 justify-start"
                    >
                        Sesi
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const sesi = row.original.sesi;
                return (
                    <div className="capitalize min-w-16 max-w-20 ml-4">
                        <p>{ sesi ? `${sesi.nama}` : '-'  }</p>
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
                    <div className="capitalize min-w-48 max-w-60 truncate ml-4">
                        <p>{ aslab ? `${aslab.nama}` : '-'  }</p>
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
                    className="w-36 justify-start"
                >
                    Terverifikasi
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const terverifikasi = row.original.terverifikasi;
                return (
                    <div className={ `ml-3 w-28 flex gap-1 items-center justify-center ${terverifikasi ? 'text-green-600' : 'text-red-500'} text-sm` }>
                        { row.original.terverifikasi
                            ? (
                                <>
                                    <CircleCheckBig size={20} strokeWidth={2.5} color="green" />
                                </>
                            ) : (
                                <>
                                    <CircleAlert size={20} strokeWidth={2.5} />
                                </>
                            )
                        }
                    </div>
                )
            }
        },
        {
            id: "downloads",
            enableHiding: false,
            cell: ({ row }) => {
                const krs = row.original.krs;
                const praktikum = row.original.pembayaran;
                const modul = row.original.modul;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-14 space-x-0">
                                <Download />
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 *:text-sm">
                            <DropdownMenuItem disabled={!krs} onSelect={() => handleDownload(krs)}>KRS</DropdownMenuItem>
                            <DropdownMenuItem disabled={!praktikum} onSelect={() => handleDownload(praktikum)}>Kwitansi Praktikum</DropdownMenuItem>
                            <DropdownMenuItem disabled={!modul} onSelect={() => handleDownload(modul)}>Transfer Modul</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
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
                            <DropdownMenuItem disabled={originalRow.terverifikasi} onClick={() => handleOpenVerifikasi(row.original.id)}>
                                <FolderCheck /> Verifikasi
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={originalRow.terverifikasi} onClick={() => setOpenReturnVerifikasiPraktikan(true)}>
                                <FolderX /> Kembalikan
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDeletePraktikan({ id: row.original.id, nama: row.original.nama })}>
                                <Trash2 /> Hapus data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const exportToExcel = (praktikum: Praktikum) => {
        if (!praktikum || !praktikum.praktikan) return;

        const wb = XLSX.utils.book_new();

        const sesiMap = new Map<string, string>();
        praktikum.praktikan.forEach(p => {
            if (p.sesi) sesiMap.set(p.sesi.id, p.sesi.nama);
        });

        const createSheet = (praktikanList: Praktikan[], sheetName: string) => {
            const sheetData = [
                [`ABSENSI PRAKTIKUM ${praktikum.nama} - ${praktikum.tahun}`],
                [],
                [],
                ["No", "Nama", "NPM", "Tanda Tangan"]
            ];

            const filteredPraktikan = praktikanList
                .filter(p => p.terverifikasi)
                .sort((a, b) => a.username.localeCompare(b.username));

            filteredPraktikan.forEach((p, index) => {
                const noZigzag = index % 2 === 0 ? `${index + 1}...............` : `                   ${index + 1}...............`;
                sheetData.push([(index + 1).toString(), p.nama, p.username, `${noZigzag}`]);
            });

            const ws = XLSX.utils.aoa_to_sheet(sheetData);

            ws["!cols"] = [
                { wch: 3 },
                { wch: 30 },
                { wch: 20 },
                { wch: 20 },
            ];

            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        };

        createSheet(praktikum.praktikan, "Semua");

        sesiMap.forEach((namaSesi, sesiId) => {
            const sesiPraktikan = praktikum.praktikan.filter(p => p.sesi?.id === sesiId);
            createSheet(sesiPraktikan, namaSesi);
        });

        XLSX.writeFile(wb, `Absensi_${praktikum.nama}_${praktikum.tahun}.xlsx`);
    };

    useEffect(() => {
        const handleFile = async () => {
            if (uploadFile.file && uploadFile.onLoad) {
                try {
                    const arrayBuffer = await uploadFile.file.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer);
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const raw_data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (raw_data.length > 0) {
                        const ACCEPT_HEADERS: string[] = [
                            "npm",
                            "nama",
                        ];

                        let invalidHeaders: string[] = [];
                        const receivedHeaders: string[] = raw_data[0].map((header) =>
                            (header as string)?.toLowerCase().trim()
                        );

                        const isValidHeaders = ACCEPT_HEADERS.every((expectedHeader, index) => {
                            const receivedHeader = receivedHeaders[index];
                            if (receivedHeader !== expectedHeader) {
                                invalidHeaders.push(
                                    `Kolom ${receivedHeader ? `"${receivedHeader}"` : `ke-${index+1}`} tidak valid. Ekspetasi kolom "${expectedHeader}".`
                                );
                                return false;
                            }
                            return true;
                        });

                        if (!isValidHeaders) {
                            toast({
                                variant: "destructive",
                                title: "Header file tidak valid",
                                description: invalidHeaders.join(" "),
                            });
                            return;
                        }

                        const errors: UploadErrors[] = [];
                        const sanitizedData = raw_data.slice(1).filter((row: any[], rowIndex: number) => {
                            const rowErrors: string[] = [];

                            const npm = row[0] as string | undefined;
                            if (!npm) {
                                rowErrors.push(`NPM tidak diisi.`);
                            }

                            const nama = row[1] as string | undefined;
                            if (!nama) {
                                rowErrors.push(
                                    `Nama tidak diisi'}`
                                );
                            }

                            if (rowErrors.length > 0) {
                                errors.push({
                                    [rowIndex + 1]: rowErrors,
                                });
                            }

                            return rowErrors.length === 0;
                        });

                        setUploadErrors(errors);

                        if (sanitizedData.length === 0) {
                            toast({
                                variant: "destructive",
                                title: "Gagal memproses file",
                                description: "File tidak memiliki data yang valid atau mungkin kosong.",
                            });
                            return;
                        }

                        setUploadContents(
                            sanitizedData.map((data: string[]) => ({
                                npm: data[0],
                                nama: data[1],
                            }))
                        );
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Gagal membaca file",
                            description: "File kosong atau tidak memiliki data.",
                        });
                    }
                } catch (error: unknown) {
                    const errMsg =
                        error instanceof Error ? error.message : "Gagal membaca dokumen.";
                    toast({
                        variant: "destructive",
                        title: "Kesalahan saat membaca file",
                        description: errMsg,
                    });
                } finally {
                    setTimeout(() => {
                        setUploadFile((prevState) => ({
                            ...prevState,
                            onLoad: false,
                        }));
                    }, 750);
                }
            }
        };

        handleFile();
    }, [uploadFile]);

    useEffect(() => {
        if (uploadContents.length > 0 && !openUploadContents) {
            setOpenUploadContents(true);
        }
    }, [ uploadContents ]);

    console.log(praktikum);

    return (
        <>
            <AdminLayout auth={auth}>
                <Head title={ `Admin - Data Praktikan ${praktikum.nama}` } />
                <CardTitle>Data Praktikan</CardTitle>
                <CardDescription>Menampilkan data Praktikan terdaftar pada Praktikum {praktikum.nama}</CardDescription>
                { uploadErrors.length > 0 && (
                    <NotificationCard className="max-w-full rounded-sm shadow-none bg-red-200 text-sm">
                        <div className="flex gap-1 items-center mb-2">
                            <TriangleAlert width={ 18 } color="red"/>
                            <p className="text-base font-medium">Data yang tidak dibaca karena tidak valid</p>
                        </div>
                        <ul className="list-disc ml-6">
                            { uploadErrors.map((errorObj, idx) => {
                                const baris = Object.keys(errorObj)[0];
                                const messages = errorObj[baris as unknown as number];
                                return (
                                    <li key={ idx }>
                                        Data ke-{ baris } : { messages.join(", ") }
                                    </li>
                                );
                            }) }
                        </ul>
                    </NotificationCard>
                ) }

                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Upload Data Praktikan</AccordionTrigger>
                        <AccordionContent>
                            { uploadFile.onLoad ? (
                                <div className="flex items-center justify-center h-60">
                                    <div className="text-center">
                                        <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto"/>
                                        <p className="mt-2 text-gray-600">Memproses file, mohon tunggu...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <FileUploader
                                        className="mt-4"
                                        onFileUpload={ (file) => handleSetUploadFile(file) }
                                    />
                                    <div
                                        className="w-full mx-auto flex gap-1 items-center justify-center text-center text-sm font-medium">
                                        Tidak memiliki file?
                                        <a href={ route('assets', 'template-upload-praktikum-praktikan.xlsx') } className="hover:text-blue-600 flex items-center gap-0.5" target="_blank">
                                            Unduh template<Download width={ 18 }/>
                                        </a>
                                    </div>
                                </>
                            ) }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Informasi Kuota Asisten Lab.</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            { sesiPraktikums.map((sesi) => ((
                                <div key={sesi.id} className="w-full flex flex-row gap-1">
                                    <div className="capitalize w-72 ml-2 flex items-center gap-2">
                                        <Clock className="ml-2" />
                                        <p className="line-clamp-2 text-ellipsis font-medium -mr-1">{sesi.nama}</p>
                                        <Badge variant="secondary">Kuota {sesi.kuota ? `${sesi.kuota} Praktikan` : 'Tidak terbatas' } </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm hidden sm:block">Sisa Kuota saat ini: </span>
                                        <Badge variant="secondary">{sesi.sisa_kuota ?? 'Tidak terbatas'}</Badge>
                                    </div>
                                </div>
                            )))}
                            <Separator className="!my-4" />
                            { aslabs.map((aslab) => ((
                                <div key={aslab.id} className="w-full flex flex-row gap-1">
                                    <div className="capitalize w-72 ml-2 flex items-center gap-2">
                                        <div className={ `justify-between min-w-11 w-11 h-11 rounded-full overflow-hidden content-center ${!aslab.avatar ? 'bg-gray-100 shadow' : ''}` }>
                                            { aslab.avatar ? (
                                                <img
                                                    src={`/storage/aslab/${aslab.avatar}`}
                                                    alt={ `${aslab.username}-aslab-avatar` }
                                                />
                                            ) : (
                                                <UserRound className="mx-auto" />
                                            )}
                                        </div>
                                        <p className="line-clamp-2 text-ellipsis">{aslab.nama}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm hidden sm:block">Jumlah Praktikan saat ini: </span>
                                        <Badge variant="secondary">{aslab.kuota}</Badge>
                                    </div>
                                </div>
                            )))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="flex flex-row items-center justify-between gap-2">
                    <h3 className="text-base font-medium sm:!mt-5">
                        Data Praktikan Terdaftar
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Unduh Berkas
                                <svg className="scale-150" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={200} height={200} viewBox="0 0 48 48">
                                    <rect width="16" height="9" x="28" y="15" fill="#21a366"></rect><path fill="#185c37" d="M44,24H12v16c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V24z"></path><rect width="16" height="9" x="28" y="24" fill="#107c42"></rect><rect width="16" height="9" x="12" y="15" fill="#3fa071"></rect><path fill="#33c481" d="M42,6H28v9h16V8C44,6.895,43.105,6,42,6z"></path><path fill="#21a366" d="M14,6h14v9H12V8C12,6.895,12.895,6,14,6z"></path><path d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z" opacity=".05"></path><path d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z" opacity=".07"></path><path d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z" opacity=".09"></path><linearGradient id="flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1" x1="4.725" x2="23.055" y1="14.725" y2="33.055" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"></stop><stop offset="1" stop-color="#0b6731"></stop></linearGradient><path fill="url(#flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1)" d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"></path><path fill="#fff" d="M9.807,19h2.386l1.936,3.754L16.175,19h2.229l-3.071,5l3.141,5h-2.351l-2.11-3.93L11.912,29H9.526	l3.193-5.018L9.807,19z"></path>
                                </svg>
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuLabel>Ekspor Excel</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => exportToExcel(praktikum)}>
                                Absensi Praktikum
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Kartu Praktikum
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <DataTable<Praktikan>
                    columns={columns}
                    data={praktikum.praktikan}
                    showViewPerPage={false}
                />
            </AdminLayout>

            <AlertDialog open={ openUploadContents } onOpenChange={ setOpenUploadContents }>
                <AlertDialogContent className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Konfirmasi Data Praktikan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Berhasil membaca { uploadContents.length } data Praktikan yang diupload
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4 h-96 xl:h-[65vh]") } onSubmit={ handleSubmitUploadContents }>
                        <div className="h-80 xl:h-full overflow-y-auto space-y-1 pr-2.5">
                            { uploadContents.map((content, index) => ((
                                <div key={ index } className="!mb-3.5 p-3 rounded border-[1.5px] border-muted-foreground/30">
                                    <h5 className="font-medium text-lg">#{index+1}</h5>
                                    <div className="space-y-1">
                                        <div className="grid gap-2">
                                            <Label htmlFor={ `username-${ index }` }>NPM</Label>
                                            <Input
                                                type="text"
                                                name={ `username-${ index }` }
                                                id={ `username-${ index }` }
                                                value={ content.npm }
                                                onChange={ (event) => {
                                                    const updated = [ ...uploadContents ];
                                                    updated[index].npm = event.target.value;
                                                    setUploadContents(updated);
                                                } }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={ `nama-${ index }` }>Nama</Label>
                                            <Input
                                                type="text"
                                                name={ `nama-${ index }` }
                                                id={ `nama-${ index }` }
                                                value={ content.nama }
                                                onChange={ (event) => {
                                                    const updated = [ ...uploadContents ];
                                                    updated[index].nama = event.target.value;
                                                    setUploadContents(updated);
                                                } }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))) }
                        </div>
                        <Button
                            type="submit"
                            disabled={ onFetchIdPraktikan || onSubmitUploadContents || uploadContents.length < 1 || uploadFile.onLoad }
                        >
                            { onFetchIdPraktikan || onSubmitUploadContents ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="animate-spin h-4 w-4"/>
                                    <span>{ onFetchIdPraktikan ? 'Mengambil data Praktikan...' : 'Mengirim data Praktikan...'}</span>
                                </div>
                            ) : (
                                "Simpan euy"
                            ) }
                        </Button>
                    </form>
                    <AlertDialogCancel onClick={ handleCancelUploadFile }>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={ openDeletePraktikan } onOpenChange={ setOpenDeletePraktikan }>
                <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Praktikan dari Praktikum?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <span className="text-red-600 font-bold">
                                Anda akan menghapus Praktikan dari Praktikum { praktikum.nama }
                            </span>
                            <span className="*:text-red-600">
                                Semua data Nilai Praktikan <strong>{ deletePraktikan.nama }</strong> yang terkait dengan <strong>{ praktikum.nama }</strong> akan juga dihapus
                            </span>
                            <br/>
                            <span className="text-red-600">
                                Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleDeletePraktikanSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="validation">Validasi aksi anda</Label>
                            <Input
                                type="text"
                                name="validation"
                                id="validation"
                                value={ deletePraktikan.validation }
                                placeholder="JARKOM JAYA"
                                onChange={ (event) =>
                                    setDeletePraktikan((prevState) => ({
                                        ...prevState,
                                        validation: event.target.value,
                                    }))
                                }
                                autoComplete="off"
                            />
                            <p>Ketik <strong>JARKOM JAYA</strong> untuk melanjutkan</p>
                        </div>
                        <Button type="submit" disabled={ deletePraktikan.onSubmit || deletePraktikan.validation !== 'JARKOM JAYA'}>
                            { deletePraktikan.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin" /></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="hover:bg-red-300/70"
                            onClick={() => {
                                setDeletePraktikan(deletePraktikanInit);
                                setOpenDeletePraktikan(false);
                            }}
                        >
                            Batal
                        </Button>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={ inValidVerifikasiPraktikan }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Data Praktikan tidak valid!
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel className="bg-rose-600 hover:bg-rose-600/90 text-white hover:text-white">
                        Ok
                    </AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={ openVerifikasiPraktikan } onOpenChange={ handleCancelVerifikasi }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Verifikasi Praktikan
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-900 font-medium antialiased">
                            { verifikasiPraktikan.nama } - { verifikasiPraktikan.username }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitVerifikasiPraktikan }>
                        <div className="space-y-1.5">
                            <div className="grid gap-2">
                                <Label>Asisten Laboratorium</Label>
                                <Select disabled={ verifikasiPraktikan.isRandomAslab } value={ verifikasiPraktikan.aslab_id } onValueChange={ (val) => setVerifikasiPraktikan((prevState) => ({ ...prevState, aslab_id: val })) }>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={ `${verifikasiPraktikan.isRandomAslab ? 'Asisten Laboratorium Acak' : 'Pilih Asisten Laboratorium' }` }/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        { aslabs.length > 0 ? (
                                            aslabs.map((aslab) => (
                                                <SelectItem
                                                    key={aslab.id}
                                                    value={aslab.id}
                                                >
                                                    { aslab.nama }
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem
                                                value={`null-${Math.random().toString(36).substring(2, 6)}`}
                                                disabled
                                            >
                                                Tidak ada Aslab tersedia
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="items-center flex gap-1.5">
                                <Checkbox id="random-aslab" onCheckedChange={(checked) => setVerifikasiPraktikan((prevState) => ({ ...prevState, isRandomAslab: !!checked, aslab_id: !!(checked) ? '' : prevState.aslab_id })) } />
                                <Label htmlFor="random-aslab" className="text-sm opacity-80">Asisten Laboratorium Acak</Label>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Sesi Praktikum</Label>
                            <Select
                                value={verifikasiPraktikan.sesi_praktikum_id}
                                onValueChange={(val) =>
                                    setVerifikasiPraktikan((prevState) => ({
                                        ...prevState,
                                        sesi_praktikum_id: val,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Sesi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sesiPraktikums.length > 0 ? (
                                        sesiPraktikums.map((sesi) => {
                                            const isDisabled = sesi.kuota !== null && (sesi.sisa_kuota ?? 0) <= 0;
                                            return (
                                                <SelectItem
                                                    key={sesi.id}
                                                    value={sesi.id}
                                                    disabled={isDisabled}
                                                >
                                                    {`${sesi.nama} - ${sesi.hari} (${parseSesiTime(sesi.waktu_mulai, currentDate)} - ${parseSesiTime(sesi.waktu_selesai, currentDate)}) ${
                                                        isDisabled ? "(Kuota Penuh)" : ""
                                                    }`}
                                                </SelectItem>
                                            );
                                        })
                                    ) : (
                                        <SelectItem
                                            value={`null-${Math.random()
                                                .toString(36)
                                                .substring(2, 6)}`}
                                            disabled
                                        >
                                            Tidak ada sesi tersedia
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" disabled={ !verifikasiPraktikan.sesi_praktikum_id || (verifikasiPraktikan.isRandomAslab ? false : !verifikasiPraktikan.aslab_id) || verifikasiPraktikan.onSubmit } className="bg-green-500 hover:bg-green-500/90 ">
                            { verifikasiPraktikan.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin"/></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </form>
                    <AlertDialogCancel disabled={ verifikasiPraktikan.onSubmit }>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={ openReturnVerifikasiPraktikan } onOpenChange={ setOpenReturnVerifikasiPraktikan }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Kembalikan Data Praktikan
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-900 font-medium antialiased">
                            { verifikasiPraktikan.nama } - { verifikasiPraktikan.username }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitVerifikasiPraktikan }>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="message">Alasan pengembalian</Label>
                            <Textarea className="min-h-32" placeholder="Type your message here." id="message" />
                        </div>
                        <Button type="submit" disabled={ !verifikasiPraktikan.sesi_praktikum_id || (verifikasiPraktikan.isRandomAslab ? false : !verifikasiPraktikan.aslab_id) } className="bg-red-600 hover:bg-red-600/85">
                            { verifikasiPraktikan.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin"/></>
                                ) : (
                                    <span>Kembalikan</span>
                                )
                            }
                        </Button>
                    </form>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>

        </>
    );
}
