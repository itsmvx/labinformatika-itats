import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import Typewriter from "@/components/typewriter";
import { Toaster } from "@/components/ui/toaster";

const registerSchema = z.object({
    nama: z.string({ message: 'Nama wajib diisi!' })
        .min(3, "Nama wajib diisi! minimal 3 karakter")
        .max(50, "Nama terlalu panjang"),

    npm: z.string({ message: 'NPM wajib diisi!' })
        .min(3, "NPM wajib diisi! dengan format yang ditentukan")
        .regex(/^(\d{2})\.(\d{4})\.(\d{1})\.(\d{5,})$/, {
            message: "Format NPM tidak valid. Harus sesuai dengan format XX.XXXX.X.XXXXX",
        }),

    password: z.string({ message: 'Password wajib diisi!' })
        .min(6, "Password minimal 6 karakter")
        .max(100, "Password terlalu panjang"),
});

export default function PraktikanRegistrationPage() {
    const { toast } = useToast();
    const formInit = {
        nama: '',
        npm: '',
        password: '',
        onsubmit: false,
        onSuccess: false,
        onError: false,
        errMsg: ''
    };
    const [ form, setForm ] = useState(formInit);
    const [ passwordVisible, setPasswordVisible ] = useState(false);

    const handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
            onError: false,
            errMsg: ''
        }));
    };
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nama, npm, password } = form;
        setForm((prev) => ({ ...prev, onsubmit: true }));
        const loginValidation = registerSchema.safeParse({
            nama: nama,
            npm: npm,
            password: password,
        });

        if (!loginValidation.success) {
            setForm((prevState) => ({
                ...prevState,
                onsubmit: false,
                onError: true,
                errMsg: loginValidation.error.issues[0].message
            }));
            return;
        }

        axios.post(route('praktikan.create'), {
            nama: nama,
            username: npm,
            password: password,
        })
            .then(() => {
                setForm((prevState) => ({ ...prevState, onsubmit: false, onSuccess: true }));
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Sukses!",
                    description: "Berhasil membuat Akun!",
                });
                axios.post(route('auth.praktikan'), {
                    username: npm,
                    password: password
                })
                    .then(() => {
                        router.visit(route('praktikan.dashboard'), { replace: true });
                    })
                    .catch(() => {
                        toast({
                            variant: "destructive",
                            title: "Gagal memproses Auto-Login",
                            description: 'Mohon coba login seperti biasanya..',
                        });
                        setTimeout(() => {
                            router.visit(route('praktikan.login'), { replace: true });
                        }, 1000);
                    })
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Server gagal memproses permintaan!';
                setForm((prevState) => ({
                    ...prevState,
                    onsubmit: false,
                    onError: (err instanceof AxiosError && err.status !== 500),
                    errMsg: errMsg
                }));
            });

    };
    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };
    const paragraphs = [
        "Selamat datang di website Jarkom Jaya!🫠",
        "Website ini masih dalam tahap pengembangan, jadi setiap masukanmu akan sangat membantu untuk pengembangan website ini!🥶",
        "Jangan ragu untuk menyampaikan masukan dan saran untuk membantu pengembangan website ini👌",
        "...",
        "Vanity of Vanities..",
        "Everything is Vain."
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-700 via-cyan-400 to-zinc-400">
                <form className="max-w-md w-full" onSubmit={ handleFormSubmit }>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-700">Buat Akun</CardTitle>
                            <CardDescription>Mendaftar untuk mengakses layanan tersedia</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3.5">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Nama</Label>
                                    <Input
                                        id="nama"
                                        name="nama"
                                        type="text"
                                        placeholder="Nama"
                                        value={ form.nama }
                                        onChange={ handleFormInput }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="username">NPM</Label>
                                    <Input
                                        id="npm"
                                        name="npm"
                                        type="text"
                                        placeholder="06.20xx.x.xxxx"
                                        value={ form.npm }
                                        onChange={ handleFormInput }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={ passwordVisible ? "text" : "password" }
                                            placeholder="******"
                                            value={ form.password }
                                            onChange={ handleFormInput }
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={ togglePasswordVisibility }
                                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                                        >
                                            { passwordVisible ? (
                                                <EyeOff className="w-5 h-5"/>
                                            ) : (
                                                <Eye className="w-5 h-5"/>
                                            ) }
                                        </button>
                                    </div>
                                </div>
                                <div className="!-mb-4 flex flex-row gap-1 justify-end text-sm">
                                    <p>Sudah punya akun?</p>
                                    <Link href={ route('praktikan.login') }
                                          className="font-semibold underline-offset-2 hover:underline">
                                        Loginkan!
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3 pb-6 flex flex-col gap-2.5">
                            <Button
                                type="submit"
                                className="w-full bg-slate-700 hover:bg-slate-700/90 text-white"
                                disabled={
                                    !form.nama || !form.npm || !form.password || form.onsubmit || form.onError || form.onSuccess
                                }
                            >
                                { form.onsubmit
                                    ? "Memproses..."
                                    : form.onSuccess
                                        ? "Memproses Login.."
                                        : "Buat Akun"
                                }
                            </Button>
                            <p
                                className={ `h-6 text-sm text-red-600 font-medium ${
                                    form.onError && form.errMsg
                                        ? "opacity-100"
                                        : "opacity-0"
                                }` }
                            >
                                { form.errMsg }
                            </p>
                        </CardFooter>
                    </Card>
                </form>
            </div>

            <div className="hidden md:flex flex-1 bg-gradient-to-bl from-fuchsia-700 via-cyan-400 to-zinc-400 items-center justify-center p-2">
                <div className="relative w-full h-full max-w-lg max-h-lg">
                    <Typewriter
                        paragraphs={ paragraphs }
                        speed={ 75 }
                        pauseBetweenParagraphs={1500}
                    />
                    {/*<img*/}
                    {/*    src={ NoaPP }*/}
                    {/*    alt="Decorative image"*/}
                    {/*    className="object-contain sepia"*/}
                    {/*/>*/}
                </div>
            </div>
            <Toaster/>
        </div>
    )
}

