import type { Client } from '@/models/client';
import type {
    CalculateFamilyInformationForm,
    CalculateFormData,
    RegimePeriod,
} from '../types/calculate';
import { BASE_REGIME_TYPES } from './regimeTypes';

export const createBaseRegimePeriods = (): RegimePeriod[] =>
    BASE_REGIME_TYPES.map((regimeType) => ({
        regime_type: regimeType.value,
        regime_name: regimeType.label,
        contribution_start_date: null,
        contribution_end_date: null,
        uma_value_year : 0,
        time: 0,
        integrated_balance : 0,
        is_fixed: true,
    }));

export const createFamilyInformationDefaults = (
    selectedClient: Client | null,
): CalculateFamilyInformationForm => {
    const familyInformation = selectedClient?.family_information;

    return {
        has_spouse: familyInformation
            ? String(Number(familyInformation.has_spouse))
            : '',
        minor_or_student_children_count:
            familyInformation?.minor_or_student_children_count === undefined
                ? ''
                : String(familyInformation.minor_or_student_children_count),
        parents_count:
            familyInformation?.parents_count === undefined
                ? ''
                : familyInformation.parents_count,
    };
};

export const createCalculateFormDefaults = (
    selectedClient: Client | null,
): CalculateFormData => ({
    client_id: selectedClient?.id ?? null,
    client: {
        name: '',
        last_name: '',
        phone: '',
        email: '',
        curp: '',
        birthdate: '',
        nss: '',
        regime_end_date: '',
        unemployment_assistance_discounted_weeks: '',
        notes: '',
    },
    family_information: createFamilyInformationDefaults(selectedClient),
    regime_periods: createBaseRegimePeriods(),
    basicAmountPercentage: '',
    annualBasicAmountIncreasePercentage: '',
    cesantiaEdadAvanzada: '',
});
