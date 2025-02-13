import { Separator } from "@/components/ui/separator"
export function Footer() {
    return (
        <footer className="mt-auto w-screen">
            <Separator/>
            <div className="p-2 md:p-4 lg:p-6 md:flex md:items-center md:justify-between">
                <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                        &copy; 2024, Made with love by Laboratorium Jaringan Komputer ITATS.
                    </p>
                </div>
            </div>
        </footer>
    )
}
