import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Home, LogIn } from 'lucide-react'
import { Link, router } from "@inertiajs/react";

export default function ErrorPage({ status }: { status: number }) {
    const title = {
        500: '500: Server Error',
        503: '503: Layanan Tidak tersedia',
        404: '404: Page Not Found',
        403: '403: Forbidden',
        401: '401: Tidak Diizinkan',
    }[status] || 'An Error Occurred';

    const description = {
        503: 'Oops! Maaf kami sedang melakukan perbaikan. Kembali lagi nanti ya',
        500: 'Oops! Suatu error terjadi di Server. Coba lagi ya',
        404: 'Maaf, Halaman yang kamu cari tidak ditemukan',
        403: 'Walawee.. Kamu seharusnya tidak disini',
        401: 'Whoops.. Kamu perlu autentikasi untuk mengakses halaman ini'
    }[status] || 'We apologize for the inconvenience. Please try again later.';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
           <div className="text-center space-y-6 max-w-md">
                <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                <p className="text-lg text-muted-foreground">{description}</p>
                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-1 justify-center">
                    <Button className="bg-red-600/80 hover:bg-red-600" onClick={() => window.history.back()}>
                        Kembali <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button asChild className="bg-blue-600/80 hover:bg-blue-600 order-last sm:order-none">
                        <Link href="/"><Home className="mr-2 h-4 w-4" />
                            Halaman Utama
                        </Link>
                    </Button>
                    { [401,403].includes(status) && (
                        <Button className="bg-green-600/80 hover:bg-green-600" onClick={() => router.visit(route('praktikan.login'), { replace: true })}>
                            Login <LogIn className="h-4 w-4" />
                        </Button>
                    ) }
                </div>
            </div>
        </div>
    );
}

