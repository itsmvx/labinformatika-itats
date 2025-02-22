import { Label } from "@/components/ui/label";
import { YearPicker } from "@/components/year-picker";
import { FormEvent, useRef, useState } from "react";
import { AslabLayout } from "@/layouts/AslabLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, romanToNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    BookMarked,
    Check, Clock,
    Copy,
    Hash,
    Loader2,
    MoveRight,
    Pencil,
    Plus,
    Trash2, UsersRound,
    X
} from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSwitch } from "@/components/icon-switch";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { _NamaHari } from "@/lib/StaticDataLib";
import { TimePickerInput } from "@/components/time-picker-input";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parse } from "date-fns";
import { PageProps } from "@/types";

type IDNama = {
    id: string;
    nama: string;
};
type Sesi = {
    id: string;
    nama: string;
    kuota: number | null;
    isUnlimited: boolean;
    hari: string;
    waktu_mulai: string;
    waktu_selesai: string;
    praktikum_id: string;
};
type Modul = {
    id: string;
    nama: string;
    topik: string;
};
type Praktikum = {
    id: string;
    nama: string;
    tahun: string;
    status: boolean;
    jenis: IDNama;
    periode: IDNama;
    pertemuan: {
        id: string;
        nama: string;
        modul: Modul[];
    }[];
    sesi: Sesi[];
};
export default function AslabPraktikumDetailsPage({ auth, praktikum, jenisPraktikums, periodePraktikums, currentDate }: PageProps<{
    praktikum: Praktikum;
    jenisPraktikums: IDNama[];
    periodePraktikums: IDNama[];
    currentDate: string;
}>) {
    const { toast } = useToast();
    type UpdateForm = {
        nama: string;
        jenis_praktikum_id: string;
        periode_praktikum_id: string;
        status: boolean;
        tahun: number;
        onSubmit: boolean;
    };

    const [ clipboard, setClipboard ] = useState<string>('');
    const handleSetClipboard = (value: string) => {
        setClipboard(value);
        navigator.clipboard.writeText(value);
    };

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>({
        nama: praktikum.nama,
        jenis_praktikum_id: praktikum.jenis.id,
        periode_praktikum_id: praktikum.periode.id,
        status: Boolean(praktikum.status),
        tahun: Number(praktikum.tahun),
        onSubmit: false
    });
    const [ isOnChange, setIsOnChange ] = useState(false);
    const [ selectedYear, setSelectedYear ] = useState<number>(Number(praktikum.tahun));

    const handleUpdateForm = (key: keyof UpdateForm, value: string | boolean | number) => {
        const payload = {
            [key]: value,
        };

        setUpdateForm((prevState) => {
            const newState = { ...prevState, ...payload };
            const latestState = {
                nama: praktikum.nama,
                jenis_praktikum_id: praktikum.jenis.id,
                periode_praktikum_id: praktikum.periode.id,
                status: Boolean(praktikum.status),
                tahun: Number(praktikum.tahun),
                onSubmit: false
            }
            if (JSON.stringify(newState) !== JSON.stringify(latestState)) {
                setIsOnChange(true);
            } else {
                setIsOnChange(false);
            }

            return newState;
        });
    };

    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, status, jenis_praktikum_id, periode_praktikum_id } = updateForm;
        const tahun = selectedYear;
        const updateSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Praktikum wajib diisi!' }),
            jenis_praktikum_id: z.string({ message: 'Format Modul tidak valid! '}).min(1, { message: 'Modul wajib dipilih!' }),
            periode_praktikum_id: z.string({ message: 'Format Periode Praktikum tidak valid! '}).min(1, { message: 'Periode Praktikum wajib dipilih!' }),
            tahun: z.number({ message: 'Tahun Praktikum wajib diisi!' }).min(1, { message: 'Tahun Praktikum wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            nama: nama,
            jenis_praktikum_id: jenis_praktikum_id,
            periode_praktikum_id: periode_praktikum_id,
            tahun: tahun
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
        }>(route('praktikum.update'), {
            id: praktikum.id,
            nama: nama,
            jenis_praktikum_id: jenis_praktikum_id,
            periode_praktikum_id: periode_praktikum_id,
            status: status,
            tahun: tahun,
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikum'] });
                setUpdateForm((prevState) => ({
                    ...prevState,
                    onSubmit: false
                }))
                setIsOnChange(false);
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

    type CreateSesi = {
        nama: string;
        kuota: string;
        isUnlimited: boolean;
        hari: string;
        waktu_mulai: Date | null;
        waktu_selesai: Date | null;
        onSubmit: boolean;
    };
    type UpdateSesi = {
        id: string;
        nama: string;
        kuota: string;
        isUnlimited: boolean;
        hari: string;
        waktu_mulai: Date | null;
        waktu_selesai: Date | null;
        onSubmit: boolean;
    };
    type DeleteSesi = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const mapToUpdateSesi = (data: Sesi): UpdateSesi => {
        return {
            id: data.id,
            nama: data.nama,
            kuota: data.kuota === null ? '' : data.kuota.toString(),
            isUnlimited: data.kuota === null,
            hari: data.hari,
            waktu_mulai: data.waktu_mulai
                ? parse(data.waktu_mulai, 'HH:mm:ss', new Date())
                : null,
            waktu_selesai: data.waktu_selesai
                ? parse(data.waktu_selesai, 'HH:mm:ss', new Date())
                : null,
            onSubmit: false,
        };
    };
    const createSesiInit: CreateSesi = {
        nama: 'Sesi ',
        kuota: '',
        isUnlimited: false,
        hari: '',
        waktu_mulai: null,
        waktu_selesai: null,
        onSubmit: false,
    };
    const updateSesiInit: UpdateSesi = {
        id: '',
        nama: '',
        kuota: '',
        isUnlimited: false,
        hari: '',
        waktu_mulai: null,
        waktu_selesai: null,
        onSubmit: false,
    };
    const deleteSesiInit: DeleteSesi = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false,
    };

    const [ openCreateSesi, setOpenCreateSesi ] = useState(false);
    const [ openUpdateSesi, setOpenUpdateSesi ] = useState(false);
    const [ openDeleteSesi, setOpenDeleteSesi ] = useState(false);

    const [ createSesi, setCreateSesi ] = useState<CreateSesi>(createSesiInit);
    const [ updateSesi, setUpdateSesi ] = useState<UpdateSesi>(updateSesiInit);
    const [ deleteSesi, setDeleteSesi ] = useState<DeleteSesi>(deleteSesiInit);

    const parseSesiTime = (time: string) => {
        return parse(time, 'HH:mm:ss', new Date(currentDate));
    };
    const handleSubmitCreateSesi = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateSesi((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, kuota, isUnlimited, hari, waktu_mulai, waktu_selesai } = createSesi;
        const sesiSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Sesi Praktikum wajib diisi!' }),
        });
        const sesiParse = sesiSchema.safeParse({
            nama: nama
        });
        if (!sesiParse.success) {
            const errMsg = sesiParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreateSesi((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('sesi-praktikum.create'), {
            nama: nama,
            kuota: !isUnlimited ? Number(kuota) : null,
            hari: hari,
            waktu_mulai: waktu_mulai,
            waktu_selesai: waktu_selesai,
            praktikum_id: praktikum.id
        })
            .then((res) => {
                setCreateSesi(createSesiInit);
                setOpenCreateSesi(false);
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
                setCreateSesi((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleOpenUpdateSesi = (sesi: Sesi) => {
        setUpdateSesi(mapToUpdateSesi(sesi));
        setOpenUpdateSesi(true);
    };
    const handleCancelUpdateSesi = () => {
        setUpdateSesi(updateSesiInit);
        setOpenUpdateSesi(false);
    }
    const handleSubmitUpdateSesi = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateSesi((prevState) => ({ ...prevState, onSubmit: true }));
        const { id, nama, kuota, isUnlimited, hari, waktu_mulai, waktu_selesai } = updateSesi;
        const sesiSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Sesi Praktikum wajib diisi!' }),
        });
        const sesiParse = sesiSchema.safeParse({
            nama: nama
        });
        if (!sesiParse.success) {
            const errMsg = sesiParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreateSesi((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('sesi-praktikum.update'), {
            id: id,
            nama: nama,
            kuota: !isUnlimited ? Number(kuota) : null,
            hari: hari,
            waktu_mulai: waktu_mulai,
            waktu_selesai: waktu_selesai,
            praktikum_id: praktikum.id
        })
            .then((res) => {
                setUpdateSesi(updateSesiInit);
                setOpenUpdateSesi(false);
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
                setUpdateSesi((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleOpenDeleteSesi = (sesi: IDNama) => {
        setDeleteSesi((prevState) => ({
            ...prevState,
            id: sesi.id,
            nama: sesi.nama,
        }));
        setOpenDeleteSesi(true);
    };
    const handleSubmitDeleteSesi = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteSesi((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteSesi;
        const deleteSchema = z.object({
            id: z.string({ message: 'Format Sesi Praktikum tidak valid! '}).min(1, { message: 'Format Sesi Praktikum tidak valid!' }),
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
            setDeleteSesi((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('sesi-praktikum.delete'), {
            id: id,
        })
            .then((res) => {
                setDeleteSesi(deleteSesiInit);
                setOpenDeleteSesi(false);
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
                setDeleteSesi((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    type CreatePertemuan = {
        nama: string;
        onSubmit: boolean;
    };
    type UpdatePertemuan = {
        id: string;
        nama: string;
        onSubmit: boolean;
    };
    type DeletePertemuan = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const createPertemuanInit: CreatePertemuan = {
        nama: '',
        onSubmit: false,
    };
    const updatePertemuanInit: UpdatePertemuan = {
        id: '',
        nama: '',
        onSubmit: false,
    };
    const deletePertemuanInit: DeletePertemuan = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false,
    };

    const [ openCreatePertemuan, setOpenCreatePertemuan ] = useState(false);
    const [ openDeletePertemuan, setOpenDeletePertemuan ] = useState(false);

    const [ createPertemuan, setCreatePertemuan ] = useState<CreatePertemuan>(createPertemuanInit);
    const [ updatePertemuan, setUpdatePertemuan ] = useState<UpdatePertemuan>(updatePertemuanInit);
    const [ deletePertemuan, setDeletePertemuan ] = useState<DeletePertemuan>(deletePertemuanInit);

    const handleSubmitCreatePertemuan = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreatePertemuan((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama } = createPertemuan;
        const pertemuanSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Pertemuan Praktikum wajib diisi!' }),
        });
        const pertemuanParse = pertemuanSchema.safeParse({
            nama: nama
        });
        if (!pertemuanParse.success) {
            const errMsg = pertemuanParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreatePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('pertemuan.create'), {
            nama: nama,
            praktikum_id: praktikum.id
        })
            .then((res) => {
                setCreatePertemuan(createPertemuanInit);
                setOpenCreatePertemuan(false);
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
                setCreatePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleOpenUpdatePertemuan = (pertemuan: IDNama) => {
        setUpdatePertemuan((prevState) => ({
            ...prevState,
            id: pertemuan.id,
            nama: pertemuan.nama,
        }));
    };
    const handleChangeUpdatePertemuan = (key: keyof UpdatePertemuan, value: string | boolean) => {
        setUpdatePertemuan((prevState) => ({ ...prevState, [key]: value }));
    };
    const handleSubmitUpdatePertemuan = () => {
        setUpdatePertemuan((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const { id, nama } = updatePertemuan;
        const updateSchema = z.object({
            id: z.string({ message: 'Format Modul tidak valid! '}).min(1, { message: 'Format Pertemuan Praktikum tidak valid!' }),
            nama: z.string({ message: 'Format nama Modul tidak valid! '}).min(1, { message: 'Nama Pertemuan Praktikum wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            id: id,
            nama: nama,
        });
        if (!updateParse.success) {
            const errMsg = updateParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setUpdatePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('pertemuan.update'), {
            id: id,
            nama: nama,
        })
            .then((res) => {
                setUpdatePertemuan(updatePertemuanInit);
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
                setUpdatePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleOpenDeletePertemuan = (pertemuan: IDNama) => {
        setDeletePertemuan((prevState) => ({
            ...prevState,
            id: pertemuan.id,
            nama: pertemuan.nama,
        }));
        setOpenDeletePertemuan(true);
    };
    const handleSubmitDeletePertemuan = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeletePertemuan((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deletePertemuan;
        const deleteSchema = z.object({
            id: z.string({ message: 'Format Pertemuan Praktikum tidak valid! '}).min(1, { message: 'Format Pertemuan Praktikum tidak valid!' }),
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
            setDeletePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('pertemuan.delete'), {
            id: id,
        })
            .then((res) => {
                setDeletePertemuan(deletePertemuanInit);
                setOpenDeletePertemuan(false);
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
                setDeletePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    type CreateModul = {
        nama: string;
        topik: string;
        pertemuan_id: string;
        onSubmit: boolean;
    };
    type UpdateModul = {
        id: string;
        nama: string;
        topik: string;
        onSubmit: boolean;
    };
    type DeleteModul = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const createModulInit: CreateModul = {
        nama: 'Modul ',
        topik: '',
        pertemuan_id: '',
        onSubmit: false,
    };
    const updateModulInit: UpdateModul = {
        id: '',
        nama: '',
        topik: '',
        onSubmit: false,
    };
    const deleteModulInit: DeleteModul = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false
    };

    const [ openCreateModul, setOpenCreateModul ] = useState(false);
    const [ openDeleteModul, setOpenDeleteModul ] = useState(false);
    const [ createModul, setCreateModul ] = useState<CreateModul>(createModulInit);
    const [ updateModul, setUpdateModul ] = useState<UpdateModul>(updateModulInit);
    const [ deleteModul, setDeleteModul ] = useState<DeleteModul>(deleteModulInit);
    const createSesiMulaiHoursRef = useRef<HTMLInputElement>(null);
    const createSesiMulaiMinuteRef = useRef<HTMLInputElement>(null);
    const createSesiSelesaiHoursRef = useRef<HTMLInputElement>(null);
    const createSesiSelesaiMinuteRef = useRef<HTMLInputElement>(null);
    const updateSesiMulaiHoursRef = useRef<HTMLInputElement>(null);
    const updateSesiMulaiMinuteRef = useRef<HTMLInputElement>(null);
    const updateSesiSelesaiHoursRef = useRef<HTMLInputElement>(null);
    const updateSesiSelesaiMinuteRef = useRef<HTMLInputElement>(null);

    const handleOpenCreateModul = (pertemuan_id: string) => {
        setOpenCreateModul(true);
        setCreateModul((prevState) => ({ ...prevState, pertemuan_id: pertemuan_id }));
    };
    const handleSubmitCreateModul = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateModul((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, topik, pertemuan_id } = createModul;
        const modulSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Modul Praktikum wajib diisi!' }),
            topik: z.string({ message: 'Format topik tidak valid! '}).min(1, { message: 'Topik Modul Praktikum wajib diisi!' }),
            pertemuan_id: z.string({ message: 'Format Pertemuan modul tidak valid! '}).min(1, { message: 'Pertemuan Modul Praktikum wajib disertakan!' }),
        });
        const modulParse = modulSchema.safeParse({
            nama: nama,
            topik: topik,
            pertemuan_id: pertemuan_id,
        });
        if (!modulParse.success) {
            const errMsg = modulParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreateModul((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('modul.create'), {
            nama: nama,
            topik: topik,
            pertemuan_id: pertemuan_id,
        })
            .then((res) => {
                setCreateModul(createModulInit);
                setOpenCreateModul(false);
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
                setCreateModul((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    const handleOpenUpdateModul = (modul: Modul) => {
        setUpdateModul((prevState) => ({
            ...prevState,
            id: modul.id,
            nama: modul.nama,
            topik: modul.topik
        }));
    };
    const handleChangeUpdateModul = (key: keyof UpdateModul, value: string | boolean) => {
        setUpdateModul((prevState) => ({ ...prevState, [key]: value }));
    };
    const handleSubmitUpdateModul = () => {
        setUpdateModul((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const { id, nama, topik } = updateModul;
        const updateSchema = z.object({
            id: z.string({ message: 'Format Modul tidak valid! '}).min(1, { message: 'Format Modul tidak valid!' }),
            nama: z.string({ message: 'Format nama Modul tidak valid! '}).min(1, { message: 'Nama Modul wajib diisi!' }),
            topik: z.string({ message: 'Format topik Modul tidak valid! '}).min(1, { message: 'Topik Modul wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            id: id,
            nama: nama,
            topik: topik
        });
        if (!updateParse.success) {
            const errMsg = updateParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setUpdateModul((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('modul.update'), {
            id: id,
            nama: nama,
            topik: topik
        })
            .then((res) => {
                setUpdateModul(updateModulInit);
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
                setUpdateModul((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleOpenDeleteModul = (modul: {
        id: string;
        nama: string;
    }) => {
        setDeleteModul((prevState) => ({
            ...prevState,
            id: modul.id,
            nama: modul.nama,
        }));
        setOpenDeleteModul(true);
    };
    const handleSubmitDeleteModul = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteModul((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteModul;
        const deleteSchema = z.object({
            id: z.string({ message: 'Format Modul tidak valid! '}).min(1, { message: 'Format Modul tidak valid!' }),
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
            setDeleteModul((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('modul.delete'), {
            id: id,
        })
            .then((res) => {
                setDeleteModul(deleteModulInit);
                setOpenDeleteModul(false);
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
                setDeleteModul((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    return (
        <>
            <AslabLayout auth={auth}>
                <Head title={ `Aslab - Detail Praktikum ${praktikum.nama}` } />
                <CardTitle>
                    Memperbarui data Praktikum
                </CardTitle>
                <CardDescription>
                    ...
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap md:items-center">
                        <Label className="flex-1 min-w-72 grid gap-2">
                            Jenis Praktikum
                            <Select value={ updateForm.jenis_praktikum_id } onValueChange={(value) => handleUpdateForm('jenis_praktikum_id', value)} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Modul"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        jenisPraktikums.map((jenis, index) => ((
                                            <SelectItem key={ index } value={ jenis.id }>
                                                { jenis.nama }
                                            </SelectItem>
                                        )))
                                    }
                                </SelectContent>
                            </Select>
                        </Label>
                        <Label className="flex-1 min-w-72 grid gap-2">
                            Periode Praktikum
                            <Select value={ updateForm.periode_praktikum_id } onValueChange={(value) => handleUpdateForm('periode_praktikum_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Periode Praktikum"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        periodePraktikums.sort((a, b) => romanToNumber(a.nama) - romanToNumber(b.nama)).map((jenis, index) => ((
                                            <SelectItem key={ index } value={ jenis.id }>
                                                { jenis.nama }
                                            </SelectItem>
                                        )))
                                    }
                                </SelectContent>
                            </Select>
                        </Label>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nama">Nama Praktikum</Label>
                        <Input
                            type="text"
                            name="nama"
                            id="nama"
                            value={ updateForm.nama }
                            onChange={(event) => handleUpdateForm('nama', event.target.value)}
                        />
                    </div>
                    <div className=" flex flex-col md:flex-row flex-wrap gap-3 md:gap-2 md:items-center">
                        <Label className="grid gap-2 [&_button]:w-full min-w-72 flex-1 basis-1/2">
                            Tahun Periode Praktikum
                            <YearPicker
                                value={ selectedYear }
                                onValueChange={(year) => {
                                    setSelectedYear(year);
                                    handleUpdateForm('tahun', year);
                                }}
                            />
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
                                    checked={ updateForm.status }
                                    onCheckedChange={(checked) => handleUpdateForm('status', checked)}
                                    aria-label="Status Praktikum"
                                    className="max-w-sm data-[state=checked]:bg-green-500"
                                />
                                <p className="basis-3/4 text-sm md:text-base">
                                    Status Praktikum : <strong>{ updateForm.status ? 'Aktif' : 'Nonaktif' }</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.jenis_praktikum_id || !updateForm.periode_praktikum_id || !isOnChange }>
                        { updateForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <span>Simpan</span>
                            )
                        }
                    </Button>
                </form>

                <Separator className="!my-8" />

                <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold mb-4">
                            Sesi Praktikum
                        </h3>
                        {praktikum.sesi.length > 0 && (
                            <Button size="sm" className="-mt-3" onClick={() => setOpenCreateSesi(true)}>
                                <span className="hidden lg:block">Sesi</span>
                                <Plus/>
                            </Button>
                        )}
                    </div>
                    <div className="space-y-4">
                        { praktikum.sesi.length > 0 ? praktikum.sesi.map((sesi) => (
                            <Card key={ sesi.id } className="rounded-sm shadow-none border-muted-foreground/40 !py-1">
                                <div className="flex flex-row gap-2 justify-between">
                                    <div className="flex flex-col px-6 py-3.5">
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{ sesi.nama }</span>
                                        </CardTitle>
                                        <div className="text-muted-foreground text-sm font-medium space-y-1.5 !mt-2.5 *:flex *:gap-2">
                                            <div>
                                                <UsersRound size={20} />
                                                <p>{ sesi.kuota ? `Kuota ${sesi.kuota} orang` : 'Kuota Tidak terbatas' }</p>
                                            </div>
                                            <div>
                                                <Clock size={20} />
                                                <p>{ sesi.hari }, { format(parseSesiTime(sesi.waktu_mulai), 'HH:mm') } - { format(parseSesiTime(sesi.waktu_selesai), 'HH:mm') }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-x-1 content-center">
                                        <Button size="icon" variant="ghost" className="group hover:bg-red-500/85" onClick={() => handleOpenDeleteSesi({ id: sesi.id, nama: sesi.nama })}>
                                            <Trash2 className="text-red-600 group-hover:text-white transition-colors" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="group hover:bg-blue-500/85" onClick={() => handleOpenUpdateSesi(sesi)} disabled={!!updateSesi.id}>
                                            <Pencil className="text-blue-600 group-hover:text-white transition-colors" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )) : (
                            <Card className="h-32 rounded-sm shadow-none border-muted-foreground/40 flex flex-col items-center justify-center gap-3">
                                <p className="text-sm">Belum ada data sesi praktikum</p>
                                <Button size="sm" className="mt-4" onClick={ () => setOpenCreateSesi(true) }>
                                    Tambahkan <Plus/>
                                </Button>
                            </Card>
                        ) }
                    </div>
                </CardContent>

                <Separator className="!my-8" />

                <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold mb-4">
                            Pertemuan Praktikum
                        </h3>
                        {praktikum.pertemuan.length > 0 && (
                            <Button size="sm" className="-mt-3" onClick={() => setOpenCreatePertemuan(true)}>
                                <span className="hidden lg:block">Pertemuan</span>
                                <Plus/>
                            </Button>
                        )}
                    </div>
                    <div className="space-y-4">
                        { praktikum.pertemuan.length > 0 ? praktikum.pertemuan.map((pertemuan) => (
                            <Card key={ pertemuan.id } className="rounded-sm shadow-none border-muted-foreground/40">
                                <div className="flex flex-row gap-2 justify-between">
                                    <CardHeader>
                                        { updatePertemuan.id === pertemuan.id ? (
                                            <Input value={ updatePertemuan.nama } onChange={(event) => handleChangeUpdatePertemuan('nama', event.target.value)} className="font-semibold" autoFocus={true} />
                                        ) : (
                                            <CardTitle className="flex items-center justify-between">
                                                <span>{ pertemuan.nama }</span>
                                            </CardTitle>
                                        )}
                                        <CardDescription className="flex items-center gap-0">
                                            <Hash width={ 15 }/>
                                            <div className="flex items-center gap-1">
                                                <p className="text-xs line-clamp-1 text-ellipsis">{ pertemuan.id }</p>
                                                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={ () => handleSetClipboard(pertemuan.id) }>
                                                    { clipboard === pertemuan.id
                                                        ? (
                                                            <Check width={ 15 }/>
                                                        ) : (
                                                            <Copy width={ 15 }/>
                                                        )
                                                    }
                                                </Button>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="p-6 space-x-1">
                                        {updatePertemuan.id === pertemuan.id ? (
                                            <>
                                                <Button className="bg-green-600 hover:bg-green-600/80" disabled={updatePertemuan.id === pertemuan.id && updatePertemuan.nama === pertemuan.nama } onClick={handleSubmitUpdatePertemuan}>
                                                    { updatePertemuan.onSubmit ? (
                                                        <Loader2 className="animate-spin" />
                                                    ) : (
                                                        <Check className="text-white" />
                                                    )}
                                                </Button>
                                                <Button variant="ghost" className="hover:bg-red-300/70" onClick={() => setUpdatePertemuan(updatePertemuanInit)}>
                                                    <X className="text-red-600" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="icon" variant="ghost" className="group hover:bg-red-500/85" onClick={() => handleOpenDeletePertemuan({ id: pertemuan.id, nama: pertemuan.nama })}>
                                                    <Trash2 className="text-red-600 group-hover:text-white transition-colors" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="group hover:bg-blue-500/85" onClick={() => handleOpenUpdatePertemuan({ id: pertemuan.id, nama: pertemuan.nama })} disabled={!!updatePertemuan.id}>
                                                    <Pencil className="text-blue-600 group-hover:text-white transition-colors" />
                                                </Button>
                                            </>
                                        )}

                                    </div>
                                </div>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold mb-1">
                                            Modul
                                        </h3>
                                        <Button size="sm" className="-mt-3" onClick={ () => handleOpenCreateModul(pertemuan.id) }>
                                            <span className="hidden lg:block">Modul</span>
                                            <Plus/>
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        { pertemuan.modul.length > 0 ? pertemuan.modul.map((modul) => (
                                            <Card key={ modul.id } className="rounded-sm shadow-none border-muted-foreground/40">
                                                <CardContent className="p-2.5 flex justify-between items-center gap-3">
                                                    <div className="flex-1 flex items-center gap-3">
                                                        <BookMarked width={ 22 }/>
                                                        <div className={ `${ updateModul.id === modul.id ? 'space-y-2' : 'space-y-0.5' } w-full` }>
                                                            { updateModul.id === modul.id ? (
                                                                <>
                                                                    <Input value={ updateModul.nama } onChange={(event) => handleChangeUpdateModul('nama', event.target.value)} className="font-semibold" autoFocus={true} />
                                                                    <Input value={ updateModul.topik } onChange={(event) => handleChangeUpdateModul('topik', event.target.value)} />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CardTitle className="text-sm font-semibold">{ modul.nama }</CardTitle>
                                                                    <CardDescription className="text-sm">{ modul.topik }</CardDescription>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className={ `flex ${ updateModul.id === modul.id ? 'flex-col' : 'flex-row' } gap-1` }>
                                                        { updateModul.id === modul.id ? (
                                                            <>
                                                                <Button className="bg-green-600 hover:bg-green-600/80" disabled={updateModul.id === modul.id && updateModul.nama === modul.nama && updateModul.topik === modul.topik } onClick={handleSubmitUpdateModul}>
                                                                    { updateModul.onSubmit ? (
                                                                        <Loader2 className="animate-spin" />
                                                                    ) : (
                                                                        <Check className="text-white" />
                                                                    )}
                                                                </Button>
                                                                <Button variant="ghost" className="hover:bg-red-300/70" onClick={() => setUpdateModul(updateModulInit)}>
                                                                    <X className="text-red-600" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button size="icon" className="bg-red-600 hover:bg-red-600/85" onClick={() => handleOpenDeleteModul({ id: modul.id, nama: `${modul.nama} - ${pertemuan.nama}` })}>
                                                                    <Trash2 />
                                                                </Button>
                                                                <Button size="icon" className="bg-blue-600 hover:bg-blue-600/85" onClick={() => handleOpenUpdateModul(modul)} disabled={!!updateModul.id}>
                                                                    <Pencil />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )) : (
                                            <Card className="rounded-sm shadow-none border-muted-foreground/40">
                                                <CardContent className="p-2.5 flex justify-between items-center gap-1">
                                                    <p className="text-xs italic text-gray-500/90 font-medium">Belum ada data modul untuk pertemuan ini</p>
                                                </CardContent>
                                            </Card>
                                        ) }
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <Card className="h-32 rounded-sm shadow-none border-muted-foreground/40 flex flex-col items-center justify-center gap-3">
                                <p className="text-sm">Belum ada data pertemuan praktikum</p>
                                <Button size="sm" className="mt-4" onClick={ () => setOpenCreatePertemuan(true) }>
                                    Tambahkan <Plus/>
                                </Button>
                            </Card>
                        ) }
                    </div>
                </CardContent>

                {/*START OF SESI MODALS*/}
                <AlertDialog open={ openCreateSesi } onOpenChange={ setOpenCreateSesi }>
                    <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Tambah Sesi Praktikum
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Sesi praktikum seperti "Sesi 1"
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitCreateSesi }>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Sesi Praktikum</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ createSesi.nama }
                                    onChange={ (event) => setCreateSesi((prevState) => ({
                                        ...prevState,
                                        nama: event.target.value
                                    })) }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="grid gap-2">
                                    <Label htmlFor="kuota">Kuota</Label>
                                    <Input
                                        type="number"
                                        name="kuota"
                                        id="kuota"
                                        value={ createSesi.kuota }
                                        onChange={ (event) => setCreateSesi((prevState) => ({ ...prevState, kuota: event.target.value })) }
                                        disabled={createSesi.isUnlimited}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="items-center flex gap-1.5">
                                    <Checkbox id="unlimited-kuota" onCheckedChange={(checked) => setCreateSesi((prevState) => ({ ...prevState, isUnlimited: !!checked, kuota: !!(checked) ? '' : prevState.kuota })) } />
                                    <Label htmlFor="unlimited-kuota" className="text-sm opacity-80">Kuota tidak terbatas</Label>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Hari Sesi Praktikum</Label>
                                <Select value={ createSesi.hari } onValueChange={ (val) => setCreateSesi((prevState) => ({ ...prevState, hari: val })) }>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Hari"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        { _NamaHari.map((hari, index) => ((
                                            <SelectItem key={ index } value={ hari }>{ hari }</SelectItem>
                                        ))) }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Waktu Sesi Praktikum <span className="text-xs font-medium text-red-500">*Ketik Jam & menit</span></Label>
                                <div className="flex items-end gap-2">
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="hours" className="text-xs">
                                            Jam
                                        </Label>
                                        <TimePickerInput
                                            picker="hours"
                                            date={ createSesi.waktu_mulai ?? undefined }
                                            setDate={ (date) => setCreateSesi((prevState) => ({
                                                ...prevState,
                                                waktu_mulai: date ?? null
                                            })) }
                                            ref={ createSesiMulaiHoursRef }
                                            onRightFocus={ () => createSesiMulaiMinuteRef.current?.focus() }
                                        />
                                    </div>
                                    <p className="mb-1 font-bold">
                                        :
                                    </p>
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="minutes" className="text-xs">
                                            Menit
                                        </Label>
                                        <TimePickerInput
                                            picker="minutes"
                                            date={ createSesi.waktu_mulai ?? undefined }
                                            setDate={ (date) => setCreateSesi((prevState) => ({
                                                ...prevState,
                                                waktu_mulai: date ?? null
                                            })) }
                                            ref={ createSesiMulaiMinuteRef }
                                        />
                                    </div>
                                    <div className="flex h-10 items-center">
                                        <MoveRight size={ 30 } className="mx-2"/>
                                    </div>
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="hours" className="text-xs">
                                            Jam
                                        </Label>
                                        <TimePickerInput
                                            picker="hours"
                                            date={ createSesi.waktu_selesai ?? undefined }
                                            setDate={ (date) => setCreateSesi((prevState) => ({
                                                ...prevState,
                                                waktu_selesai: date ?? null
                                            })) }
                                            ref={ createSesiSelesaiHoursRef }
                                            onRightFocus={ () => createSesiSelesaiMinuteRef.current?.focus() }
                                        />
                                    </div>
                                    <p className="mb-1 font-bold">
                                        :
                                    </p>
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="minutes" className="text-xs">
                                            Menit
                                        </Label>
                                        <TimePickerInput
                                            picker="minutes"
                                            date={ createSesi.waktu_selesai ?? undefined }
                                            setDate={ (date) => setCreateSesi((prevState) => ({
                                                ...prevState,
                                                waktu_selesai: date ?? null
                                            })) }
                                            ref={ createSesiSelesaiMinuteRef }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" disabled={ createSesi.onSubmit }>
                                { createSesi.onSubmit
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
                <AlertDialog open={ openUpdateSesi } onOpenChange={ setOpenUpdateSesi }>
                    <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Update Sesi Praktikum
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Anda akan mengubah data dari { updateSesi.nama }
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitUpdateSesi }>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Sesi Praktikum</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ updateSesi.nama }
                                    onChange={ (event) => setUpdateSesi((prevState) => ({ ...prevState, nama: event.target.value })) }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="grid gap-2">
                                    <Label htmlFor="kuota">Kuota</Label>
                                    <Input
                                        type="number"
                                        name="kuota"
                                        id="kuota"
                                        value={ updateSesi.kuota }
                                        onChange={ (event) => setUpdateSesi((prevState) => ({ ...prevState, kuota: event.target.value })) }
                                        disabled={ updateSesi.isUnlimited }
                                        placeholder="0"
                                    />
                                </div>
                                <div className="items-center flex gap-1.5">
                                    <Checkbox id="unlimited-kuota-update" checked={ updateSesi.isUnlimited } onCheckedChange={(checked) => setUpdateSesi((prevState) => ({ ...prevState, isUnlimited: !!checked, kuota: !!(checked) ? '' : prevState.kuota })) } />
                                    <Label htmlFor="unlimited-kuota-update" className="text-sm opacity-80">Kuota tidak terbatas</Label>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Hari Sesi Praktikum</Label>
                                <Select value={ updateSesi.hari } onValueChange={ (val) => setUpdateSesi((prevState) => ({ ...prevState, hari: val })) }>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Hari"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        { _NamaHari.map((hari, index) => ((
                                            <SelectItem key={ index } value={ hari }>{ hari }</SelectItem>
                                        ))) }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Waktu Sesi Praktikum <span className="text-xs font-medium text-red-500">*Ketik Jam & menit</span></Label>
                                <div className="flex items-end gap-2">
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="hours" className="text-xs">
                                            Jam
                                        </Label>
                                        <TimePickerInput
                                            picker="hours"
                                            date={ updateSesi.waktu_mulai ?? undefined }
                                            setDate={ (date) => setUpdateSesi((prevState) => ({ ...prevState, waktu_mulai: date ?? null })) }
                                            ref={ updateSesiMulaiHoursRef }
                                            onRightFocus={ () => updateSesiMulaiMinuteRef.current?.focus() }
                                        />
                                    </div>
                                    <p className="mb-1 font-bold">
                                        :
                                    </p>
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="minutes" className="text-xs">
                                            Menit
                                        </Label>
                                        <TimePickerInput
                                            picker="minutes"
                                            date={ updateSesi.waktu_mulai ?? undefined }
                                            setDate={ (date) => setUpdateSesi((prevState) => ({ ...prevState, waktu_mulai: date ?? null })) }
                                            ref={ updateSesiMulaiMinuteRef }
                                        />
                                    </div>
                                    <div className="flex h-10 items-center">
                                        <MoveRight size={ 30 } className="mx-2"/>
                                    </div>
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="hours" className="text-xs">
                                            Jam
                                        </Label>
                                        <TimePickerInput
                                            picker="hours"
                                            date={ updateSesi.waktu_selesai ?? undefined }
                                            setDate={ (date) => setUpdateSesi((prevState) => ({ ...prevState, waktu_selesai: date ?? null })) }
                                            ref={ updateSesiSelesaiHoursRef }
                                            onRightFocus={ () => updateSesiSelesaiMinuteRef.current?.focus() }
                                        />
                                    </div>
                                    <p className="mb-1 font-bold">
                                        :
                                    </p>
                                    <div className="grid gap-1 text-center">
                                        <Label htmlFor="minutes" className="text-xs">
                                            Menit
                                        </Label>
                                        <TimePickerInput
                                            picker="minutes"
                                            date={ updateSesi.waktu_selesai ?? undefined }
                                            setDate={ (date) => setUpdateSesi((prevState) => ({ ...prevState, waktu_selesai: date ?? null })) }
                                            ref={ updateSesiSelesaiMinuteRef }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" disabled={ updateSesi.onSubmit }>
                                { updateSesi.onSubmit
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
                <AlertDialog open={ openDeleteSesi } onOpenChange={ setOpenDeleteSesi }>
                    <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded"
                                        onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Hapus Sesi
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex flex-col gap-0.5">
                                <span className="text-red-600 font-bold">
                                    Anda akan menghapus Sesi!
                                </span>
                                <span className="*:text-red-600">
                                    Semua data Modul,Kuis,Nilai Praktikan yang terkaitdengan <strong>"{ deleteSesi.nama }"</strong> akan juga dihapus
                                </span>
                                <br/>
                                <span className="text-red-600">
                                    Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitDeleteSesi }>
                            <div className="grid gap-2">
                                <Label htmlFor="validation">Validasi aksi anda</Label>
                                <Input
                                    type="text"
                                    name="validation"
                                    id="validation"
                                    value={ deleteSesi.validation }
                                    placeholder="JARKOM JAYA"
                                    onChange={ (event) =>
                                        setDeleteSesi((prevState) => ({
                                            ...prevState,
                                            validation: event.target.value,
                                        }))
                                    }
                                    autoComplete="off"
                                />
                                <p>Ketik <strong>JARKOM JAYA</strong> untuk melanjutkan</p>
                            </div>
                            <Button type="submit" disabled={ deleteSesi.onSubmit || deleteSesi.validation !== 'JARKOM JAYA'}>
                                { deleteSesi.onSubmit
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
                                    setDeleteSesi(deleteSesiInit);
                                    setOpenDeleteSesi(false);
                                }}
                            >
                                Batal
                            </Button>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
                {/*END OF SESI MODALS*/}

                {/*START OF PERTEMUAN MODALS*/}
                <AlertDialog open={ openCreatePertemuan } onOpenChange={ setOpenCreatePertemuan }>
                    <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Tambah Pertemuan Praktikum
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Pertemuan praktikum seperti "Pertemuan 1"
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitCreatePertemuan }>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Pertemuan Praktikum</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ createPertemuan.nama }
                                    onChange={ (event) => setCreatePertemuan((prevState) => ({
                                        ...prevState,
                                        nama: event.target.value
                                    })) }
                                />
                            </div>
                            <Button type="submit" disabled={createPertemuan.onSubmit}>
                                { createPertemuan.onSubmit
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
                <AlertDialog open={ openDeletePertemuan } onOpenChange={ setOpenDeletePertemuan }>
                    <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Hapus Pertemuan
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex flex-col gap-0.5">
                                <span className="text-red-600 font-bold">
                                    Anda akan menghapus Pertemuan!
                                </span>
                                <span className="*:text-red-600">
                                    Semua data Modul,Kuis,Nilai Praktikan yang terkaitdengan <strong>"{ deletePertemuan.nama }"</strong> akan juga dihapus
                                </span>
                                <br/>
                                <span className="text-red-600">
                                    Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitDeletePertemuan }>
                            <div className="grid gap-2">
                                <Label htmlFor="validation">Validasi aksi anda</Label>
                                <Input
                                    type="text"
                                    name="validation"
                                    id="validation"
                                    value={ deletePertemuan.validation }
                                    placeholder="JARKOM JAYA"
                                    onChange={ (event) =>
                                        setDeletePertemuan((prevState) => ({
                                            ...prevState,
                                            validation: event.target.value,
                                        }))
                                    }
                                    autoComplete="off"
                                />
                                <p>Ketik <strong>JARKOM JAYA</strong> untuk melanjutkan</p>
                            </div>
                            <Button type="submit" disabled={ deletePertemuan.onSubmit || deletePertemuan.validation !== 'JARKOM JAYA'}>
                                { deletePertemuan.onSubmit
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
                                    setDeletePertemuan(deletePertemuanInit);
                                    setOpenDeletePertemuan(false);
                                }}
                            >
                                Batal
                            </Button>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
                {/*END OF PERTEMUAN MODALS*/}

                {/*START OF MODUL MODALS*/}
                <AlertDialog open={ openCreateModul } onOpenChange={ setOpenCreateModul }>
                    <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Tambah Modul { praktikum.pertemuan.find((pertemuan) => pertemuan.id === createModul.pertemuan_id)?.nama ?? ''}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex flex-col gap-0">
                                <span>Modul praktikum seperti <strong>"Modul 1"</strong></span>
                                <span>Topik Modul seperti <strong>"COMMAND LINE INTERFAFACE"</strong></span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitCreateModul }>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Modul</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ createModul.nama }
                                    onChange={ (event) => setCreateModul((prevState) => ({
                                        ...prevState,
                                        nama: event.target.value
                                    })) }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Topik Modul</Label>
                                <Input
                                    type="text"
                                    name="topik"
                                    id="topik"
                                    value={ createModul.topik }
                                    onChange={ (event) => setCreateModul((prevState) => ({
                                        ...prevState,
                                        topik: event.target.value
                                    })) }
                                />
                            </div>
                            <Button type="submit" disabled={createModul.onSubmit || !createModul.nama || !createModul.topik || createModul.nama === createModulInit.nama}>
                                { createModul.onSubmit
                                    ? (
                                        <>Memproses <Loader2 className="animate-spin"/></>
                                    ) : (
                                        <span>Simpan</span>
                                    )
                                }
                            </Button>
                        </form>
                        <AlertDialogCancel onClick={() => setCreateModul(createModulInit)}>
                            Batal
                        </AlertDialogCancel>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog open={ openDeleteModul } onOpenChange={ setOpenDeleteModul }>
                    <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Hapus Modul
                            </AlertDialogTitle>
                            <AlertDialogDescription className="flex flex-col gap-0.5">
                                    <span className="text-red-600 font-bold">
                                        Anda akan menghapus Modul!
                                    </span>
                                <span className="*:text-red-600">
                                        Semua data Nilai Praktikan untuk modul <strong>"{ deleteModul.nama }"</strong> akan juga dihapus
                                    </span>
                                <br/>
                                <span className="text-red-600">
                                        Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                                    </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleSubmitDeleteModul }>
                            <div className="grid gap-2">
                                <Label htmlFor="validation">Validasi aksi anda</Label>
                                <Input
                                    type="text"
                                    name="validation"
                                    id="validation"
                                    value={ deleteModul.validation }
                                    placeholder="JARKOM JAYA"
                                    onChange={ (event) =>
                                        setDeleteModul((prevState) => ({
                                            ...prevState,
                                            validation: event.target.value,
                                        }))
                                    }
                                    autoComplete="off"
                                />
                                <p>Ketik <strong>JARKOM JAYA</strong> untuk melanjutkan</p>
                            </div>
                            <Button type="submit" disabled={ deleteModul.onSubmit || deleteModul.validation !== 'JARKOM JAYA'}>
                                { deleteModul.onSubmit
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
                                    setDeleteModul(deleteModulInit);
                                    setOpenDeleteModul(false);
                                }}
                            >
                                Batal
                            </Button>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
                {/*END OF MODUL MODALS*/}
            </AslabLayout>
        </>
    );
}
