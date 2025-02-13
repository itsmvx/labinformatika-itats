import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Download, Loader, Loader2, TriangleAlert } from "lucide-react";
import * as XLSX from "xlsx";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { NotificationCard } from "@/components/notification-card";
import { FileUploader } from "@/components/file-uploader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageProps } from "@/types";

export default function AdminPraktikanCreateUploadPage({ auth }: PageProps) {
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
    const uploadFileInit: uploadFile = {
        file: null,
        onLoad: false,
        onInvalid: false,
        invalidMsg: ''
    };

    const [uploadFile, setUploadFile] = useState<uploadFile>(uploadFileInit);
    const [uploadErrors, setUploadErrors] = useState<UploadErrors[]>([]);
    const [uploadContents, setUploadContents] = useState<uploadContents[]>([]);
    const [onSubmitUploadContents, setOnSubmitUploadContents] = useState<boolean>(false);
    const [submitNPMErrors, setSubmitNPMErrors] = useState<string[]>([]);

    const handleSetUploadFile = (file: File) => {
        setUploadFile({
            file,
            onLoad: true,
            onInvalid: false,
            invalidMsg: "",
        });
    };
    const handleSubmitUploadContents = () => {
        setOnSubmitUploadContents(true);
        setSubmitNPMErrors([]);

        axios.post(route('api.check-npm-post'), {
            npm: uploadContents.map((content) => content.npm)
        })
            .then(() => {
                axios.post<{
                    message: string;
                }>(route('praktikan.create-mass', {
                    praktikans: uploadContents,
                }))
                    .then((res) => {
                        setOnSubmitUploadContents(false);
                        toast({
                            variant: "default",
                            className: "bg-green-500 text-white",
                            title: "Berhasil!",
                            description: res.data.message,
                        });
                        router.visit(route("admin.praktikan.index"));
                    })
                    .catch((err: unknown) => {
                        const errMsg: string =
                            err instanceof AxiosError && err.response?.data?.message
                                ? err.response.data.message
                                : "Error tidak diketahui terjadi!";
                        setOnSubmitUploadContents(false);
                        toast({
                            variant: "destructive",
                            title: "Permintaan gagal diproses!",
                            description: errMsg,
                        });
                    });
            })
            .catch((err: unknown) => {
                const errMsg: string =
                    err instanceof AxiosError && err.response?.data?.message
                        ? err.response.data.message
                        : "Error tidak diketahui terjadi!";
                setOnSubmitUploadContents(false);
                if (err instanceof AxiosError && err.response?.data?.errors && Array.isArray(err.response?.data?.errors)) {
                    setSubmitNPMErrors(err.response.data.errors);
                    toast({
                        variant: "destructive",
                        title: "Permintaan gagal diproses!",
                        description: 'Terdapat duplikasi Praktikan! cek notifikasi diatas untuk informasi lengkap',
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
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
                    setUploadFile((prevState) => ({
                        ...prevState,
                        onLoad: false,
                    }));
                }
            }
        };

        handleFile();
    }, [uploadFile]);

    return (
        <>
            <AdminLayout auth={auth}>
                <Head title="Admin - Praktikum|Data Praktikan"/>
                <CardTitle>Upload Data Praktikan</CardTitle>
                <CardDescription>...</CardDescription>
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
                { submitNPMErrors.length > 0 && (
                    <NotificationCard className="max-w-full rounded-sm shadow-none bg-red-200 text-sm">
                        <div className="flex gap-1 items-center mb-2">
                            <TriangleAlert width={ 18 } color="red"/>
                            <p className="text-base font-medium">Data NPM yang sudah ada</p>
                        </div>
                        <ul className="list-disc list-inside flex flex-row flex-wrap gap-3">
                            { submitNPMErrors.map((npm, idx) => ((
                                <li key={ idx } className="w-48 truncate">
                                    NPM { npm }
                                </li>
                            ))) }
                        </ul>
                    </NotificationCard>
                ) }

                { uploadFile.onLoad ? (
                    <div className="flex items-center justify-center h-60">
                        <div className="text-center">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto"/>
                            <p className="mt-2 text-gray-600">Memproses file, mohon tunggu...</p>
                        </div>
                    </div>
                ) : uploadContents.length > 0 ? (
                    <div className="mt-6 space-y-6">
                        <NotificationCard className="w-full max-w-full rounded shadow-sm bg-green-300 text-sm">
                            <ul className="list-disc list-inside">
                                <li>Pastikan NPM Praktikan sudah benar, dengan format <strong>06.XXXX.X.XXXX</strong>
                                </li>
                                <li>Pastikan Nama Praktikan sudah benar, Kapital untuk setiap Kata (sesuai EYD ya kidz)
                                </li>
                            </ul>
                        </NotificationCard>
                        { uploadContents.map((content, index) => (
                            <CardContent key={ index } className="p-4 border rounded-md">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold">Praktikan { index + 1 }</h3>
                                    <div className="grid gap-2">
                                        <Label htmlFor={ `npm-${ index }` }>NPM</Label>
                                        <Input
                                            type="text"
                                            name={ `npm-${ index }` }
                                            id={ `npm-${ index }` }
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
                            </CardContent>
                        )) }
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

                <div className="my-3 flex items-center justify-between gap-2">
                    <div className={ `flex-1 flex flex-row items-center gap-1 ${onSubmitUploadContents ? '*:block' : '*:hidden'} text-xs text-muted-foreground font-medium` }>
                        <p className="max-w-96 truncate">
                            Tunggu bentar yah.. emang agak lama hehe
                        </p>
                        <Loader className="animate-spin w-min h-4 text-gray-900 ml-0" />
                    </div>
                    <Button
                        onClick={ handleSubmitUploadContents }
                        disabled={ onSubmitUploadContents || uploadContents.length === 0 || uploadFile.onLoad }
                        className={ `${ uploadContents.length > 1 && !uploadFile.onLoad  ? 'inline-flex' : 'hidden' }` }
                    >
                        { onSubmitUploadContents ? (
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
        </>
    );
}

