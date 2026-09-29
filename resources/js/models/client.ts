export interface ClientFamilyInformation {
    has_spouse: boolean;
    minor_or_student_children_count: number;
    parents_count: number;
}

export interface ClientSocialSecurityInformation {
    nss: string;
    regime_end_date: string | null;
    unemployment_assistance_discounted_weeks: number;
    total_contributed_weeks: number;
}

export interface Client {
    id: number;
    name: string;
    last_name: string | null;
    phone: string | null;
    email: string | null;
    curp: string;
    birthdate: string | null;
    notes: string | null;
    social_security_information: ClientSocialSecurityInformation | null;
    family_information: ClientFamilyInformation | null;
}
