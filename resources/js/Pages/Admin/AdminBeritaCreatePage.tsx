import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageProps } from "@/types";
import ErrorPage from "@/Pages/ErrorPage";
import { Textarea } from "@/components/ui/textarea";
import { FreezeTextInput } from "@/components/freeze-text-input";
import { CustomSeparator } from "@/components/custom-separator";
import { QuillEditor } from "@/components/quill-editor";
import type { Delta } from "quill";
import { deltaInit } from "@/lib/StaticDataLib";

export default function AdminBeritaCreatePage({ auth, laboratoriums, jenisPraktikums }: PageProps<{
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
}>) {
    const authUser = auth.user;
    if (!authUser || auth.role !== "admin") {
        return (
            <ErrorPage status={401} />
        );
    }

    const { toast } = useToast();
    type CreateForm = {
        laboratorium_id: string;
        jenis_praktikum_id: string;
        judul: string;
        slug: string;
        deskripsi: string;
        prasyarat: Delta;
        konten: Delta;
        alur: string;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        jenis_praktikum_id: '',
        laboratorium_id: authUser.laboratorium_id === null ? '' : authUser.laboratorium_id,
        judul: '',
        slug: '',
        deskripsi: '',
        prasyarat: deltaInit,
        konten: deltaInit,
        alur: '',
        onSubmit: false
    };

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);

    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { laboratorium_id, jenis_praktikum_id, judul, slug, deskripsi, prasyarat, konten, alur } = createForm;

        axios.post<{
            message: string;
        }>(route('berita.create'), {
            admin_id: authUser.id,
            laboratorium_id: laboratorium_id === 'null' ? null : laboratorium_id,
            jenis_praktikum_id: jenis_praktikum_id === 'null' ? null : jenis_praktikum_id,
            judul: judul,
            slug: slug,
            deskripsi: deskripsi,
            prasyarat: prasyarat === deltaInit ? null : JSON.stringify(prasyarat),
            konten: konten === deltaInit ? null : JSON.stringify(konten),
            alur: alur,
        })
            .then((res) => {
                setCreateForm(createFormInit);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('admin.berita.index'));
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

    const SelectJenisPraktikum = () => {
        const jenisPraktikumFiltered = jenisPraktikums.filter((filt) => filt.laboratorium_id === createForm.laboratorium_id );

        return (
            <>
                <Label className="flex-1 min-w-72 grid gap-2">
                    Mata Kuliah / Jenis Praktikum
                    <Select disabled={ !createForm.laboratorium_id || createForm.laboratorium_id === "null" } value={ createForm.jenis_praktikum_id } onValueChange={ (value) => setCreateForm((prevState) => ({ ...prevState, jenis_praktikum_id: value })) }>
                        <SelectTrigger>
                            <SelectValue placeholder={ createForm.laboratorium_id ? "Pilih Mata kuliah / Jenis Praktikum" : "Pilih Laboratorium terlebih dahulu..." } />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="null">
                                Umum
                            </SelectItem>
                            {
                                jenisPraktikumFiltered.map((jenis, index) => ((
                                    <SelectItem key={ index } value={ jenis.id }>
                                        { jenis.nama }
                                    </SelectItem>
                                )))
                            }
                        </SelectContent>
                    </Select>
                </Label>
            </>
        );
    };

    return (
        <>
            <AdminLayout auth={auth}>
                <Head title="Admin - Menambahkan Berita" />
                <CardTitle>
                    Menambahkan Berita
                </CardTitle>
                <CardDescription>
                    Menambahkan data Berita baru
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    <CustomSeparator
                        text="Penerbit Berita"
                        className="my-5 !mb-0"
                        lineClassName="bg-primary/50 h-0.5 w-auto"
                        textClassName="bg-primary/10 rounded-md px-4 py-1 text-primary font-bold"
                    />
                    {authUser.laboratorium_id === null && (
                        <Label className="flex-1 grid gap-2">
                            Laboratorium Penerbit Berita
                            <Select defaultValue="null" value={ createForm.laboratorium_id } onValueChange={ (value) => setCreateForm((prevState) => ({ ...prevState, laboratorium_id: value, jenis_praktikum_id: value === 'null' ? 'null' : '' })) }>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Laboratorium"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">
                                        Umum
                                    </SelectItem>
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
                    </div>
                    <CustomSeparator
                        text="Headline Berita"
                        className="my-5 !mb-0"
                        lineClassName="bg-primary/50 h-0.5 w-auto"
                        textClassName="bg-primary/10 rounded-md px-4 py-1 text-primary font-bold"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="judul">Judul Berita</Label>
                        <Input
                            type="text"
                            name="judul"
                            id="judul"
                            placeholder="Pendaftaran Praktikum Jaringan Komputer ...."
                            value={ createForm.judul }
                            onChange={ (event) =>
                                setCreateForm((prevState) => ({
                                    ...prevState,
                                    judul: event.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <FreezeTextInput
                            freezeText={`${window.location.origin}/berita/`}
                            spacing={0}
                            id="slug"
                            placeholder="pendafaran-praktikum-jaringan-komputer-xxxviii"
                            onChange={ (event) => { setCreateForm((prevState) => ({ ...prevState, slug: event.target.value })) }}
                            required
                        />
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            id="deskripsi"
                            placeholder="Pendaftaran Praktikum .... telah dibuka!"
                            className="min-h-20"
                            value={ createForm.deskripsi }
                            onChange={(event) => setCreateForm((prevState) => ({ ...prevState, deskripsi: event.target.value })) }
                            required
                        />
                    </div>
                    <CustomSeparator
                        text="Konten Berita"
                        className="my-5 !mb-0"
                        lineClassName="bg-primary/50 h-0.5 w-auto"
                        textClassName="bg-primary/10 rounded-md px-4 py-1 text-primary font-bold"
                    />
                    <div className="grid gap-2">
                        <Label>Prasyarat</Label>
                        <QuillEditor
                            onValueChange={(delta) => setCreateForm((prevState) => ({ ...prevState, prasyarat: delta })) }
                            value={createForm.prasyarat}
                            height="250px"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Konten</Label>
                        <QuillEditor
                            onValueChange={(delta) => setCreateForm((prevState) => ({ ...prevState, konten: delta })) }
                            value={createForm.konten}
                            height="300px"
                        />
                    </div>
                    <Button type="submit" disabled={ createForm.onSubmit || !createForm.laboratorium_id || !createForm.jenis_praktikum_id || !createForm.judul || !createForm.slug || !createForm.deskripsi }>
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
