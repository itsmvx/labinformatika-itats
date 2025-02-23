import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Eye, EyeOff, Loader2, LoaderCircle } from "lucide-react";
import { Head, Link, router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster";
import { LogoLogin } from "@/lib/StaticImagesLib";
import { Stepper } from "@/components/ui/stepper";
import { CustomSeparator } from "@/components/custom-separator";
import { capitalizeWords } from "@/lib/utils";
import { AvatarUpload } from "@/components/avatar-upload";
import { Progress } from "@/components/ui/progress";
import { HollowPurple } from "@/lib/StaticLib";
import { motion } from "framer-motion";

const NPMRegex: RegExp = /^(\d{2})\.(\d{4})\.(\d{1})\.(\d{5,})$/;

const registerSchema = z.object({
    nama: z.string({ message: 'Nama wajib diisi!' })
        .min(3, "Nama wajib diisi! minimal 3 karakter")
        .max(50, "Nama terlalu panjang"),

    npm: z.string({ message: 'NPM wajib diisi!' })
        .min(3, "NPM wajib diisi! dengan format yang ditentukan")
        .regex(NPMRegex, {
            message: "Format NPM tidak valid. Harus sesuai dengan format XX.XXXX.X.XXXXX",
        }),

    password: z.string({ message: 'Password wajib diisi!' })
        .min(6, "Password minimal 6 karakter")
        .max(100, "Password terlalu panjang"),
});

export default function PraktikanRegistrationPage() {
    const { toast } = useToast();

    type VerifyForm = {
        npm: string;
        onSubmit: boolean;
        onSuccess: boolean;
        onError: boolean;
        errMsg: string;
    };
    type CreateForm = {
        avatar: File | null;
        nama: string;
        npm: string;
        password: string;
        repeatPassword: string;
        onSubmit: boolean;
        onSuccess: boolean;
        onError: boolean;
        errMsg: string;
    };
    type SubmitProgress = {
        form: number;
        avatar: number;
    };

    const steps = [
        { title: "Verifikasi NPM", description: "Verifikasi NPM kamu" },
        { title: "Buat Password", description: "Tentukan Password untuk akun-mu" },
        { title: "Unggah foto", description: "Unggah foto Profil" },
        { title: "Konfirmasi Akun", description: "Konfirmasi data akun kamu" },
    ];
    const verifyFormInit: VerifyForm = {
        npm: '',
        onSubmit: false,
        onSuccess: false,
        onError: false,
        errMsg: ''
    };
    const createFormInit: CreateForm = {
        avatar: null,
        nama: '',
        npm: '',
        password: '',
        repeatPassword: '',
        onSubmit: false,
        onSuccess: false,
        onError: false,
        errMsg: ''
    };
    const submitProgressInit: SubmitProgress = {
        form: 0,
        avatar: 0
    };

    const [ step, setStep ] = useState(1);
    const [ verifyForm, setVerifyForm ] = useState<VerifyForm>(verifyFormInit);
    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false);
    const [ submitProgress, setSubmitProgress ] = useState<SubmitProgress>(submitProgressInit);
    const [ showMurasaki, setShowMurasaki ] = useState<boolean>(false);
    const [ showPurple, setShowPurple ] = useState(false);

    const handleVerifyFormInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setVerifyForm((prevState) => ({
            ...prevState,
            [name]: value,
            onError: false,
            errMsg: ''
        }));
    };
    const handleCreateFormInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCreateForm((prevState) => ({
            ...prevState,
            [name]: value,
            onError: false,
            errMsg: ''
        }));
    };
    const handleVerifyFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setVerifyForm((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const { npm } = verifyForm;
        axios.post<{
            message: string;
            data: {
                nama: string;
                npm: string;
            } | null;
            exists: boolean;
        }>(route('api.verify-npm'), {
            npm: npm,
        })
            .then((res) => {
                const resData = res.data.data;
                if (resData === null) {
                    toast({
                        variant: "destructive",
                        title: "Gagal memverifikasi NPM",
                        description: res.data.message,
                    });
                    setVerifyForm((prevState) => ({
                        ...prevState,
                        onError: true,
                        errMsg: res.data.message,
                        onSubmit: false
                    }));
                    return;
                }
                setCreateForm(prevState => ({
                    ...prevState,
                    nama: capitalizeWords(resData.nama),
                    npm: resData.npm,
                }));
                setStep(2);
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Periksa lagi koneksi-mu kawan!';
                toast({
                    variant: "destructive",
                    title: "Gagal memverifikasi NPM",
                    description: errMsg,
                });
                setVerifyForm((prevState) => ({
                    ...prevState,
                    npm: npm,
                }));
            })
    }
    const handleCreateFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nama, npm, password } = createForm;
        setCreateForm((prev) => ({ ...prev, onSubmit: true }));
        const registerSchemaParse = registerSchema.safeParse({
            nama: nama,
            npm: npm,
            password: password,
        });

        if (!registerSchemaParse.success) {
            setCreateForm((prevState) => ({
                ...prevState,
                onSubmit: false,
                onError: true,
                errMsg: registerSchemaParse.error.issues[0].message
            }));
            return;
        }
        try {
            const responseCreate = await axios.post<{
                message: string;
                data: {
                    id: string;
                    nama: string;
                    npm: string;
                }
            }>(route('praktikan.create'), { nama, username: npm, password }, {
                onUploadProgress: (p: AxiosProgressEvent) => {
                    const progress: number = Math.round((p.loaded * 100) / (p.total ?? 100));
                    setSubmitProgress((prevState) => ({
                        ...prevState,
                        form: progress
                    }));
                    console.log('form: ', progress)
                }
            });

            if (createForm.avatar) {
                const formData = new FormData();
                formData.append('avatar', createForm.avatar);
                formData.append('id', responseCreate.data.data.id);

                try {
                    await axios.post(route('praktikan.upload-avatar'), formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (p: AxiosProgressEvent) => {
                            const progress: number = Math.round((p.loaded * 100) / (p.total ?? 100))
                            setSubmitProgress((prevState) => ({
                                ...prevState,
                                avatar: progress
                            }));
                            console.log('avatar: ', progress)
                        }
                    });
                } catch {
                    toast({
                        variant: "destructive",
                        title: "Gagal mengunggah Foto",
                        description: "Coba lagi di menu Profil setelah login",
                    });
                    return router.visit(route('praktikan.login'), { replace: true });
                }
            }

            try {
                await axios.post(route('auth.praktikan'), { username: npm, password });
                setShowMurasaki(true);
                setTimeout(() => {
                    router.visit(route('praktikan.dashboard'), { replace: true });
                }, 3800);
            } catch {
                toast({
                    variant: "destructive",
                    title: "Gagal memproses Auto-Login",
                    description: "Mohon coba login seperti biasanya..",
                });
                router.visit(route('praktikan.login'), { replace: true });
            }
        } catch (err: unknown) {
            const errMsg = err instanceof AxiosError && err.response?.data?.message
                ? err.response.data.message
                : 'Server gagal memproses permintaan!';
            setCreateForm((prevState) => ({ ...prevState, onSubmit: false, onError: true, errMsg }));
        }

    };
    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const handleUploadAvatar = (file: File) => {
        setCreateForm((prevState) => ({
            ...prevState,
            avatar: file
        }));
    };

    useEffect(() => {
        if (showMurasaki) {
            const timer = setTimeout(() => setShowPurple(true), 1900);
            return () => clearTimeout(timer);
        }
    }, [showMurasaki]);

    return (
        <>
            <Head title="Registrasi" />
            <div className="min-h-screen flex flex-col md:flex-row">
                <div className="flex-1 flex flex-col items-center justify-start p-4 sm:px-8 bg-white">
                    <CardHeader className="px-0 self-start">
                        <CardTitle className="text-2xl font-bold text-slate-700">Buat Akun</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground text-left w-full">
                            {step === 1 && "Mendaftar cukup dengan NPM dan foto profil resmi"}
                            {step === 2 && "Unggah foto profil dan tentukan password akun"}
                            {step === 3 && "Okei. Mari konfirmasi data akun kamu"}
                        </CardDescription>
                    </CardHeader>
                    <Stepper
                        steps={steps}
                        currentStep={step}
                        hideDescriptionInSmallBreakpoint={true}
                    />
                    <CustomSeparator
                        text={`Tahap ${step}`}
                        className="my-5 !mb-0"
                        lineClassName="bg-primary/50 h-0.5 w-auto"
                        textClassName="bg-primary/10 rounded-md px-4 py-1 text-primary font-bold border border-primary/30"
                    />
                    <CardContent className="p-0 w-full">
                        {step === 1 && (
                            <form onSubmit={handleVerifyFormSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="npm">NPM</Label>
                                        <Input
                                            id="npm"
                                            name="npm"
                                            type="text"
                                            placeholder="xx.xxxx.x.xxxxx"
                                            value={ verifyForm.npm }
                                            onChange={ handleVerifyFormInput }
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={verifyForm.onSubmit || !verifyForm.npm || !NPMRegex.test(verifyForm.npm) || verifyForm.onError}>
                                        {verifyForm.onSubmit ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sedang memverifikasi...
                                            </>
                                        ) : (
                                            "Verifikasi NPM"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in ease-in duration-750">
                                <CardDescription className="mt-2">
                                    <span className="text-red-600 font-bold text-sm">*</span>Password minimal 6 karakter
                                </CardDescription>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={ passwordVisible ? "text" : "password" }
                                            placeholder="******"
                                            value={ createForm.password }
                                            onChange={ handleCreateFormInput }
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
                                <div className="grid gap-2">
                                    <Label htmlFor="repeatPassword">Konfirmasi Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="repeatPassword"
                                            name="repeatPassword"
                                            type={ passwordVisible ? "text" : "password" }
                                            placeholder="******"
                                            value={ createForm.repeatPassword }
                                            onChange={ handleCreateFormInput }
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
                                <Button
                                    type="button"
                                    className="w-full"
                                    disabled={createForm.password.length < 6 || createForm.repeatPassword.length < 6 || createForm.password !== createForm.repeatPassword}
                                    onClick={() => setStep(3)}
                                >
                                    Lanjutkan
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-1">
                                <CardHeader className="pt-3 pb-0 text-center ">
                                    <CardTitle className="text-xl">
                                        Unggah Foto Profil kamu
                                    </CardTitle>
                                    <CardDescription>
                                        Foto akan digunakan di Kartu Praktikum
                                    </CardDescription>
                                </CardHeader>
                                <AvatarUpload avatarSrc={createForm.avatar ? URL.createObjectURL(createForm.avatar) : undefined} onUpload={handleUploadAvatar} />
                                {createForm.avatar && (
                                    <Button
                                        type="button"
                                        className="w-full animate-in fade-in duration-500 ease-in"
                                        disabled={!createForm.avatar}
                                        onClick={() => setStep(4)}
                                    >
                                        Terlihat bagus😉
                                    </Button>
                                )}
                            </div>
                        )}

                        {(step === 4 && !createForm.onSubmit) && (
                            <form className="w-full space-y-4" onSubmit={ handleCreateFormSubmit }>
                                <div className="w-32 h-32 mx-auto mt-5 border-2 border-muted-foreground/40 rounded-full overflow-hidden">
                                    <img
                                        src={ createForm.avatar ? URL.createObjectURL(createForm.avatar) : undefined }
                                        alt={ createForm.npm }
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="nama">Nama</Label>
                                    <Input
                                        id="nama"
                                        name="nama"
                                        type="text"
                                        placeholder="Nama"
                                        value={ createForm.nama }
                                        onChange={ handleCreateFormInput }
                                        required
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="npm">NPM</Label>
                                    <Input
                                        id="npm"
                                        name="npm"
                                        type="text"
                                        placeholder="xx.xxxx.x.xxxxx"
                                        value={ createForm.npm }
                                        onChange={ handleCreateFormInput }
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        !createForm.nama || !createForm.npm || !createForm.password || createForm.onSubmit || createForm.onError || createForm.onSuccess
                                    }
                                >
                                    Buat Akun
                                </Button>
                            </form>
                        )}

                        {(step === 4 && createForm.onSubmit) && (
                            <div className="mt-3 max-w-lg space-y-3 mx-auto">
                                <CardHeader>
                                    <CardTitle className="text-center text-lg">
                                        Mengirim data ke Server..
                                    </CardTitle>
                                </CardHeader>
                                <div className="grid gap-1">
                                    <Label>Registrasi</Label>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={submitProgress.form}
                                            className="w-full bg-red-600/35 *:bg-red-600"
                                        />
                                        <div className="min-w-24 flex items-center gap-0.5 text-sm font-medium text-red-600">
                                            {submitProgress.form < 100
                                                ? <LoaderCircle size={20} className="animate-spin" />
                                                : <Check size={20} strokeWidth={3.0} />
                                            }
                                            <p>
                                                {submitProgress.form === 0
                                                    ? "Menunggu..."
                                                    : submitProgress.form === 100
                                                        ? "Red"
                                                        : "Mengunggah"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-1">
                                    <Label>Upload Foto</Label>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={submitProgress.avatar}
                                            className="w-full bg-blue-600/35 *:bg-blue-600"
                                        />
                                        <div className="min-w-24 flex items-center gap-0.5 text-sm font-medium text-blue-600">
                                            {submitProgress.avatar < 100
                                                ? <LoaderCircle size={20} className="animate-spin" />
                                                : <Check size={20} strokeWidth={3.0} />
                                            }
                                            <p>
                                                {submitProgress.avatar === 0
                                                    ? "Menunggu..."
                                                    : submitProgress.avatar === 100
                                                        ? "Blue"
                                                        : "Mengunggah"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {showMurasaki && (
                                    <div className="flex gap-0 items-center justify-center font-bold text-lg animate-in fade-in" style={{ animationDuration: '1500ms' }}>
                                        <h6 className="text-red-600">Hol</h6>
                                        <h6 className="text-blue-600">
                                            low
                                            <span className="text-red-600">.</span>
                                            <span className="text-blue-600">.</span>
                                        </h6>
                                    </div>
                                )}
                                {showPurple && (
                                    <h6
                                        className="!-mt-1.5 font-bold text-lg text-center text-purple-700 animate-in fade-in"
                                        style={{ animationDuration: "1500ms" }}
                                    >
                                        PURPLE!
                                    </h6>
                                )}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="mt-auto pb-6 flex flex-col gap-2.5">
                        <p className="text-sm text-muted-foreground text-center w-full">
                            {step === 1 && "Tenang saja, Proses ini lebih cepat daripada seekor kelinci"}
                        </p>
                        {step === 1 && (
                            <div className="!-mb-4 flex flex-row gap-1 justify-end text-sm">
                                <p>Sudah punya akun?</p>
                                <Link href={ route('praktikan.login') }
                                      className="font-semibold underline-offset-2 hover:underline">
                                    Loginkan!
                                </Link>
                            </div>
                        )}
                    </CardFooter>
                </div>

                <div className="hidden lg:flex lg:w-[32rem] xl:w-[35rem] transition-width duration-200 ease-in-out items-center justify-center p-2">
                    <div className="relative w-full h-full max-w-lg max-h-lg content-center">
                        <video
                            src={ HollowPurple }
                            preload="auto"
                            autoPlay
                            muted
                            className={ `${showMurasaki ? 'block' : 'hidden'} mx-auto` }
                        />
                        <img
                            src={LogoLogin}
                            alt="logo-login"
                            className={ `${showMurasaki ? 'hidden' : 'block'}` }
                        />
                    </div>
                </div>
            </div>
            {showMurasaki && (
                <motion.div
                    initial={{ opacity: 0, transformOrigin: "center" }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 1.5, ease: "easeOut" }}
                    className="fixed top-0 left-0 w-screen h-screen bg-white z-50"
                >
                    <motion.div
                        initial={{ opacity: 0, transformOrigin: "center" }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.5, duration: 0.5, ease: "easeOut" }}
                        className="fixed top-0 left-0 w-screen h-screen bg-white z-50 content-center text-center"
                    >
                        <h5 className="text-lg font-medium">
                            Memproses Auto Login
                        </h5>
                        <p>Santai.. ini ngga error kok, cuman males bikin animasi lagi njiR</p>
                    </motion.div>
                </motion.div>
            )}
            <Toaster />
        </>
    );
}

