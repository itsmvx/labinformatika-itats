import { Label } from "@/components/ui/label";
import { YearPicker } from "@/components/year-picker";
import { FormEvent, useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn, romanToNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSwitch } from "@/components/icon-switch";
import { PageProps } from "@/types";
import ErrorPage from "@/Pages/ErrorPage";

export default function AdminPraktikumCreatePage({ auth, currentDate, laboratoriums, jenisPraktikums, periodePraktikums }: PageProps<{
    currentDate: string;
    laboratoriums: {
        id: string;
        nama: string;
    }[];
    jenisPraktikums: {
        id: string;
        nama: string;
        laboratorium_id: string;
        laboratorium: {
            id: string;
            nama: string;
        };
    }[];
    periodePraktikums: {
        id: string;
        nama: string;
        laboratorium_id: string;
        laboratorium: {
            id: string;
            nama: string;
        };
    }[];
}>) {
    const authUser = auth.user;
    if (!authUser || auth.role !== "admin") {
        return (
            <ErrorPage status={401} />
        );
    }

    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        jenis_praktikum_id: string;
        periode_praktikum_id: string;
        laboratorium_id: string;
        status: boolean;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        jenis_praktikum_id: '',
        periode_praktikum_id: '',
        laboratorium_id: authUser.laboratorium_id === null ? '' : authUser.laboratorium_id,
        status: false,
        onSubmit: false
    };

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const [ selectedYear, setSelectedYear ] = useState<number>(new Date(currentDate).getFullYear());

    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, status, jenis_praktikum_id, periode_praktikum_id } = createForm;
        const tahun = selectedYear;
        const createSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Praktikum wajib diisi!' }),
            jenis_praktikum_id: z.string({ message: 'Format Jenis Praktikum tidak valid! '}).min(1, { message: 'Jenis Praktikum wajib dipilih!' }),
            periode_praktikum_id: z.string({ message: 'Format Periode Praktikum tidak valid! '}).min(1, { message: 'Periode Praktikum wajib dipilih!' }),
            tahun: z.number({ message: 'Tahun Praktikum wajib diisi!' }).min(1, { message: 'Tahun Praktikum wajib diisi!' })
        });
        const createParse = createSchema.safeParse({
            nama: nama,
            jenis_praktikum_id: jenis_praktikum_id,
            periode_praktikum_id: periode_praktikum_id,
            tahun: tahun
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
        }>(route('praktikum.create'), {
            nama: nama,
            jenis_praktikum_id: jenis_praktikum_id,
            periode_praktikum_id: periode_praktikum_id,
            status: status,
            tahun: tahun,
        })
            .then((res) => {
                setCreateForm(createFormInit);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('admin.praktikum.index'));
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

    useEffect(() => {
        if (createForm.jenis_praktikum_id && createForm.periode_praktikum_id) {
            const jenisPraktikum = jenisPraktikums.find((jenis) => jenis.id === createForm.jenis_praktikum_id);
            const periodePraktikum = periodePraktikums.find((periode) => periode.id === createForm.periode_praktikum_id);
            if (jenisPraktikum && periodePraktikum) {
                setCreateForm((prevState) => ({
                    ...prevState,
                    nama: `${jenisPraktikum.nama} ${periodePraktikum.nama}`
                }));
            }
        }
    }, [ createForm.jenis_praktikum_id, createForm.periode_praktikum_id ]);

    const SelectJenisPraktikum = () => {
        const jenisPraktikumFiltered = jenisPraktikums.filter((filt) => filt.laboratorium_id === createForm.laboratorium_id );

        return (
            <>
                <Label className="flex-1 min-w-72 grid gap-2">
                    Jenis Praktikum
                    <Select disabled={ !createForm.laboratorium_id } value={ createForm.jenis_praktikum_id } onValueChange={ (value) => setCreateForm((prevState) => ({ ...prevState, jenis_praktikum_id: value, periode_praktikum_id: value ? '' : prevState.periode_praktikum_id })) }>
                        <SelectTrigger>
                            <SelectValue placeholder={ createForm.laboratorium_id ? "Pilih Jenis Praktikum" : "Pilih Laboratorium terlebih dahulu..." } />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                jenisPraktikumFiltered.length > 0
                                    ? jenisPraktikumFiltered.map((jenis, index) => ((
                                        <SelectItem key={ index } value={ jenis.id }>
                                            { jenis.nama }
                                        </SelectItem>
                                    ))) : (
                                        <SelectItem value="null" disabled>
                                            Tidak ada Jenis Praktikum terdaftar dari Laboratorium terpilih
                                        </SelectItem>
                                    )
                            }
                        </SelectContent>
                    </Select>
                </Label>
            </>
        );
    };
    const SelectPeriodePraktikum = () => {
        const periodePraktikumFiltered = periodePraktikums.filter((filt) => filt.laboratorium_id === createForm.laboratorium_id );
        return (
            <Label className="flex-1 min-w-72 grid gap-2">
                Periode Praktikum
                <Select disabled={ !createForm.jenis_praktikum_id } value={ createForm.periode_praktikum_id } onValueChange={ (value) => setCreateForm((prevState) => ({ ...prevState, periode_praktikum_id: value })) }>
                    <SelectTrigger>
                        <SelectValue placeholder={ createForm.laboratorium_id ? "Pilih Periode Praktikum" : "Pilih Jenis Praktikum terlebih dahulu..." } />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            periodePraktikumFiltered.length > 0
                                ? periodePraktikums.filter((filt) => filt.laboratorium_id === createForm.laboratorium_id ).sort((a, b) => romanToNumber(a.nama) - romanToNumber(b.nama)).map((periode, index) => ((
                                    <SelectItem key={ index } value={ periode.id }>
                                        { periode.nama }
                                    </SelectItem>
                                ))) : (
                                    <SelectItem value="null" disabled>
                                        Tidak ada Periode Praktikum terdaftar dari Laboratorium terpilih
                                    </SelectItem>
                                )
                        }
                    </SelectContent>
                </Select>
            </Label>
        )
    };

    console.log(createForm)
    return (
        <>
            <AdminLayout auth={auth}>
                <Head title="Admin - Menambahkan Praktikum" />
                <CardTitle>
                    Menambahkan Praktikum
                </CardTitle>
                <CardDescription>
                    Menambahkan data Praktikum baru
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    {authUser.laboratorium_id === null && (
                        <Label className="flex-1 grid gap-2">
                            Laboratorium
                            <Select value={ createForm.laboratorium_id } onValueChange={ (value) => setCreateForm((prevState) => ({ ...prevState, laboratorium_id: value, jenis_praktikum_id: value ? '' : prevState.jenis_praktikum_id, periode_praktikum_id: value ? '' : prevState.periode_praktikum_id })) }>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Laboratorium"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        laboratoriums.map((lab, index) => ((
                                            <SelectItem key={ index } value={ lab.id }>
                                                { lab.nama }
                                            </SelectItem>
                                        )))
                                    }
                                </SelectContent>
                            </Select>
                        </Label>
                    )}
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap md:items-center">
                        <SelectJenisPraktikum />
                        <SelectPeriodePraktikum />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nama">Nama Praktikum</Label>
                        <Input
                            type="text"
                            name="nama"
                            id="nama"
                            value={ createForm.nama }
                            onChange={ (event) =>
                                setCreateForm((prevState) => ({
                                    ...prevState,
                                    nama: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className=" flex flex-col md:flex-row flex-wrap gap-3 md:gap-2 md:items-center">
                        <Label className="grid gap-2 [&_button]:w-full min-w-72 flex-1 basis-1/2">
                            Tahun Pelaksanaan Praktikum
                            <YearPicker value={ selectedYear } onValueChange={ setSelectedYear } />
                        </Label>
                        <div className="min-w-80 flex-1 grid gap-2">
                            <Label htmlFor="status-switch">
                                Status Praktikum
                            </Label>
                            <div className="basis-1/2 flex flex-row gap-1.5 items-center">
                                <IconSwitch
                                    id="status-switch"
                                    checkedIcon={ <Check className="w-4 h-4 text-green-500" /> }
                                    uncheckedIcon={ <X className="w-4 h-4 text-red-600" /> }
                                    checked={ createForm.status }
                                    onCheckedChange={ (event) => setCreateForm((prevState) => ({ ...prevState, status: event })) }
                                    aria-label="Status Praktikum"
                                    className="max-w-sm data-[state=checked]:bg-green-500"
                                />
                                <p className="basis-3/4 text-sm md:text-base">
                                    Status Praktikum : <strong>{ createForm.status ? 'Aktif' : 'Nonaktif' }</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button type="submit"
                            disabled={ createForm.onSubmit || !createForm.nama || !createForm.jenis_praktikum_id || !createForm.periode_praktikum_id }>
                        { createForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <span>Simpan</span>
                            )
                        }
                    </Button>
                </form>
            </AdminLayout>
        </>
    );
}
