import type { Client } from '@/models/client';
import type {
    BeneficieresData,
    CalculateFormData,
    CalculateFamilyInformationForm,
    FinancingData,
    ProjectionData,
    RegimePeriod,
} from '../types/calculate';
import { BASE_REGIME_TYPES } from './regimeTypes';

export const createBaseRegimePeriods = (): RegimePeriod[] =>
    BASE_REGIME_TYPES.map((regimeType) => ({
        regime_type: regimeType.value,
        regime_name: regimeType.label,
        contribution_start_date: null,
        contribution_end_date: null,
        uma_value_year: 0,
        time: 0,
        integrated_balance: 0,
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

export const createFinancingDefaults = (): FinancingData => ({
    modalidad10CostPercentage: '',
    modalidad40CostPercentage: '',
    modalidad40UmaMultiplier: 25,
    modalidad40AnnualValues: {},
    pagoRetroactivo: 205167,
    modalidad10: 16426.84,
    pagoAyudaDeDesempleo: 93860.61,
    seguroDeVida: 12759.35,
    costoAdicional: 0,
    modalidad40Dates: {
        contribution_end_date: '',
        contribution_start_date: '',
    },
    modalidad10Dates: {
        contribution_end_date: '',
        contribution_start_date: '',
    },
});

export const createProjectionDefaults = (): ProjectionData => ({
    monthlyPayment: 0,
    retirement97Sar92: 0,
    pensionCredit: 0,
});

export const createBeneficieresDefaults = (): BeneficieresData => ({
    basicAmountPercentage: '',
    annualBasicAmountIncreasePercentage: '',
    cesantiaEdadAvanzada: '',
});

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
    financing: createFinancingDefaults(),
    projection: createProjectionDefaults(),
    beneficieres: createBeneficieresDefaults(),
});
