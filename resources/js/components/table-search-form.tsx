import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { router } from "@inertiajs/react";

export const TableSearchForm = () => {
    type Search = {
        value: string;
        onFetch: boolean;
        onSearch: boolean;
        result: string;
    };
    const searchParams = new URLSearchParams(window.location.search);
    const [ search, setSearch ] = useState<Search>({
        value: searchParams.get('search') ?? '',
        onFetch: false,
        onSearch: !!searchParams.get('search'),
        result: searchParams.get('search') ?? ''
    });

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { value } = search;

        if (value) {
            searchParams.set('search', search.value);
            searchParams.delete('page');
            router.visit(window.location.pathname + '?' + searchParams.toString(), {
                preserveState: true,
                preserveScroll: true,
                onStart: () => {
                    setSearch((prevState) => ({
                        ...prevState,
                        onFetch: true,
                    }));
                },
                onFinish: () => {
                    setSearch((prevState) => ({
                        ...prevState,
                        result: value,
                        onFetch: false,
                        onSearch: true
                    }));
                }
            });
        } else {
            searchParams.delete('search');
            router.visit(window.location.pathname + '?' + searchParams.toString(), {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setSearch((prevState) => ({
                        ...prevState,
                        input: '',
                        result: '',
                        onSearch: false
                    }));
                }
            });
        }
    };
    const handleCancelSearch = () => {
        searchParams.delete('search');
        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setSearch((prevState) => ({
                    ...prevState,
                    value: '',
                    onFetch: false,
                    onSearch: false,
                    result: ''
                }));
            }
        });
    };

    return (
        <>
            <div className="w-full lg:max-w-sm py-4 flex flex-col items-end gap-2.5">
                <form onSubmit={handleFormSubmit} className="w-full flex flex-col lg:flex-row gap-1">
                    <div className="w-full flex flex-row gap-1 justify-end">
                        <Input
                            placeholder={ `Cari....` }
                            value={ search.value }
                            onChange={ (event) => {
                                setSearch((prevState) => ({
                                    ...prevState,
                                    value: event.target.value
                                }));
                            } }
                            className="w-full sm:max-w-xs md:max-w-md lg:max-w-full"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={ !search.value || search.onFetch || (search.onSearch && !search.value) || search.value === search.result }
                            className="min-w-9 w-min"
                        >
                            {
                                search.onFetch
                                    ? (
                                        <LoaderCircle className="animate-spin" />
                                    )
                                    : (
                                        <Search/>
                                    )
                            }
                        </Button>
                    </div>
                </form>
                <div className={ `text-muted-foreground text-sm min-w-64 min-h-5 ${search.onSearch ? '*:block' : '*:hidden'}` }>
                    <p>
                        Menampilkan hasil pencarian :&nbsp;
                        <span className="font-medium text-gray-600 antialiased">{ search.result }</span>
                    </p>
                    <Button
                        variant="link"
                        className="ml-auto pr-0 text-red-600"
                        onClick={ handleCancelSearch }
                    >
                        Batalkan pencarian
                    </Button>
                </div>
            </div>
        </>
    );
};
