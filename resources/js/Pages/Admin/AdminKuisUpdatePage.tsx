import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Loader2, RefreshCcw } from "lucide-react";
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
import { QuillEditor } from "@/components/quill-editor";
import { Delta } from "quill";
import { TransferListBox } from "@/components/transfer-list-box";
import ReactSelect from "react-select";
import { DateTimePicker } from "@/components/date-time-picker";
import { PageProps } from "@/types";
import { deltaParse } from "@/components/delta-parse";

export default function AdminKuisUpdatePage({ auth, praktikums, labels, kuis }: PageProps<{
    praktikums: {
        id: string;
        nama: string;
        pertemuan: {
            id: string;
            nama: string;
            praktikum_id: string;
        }[];
    }[];
    labels: {
        id: string;
        nama: string;
    }[];
    kuis: {
        id: string;
        nama: string;
        deskripsi: string;
        waktu_mulai: string;
        waktu_selesai: string;
        pertemuan_id: string;
        soal: {
            id: string;
            pertanyaan: string;
        }[];
    };
}>) {
    const { toast } = useToast();
    type UpdateForm = {
        nama: string;
        deskripsi: Delta;
        waktu_mulai: Date | undefined;
        waktu_selesai: Date | undefined;
        pertemuan_id: string;
        onSubmit: boolean;
    };
    type DataSoalKuis = {
        unselected: {
            label: string;
            value: string;
        }[];
        selected: {
            label: string;
            value: string;
        }[];
    };
    type SoalKuis = {
        data: DataSoalKuis;
        onLoad: boolean;
        onReady: boolean;
        limit: number;
        loadMessage: string;
    };
    type LabelSelection = {
        data: string[];
        onChange: boolean;
        onFetch: boolean;
    };
    const updateFormInit: UpdateForm = {
        nama: kuis.nama,
        deskripsi: deltaParse(kuis.deskripsi),
        waktu_mulai: new Date(kuis.waktu_mulai),
        waktu_selesai: new Date(kuis.waktu_selesai),
        pertemuan_id: kuis.pertemuan_id,
        onSubmit: false
    };
    const soalKuisInit: SoalKuis = {
        data: {
            unselected: [],
            selected: kuis.soal.map((item) => {
                const delta = JSON.parse(item.pertanyaan);
                const text = delta.ops.map((op: { insert: string }) => op.insert).join("");

                return {
                    label: text.trim(),
                    value: item.id
                };
            }),
        },
        onLoad: false,
        onReady: false,
        limit: 50,
        loadMessage: "",
    };
    const labelSelectionInit: LabelSelection = {
        data: [],
        onChange: false,
        onFetch: false
    };

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>(updateFormInit);
    const [ soalKuis, setSoalKuis ] = useState<SoalKuis>(soalKuisInit);
    const [ labelSelection, setLabelSelection ] = useState<LabelSelection>(labelSelectionInit);
    const handleFormChange = (key: keyof UpdateForm, value: any) => {
        if (key === 'pertemuan_id') {
            const newNama = (() => {
                for (const { nama: namaPraktikum, pertemuan } of praktikums) {
                    const found = pertemuan.find(({ id }) => id === value);
                    if (found) return `Kuis ${namaPraktikum} - ${found.nama}`;
                }
                return '';
            })();
            setUpdateForm((prevState) => ({
                ...prevState,
                pertemuan_id: value,
                nama: newNama,
            }));
            return;
        }
        setUpdateForm((prev) => ({ ...prev, [key]: value }));
    };
    const handleSoalKuisChange = (key: keyof SoalKuis, value: boolean | DataSoalKuis) => {
        setSoalKuis((prev) => ({ ...prev, [key]: value }));
    };
    const handleLabelSelectionChange = (key: keyof LabelSelection, value: boolean | string[]) => {
        if (key === 'data') {
            setLabelSelection((prevState) => ({ ...prevState, data: value as string[], onChange: true }));
            setSoalKuis((prevState) => ({ ...prevState, loadMessage: '' }));
            return;
        }
        setLabelSelection((prev) => ({ ...prev, [key]: value }));
        setSoalKuis((prevState) => ({ ...prevState, loadMessage: '' }));
    };
    const handleLabelSelectionFetch = () => {
        setSoalKuis((prevState) => ({
            ...prevState,
            onLoad: true,
        }));
        setLabelSelection((prevState) => ({
            ...prevState,
            onFetch: true
        }));
        axios.get<{
            data: {
                id: string;
                pertanyaan: string;
            }[];
        }>(route('api.soal'), {
            params: {
                labels: labelSelection.data,
                limit: 250
            }
        })
            .then(res => {
                let duplicate = 0;
                const filteredUnselected = res.data.data.filter(item => {
                    const isDuplicate = soalKuis.data.selected.some(selectedItem => selectedItem.value === item.id);

                    if (isDuplicate) {
                        duplicate++;
                    }

                    return !isDuplicate;
                });

                const newSoalKuisData = {
                    selected: soalKuis.data.selected,
                    unselected: filteredUnselected.map((item) => {
                        const delta = JSON.parse(item.pertanyaan);
                        const text = delta.ops.map((op: { insert: string }) => op.insert).join("");

                        return {
                            label: text.trim(),
                            value: item.id
                        };
                    })
                };

                setSoalKuis((prevState) => ({
                    ...prevState,
                    data: newSoalKuisData,
                    onLoad: false,
                    onReady: true,
                    loadMessage: duplicate ? `Terdapat ${duplicate} data yang sudah terpilih, tidak dimasukkan` : ''
                }));

                setLabelSelection((prevState) => ({
                    ...prevState,
                    onFetch: false,
                    onChange: false
                }));
            })
            .catch(err => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : "Error tidak diketahui terjadi!";
                setLabelSelection((prevState) => ({
                    ...prevState,
                    onFetch: false,
                    onChange: true
                }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, pertemuan_id, deskripsi, waktu_mulai, waktu_selesai } = updateForm;
        const updateSchema = z.object({
            nama: z.string({ message: 'Format nama Kuis tidak valid! '}).min(1, { message: 'Nama Kuis wajib diisi!' }),
            pertemuan_id: z.string({ message: 'Format Pertemuan Kuis tidak valid! '}).min(1, { message: 'Pertemuan untuk Kuis belum dipilih!' }),
            waktu_mulai: z.date({ message: 'Format Tanggal mulai kuis tidak valid! '}),
            waktu_selesai: z.date({ message: 'Format Tanggal mulai kuis tidak valid! '})
        });
        const updateParse = updateSchema.safeParse({
            nama: nama,
            pertemuan_id: pertemuan_id,
            waktu_mulai: waktu_mulai,
            waktu_selesai: waktu_selesai
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
        }>(route('kuis.update'), {
            id: kuis.id,
            pertemuan_id: pertemuan_id,
            nama: nama,
            deskripsi: JSON.stringify(deskripsi),
            waktu_mulai: waktu_mulai,
            waktu_selesai: waktu_selesai,
            labels: soalKuis.data.selected.map((selected) => selected.value)
        })
            .then((res) => {
                setUpdateForm(updateFormInit);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('admin.kuis.index'));
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

    return (
        <>
            <AdminLayout auth={auth}>
                <Head title="Admin - Menambahkan Kuis" />
                <Button variant="ghost" size="icon" onClick={ () => router.visit(route('admin.kuis.index')) }>
                    <ArrowBigLeft />
                </Button>
                <CardTitle>
                    Memperbarui data Kuis
                </CardTitle>
                <CardDescription>
                    ...
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    <div className="grid gap-2">
                        <Label>Pertemuan Praktikum</Label>
                        <Select value={updateForm.pertemuan_id} onValueChange={ (val) => handleFormChange('pertemuan_id', val) }>
                            <SelectTrigger className="min-w-80">
                                <SelectValue placeholder="Pilih pertemuan"/>
                            </SelectTrigger>
                            <SelectContent>
                                { praktikums.map((praktikum, index) => ((
                                    <SelectGroup key={ index }>
                                        <SelectLabel>{ praktikum.nama }</SelectLabel>
                                        {
                                            praktikum.pertemuan.map((pertemuan) => ((
                                                <SelectItem key={ pertemuan.id } value={ pertemuan.id }>{ `${ praktikum.nama } - ${ pertemuan.nama }` }</SelectItem>
                                            )))
                                        }
                                    </SelectGroup>
                                )))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2 min-w-80">
                        <Label htmlFor="nama">Nama Kuis</Label>
                        <Input
                            type="text"
                            name="nama"
                            id="nama"
                            value={ updateForm.nama }
                            onChange={ (event) =>
                                setUpdateForm((prevState) => ({
                                    ...prevState,
                                    nama: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="grid gap-2 min-w-80">
                        <Label>Deskripsi Kuis</Label>
                        <QuillEditor
                            onValueChange={ (delta) => {
                                handleFormChange("deskripsi", delta)
                            } }
                            value={ updateForm.deskripsi }
                            height="250px"
                        />
                    </div>
                    <div className="grid gap-2 min-w-80 w-full">
                        <Label>Waktu Mulai Pelaksanaan Kuis</Label>
                        <DateTimePicker
                            onChange={(date) => {
                                if (date) {
                                    handleFormChange('waktu_mulai', date)
                                }
                            }}
                        />
                    </div>
                    <div className="grid gap-2 min-w-80 w-full">
                        <Label>Waktu Akhir Pelaksanaan Kuis</Label>
                        <DateTimePicker
                            onChange={(date) => {
                                if (date) {
                                    handleFormChange('waktu_selesai', date)
                                }
                            }}
                        />
                    </div>

                    <div className="grid gap-2 min-w-80">
                        <Label>Soal Kuis</Label>
                        <div className="flex flex-row gap-2.5">
                            <ReactSelect
                                isMulti
                                options={ labels.map((item) => ({
                                    value: item.id,
                                    label: item.nama,
                                })) }
                                onChange={ (selectedOptions) => {
                                    handleLabelSelectionChange("data", selectedOptions.map((opt) => opt.value))
                                } }
                                value={ labels
                                    .filter((item) => labelSelection.data.includes(item.id))
                                    .map((item) => ({ value: item.id, label: item.nama })) }
                                placeholder="Pilih label Soal"
                                className="flex-1"
                                isDisabled={ labelSelection.onFetch }
                            />
                            <Button
                                size="icon"
                                disabled={ !labelSelection.onChange || labelSelection.onFetch }
                                type="button"
                                onClick={ handleLabelSelectionFetch }
                            >
                                <RefreshCcw
                                    className={ `${ labelSelection.onFetch ? 'animate-spin' : 'animate-none' }` }/>
                            </Button>
                        </div>
                        <p className="mt-3 -mb-3 text-sm text-red-500/90 font-medium flex flex-col gap-1">
                            <span className="text-green-600/90">{ soalKuis.loadMessage ? 'Berhasil mengambil data!' : '' }</span>
                            { soalKuis.loadMessage ? soalKuis.loadMessage : '' }
                        </p>
                        <div className="w-full overflow-x-auto">
                            <TransferListBox
                                initialValue={ soalKuis.data }
                                unSelectedTitle="Soal tersedia untuk dipilih"
                                unSelectedDescription=""
                                selectedTitle="Soal yang dipilih"
                                selectedDescription=""
                                isUnSelectedOnLoad={ soalKuis.onLoad }
                                onValueChange={ (val) => {
                                    JSON.stringify(val) !== JSON.stringify(soalKuis.data) && handleSoalKuisChange('data', val);
                                } }
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.pertemuan_id || !updateForm.waktu_mulai || !updateForm.waktu_selesai }
                        className="w-min ml-auto"
                    >
                        { updateForm.onSubmit
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
