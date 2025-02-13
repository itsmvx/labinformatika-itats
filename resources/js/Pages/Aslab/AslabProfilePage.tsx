import { AvatarUpload } from "@/components/avatar-upload";
import { PageProps } from "@/types";
import ErrorPage from "@/Pages/ErrorPage";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { AslabLayout } from "@/layouts/AslabLayout";

export default function AslabProfilePage({ auth, aslab }: PageProps<{
    aslab: {
        id: string;
        nama: string;
        username: string;
        avatar: string | null;
        laboratorium: {
            id: string;
            nama: string;
        };
    };
}>) {
    if (!auth.user) {
        return (
            <ErrorPage status={401} />
        );
    }
    const { toast } = useToast();
    const handleUploadAvatar = (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('id', aslab.id);
        axios.post<{
            message: string;
            avatar_url: string;
        }>(route('aslab.upload-avatar'), formData, {
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
                router.reload({ only: ['aslab', 'auth'] });
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


    return (
        <>
            <AslabLayout auth={ auth }>
                <Head title="Aslab - Profil" />
                <CardTitle>
                    Profil Saya
                </CardTitle>
                <CardDescription>
                    Menampilkan data profil Asisten Lab.
                </CardDescription>
                <AvatarUpload avatarSrc={aslab.avatar ? `/storage/aslab/${aslab.avatar}` : undefined} onUpload={handleUploadAvatar} />
                <div className={ cn("grid items-start gap-4") }>
                    <div className="grid gap-2 min-w-80">
                        <Label htmlFor="laboratorium">Laboratorium</Label>
                        <Input
                            type="text"
                            name="laboratorium"
                            id="laboratorium"
                            value={ aslab.laboratorium.nama }
                            className="text-sm cursor-not-allowed"
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Asisten Lab.</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ aslab.nama }
                                className="text-sm cursor-not-allowed"
                                readOnly
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="username">NPM Asisten Lab.</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                value={ aslab.username }
                                className="text-sm cursor-not-allowed"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </AslabLayout>
        </>
    );
}
