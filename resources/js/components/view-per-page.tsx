import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { _MyWebConfig } from "@/lib/StaticDataLib";

export const ViewPerPage = ({ className, preserveState }: {
    className?: string;
    preserveState?: boolean;
}) => {
    const [ viewPerPage, setViewPerPage ] = useState(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const viewParam = searchParams.get('view');
        return viewParam ? parseInt(viewParam, 10) : _MyWebConfig.VIEW_PER_PAGE[0];
    });
    const handleSetViewPerPage = (value: number) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (value === _MyWebConfig.VIEW_PER_PAGE[0]) {
            searchParams.delete('view');
        } else {
            searchParams.set('view', String(value));
        }
        setViewPerPage(value);
        searchParams.delete('page');
        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: preserveState ?? true,
            preserveScroll: true,
        });
    };
    return (
        <>
            <div className={ `flex flex-wrap items-center gap-1.5 text-sm ${className ?? ''}` }>
                <p>Menampilkan&nbsp;</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-12 gap-0.5">
                            { viewPerPage }<ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {
                            _MyWebConfig.VIEW_PER_PAGE.map((view, index) => ((
                                <DropdownMenuCheckboxItem
                                    key={ index }
                                    className="capitalize"
                                    checked={ view === viewPerPage }
                                    onCheckedChange={ () => {
                                        handleSetViewPerPage(view)
                                    } }
                                >
                                    { view }
                                </DropdownMenuCheckboxItem>
                            )))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
                <p>Data per Halaman</p>
            </div>
        </>
    );
};
