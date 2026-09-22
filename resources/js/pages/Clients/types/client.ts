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

export interface CreatedClientResponse {
    data: {
        id: number;
        name: string;
        last_name: string | null;
        phone: string | null;
        email: string | null;
        curp: string;
        birthdate: string;
        nss: string;
        regime_end_date: string | null;
        unemployment_assistance_discounted_weeks: number;
        notes: string | null;
    };
}
