import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronsDown, SquareArrowOutUpRight, } from 'lucide-react'
import { Head, Link } from "@inertiajs/react";
import { LandingPrak, LandingPrak2, LandingPrak3, LogoJarkom } from "@/lib/StaticImagesLib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Aslab_DATA } from "@/lib/StaticDataLib";
import { Footer } from "@/components/app-footer";
import { AppLayout } from "@/layouts/AppLayout";
import { PageProps } from "@/types";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { useRef, useState, useEffect } from "react";

export default function LandingPage({ auth }: PageProps) {
    const landingImages = [ LandingPrak, LandingPrak2, LandingPrak3 ];
    const featuresRef = useRef<HTMLDivElement | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % landingImages.length)
        }, 5000);

        return () => clearInterval(interval)
    }, [landingImages.length]);


    return (
        <>
            <AppLayout>
                <Head title="Welcome" />
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
                                            Makasih udah mau visit bang, welkam and keep chilling always Looksmaxxing
                                        </p>
                                    </div>
                                    <div className="space-x-4">
                                        <Button className="tracking-wider" onClick={ () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' }) }>
                                            LESGOO
                                            <ChevronsDown className="ml-2 h-4 w-4" />
                                        </Button>
                                        <Button variant="outline">Tentang Kami</Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="features" className="w-full py-12 px-4 bg-muted">
                            <Card className="pt-8 pb-4" ref={ featuresRef } >
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                                    Praktikum
                                </h2>
                                <Tabs defaultValue="Sistem Operasi" className="w-full">
                                    <TabsList className="mx-auto max-w-xs md:max-w-lg grid grid-cols-2 my-4">
                                        <TabsTrigger value="Sistem Operasi">Sistem Operasi</TabsTrigger>
                                        <TabsTrigger value="Jaringan Komputer">Jaringan Komputer</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="Sistem Operasi" className="overflow-hidden">
                                        <div
                                            className="p-6 flex flex-col md:flex-row animate-in slide-in-from-top-5 md:slide-in-from-top-0 md:slide-in-from-left-6 fade-in-10 duration-700">
                                            <div
                                                className="mx-auto lg:mx-0 w-auto md:w-96 relative order-first lg:order-none">
                                                <img
                                                    src={ LogoJarkom }
                                                    alt="mahiru-standart"
                                                    width={ 300 }
                                                    className="rounded-lg aspect-square object-cover object-center"
                                                />
                                            </div>
                                            <div className="w-full text-left lg:text-right">
                                                <CardHeader>
                                                    <CardTitle>Praktikum Sistem Operasi</CardTitle>
                                                    <CardDescription>
                                                        Praktikum semester ganjil yang tersedia untuk mahasiswa mulai dari
                                                        semester 3
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="h-44">
                                                    <p className="text-left md:text-justify text-ellipsis line-clamp-6">
                                                        Lorem ipsum odor amet, consectetuer adipiscing elit. Hac magnis
                                                        tempor aenean vestibulum platea. Consequat posuere ultrices cursus
                                                        dis ullamcorper habitant nec fermentum. Fermentum iaculis sem nullam
                                                        inceptos metus odio lorem malesuada. Sit rutrum sociosqu fames
                                                        curabitur nostra iaculis id. Porttitor felis ultricies primis dolor
                                                        tempor nostra. Ac neque phasellus ut nulla dictum elementum. Quam
                                                        elit etiam magnis libero laoreet eleifend facilisi suspendisse.
                                                        Facilisis diam facilisi pulvinar cras tortor risus habitant.
                                                        Ultrices volutpat potenti fusce venenatis libero gravida sagittis
                                                        aenean. Eu purus imperdiet nibh conubia nunc pharetra odio. Sed
                                                        sapien facilisis platea at tristique vestibulum est leo. Lacinia ac
                                                        ac penatibus ullamcorper porttitor ultricies. Ex mauris commodo
                                                        massa dui neque. Justo cras tincidunt lorem etiam accumsan sapien
                                                        blandit. Metus id maximus lorem, malesuada pharetra nulla taciti
                                                        semper.
                                                        Odio mauris class conubia nam eu. Mollis mus natoque curabitur,
                                                        malesuada inceptos fermentum quam eleifend porttitor? Ad finibus
                                                        aliquam, velit sapien parturient orci nisl. Aenean fringilla
                                                        ultricies adipiscing accumsan curae potenti sagittis vehicula. Ante
                                                        libero nam, vulputate cubilia fusce litora donec. Rutrum posuere
                                                        lorem inceptos tellus id vel dis. Class molestie risus eleifend
                                                        tortor; litora nibh condimentum torquent. Nec adipiscing quam class
                                                        suspendisse cubilia tortor. Egestas id viverra amet vehicula dapibus
                                                        dui.
                                                    </p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button className="ml-0 md:ml-auto">
                                                        Informasi Praktikum <SquareArrowOutUpRight/>
                                                    </Button>
                                                </CardFooter>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="Jaringan Komputer" className="overflow-hidden">
                                        <div
                                            className="p-6 flex flex-col md:flex-row animate-in slide-in-from-bottom-5 md:slide-in-from-bottom-0 md:slide-in-from-right-6 fade-in-10 duration-700">
                                            <div className="w-full">
                                                <CardHeader>
                                                    <CardTitle>Praktikum Jaringan Komputer</CardTitle>
                                                    <CardDescription>
                                                        Praktikum semester genap yang tersedia untuk mahasiswa mulai dari
                                                        semester 4
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="h-44">
                                                    <p className="text-left md:text-justify text-ellipsis line-clamp-6">
                                                        Praktikum yang membahas secara praktis berbagai hal yang berhubungan dengan Pengenalan jaringan komputer, diantaranya seperti TCP/IP, IPv4, IPv6, Cisco Router, Routing, GNS3, DHCP, SSH, DNS, Webserver, Mail server, dan Proxy Server. Praktikum ini diharapkan dapat membantu para pemula atau newbies untuk mengenal dan menuntun arti dari sebuah ilmu jaringan komputer itu sendiri.
                                                    </p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button>
                                                        Informasi Praktikum <SquareArrowOutUpRight/>
                                                    </Button>
                                                </CardFooter>
                                            </div>
                                            <div
                                                className="mx-auto lg:mx-0 w-auto md:w-96 relative order-first lg:order-none">
                                                <img
                                                    src={ LogoJarkom }
                                                    alt="mahiru-standart"
                                                    width={ 300 }
                                                    className="mx-auto rounded-lg aspect-square object-cover object-center"
                                                />
                                            </div>
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
                                    opts={ {
                                        align: "start",
                                    } }
                                    className="w-72 md:w-full md:max-w-xl lg:max-w-4xl xl:max-w-6xl mx-auto"
                                >
                                    <CarouselContent className="mx-auto">
                                        { Aslab_DATA.map((aslab, index) => (
                                            <CarouselItem key={ aslab.id } className="md:basis-1/2 lg:basis-1/3">
                                                <div className="p-1">
                                                    <Card>
                                                        <CardContent className="flex flex-col items-center p-6">
                                                            <div className="aspect-square relative w-full mb-4">
                                                                <img
                                                                    src={ LogoJarkom }
                                                                    alt={ `image-${ index }` }
                                                                    className="object-cover object-center rounded-md"
                                                                />
                                                            </div>
                                                            <h3 className="h-16 font-semibold text-lg text-center mb-2 line-clamp-2 text-ellipsis">
                                                                { aslab.nama }
                                                            </h3>
                                                            <p className="text-sm text-gray-600 text-center mb-4">
                                                                { aslab.jabatan }
                                                            </p>
                                                            <p className="font-bold text-lg text-center">
                                                                { aslab.npm }
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        )) }
                                    </CarouselContent>
                                    <CarouselPrevious/>
                                    <CarouselNext/>
                                </Carousel>
                            </div>
                        </section>
                        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
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
                    </main>
                    <Footer/>
                </div>
            </AppLayout>
        </>
    );
}
