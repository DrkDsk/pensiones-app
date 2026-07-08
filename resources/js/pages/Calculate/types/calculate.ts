import type { InertiaForm } from '@inertiajs/vue3';

export interface CalculateClientForm {
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

export interface CalculateFamilyInformationForm {
    has_spouse: string;
    minor_or_student_children_count: string;
    parents_count: string | number;
}

export type RegimePeriod = {
    id?: string | number;
    regime_type: 'modalidad_10' | 'modalidad_40' | 'custom';
    regime_name: string;
    contribution_start_date: string | null;
    contribution_end_date: string | null;
    time: number;
    uma_value_year : number | null;
    integrated_balance: number | null;
    is_fixed: boolean;
};

export interface CalculateFormData {
    client_id: number | null;
    client: CalculateClientForm;
    family_information: CalculateFamilyInformationForm;
    regime_periods: RegimePeriod[];
}

export type CalculateForm = InertiaForm<CalculateFormData>;

export type ClientStepField =
    | 'client_id'
    | keyof CalculateClientForm
    | keyof CalculateFamilyInformationForm;

export type ClientValidationField = Exclude<
    ClientStepField,
    | 'client_id'
    | 'last_name'
    | 'notes'
    | 'has_spouse'
    | 'minor_or_student_children_count'
    | 'parents_count'
>;

export type ManualClientField =
    | Exclude<
          ClientStepField,
          | 'client_id'
          | 'notes'
          | 'has_spouse'
          | 'minor_or_student_children_count'
          | 'parents_count'
      >
    | 'client_notes';

export type FamilyInformationField =
    | 'has_spouse'
    | 'minor_or_student_children_count'
    | 'parents_count';

export type RegimePeriodField =
    | 'regime_type'
    | 'regime_name'
    | 'contribution_start_date'
    | 'contribution_end_date'
    | 'uma_value_year'
    | 'integrated_balance';

export type RegimePeriodErrors = Partial<Record<RegimePeriodField, string>>;

export type StepErrors = Record<ClientStepField, string> & {
    regime_periods: RegimePeriodErrors[];
};

export interface CalculateStep {
    id: number;
    label: string;
    helper: string;
}
