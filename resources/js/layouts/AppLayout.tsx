import { useState, useEffect, ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Electro, Glacio, Havoc, LogoJarkom, Spectro } from "@/lib/StaticImagesLib";
import Cookies from "js-cookie";
import { Head, Link } from "@inertiajs/react";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { PageProps } from "@/types";
import { Footer } from "@/components/app-footer";

export const AppLayout = ({ auth, children }: PageProps<{
    children: ReactNode;
}>) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasVisited = Cookies.get("visited");
        if (!hasVisited) {
            setIsOpen(true)
            Cookies.set('visited', 'YRSKA')
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="description" content="Majestic Mahiru Shiina ❤️"/>
                <meta name="author" content="Laboratorium Teknik Informatika ITATS"/>
            </Head>
            <div className="flex flex-col min-h-screen">
                <header className="px-4 lg:px-6 h-14 flex items-center">
                    <Link
                        className="p-2 flex items-center justify-center gap-1.5 font-semibold bg-none hover:bg-muted transition-colors ease-in-out duration-150 rounded-md"
                        href="#"
                    >
                        <img src={ LogoJarkom } alt="logo-jarkom" width={30} className="rounded-full"/>
                        <span className="sr-only">Laboratorium Jaringan Komputer ITATS</span>
                        <p>JARKOM JAYA</p>
                    </Link>
                    <nav className="ml-auto flex gap-4 sm:gap-6">
                        <ProfileDropdown auth={auth} />
                    </nav>
                </header>
                <main className="flex-1">
                    { children }
                </main>
                <Footer />
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bell className="h-6 w-6 text-blue-600" />
                            Selamat Datang di Jarkom Jaya!
                        </DialogTitle>
                        <DialogDescription className="!mt-4 text-gray-900 font-medium">
                            Website ini masih dalam pengembangan, mohon masukan dan sarannya juga untuk pengembangan website ini😁
                            <br/>
                            <br/>
                            Untuk keperluan testing, sudah ada beberapa fitur yang sudah bisa digunakan
                        </DialogDescription>
                    </DialogHeader>
                    <ul className="pb-4 space-y-3">
                        <li className="grid grid-cols-12 gap-1 text-sm text-gray-800">
                            <img
                                src={ Spectro }
                                width={ 25 }
                                alt="spectro"
                                className="col-span-1"
                            />
                            <p className="col-span-11">
                                <strong> Halaman Admin</strong>, fitur yang bisa digunakan yaitu Manajemen Praktikum yang mencakup data Praktikum, Jenis Praktikum, Periode Praktikum, kemudian Manajemen Praktikan yang mencakup Data Praktikan dan Registrasi Praktikan ke Praktikum, dan terakhir, Manajemen Kuis yang mencakup Soal dan Label Soal.
                            </p>
                        </li>
                        <li className="grid grid-cols-12 gap-1 text-sm text-gray-800">
                            <img
                                src={ Havoc }
                                width={ 25 }
                                alt="spectro"
                                className="col-span-1"
                            />
                            <p className="col-span-11">
                                <strong>Halaman Praktikan</strong>, memerlukan autentikasi (login) untuk menggunakan beberapa fitur seperti Profil, dan Registrasi Praktikum
                            </p>
                        </li>
                        <li className="grid grid-cols-12 gap-1 text-sm text-gray-800">
                            <img
                                src={ Glacio }
                                width={ 25 }
                                alt="spectro"
                                className="col-span-1"
                            />
                            <p className="col-span-11">
                                <strong>Halaman Aslab,</strong>, bentar.. masih Malas
                            </p>
                        </li>
                        <li className="grid grid-cols-12 gap-1 text-sm text-gray-800">
                            <img
                                src={ Electro }
                                width={ 40 }
                                alt="spectro"
                                className="col-span-1"
                            />
                            <p className="col-span-11">
                                <strong>Manajemen Nilai Praktikum,</strong>, modar ketimpa JOIN JOIN JOIN
                            </p>
                        </li>
                    </ul>
                    <DialogFooter>
                        <Button onClick={ () => setIsOpen(false) } className="w-full">
                            Oke mint
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
};
