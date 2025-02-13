import { PageProps } from "@/types";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarUpload } from "@/components/avatar-upload";

export default function AdminPraktikanDetailsPage({ auth, praktikan }: PageProps<{
    praktikan: {
        id: string;
        nama: string;
        username: string;
        jenis_kelamin: string | null;
        avatar: string | null;
    }
}>) {
    const { toast } = useToast();
    type UpdateForm = {
        nama: string;
        username: string;
        jenis_kelamin: string | null;
        onSubmit: boolean;
    };
    const [ updateForm, setUpdateForm ] = useState<UpdateForm>({
        nama: praktikan.nama,
        username: praktikan.username,
        jenis_kelamin: praktikan.jenis_kelamin,
        onSubmit: false
    });
    const [ isOnChange, setIsOnChange ] = useState(false);

    const handleUpdateForm = (key: keyof UpdateForm, value: string | boolean | number) => {
        const payload = {
            [key]: value,
        };

        setUpdateForm((prevState) => {
            const newState = { ...prevState, ...payload };
            const latestState = {
                nama: praktikan.nama,
                username: praktikan.username,
                jenis_kelamin: praktikan.jenis_kelamin,
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
        const { nama, username, jenis_kelamin } = updateForm;
        const updateSchema = z.object({
            nama: z.string({ message: 'Format nama Praktikan tidak valid! '}).min(1, { message: 'Nama Praktikan wajib diisi!' }),
            username: z.string({ message: 'Format NPM tidak valid! '}).min(1, { message: 'NPM wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            nama: nama,
            username: username,
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
        }>(route('praktikan.update'), {
            id: praktikan.id,
            nama: nama,
            username: username,
            jenis_kelamin: jenis_kelamin
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan'] });
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
    const handleUploadAvatar = (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('id', praktikan.id);
        axios.post<{
            message: string;
            avatar_url: string;
        }>(route('praktikan.upload-avatar'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    console.log(praktikan)
    return (
        <>
            <AdminLayout auth={auth}>
                <Head title="Admin - Memperbarui Praktikan" />
                <CardTitle>
                    Detail data Praktikan
                </CardTitle>
                <CardDescription>
                    Menampilkan data praktikan { praktikan.nama }
                </CardDescription>
                <AvatarUpload avatarSrc={praktikan.avatar ? `/storage/praktikan/${praktikan.avatar}` : undefined} onUpload={handleUploadAvatar} />
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Praktikan</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                onChange={ (event) => handleUpdateForm('nama', event.target.value) }
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">NPM Praktikan</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="06.20xx.1.xxxx"
                                value={ updateForm.username }
                                onChange={ (event) => handleUpdateForm('username', event.target.value) }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">Jenis kelamin</Label>
                            <Select value={updateForm.jenis_kelamin ?? ''} onValueChange={(val) => handleUpdateForm('jenis_kelamin', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih salah satu.." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.username || !isOnChange }>
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
