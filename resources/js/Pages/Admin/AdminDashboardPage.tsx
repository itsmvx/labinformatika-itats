import { AdminLayout } from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpenText, FolderSync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MahiruCirle } from "@/lib/StaticImagesLib";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function AdminDashboardPage({ auth, aslabs, kuis }: PageProps<{
    aslabs: {
        nama: string;
        username: string;
        jabatan: string;
    }[];
    kuis: {
        id: string;
        nama: string;
        praktikum: {
            id: string;
            nama: string;
        };
    }[];
}>) {
    const chartDataPraktikum = [
        { praktikum: "Sistem Operasi XXXVI", lulus: 90, gugur: 7 },
        { praktikum: "Jaringan Komputer XXXVI", lulus: 83, gugur: 2 },
        { praktikum: "Sistem Operasi XXXVII", lulus: 85, gugur: 21 },
        { praktikum: "Jaringan Komputer XXXVII", lulus: 93, gugur: 3 },
        { praktikum: "Sistem Operasi XXXVIII", lulus: 80, gugur: 8 },
        { praktikum: "Jaringan Komputer XXXVIII", lulus: 0, gugur: 0 },
    ];

    const chartConfig = {
        lulus: {
            label: "Lulus",
            color: "#2563eb",
        },
        gugur: {
            label: "Gugur",
            color: "#f87171",
        },
    } satisfies ChartConfig;

    return (
        <>
            <AdminLayout auth={auth}>
                <Head title="Admin - Dashboard" />
                <div className="flex flex-col lg:flex-row gap-3">
                    <Card className="flex flex-col w-full lg:w-2/3 lg:min-w-[26rem] h-[27rem] lg:h-[32rem] overflow-y-auto rounded">
                        <CardHeader>
                            <CardTitle>Jadwal Kuis</CardTitle>
                            <CardDescription>
                                { kuis.length } Kuis mendatang
                            </CardDescription>
                        </CardHeader>
                        <ScrollArea>
                            <CardContent className="grid gap-4">
                                {
                                    kuis.length > 0 ? kuis.map((kuis, index) => ((
                                        <div key={index} className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
                                            <BookOpenText/>
                                            <div className="space-y-1 flex-1 truncate overflow-hidden">
                                                <p className="text-sm font-medium leading-none">
                                                    { kuis.nama }
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    { kuis.praktikum.nama }
                                                </p>
                                            </div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <FolderSync/>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Detail Kuis
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ))) : (
                                        <div
                                            className="flex items-center space-x-4 rounded-md border p-3 truncate [&_p]:truncate">
                                            <p className="text-sm font-medium text-muted-foreground/80">
                                                Tidak ada kuis mendatang
                                            </p>
                                        </div>
                                    )
                                }
                            </CardContent>
                        </ScrollArea>
                        <CardFooter className="mt-auto">
                            <Button className="w-full">
                                Manajemen Kuis <ArrowRight/>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="flex flex-col w-full lg:w-1/3 lg:min-w-[23rem] h-[27rem] lg:h-[32rem] overflow-y-auto rounded">
                        <CardHeader>
                            <CardTitle>Aslab Aktif</CardTitle>
                            <CardDescription>
                                { aslabs.length } Aslab aktif saat ini
                            </CardDescription>
                        </CardHeader>
                        <ScrollArea>
                            <CardContent className="grid gap-4">
                                {
                                    aslabs.map((aslab, index) => ((
                                        <div key={ index }
                                             className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
                                            <div className="h-7">
                                                <img src={ MahiruCirle } alt="profile" width={ 30 }/>
                                            </div>
                                            <div className="space-y-1 flex-1 truncate overflow-hidden">
                                                <p className="text-sm font-medium">
                                                    { aslab.nama }
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    { aslab.username }
                                                </p>
                                                <p className="!-mt-0.5 text-sm text-muted-foreground">
                                                    { aslab.jabatan }
                                                </p>
                                            </div>
                                        </div>
                                    )))
                                }
                            </CardContent>
                        </ScrollArea>
                        <CardFooter className="mt-auto">
                            <Button className="w-full" onClick={() => router.visit(route('admin.aslab.index'))}>
                                Manajemen Aslab <ArrowRight/>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-3">
                    <Card className="p-3 content-center w-full lg:w-2/3 lg:min-w-[26rem] min-h-80 lg:min-h-[30rem] rounded">
                        <ScrollArea>
                            <CardHeader>
                                <CardTitle>Statistik Praktikum terbaru</CardTitle>
                                <CardDescription>
                                    Data kelulusan { chartDataPraktikum.length } praktikum terbaru
                                </CardDescription>
                            </CardHeader>
                            <ChartContainer config={ chartConfig } className="min-h-[200px] w-80 md:w-[38rem] md:min-w-96 lg:w-[38rem] mx-auto">
                                <BarChart accessibilityLayer data={ chartDataPraktikum }>
                                    <CartesianGrid vertical={ false }/>
                                    <XAxis
                                        dataKey="praktikum"
                                        tickLine={ false }
                                        tickMargin={ 10 }
                                        axisLine={ false }
                                        tickFormatter={(value) => {
                                            const words = value.split(" ");
                                            const initials = words[0][0] + words[1][0];
                                            return `${initials}-${words.slice(-1)[0]}`;
                                        }}
                                    />
                                    <ChartTooltip content={ <ChartTooltipContent/> }/>
                                    <ChartLegend content={ <ChartLegendContent/> }/>
                                    <Bar dataKey="lulus" fill="var(--color-lulus)" radius={ 4 }/>
                                    <Bar dataKey="gugur" fill="var(--color-gugur)" radius={ 4 }/>
                                </BarChart>
                            </ChartContainer>
                        </ScrollArea>
                    </Card>
                    <Card className="flex flex-col w-full lg:w-1/3 lg:min-w-[23rem] h-[30rem] overflow-y-auto rounded">
                        <ScrollArea>
                            <CardHeader>
                                <CardTitle>Aslab Aktif (SARAN KONTEN?)</CardTitle>
                                <CardDescription>
                                    { aslabs.length } Aslab aktif saat ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {
                                    aslabs.map((aslab, index) => ((
                                        <div key={index} className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
                                            <div className="h-7">
                                                <img src={ MahiruCirle } alt="profile" width={ 30 }/>
                                            </div>
                                            <div className="space-y-1 flex-1 truncate overflow-hidden">
                                                <p className="text-sm font-medium leading-none">
                                                    { aslab.nama }
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    { aslab.username }
                                                </p>
                                            </div>
                                        </div>
                                    )))
                                }
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button className="w-full">
                                    Manajemen Aslab <ArrowRight/>
                                </Button>
                            </CardFooter>
                        </ScrollArea>
                    </Card>
                </div>
            </AdminLayout>
        </>
    )
}
