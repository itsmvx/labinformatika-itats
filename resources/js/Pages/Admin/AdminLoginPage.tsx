import { ChangeEvent, FormEvent, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HumpbackWhale, LogoJarkom } from "@/lib/StaticImagesLib";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Head, router } from "@inertiajs/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
    username: z.string({ message: 'Username wajib diisi!' }).min(3, "Username minimal 3 karakter").max(50, "Username terlalu panjang"),
    password: z.string({ message: 'Password wajib diisi!' }).min(6, "Password minimal 6 karakter").max(100, "Password terlalu panjang"),
});
export default function PraktikanLoginPage() {
    const { toast } = useToast();
    const formInit = {
        username: '',
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
        const { username, password } = form;
        setForm((prev) => ({ ...prev, onsubmit: true }));
        const loginValidation = loginSchema.safeParse({
            username: username,
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

        axios.post(route('auth.admin'), {
            username: username,
            password: password,
        })
            .then((res) => {
                setForm((prevState) => ({ ...prevState, onsubmit: false, onSuccess: true }));
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Sukses!",
                    description: res.data.message,
                });
                router.visit(route('admin.dashboard'));
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

    return (
        <>
            <Head title="Login" />
            <div className="relative min-h-screen bg-gradient-to-b from-muted from-70% to-muted-foreground flex items-center justify-center">
                <img
                    src={ HumpbackWhale }
                    alt="humpback-whale"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                <div className="relative z-10 w-full max-w-md m-4">
                    <Card className="w-full max-w-md shadow-md !bg-white !bg-opacity-80">
                        <form onSubmit={ handleFormSubmit }>
                            <CardHeader className="space-y-1 flex flex-col items-center">
                                <img
                                    src={ LogoJarkom }
                                    alt="logo-jarkom"
                                    width={ 140 }
                                    className="mx-auto"
                                />
                                <CardTitle className="text-2xl font-bold text-center">
                                    Labinformatika
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Masuk sebagai Admin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="username"
                                        value={ form.username }
                                        onChange={ handleFormInput }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={ passwordVisible ? "text" : "password" }
                                            placeholder="Password"
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
                            </CardContent>
                            <CardFooter className="pt-3 pb-8 flex flex-col gap-2.5">
                                <Button
                                    className="w-full"
                                    type="submit"
                                    disabled={
                                        form.onsubmit || form.onError || form.onSuccess
                                    }
                                >
                                    {form.onsubmit
                                        ? "Memuat..."
                                        : form.onSuccess
                                            ? "Berhasil"
                                            : "Masuk"}
                                </Button>
                                <p
                                    className={`h-6 text-sm text-red-600 font-medium ${
                                        form.onError && form.errMsg
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                >
                                    {form.errMsg}
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
