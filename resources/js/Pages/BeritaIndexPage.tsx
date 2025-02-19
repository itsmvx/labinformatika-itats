import { AppLayout } from "@/layouts/AppLayout";
import { PageProps, PaginationData } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Head, Link } from "@inertiajs/react";
import { SquareArrowOutUpRight } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type Berita = {
    id: string;
    slug: string;
    judul: string;
    deskripsi: string;
    updated_at: string | null;
    admin: {
        id: string;
        nama: string;
    } | null;
};

export default function BeritaIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Berita[]>;
}>) {

    return (
        <>
            <Head title="Berita" />
            <AppLayout auth={auth}>
                <header className="bg-primary text-primary-foreground py-4 px-5">
                    <Link href={ route('berita.index') } className="text-2xl font-bold">Berita Lab. Informatika ITATS</Link>
                </header>
                { pagination.data.length > 0
                    ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 py-5">
                            { pagination.data.map((berita) => ((
                                <Card key={berita.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-lg h-16 line-clamp-2 text-ellipsis">{berita.judul}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-36">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            { berita.updated_at ? format(berita.updated_at, 'PPPp', { locale: localeId }) : ''}
                                            <span>, { berita.admin?.nama ?? '' }</span>
                                        </p>
                                        <p className="text-sm line-clamp-4">{berita.deskripsi}</p>
                                    </CardContent>
                                    <CardFooter className="mt-auto">
                                        <Button asChild>
                                            <Link href={`/berita/${berita.slug ?? berita.id}`}>Selengkapnya <SquareArrowOutUpRight /></Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )))}
                        </div>
                    ) : (
                        <div className="w-full min-h-72 flex items-center justify-center text-muted-foreground text-sm">
                            <p>Belum ada berita tersedia..</p>
                        </div>
                    ) }
            </AppLayout>
        </>
    )
}
