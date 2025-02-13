import { Head } from "@inertiajs/react";
import { AslabLayout } from "@/layouts/AslabLayout";
import { PageProps } from "@/types";

export default function AslabDashboardPage({ auth }: PageProps) {
    return (
        <>
            <Head title="Aslab - Dashboard" />
            <AslabLayout auth={auth}>
                <div>
                    Dashboard Aslab
                </div>
            </AslabLayout>
        </>
    );
}
