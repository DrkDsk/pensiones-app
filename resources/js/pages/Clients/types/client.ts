export interface ClientFormData {
    name: string;
    last_name: string;
    phone: string;
    email: string;
    curp: string;
    birthdate: string;
    nss: string;
    regime_end_date: string;
    unemployment_assistance_discounted_weeks: string;
    notes: string;
}

export type ClientFormField = keyof ClientFormData;

export interface ClientListItem {
    id: number;
    name: string;
    last_name: string | null;
    phone: string | null;
    email: string | null;
    curp: string;
    birthdate: string | null;
    nss: string;
    regime_end_date: string | null;
    unemployment_assistance_discounted_weeks: number;
    notes: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedClients {
    data: ClientListItem[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
}
