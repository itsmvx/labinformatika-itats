import { router } from "@inertiajs/react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export type PaginationData<T> = {
    current_page: number
    data: T
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
}

interface LaravelPaginationProps<T> {
    pagination: PaginationData<T>
}

export function LaravelPagination<T>({ pagination }: LaravelPaginationProps<T>) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url)
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        size="sm"
                        href={pagination.prev_page_url || "#"}
                        onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(pagination.prev_page_url)
                        }}
                        className={pagination.prev_page_url ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                        aria-disabled={!pagination.prev_page_url}
                    />
                </PaginationItem>

                {pagination.links.slice(1, -1).map((link, index) => (
                    <PaginationItem key={index}>
                        {link.url ? (
                            <PaginationLink
                                href={link.url}
                                size="sm"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(link.url)
                                }}
                                isActive={link.active}
                            >
                                {link.label}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        size="sm"
                        href={pagination.next_page_url || "#"}
                        onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(pagination.next_page_url)
                        }}
                        className={pagination.next_page_url ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                        aria-disabled={!pagination.next_page_url}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

