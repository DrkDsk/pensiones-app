export interface ClientFamilyInformation {
    has_spouse: boolean;
    minor_or_student_children_count: number;
    parents_count: number;
}

export interface Client {
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
    family_information: ClientFamilyInformation | null;
}
