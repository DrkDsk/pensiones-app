export interface ClientFormData {
    client: {
        name: string;
        last_name: string;
        phone: string;
        email: string;
        curp: string;
        birthdate: string;
        notes: string;
    };
    social_security_information: {
        nss: string;
        regime_end_date: string;
        unemployment_assistance_discounted_weeks: string;
        total_contributed_weeks: string;
    };
}

export type ClientFormField =
    | `client.${keyof ClientFormData['client']}`
    | `social_security_information.${keyof ClientFormData['social_security_information']}`;

export interface ClientListItem {
    id: number;
    name: string;
    last_name: string | null;
    phone: string | null;
    email: string | null;
    curp: string;
    birthdate: string | null;
    social_security_information: {
        nss: string;
        regime_end_date: string | null;
        unemployment_assistance_discounted_weeks: number;
        total_contributed_weeks: number;
    } | null;
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
