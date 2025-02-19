import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChevronsDown, SquareArrowOutUpRight, UserCircle2 } from "lucide-react";
import {
    LandingPrak,
    LandingPrak2,
    LandingPrak3,
    LogoJarkom,
} from "@/lib/StaticImagesLib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { AppLayout } from "@/layouts/AppLayout";
import { PageProps } from "@/types";
import { useRef, useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage({
    auth,
    aslabs,
}: PageProps<{
    aslabs: {
        id: string;
        nama: string;
        username: string;
        jabatan: string;
        avatar: string | null;
        laboratorium: {
            id: string;
            nama: string;
        };
    }[];
}>) {
    const landingImages = [LandingPrak, LandingPrak2, LandingPrak3];
    const featuresRef = useRef<HTMLDivElement | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const jmlLandingImages = landingImages.length;
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(
                (prevIndex) => (prevIndex + 1) % jmlLandingImages
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [jmlLandingImages]);

    const PraktikumJarkom = [
        {
            title: "Sistem Operasi",
            description:
                "Praktikum semester ganjil yang tersedia untuk mahasiswa mulai dari semester 3",
            content:
                "Sistem operasi adalah perangkat lunak yang mengelola perangkat keras komputer dan menyediakan layanan bagi program aplikasi. Sistem operasi berfungsi sebagai perantara antara pengguna dan perangkat keras komputer, memungkinkan eksekusi program, manajemen sumber daya, pengelolaan file, serta keamanan sistem. Beberapa sistem operasi populer meliputi Windows, Linux, dan macOS. Dalam praktikum ini, mahasiswa akan belajar konsep dasar sistem operasi seperti manajemen proses, manajemen memori, sistem file, hingga keamanan sistem. Selain itu, mahasiswa juga akan melakukan simulasi penggunaan sistem operasi dalam berbagai skenario praktis.",
            // image: { LogoJarkom },
        },
        {
            title: "Jaringan Komputer",
            description:
                "Praktikum semester genap yang tersedia untuk mahasiswa mulai dari semester 4",
            content:
                "Jaringan komputer adalah kumpulan komputer yang saling terhubung untuk berbagi sumber daya, seperti file, printer, atau koneksi internet. Jaringan komputer terdiri dari berbagai topologi dan jenis jaringan, seperti LAN (Local Area Network), MAN (Metropolitan Area Network), dan WAN (Wide Area Network). Dalam praktikum ini, mahasiswa akan mempelajari dasar-dasar jaringan komputer, model OSI, TCP/IP, pengalamatan IP, subnetting, hingga konfigurasi perangkat jaringan seperti router dan switch. Mahasiswa juga akan melakukan simulasi menggunakan perangkat lunak seperti Cisco Packet Tracer untuk memahami lebih dalam konsep jaringan.",
            // image: { LogoJarkom },
        },
    ];

    const PraktikumRPL = [
        {
            title: "Pemrograman Terstruktur",
            description:
                "Praktikum semester ganjil yang tersedia untuk mahasiswa mulai dari semester 1",
            content:
                "Pemrograman terstruktur adalah paradigma pemrograman yang mengutamakan penggunaan struktur kontrol seperti percabangan dan perulangan. Prinsip dasar dari pemrograman terstruktur adalah modularitas, di mana kode program dibagi menjadi fungsi atau prosedur kecil agar lebih mudah dipahami dan dikelola. Dalam praktikum ini, mahasiswa akan belajar dasar-dasar pemrograman dengan bahasa seperti C atau Python, memahami konsep variabel, tipe data, operator, hingga algoritma dasar seperti sorting dan searching. Selain itu, mahasiswa juga akan diberikan latihan membuat program sederhana untuk memperkuat pemahaman mereka terhadap konsep-konsep pemrograman.",
            // image: "/images/pemrograman-terstruktur.jpg",
        },
        {
            title: "Struktur Data",
            description:
                "Praktikum semester genap yang tersedia untuk mahasiswa mulai dari semester 2",
            content:
                "Struktur data adalah cara penyimpanan dan pengorganisasian data agar dapat digunakan secara efisien. Struktur data yang baik memungkinkan algoritma berjalan lebih cepat dan lebih efisien dalam penggunaan sumber daya. Dalam praktikum ini, mahasiswa akan belajar berbagai jenis struktur data seperti array, linked list, stack, queue, tree, dan graph. Selain itu, mahasiswa akan memahami bagaimana masing-masing struktur data bekerja, kapan harus menggunakannya, serta bagaimana implementasinya dalam bahasa pemrograman seperti C++ atau Java. Mahasiswa juga akan diberikan tugas membuat program yang memanfaatkan struktur data dalam berbagai kasus, seperti manajemen antrean atau pencarian jalur terpendek dalam graf.",
            // image: "/images/struktur-data.jpg",
        },
        {
            title: "Pemrograman Berorientasi Objek",
            description:
                "Praktikum semester ganjil yang tersedia untuk mahasiswa mulai dari semester 3",
            content:
                "Pemrograman berorientasi objek (OOP) adalah paradigma pemrograman yang berfokus pada objek dan interaksinya. OOP memungkinkan pengembangan perangkat lunak yang lebih modular, reusable, dan mudah dikembangkan. Dalam praktikum ini, mahasiswa akan belajar konsep utama dalam OOP seperti kelas, objek, enkapsulasi, pewarisan, dan polimorfisme. Mahasiswa juga akan mempelajari bagaimana menerapkan prinsip-prinsip ini dalam bahasa pemrograman seperti Java atau Python. Praktikum ini mencakup latihan membuat aplikasi berbasis OOP, seperti sistem manajemen perpustakaan atau aplikasi toko online, agar mahasiswa dapat memahami bagaimana OOP diterapkan dalam dunia nyata.",
            // image: "/images/pbo.jpg",
        },
        {
            title: "Basis Data",
            description:
                "Praktikum semester genap yang tersedia untuk mahasiswa mulai dari semester 4",
            content:
                "Basis data adalah kumpulan data yang terorganisir untuk memudahkan akses, pengelolaan, dan pemutakhiran. Dalam dunia teknologi informasi, basis data digunakan untuk menyimpan informasi yang dapat diakses oleh berbagai aplikasi. Dalam praktikum ini, mahasiswa akan belajar dasar-dasar basis data, termasuk perancangan basis data, normalisasi, serta penggunaan bahasa SQL untuk manipulasi data. Mahasiswa juga akan melakukan praktik menggunakan sistem manajemen basis data (DBMS) seperti MySQL atau PostgreSQL. Selain itu, mahasiswa akan diberikan tugas untuk membuat proyek basis data sederhana, seperti sistem manajemen inventaris atau sistem informasi akademik.",
            // image: "/images/basis-data.jpg",
        },
    ];

    return (
        <>
            <Head title="Welcome" />

            <AppLayout auth={auth}>
                <section className="relative flex items-center justify-center w-full min-h-[calc(100vh-3rem)] py-12 md:py-24 lg:py-32 xl:py-48 bg-center bg-cover overflow-hidden">
                    {landingImages.map((image, index) => (
                        <div
                            key={image}
                            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                            style={{
                                opacity: index === currentImageIndex ? 1 : 0,
                                zIndex: index === currentImageIndex ? -10 : -20,
                            }}
                        >
                            <img
                                src={image || "/placeholder.svg"}
                                alt={`Background ${index + 1}`}
                                className="absolute inset-0 object-cover w-full h-full"
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-black/70 -z-10" />
                    <div className="relative z-10 h-full container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-zinc-100">
                                    Laboratorium Jaringan Komputer ITATS
                                </h2>
                                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl font-medium">
                                    Makasih udah mau visit bang, welkam and keep
                                    chilling always Looksmaxxing
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button
                                    className="tracking-wider"
                                    onClick={() =>
                                        featuresRef.current?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                    }
                                >
                                    LESGOO
                                    <ChevronsDown className="ml-2 h-4 w-4" />
                                </Button>
                                <Button variant="outline">Tentang Kami</Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 px-4 bg-muted">
                    <Card className="pt-8 pb-4" ref={featuresRef}>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                            Lab Praktikum
                        </h2>
                        <Tabs
                            defaultValue="Jaringan Komputer"
                            className="w-full"
                        >
                            <TabsList className="mx-auto max-w-xs md:max-w-lg grid grid-cols-2 my-4">
                                <TabsTrigger value="Jaringan Komputer">
                                    Jaringan Komputer
                                </TabsTrigger>
                                <TabsTrigger value="Rekayasa Perangkat Lunak">
                                    Rekayasa Perangkat Lunak
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                value="Jaringan Komputer"
                                className="overflow-hidden"
                            >
                                <div className="w-full px-4 md:px-6">
                                    <Carousel
                                        opts={{ align: "start" }}
                                        className="w-full max-w-[1320px] mx-auto"
                                    >
                                        <CarouselContent>
                                            {PraktikumJarkom.map(
                                                (praktikum, index) => (
                                                    <CarouselItem
                                                        key={index}
                                                        className="md:basis-full"
                                                    >
                                                        <div className="p-6 flex flex-col md:flex-row animate-in slide-in-from-top-5 md:slide-in-from-top-0 md:slide-in-from-left-6 fade-in-10 duration-700">
                                                            <div className="mx-auto lg:mx-0 w-auto md:w-96 relative order-first lg:order-none">
                                                                <img
                                                                    src={
                                                                        LogoJarkom
                                                                    }
                                                                    alt="mahiru-standart"
                                                                    width={300}
                                                                    className="rounded-lg aspect-square object-cover object-center"
                                                                />
                                                            </div>
                                                            <div className="w-full text-left lg:text-right">
                                                                <CardHeader>
                                                                    <CardTitle>
                                                                        {
                                                                            praktikum.title
                                                                        }
                                                                    </CardTitle>
                                                                    <CardDescription>
                                                                        {
                                                                            praktikum.description
                                                                        }
                                                                    </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="h-44">
                                                                    <p className="text-left md:text-justify text-ellipsis line-clamp-6">
                                                                        {
                                                                            praktikum.content
                                                                        }
                                                                    </p>
                                                                </CardContent>
                                                                <CardFooter>
                                                                    <Button className="ml-0 md:ml-auto">
                                                                        Informasi
                                                                        Praktikum{" "}
                                                                        <SquareArrowOutUpRight />
                                                                    </Button>
                                                                </CardFooter>
                                                            </div>
                                                        </div>
                                                    </CarouselItem>
                                                )
                                            )}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="Rekayasa Perangkat Lunak"
                                className="overflow-hidden"
                            >
                                <div className="w-full px-4 md:px-6">
                                    <Carousel
                                        opts={{ align: "start" }}
                                        className="w-full max-w-[1320px] mx-auto"
                                    >
                                        <CarouselContent>
                                            {PraktikumRPL.map(
                                                (praktikum, index) => (
                                                    <CarouselItem
                                                        key={index}
                                                        className="md:basis-full"
                                                    >
                                                        <div className="p-6 flex flex-col md:flex-row animate-in slide-in-from-bottom-5 md:slide-in-from-bottom-0 md:slide-in-from-right-6 fade-in-10 duration-700">
                                                            <div className="w-full">
                                                                <CardHeader>
                                                                    <CardTitle>
                                                                        {
                                                                            praktikum.title
                                                                        }
                                                                    </CardTitle>
                                                                    <CardDescription>
                                                                        {
                                                                            praktikum.description
                                                                        }
                                                                    </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="h-44">
                                                                    <p className="text-left md:text-justify text-ellipsis line-clamp-6">
                                                                        {
                                                                            praktikum.content
                                                                        }
                                                                    </p>
                                                                </CardContent>
                                                                <CardFooter>
                                                                    <Button>
                                                                        Informasi
                                                                        Praktikum{" "}
                                                                        <SquareArrowOutUpRight />
                                                                    </Button>
                                                                </CardFooter>
                                                            </div>
                                                            <div className="mx-auto lg:mx-0 w-auto md:w-96 relative order-first lg:order-none">
                                                                <img
                                                                    src={
                                                                        LogoJarkom
                                                                    }
                                                                    alt="mahiru-standart"
                                                                    width={300}
                                                                    className="mx-auto rounded-lg aspect-square object-cover object-center"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CarouselItem>
                                                )
                                            )}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </section>

                <section id="testimonials" className="w-full py-12 px-4">
                    <div className="w-full px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                            Asisten Laboratorium
                        </h2>
                        <Carousel
                            opts={{
                                align: "start",
                            }}
                            className="w-72 md:w-full md:max-w-xl lg:max-w-4xl xl:max-w-6xl mx-auto"
                        >
                            <CarouselContent className="mx-auto">
                                {aslabs.map((aslab) => (
                                    <CarouselItem
                                        key={aslab.id}
                                        className="md:basis-1/2 lg:basis-1/3"
                                    >
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex flex-col items-center p-6">
                                                    <div className="aspect-square relative w-full mb-4 content-center">
                                                        {aslab.avatar ? (
                                                            <img
                                                                src={`/storage/aslab/${aslab.avatar}`}
                                                                alt={`avatar-${aslab.nama}`}
                                                                className="object-cover object-center rounded-md"
                                                            />
                                                        ) : (
                                                            <UserCircle2
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                className="mx-auto my-auto text-primary"
                                                                size={100}
                                                            />
                                                        )}
                                                    </div>
                                                    <h3 className="h-16 font-semibold text-lg text-center mb-2 line-clamp-2 text-ellipsis">
                                                        {aslab.nama}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 text-center mb-4">
                                                        {aslab.jabatan}
                                                    </p>
                                                    <p className="font-bold text-lg text-center">
                                                        {aslab.username}
                                                    </p>
                                                    <Badge className="mt-2 font-medium text-base text-center bg-primary">
                                                        {
                                                            aslab.laboratorium
                                                                .nama
                                                        }
                                                    </Badge>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </section>
                <section
                    id="cta"
                    className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
                >
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Siapa maskot Lab.Jarkom?
                            </h2>
                            <p className="mx-auto text-gray-500 md:text-xl">
                                Tentu saja Mahiru Shiina&#10084;&#65039;
                            </p>
                        </div>
                        <Button size="lg">Loginkan</Button>
                    </div>
                </section>
            </AppLayout>
        </>
    );
}
