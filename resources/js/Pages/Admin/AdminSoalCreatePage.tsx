import { FormEvent, useState } from "react";
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
import { PageProps } from "@/types";

type AnswerOption = {
    value: string;
    label: string;
};
type CreateForm = {
    label: string[];
    pertanyaan: Delta;
    pilihan_jawaban: AnswerOption[];
    kunci_jawaban: string;
    onSubmit: boolean;
    isValid: boolean;
};

export default function AdminSoalCreatePage({ auth, labels }: PageProps<{
    labels: {
        id: string;
        nama: string;
    }[];
}>) {
    const { toast } = useToast();

    const createFormInit: CreateForm = {
        label: [],
        pertanyaan: { ops: [{ insert: "\n" }] } as Delta,
        pilihan_jawaban: [],
        kunci_jawaban: "",
        onSubmit: false,
        isValid: false,
    };


    const [createForm, setCreateForm] = useState<CreateForm>(createFormInit);
    const validateForm = (form: CreateForm) => {
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

    const handleFormChange = (key: keyof CreateForm, value: any) => {
        setCreateForm((prev) => {
            const updatedForm = { ...prev, [key]: value };
            const isValid = validateForm(updatedForm);
            return { ...updatedForm, isValid };
        });
    };


    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { label, pertanyaan, pilihan_jawaban, kunci_jawaban } = createForm;

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
                .refine((key) => createForm.pilihan_jawaban.some((opt) => opt.value === key), {
                    message: "Kunci jawaban harus sesuai dengan salah satu pilihan jawaban.",
                }),
        });

        const validation = soalKuisSchema.safeParse(createForm);

        if (!validation.success) {
            const errMsg = validation.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreateForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{ message: string; }>(route("soal.create"), {
            label: label,
            pertanyaan: JSON.stringify(pertanyaan),
            pilihan_jawaban: JSON.stringify(pilihan_jawaban),
            kunci_jawaban: kunci_jawaban,
        })
            .then((res) => {
                setCreateForm(createFormInit);
                toast({
                    variant: "default",
                    className: "bg-green-500 text-white",
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('admin.kuis.soal.index'));
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                        ? err.response.data.message
                        : "Error tidak diketahui terjadi!";
                setCreateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

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
                            .filter((item) => createForm.label.includes(item.id))
                            .map((item) => ({ value: item.id, label: item.nama }))}
                        placeholder="Pilih label Soal"
                    />
                </div>
                <Label>Konten Pertanyaan</Label>
                <QuillEditor
                    onValueChange={(delta) => {
                        handleFormChange("pertanyaan", delta)
                    }}
                    value={createForm.pertanyaan}
                />
                <AnswersEditor
                    onOptionsChange={(options) => {
                        handleFormChange('pilihan_jawaban', options);
                    }}
                    onSelectCorrectAnswer={(value) => {
                        handleFormChange('kunci_jawaban', value)
                    }}
                    initialOptions={createForm.pilihan_jawaban}
                />
                <Button
                    type="submit"
                    className="w-min ml-auto"
                    disabled={!createForm.isValid || createForm.onSubmit}
                >
                    <Save />
                    {createForm.onSubmit ? "Menyimpan..." : "Simpan"}
                </Button>

            </form>
        </AdminLayout>
    );
}
