import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn, parseSesiTime } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { PraktikanLayout } from "@/layouts/PraktikanLayout";
import { PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import { FileInputWithPreview } from "@/components/file-input-with-preview";

type Praktikum = {
    id: string;
    nama: string;
    tahun: string;
    jenis: {
        id: string;
        nama: string;
    } | null;
    periode: {
        id: string;
        nama: string;
    } | null;
    sesi: {
        id: string;
        nama: string;
        kuota: number | null;
        sisa_kuota: number | null;
        hari: string;
        waktu_mulai: string;
        waktu_selesai: string;
    }[];
    available: boolean;
};

export default function PraktikanPraktikumCreatePage({ auth, jenisPraktikums, currentDate }: PageProps<{
    jenisPraktikums: {
        id: string;
        nama: string;
        praktikum: Praktikum[];
    }[];
    currentDate: string;
}>) {
    const { toast } = useToast();
    type CreateForm = {
        praktikum_id: string;
        sesi_praktikum_id: string;
        krs: File | null;
        pembayaran: File | null;
        modul: File | null;
        onSubmit: boolean;
        onSuccess: boolean;
    };
    const createFormInit: CreateForm = {
        praktikum_id: '',
        sesi_praktikum_id: '',
        krs: null,
        pembayaran: null,
        modul: null,
        onSubmit: false,
        onSuccess: false
    };

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const handleChangeCreateForm = (key: keyof CreateForm, value: string | boolean | File | null) => {
        if (key === 'praktikum_id' && value) {
            setCreateForm((prevState) => ({ ...prevState, praktikum_id: value as string, sesi_praktikum_id: '' }))
        } else {
            setCreateForm((prevState) => ({ ...prevState, [key]: value }));
        }
    };
    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const authPraktikan = auth.user;
        if (!authPraktikan) {
            toast({
                variant: "destructive",
                title: "Autentikasi Praktikan tidak valid!",
                description: 'Mohon coba lagi atau laporkan masalah ke Asisten Lab.',
            });
            return;
        }
        const { praktikum_id, sesi_praktikum_id, krs, pembayaran, modul } = createForm;
        const createSchema = z.object({
            praktikum_id: z
                .string({ message: "Format Praktikum dipilih tidak valid!" })
                .min(1, { message: "Praktikum wajib dipilih!" }),
            sesi_praktikum_id: z
                .string({ message: "Format Sesi Praktikum dipilih tidak valid!" })
                .min(1, { message: "Sesi Praktikum wajib dipilih!" }),
            krs: z
                .instanceof(File, { message: "KRS harus berupa file yang valid!" })
                .refine(file => file.type === "application/pdf", { message: "File KRS harus berupa file PDF!" })
                .refine(file => file.size <= (4 * 1024 * 1024), { message: "Ukuran file KRS maksimal 4MB!" }),
            pembayaran: z
                .instanceof(File, { message: "Pembayaran harus berupa file yang valid!" })
                .refine(file => file.type === "application/pdf", { message: "Bukti pembayaran harus berupa file PDF!" })
                .refine(file => file.size <= (4 * 1024 * 1024), { message: "Ukuran file bukti pembayaran maksimal 4MB!" }),
            modul: z
                .instanceof(File, { message: "Modul harus berupa file yang valid!" })
                .nullable()
                .refine(file => file === null || ["image/jpeg", "image/jpg", "image/png"].includes(file.type), { message: "File pembayaran modul harus berupa file JPG, JPEG, atau PNG!" })
                .refine(file => file === null || file.size <= (5 * 1024 * 1024), { message: "Ukuran file pembayaran modul maksimal 5MB!" })
        });

        const createParse = createSchema.safeParse({
            praktikum_id: praktikum_id,
            sesi_praktikum_id: sesi_praktikum_id,
            krs: krs,
            pembayaran: pembayaran,
            modul: modul
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

        const formData = new FormData();
        formData.append('praktikum_id', praktikum_id);
        formData.append('sesi_praktikum_id', sesi_praktikum_id);
        krs && formData.append('krs', krs);
        pembayaran && formData.append('pembayaran', pembayaran);
        modul && formData.append('modul', modul);

        axios.post<{
            message: string;
        }>(route('praktikum-praktikan.create'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                setCreateForm((prevState) => ({
                    ...prevState,
                    onSubmit: false,
                    onSuccess: true,
                }));
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('praktikan.praktikum.index'));
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

    return (
        <>
            <PraktikanLayout auth={auth}>
                <Head title="Praktikan - Registrasi Praktikum" />
                <CardTitle>
                    Registrasi Praktikum
                </CardTitle>
                <CardDescription>
                    Pendaftaran Praktikum baru
                </CardDescription>
                <CardDescription className="text-gray-900 font-medium text-sm !my-6">
                    <p className="">(<span className="text-red-600 font-semibold">*</span>) Wajib diisi</p>
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="praktikum">Pilih Praktikum<span className="text-red-600 font-semibold">*</span></Label>
                            <Select onValueChange={(val) => handleChangeCreateForm('praktikum_id', val)}>
                                <SelectTrigger className="min-w-80">
                                    <SelectValue placeholder="Pilih praktikum..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {jenisPraktikums.map((jenis, index) => (
                                        <SelectGroup key={index}>
                                            <SelectLabel>{jenis.nama}</SelectLabel>
                                            {jenis.praktikum.length > 0 ? (
                                                jenis.praktikum.map((praktikum) => (
                                                    <SelectItem
                                                        key={praktikum.id}
                                                        value={praktikum.id}
                                                        disabled={!praktikum.available}
                                                    >
                                                        {`${praktikum.nama} ${!praktikum.available ? '(Sudah terdaftar)' : ''}`}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value={`null-${Math.random().toString(36).substring(2, 6)}`}
                                                    disabled
                                                >
                                                    Tidak ada Praktikum tersedia
                                                </SelectItem>
                                            )}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="sesi_praktikum">Pilih Sesi Praktikum<span className="text-red-600 font-semibold">*</span></Label>
                            <Select
                                onValueChange={(val) => handleChangeCreateForm('sesi_praktikum_id', val)}
                                disabled={!createForm.praktikum_id} // Disable select sesi if no praktikum selected
                            >
                                <SelectTrigger className="min-w-80">
                                    <SelectValue
                                        placeholder={createForm.praktikum_id ? "Pilih sesi praktikum..." : "Pilih praktikum dulu..."}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {createForm.praktikum_id ? (
                                        jenisPraktikums
                                            .flatMap((jenis) =>
                                                jenis.praktikum.filter((praktikum) => praktikum.id === createForm.praktikum_id)
                                            )
                                            .map((praktikum) => {
                                                return praktikum.sesi.length > 0 ? (
                                                    praktikum.sesi.map((sesi) => (
                                                        <SelectItem
                                                            key={sesi.id}
                                                            value={sesi.id}
                                                            disabled={sesi.kuota !== null && (sesi.sisa_kuota ?? 0) <= 0}
                                                        >
                                                            {`${sesi.nama} - ${sesi.hari} (${parseSesiTime(sesi.waktu_mulai, currentDate)} - ${parseSesiTime(sesi.waktu_selesai, currentDate)}) ${
                                                                sesi.kuota !== null && (sesi.sisa_kuota ?? 0) <= 0 ? '(Kuota Penuh)' : ''
                                                            }`}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem
                                                        value={`null-${Math.random().toString(36).substring(2, 6)}`}
                                                        disabled
                                                    >
                                                        Tidak ada sesi tersedia
                                                    </SelectItem>
                                                )
                                            })
                                    ) : (
                                        <SelectItem
                                            value="null"
                                            disabled
                                        >
                                            Pilih praktikum dulu
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:flex-wrap gap-5 items-start md:items-start justify-center *:w-full *:md:min-w-72 *:md:w-80 *:min-h-80 *:py-5 *:px-4 *flex-1 *:flex *:flex-col *:gap-1 *:border *:border-muted-foreground/30 *:rounded-md *:grow">
                        <div>
                            <h5 className="w-64 font-medium">Kartu Rencana Studi (KRS)<span className="text-red-600 font-semibold">*</span></h5>
                            <FileInputWithPreview
                                allowedTypes={ [ "application/pdf" ] }
                                id="krs"
                                placeholder="Tarik dan Lepaskan file disini atau klik untuk memilih file (PDF). Ukuran maksimum 4MB"
                                errorMessage="Hanya file PDF yang diperbolehkan"
                                maxSize={4096}
                                maxSizeMessage="Ukuran maksimum file KRS adalah 4MB"
                                value={ createForm.krs }
                                onChange={ (file) => handleChangeCreateForm('krs', file) }
                            />
                        </div>
                        <div>
                            <h5 className="w-64 font-medium">Bukti Pembayaran Praktikum<span className="text-red-600 font-semibold">*</span></h5>
                            <FileInputWithPreview
                                id="pembayaran"
                                allowedTypes={ [ "application/pdf" ] }
                                placeholder="Tarik dan Lepaskan file disini atau klik untuk memilih file (PDF). Ukuran maksimum 4MB"
                                errorMessage="Hanya file PDF yang diperbolehkan"
                                maxSize={4096}
                                maxSizeMessage="Ukuran maksimum file bukti Pembayaran adalah 4MB"
                                value={ createForm.pembayaran }
                                onChange={ (file) => handleChangeCreateForm('pembayaran', file) }
                            />
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-3 items-start md:items-start justify-center *:w-full *:md:min-w-72 *:lg:max-w-md *:grow *:md:grow-0 *:min-h-80 *:py-5 *:px-4 *:flex *:flex-col *:gap-1 *:border *:border-muted-foreground/30 *:rounded-md">
                        <div>
                            <h5 className="font-medium">Bukti Transfer Modul (tidak wajib)</h5>
                            <FileInputWithPreview
                                id="modul"
                                allowedTypes={ [ "image/png","image/jpeg","image/jpg" ] }
                                placeholder="Tarik dan Lepaskan file disini atau klik untuk memilih file (JPG/JPEG/PNG). Ukuran maksimum 5MB"
                                errorMessage="Hanya file gambar png,jpeg,jpg yang diperbolehkan"
                                maxSize={5120}
                                maxSizeMessage="Ukuran maksimum file pembayaran Modul adalah 5MB"
                                value={ createForm.modul }
                                onChange={ (file) => handleChangeCreateForm('modul', file) }
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={ createForm.onSubmit || !createForm.praktikum_id || !createForm.sesi_praktikum_id || !createForm.krs || !createForm.pembayaran || createForm.onSuccess } className="w-44 ml-auto">
                        { createForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) :
                            createForm.onSuccess
                                ? (
                                    <>Berhasil <Check /> </>
                                ) : (
                                    <span>Simpan</span>
                                )
                        }
                    </Button>
                </form>
            </PraktikanLayout>
        </>
    );
}
