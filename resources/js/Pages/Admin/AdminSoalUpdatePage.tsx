import { FormEvent, useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { QuillEditor } from "@/components/quill-editor";
import type { Delta } from "quill";
import { AnswersEditor } from "@/components/answers-editor";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import Select from "react-select";
import { deltaParse } from "@/components/delta-parse";
import { PageProps } from "@/types";

type AnswerOption = {
    value: string;
    label: string;
};
type UpdateForm = {
    label: string[];
    pertanyaan: Delta;
    pilihan_jawaban: AnswerOption[];
    kunci_jawaban: string;
    onSubmit: boolean;
    isValid: boolean;
};

export default function AdminSoalUpdatePage({ auth, labels, soal }: PageProps<{
    labels: {
        id: string;
        nama: string;
    }[];
    soal: {
        id: string;
        pertanyaan: string;
        pilihan_jawaban: string;
        kunci_jawaban: string;
        label: string[];
    };
}>) {
    const { toast } = useToast();
    console.log(soal);

    const updateFormInit: UpdateForm = {
        label: soal.label,
        pertanyaan: deltaParse(soal.pertanyaan),
        pilihan_jawaban: JSON.parse(soal.pilihan_jawaban) as AnswerOption[],
        kunci_jawaban: soal.kunci_jawaban,
        onSubmit: false,
        isValid: false,
    };

    const [updateForm, setUpdateForm] = useState<UpdateForm>(updateFormInit);
    const [onUpdateForm, setOnUpdateForm] = useState<boolean>(false);

    const validateForm = (form: UpdateForm) => {
        const soalKuisSchema = z.object({
            label: z.array(z.string().uuid("Label harus berupa UUID yang valid")).optional(),
            pertanyaan: z.custom<Delta>((data) => data.ops?.length > 0, "Pertanyaan harus diisi."),
            pilihan_jawaban: z
                .array(
                    z.object({
                        value: z.string(),
                        label: z.string(),
                    })
                )
                .min(2, "Pilihan jawaban harus minimal 2."),
            kunci_jawaban: z
                .string()
                .refine((key) => form.pilihan_jawaban.some((opt) => opt.value === key), {
                    message: "Kunci jawaban harus sesuai dengan salah satu pilihan jawaban.",
                }),
        });

        return soalKuisSchema.safeParse(form).success;
    };

    const handleFormChange = (key: keyof UpdateForm, value: any) => {
        setUpdateForm((prev) => {
            const updatedForm = { ...prev, [key]: value };
            const isValid = validateForm(updatedForm);
            return { ...updatedForm, isValid };
        });
    };


    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { label, pertanyaan, pilihan_jawaban, kunci_jawaban } = updateForm;

        const soalKuisSchema = z.object({
            label: z.array(z.string().uuid("Label harus berupa UUID yang valid")).optional(),
            pertanyaan: z.custom<Delta>((data) => data.ops?.length > 0, "Pertanyaan harus diisi."),
            pilihan_jawaban: z
                .array(
                    z.object({
                        value: z.string(),
                        label: z.string(),
                    })
                )
                .min(2, "Pilihan jawaban harus minimal 2."),
            kunci_jawaban: z
                .string()
                .refine((key) => updateForm.pilihan_jawaban.some((opt) => opt.value === key), {
                    message: "Kunci jawaban harus sesuai dengan salah satu pilihan jawaban.",
                }),
        });

        const validation = soalKuisSchema.safeParse(updateForm);

        if (!validation.success) {
            const errMsg = validation.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{ message: string; }>(route("soal.update"), {
            id: soal.id,
            label: label,
            pertanyaan: JSON.stringify(pertanyaan),
            pilihan_jawaban: JSON.stringify(pilihan_jawaban),
            kunci_jawaban: kunci_jawaban,
        })
            .then((res) => {
                setUpdateForm(updateFormInit);
                toast({
                    variant: "default",
                    className: "bg-green-500 text-white",
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('admin.kuis.soal.index'));
            })
            .catch((err: unknown) => {
                const errMsg: string =
                    err instanceof AxiosError && err.response?.data?.message
                        ? err.response.data.message
                        : "Error tidak diketahui terjadi!";
                setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    useEffect(() => {
        setOnUpdateForm(() => {
            const prevState = updateForm;
            return JSON.stringify({
                label: soal.label,
                pertanyaan: soal.pertanyaan,
                pilihan_jawaban: soal.pilihan_jawaban,
                kunci_jawaban: soal.kunci_jawaban,
            }) !== JSON.stringify({
                label: prevState.label,
                pertanyaan: JSON.stringify(prevState.pertanyaan),
                pilihan_jawaban: JSON.stringify(prevState.pilihan_jawaban),
                kunci_jawaban: prevState.kunci_jawaban
            });
        });
    }, [ updateForm, updateFormInit ]);

    return (
        <AdminLayout auth={auth}>
            <Head title="Admin - Menambahkan soal kuis" />
            <Button
                variant="ghost"
                className=""
                onClick={() => router.visit(route('admin.kuis.soal.index'))}
            >
                <ArrowLeft />
            </Button>
            <CardTitle className="px-5">Menambahkan Soal Kuis</CardTitle>
            <CardDescription className="px-5">Menambahkan data soal kuis baru</CardDescription>
            <form className="w-full p-5 flex flex-col gap-3" onSubmit={handleFormSubmit}>
                <div className="grid gap-2">
                    <Label>Label Soal</Label>
                    <Select
                        isMulti
                        options={labels.map((item) => ({
                            value: item.id,
                            label: item.nama,
                        }))}
                        onChange={(selectedOptions) => {
                            handleFormChange("label", selectedOptions.map((opt) => opt.value))
                        }}
                        value={labels
                            .filter((item) => updateForm.label.includes(item.id))
                            .map((item) => ({ value: item.id, label: item.nama }))}
                        placeholder="Pilih label Soal"
                    />
                </div>
                <Label>Konten Pertanyaan</Label>
                <QuillEditor
                    onValueChange={(delta) => {
                        handleFormChange("pertanyaan", delta)
                    }}
                    value={updateForm.pertanyaan}
                />
                <AnswersEditor
                    onOptionsChange={(options) => {
                        handleFormChange('pilihan_jawaban', options);
                    }}
                    onSelectCorrectAnswer={(value) => {
                        handleFormChange('kunci_jawaban', value)
                    }}
                    initialOptions={updateForm.pilihan_jawaban}
                    initialCorrectAnswer={updateForm.kunci_jawaban}
                />
                <Button
                    type="submit"
                    className="w-min ml-auto"
                    disabled={!updateForm.isValid || updateForm.onSubmit || !onUpdateForm}
                >
                    <Save />
                    {updateForm.onSubmit ? "Menyimpan..." : "Simpan"}
                </Button>

            </form>
        </AdminLayout>
    );
}
