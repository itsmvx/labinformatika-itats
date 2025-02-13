export type AuthUser = {
    id: string;
    nama: string;
    avatar: string | null;
    username: string;
    laboratorium_id: string | null;
};
export type AuthRole = 'admin' | 'aslab' | 'dosen' | 'praktikan';

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>, > = T & {
    auth: {
        user: AuthUser | null;
        role: AuthRole | null;
    };
};

export type PaginationData<T> = {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

type JenisKelamin = 'Laki-Laki' | 'Perempuan';
