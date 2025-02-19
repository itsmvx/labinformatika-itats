import { Head, Link } from "@inertiajs/react";
import { AppLayout } from "@/layouts/AppLayout";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { PageProps } from "@/types";
import { deltaParse, RenderQuillDelta } from "@/components/delta-parse";
import { deltaInit } from "@/lib/StaticDataLib";

export default function BeritaDetailPage({ auth, berita }: PageProps<{
    berita: {
        id: string;
        judul: string;
        deskripsi: string;
        prasyarat: string;
        konten: string;
        updated_at: string | null;
        admin: {
            id: string;
            nama: string;
        } | null;
        jenis_praktikum: {
            id: string;
            nama: string;
        } | null;
        laboratorium: {
            id: string;
            nama: string;
        } | null
    };
}>) {

    console.log(berita);

    const PrasyaratElement = () => {
        const prasyaratDelta = deltaParse(berita.prasyarat);
        return JSON.stringify(prasyaratDelta) !== JSON.stringify(deltaInit) && (
            <div className="space-y-1">
                <h4 className="text-xl font-medium">Prasyarat</h4>
                <RenderQuillDelta
                    delta={prasyaratDelta}
                    className="!justify-start !items-start"
                />
            </div>
        )
    };
    const KontenElement = () => {
        const kontenDelta = deltaParse(berita.konten);
        return JSON.stringify(kontenDelta) !== JSON.stringify(deltaInit) && (
            <div className="space-y-1">
                <RenderQuillDelta
                    delta={kontenDelta}
                    className="!justify-start !items-start"
                />
            </div>
        )
    };
    return (
        <>
            <Head title={ berita.judul }>
                <meta name="description" content={ berita.deskripsi }/>
                <meta name="author" content={ berita.laboratorium?.nama ?? 'Laboratorium Teknik Informatika ITATS' }/>
            </Head>
            <AppLayout auth={ auth }>
                <header className="bg-primary text-primary-foreground py-4 px-5">
                <Link href={ route('berita.index') } className="text-2xl font-bold">Berita Lab. Informatika ITATS</Link>
                </header>
                <div className="space-y-2">
                    <CardHeader>
                        <CardTitle className="text-2xl h-16 line-clamp-2 text-ellipsis">{berita.judul}</CardTitle>
                        <CardDescription>
                            { berita.updated_at ? format(berita.updated_at, 'PPPp', { locale: localeId }) : ''}
                            <span>, { berita.admin?.nama ?? '' }</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 antialiased">
                        <p className="text-start sm:text-justify leading-relaxed tracking-wide">
                            {berita.deskripsi}
                        </p>
                        <PrasyaratElement />
                        <KontenElement />
                    </CardContent>
                </div>
            </AppLayout>
        </>
    );
}
