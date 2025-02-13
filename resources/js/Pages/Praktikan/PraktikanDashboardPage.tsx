import { Head } from "@inertiajs/react";
import { PraktikanLayout } from "@/layouts/PraktikanLayout";
import { PageProps } from "@/types";

export default function PraktikanDashboardPage({ auth }: PageProps) {
    return (
        <>
            <Head title="Praktikan - Dashboard" />
            <PraktikanLayout auth={auth}>
                <div>
                    Dashboard Praktikan
                </div>
            </PraktikanLayout>
        </>
    );
}
