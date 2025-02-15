import { useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { FileUploader } from "@/components/file-uploader";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { QuillEditor } from "@/components/quill-editor";
import { AnswersEditor } from "@/components/answers-editor";
import * as XLSX from "xlsx";
import { Delta } from "quill";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { NotificationCard } from "@/components/notification-card";
import { PageProps } from "@/types";

type FileUpload = {
    file: File | null;
    onLoad: boolean;
    onInvalid: boolean;
    invalidMsg: string;
};

type AnswerOption = {
    value: string;
    label: string;
};

type FileContent = {
    label: string[];
    pertanyaan: Delta;
    pilihan_jawaban: AnswerOption[];
    kunci_jawaban: string;
};
type FileError = {
    [key: number]: string[];
};
export default function AdminSoalCreateUploadPage({ auth, labels }: PageProps<{
    labels: {
        id: string;
        nama: string;
    }[];
    moduls: {
        id: string;
        nama: string;
    }[];
}>) {
    const { toast } = useToast();

    const fileUploadInit: FileUpload = {
        file: null,
        onLoad: false,
        onInvalid: false,
        invalidMsg: ''
    };
    const formInit = {
        onSubmit: false,
        onError: false,
        onInvalid: false,
        invalidMsg: '',
        errMsg: ''
    };

    const [fileUpload, setFileUpload] = useState<FileUpload>(fileUploadInit);
    const [fileErrors, setFileErrors] = useState<FileError[]>([]);
    const [fileContents, setFileContents] = useState<FileContent[]>([]);
    const [form, setForm] = useState(formInit);

    const handleSetFileUpload = (file: File) => {
        setFileUpload({
            file,
            onLoad: true,
            onInvalid: false,
            invalidMsg: "",
        });
    };
    const mapDataFileToContents = (row: any[]): FileContent => ({
        label: row[7]
            ? row[7]
                .split(",")
                .map((labelName: string) => labels.find((label) => label.nama === labelName.trim())?.id)
                .filter(Boolean)
            : [],
        pertanyaan: row[0] ? { ops: [{ insert: row[0] }] } as Delta : { ops: [{ insert: '' }] } as Delta,
        pilihan_jawaban: ["A", "B", "C", "D", "E"].map((key, index) => ({
            value: key,
            label: row[1 + index] ?? "",
        })),
        kunci_jawaban: row[6]?.toUpperCase() ?? "",
    });

    const soalSchema = z.object({
        pertanyaan: z.object({
            ops: z.array(
                z.object({
                    insert: z.string().min(1, "Pertanyaan tidak boleh kosong"),
                })
            ).min(1, "Pertanyaan harus memiliki minimal 1 elemen"),
        }),
        pilihan_jawaban: z
            .array(
                z.object({
                    value: z.string().min(1, "Jawaban harus memiliki key"),
                    label: z.string().min(1, "Pilihan jawaban tidak boleh kosong"),
                })
            )
            .min(2, "Harus ada minimal 2 pilihan jawaban"),
        kunci_jawaban: z.string().min(1, "Kunci jawaban tidak boleh kosong"),
    });

    const handleFormSubmit = () => {
        setForm((prevState) => ({ ...prevState, onSubmit: true }));
        const soalParse = z.array(soalSchema).safeParse(fileContents);
        if (!soalParse.success) {
            const errMsg = soalParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }
        const serializedData = fileContents.map((content) => ({
            ...content,
            pertanyaan: JSON.stringify(content.pertanyaan),
            pilihan_jawaban: JSON.stringify(content.pilihan_jawaban),
        }));

        axios
            .post<{
                message: string;
            }>(route("soal.create-mass"), {
                data: serializedData,
            })
            .then((res) => {
                setForm(formInit);
                toast({
                    variant: "default",
                    className: "bg-green-500 text-white",
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route("admin.kuis.soal.index"));
            })
            .catch((err: unknown) => {
                const errMsg: string =
                    err instanceof AxiosError && err.response?.data?.message
                        ? err.response.data.message
                        : "Error tidak diketahui terjadi!";
                setForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    useEffect(() => {
        const handleFile = async () => {
            if (fileUpload.file && fileUpload.onLoad) {
                try {
                    const arrayBuffer = await fileUpload.file.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer);
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const raw_data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (raw_data.length > 0) {
                        const ACCEPT_HEADERS: string[] = [
                            "pertanyaan",
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "kunci_jawaban",
                            "label",
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

                        const errors: FileError[] = [];
                        const sanitizedData = raw_data.slice(1).filter((row: any[], rowIndex: number) => {
                            const rowErrors: string[] = [];

                            const pertanyaan = row[0] as string | undefined;
                            if (!pertanyaan) {
                                rowErrors.push(`Pertanyaan tidak diisi.`);
                            }

                            const choices: string[] = ["A", "B", "C", "D", "E"];
                            const missingColumns: string[] = [];

                            choices.forEach((choice, i) => {
                                const answer = row[i + 1] as string | undefined;
                                if (!answer) {
                                    missingColumns.push(choice);
                                }
                            });

                            if (missingColumns.length > 0) {
                                rowErrors.push(
                                    `Pilihan jawaban ${missingColumns.join(", ")} tidak diisi.`
                                );
                            }

                            const kunci = row[6] as string | undefined;
                            if (!kunci || !choices.includes(kunci.toUpperCase())) {
                                rowErrors.push(
                                    `Kunci jawaban ${kunci ? `"${kunci}" tidak valid (A,B,C,D,E)` : 'tidak diisi'}`
                                );
                            }

                            const label = row[7] as string | undefined;
                            if (label && typeof label !== "string") {
                                rowErrors.push(`Label harus berupa teks.`);
                            }

                            if (rowErrors.length > 0) {
                                errors.push({
                                    [rowIndex + 1]: rowErrors,
                                });
                            }

                            return rowErrors.length === 0;
                        });

                        setFileErrors(errors);

                        if (sanitizedData.length === 0) {
                            toast({
                                variant: "destructive",
                                title: "Gagal memproses file",
                                description: "File tidak memiliki data yang valid atau mungkin kosong.",
                            });
                            return;
                        }

                        setFileContents(
                            sanitizedData.map((data) => mapDataFileToContents(data))
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
                    setFileUpload((prevState) => ({
                        ...prevState,
                        onLoad: false,
                    }));
                }
            }
        };

        handleFile();
    }, [fileUpload]);

    return (
        <AdminLayout auth={auth}>
            <Head title="Admin - Upload Soal Kuis" />
            <CardTitle>Upload Soal Kuis</CardTitle>
            <CardDescription>Upload data soal kuis (excel)</CardDescription>
            {fileErrors.length > 0 && (
                <NotificationCard className="max-w-full rounded-sm shadow-none bg-red-200 text-sm">
                    <div className="flex gap-1 items-center mb-2">
                        <TriangleAlert width={18} color="red" />
                        <p className="text-base font-medium">Data yang tidak dibaca karena tidak valid</p>
                    </div>
                    <ul className="list-disc ml-6">
                        {fileErrors.map((errorObj, idx) => {
                            const baris = Object.keys(errorObj)[0];
                            const messages = errorObj[baris as unknown as number];
                            return (
                                <li key={idx}>
                                    Data ke-{baris} : {messages.join(", ")}
                                </li>
                            );
                        })}
                    </ul>
                </NotificationCard>
            )}
            {fileUpload.onLoad ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2  className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
                        <p className="mt-4 text-gray-600">Memproses file, mohon tunggu...</p>
                    </div>
                </div>
            ) : fileContents.length > 0 ? (
                <div className="mt-6 space-y-6">
                    {fileContents.map((content, index) => (
                        <CardContent key={ index } className="p-4 border rounded-md">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">Soal { index + 1 }</h3>
                                <div className="grid gap-2">
                                    <Label>Label Soal</Label>
                                    <Select
                                        isMulti
                                        options={ labels.map((item) => ({
                                            value: item.id,
                                            label: item.nama,
                                        })) }
                                        onChange={ (selectedOptions) => {
                                            const updated = [ ...fileContents ];
                                            updated[index].label = selectedOptions.map((opt) => opt.value);
                                            setFileContents(updated);
                                        } }
                                        value={ labels
                                            .filter((item) => content.label.includes(item.id))
                                            .map((item) => ({ value: item.id, label: item.nama })) }
                                        placeholder="Pilih label Soal"
                                    />
                                </div>
                                <QuillEditor
                                    value={ content.pertanyaan }
                                    onValueChange={ (value) => {
                                        const updated = [ ...fileContents ];
                                        updated[index].pertanyaan = value;
                                        setFileContents(updated);
                                    } }
                                />
                                <AnswersEditor
                                    initialOptions={ content.pilihan_jawaban }
                                    onOptionsChange={ (options) => {
                                        const updated = [ ...fileContents ];
                                        if (
                                            JSON.stringify(updated[index].pilihan_jawaban) !==
                                            JSON.stringify(options)
                                        ) {
                                            updated[index].pilihan_jawaban = options;
                                            setFileContents(updated);
                                        }
                                    } }
                                    initialCorrectAnswer={ content.kunci_jawaban }
                                    onSelectCorrectAnswer={ (correct) => {
                                        const updated = [ ...fileContents ];
                                        if (updated[index].kunci_jawaban !== correct) {
                                            updated[index].kunci_jawaban = correct;
                                            setFileContents(updated);
                                        }
                                    } }
                                />
                            </div>
                        </CardContent>
                    )) }
                </div>
            ) : (
                <>
                    <FileUploader
                        className="mt-4"
                        onFileUpload={ (file) => handleSetFileUpload(file) }
                    />
                    <div className="w-full mx-auto flex gap-1 items-center justify-center text-center text-sm font-medium">
                        Tidak memiliki file?
                        <a href={route('assets', 'template-upload-soal.xlsx')} className="hover:text-blue-600 flex items-center gap-0.5" target="_blank">
                            Unduh template<Download width={18} />
                        </a>
                    </div>
                </>
            ) }
            <div className="my-3 flex items-center justify-end">
                <Button
                    onClick={ handleFormSubmit }
                    disabled={ form.onSubmit || fileContents.length === 0 }
                    className={ `${ fileContents.length > 1 ? 'inline-flex' : 'hidden' }` }
                >
                    { form.onSubmit ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="animate-spin h-4 w-4"/>
                            <span>Memproses...</span>
                        </div>
                    ) : (
                        "Simpan euy"
                    ) }
                </Button>
            </div>
        </AdminLayout>
    );
}
