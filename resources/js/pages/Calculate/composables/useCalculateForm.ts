import { useForm } from '@inertiajs/vue3';
import { computed, reactive } from 'vue';
import type { Client } from '@/models/client';
import calculate from '@/routes/calculate';
import { createCalculateFormDefaults } from '../constants/formDefaults';
import type {
    CalculateFormData,
    ClientStepField,
    StepErrors,
} from '../types/calculate';

const toFiniteNumber = (value: unknown): number | null => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
};

export const createStepErrors = () =>
    reactive<StepErrors>({
        client_id: '',
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
        has_spouse: '',
        minor_or_student_children_count: '',
        parents_count: '',
        regime_periods: [],
    });

const table = [
    [0, 0],
    [13, 0.5],
    [26.1, 1],
];

function searchValueAproxForYearReduced(value: number) {
    let result = 0;

    for (const [minValue, returnValue] of table) {
        if (value >= minValue) {
            result = returnValue;
        } else {
            break;
        }
    }

    return result;
}

export const useCalculateForm = (selectedClient: Client | null) => {

    const form = useForm<CalculateFormData>(
        createCalculateFormDefaults(selectedClient),
    );

    const stepErrors = createStepErrors();

    const average_daily_salary_last_250_weeks = computed(() => {
        const total = form.regime_periods.reduce((sum, period) => {
            const time = toFiniteNumber(period.time);
            const integratedBalance = toFiniteNumber(period.integrated_balance);

            if (time === null || integratedBalance === null) {
                return sum;
            }

            return sum + time * integratedBalance;
        }, 0);

        return Number.isFinite(total) ? total / 5 : 0;
    });

    const contributed_weeks = computed(() => {
        const modalidad40 = form.regime_periods.find(
            (period) => period.regime_type === 'modalidad_40',
        );

        if (!modalidad40) {
            return 0;
        }

        return Number((1293 + modalidad40.time * 52 + 4).toFixed(0));
    })

    const years_recognized = computed(() => {
        const weeksAfter500 = contributed_weeks.value - 500;
        const yearsCompletedAfter500 = Number((weeksAfter500 / 52).toFixed(0));
        const completedWeeksRecognizedAfter500Weeks =
            yearsCompletedAfter500 * 52;
        const weeksReduced =
            weeksAfter500 - completedWeeksRecognizedAfter500Weeks;
        const yearsReduced = searchValueAproxForYearReduced(weeksReduced);

        return yearsReduced + yearsCompletedAfter500;
    })

    const clearStepError = (field: ClientStepField) => {
        stepErrors[field] = '';
    };

    const clearStepErrors = () => {
        Object.keys(stepErrors).forEach((field) => {
            if (field === 'regime_periods') {
                stepErrors.regime_periods = [];

                return;
            }

            stepErrors[field as ClientStepField] = '';
        });
    };

    const clearClientFields = () => {
        form.client.name = '';
        form.client.last_name = '';
        form.client.phone = '';
        form.client.email = '';
        form.client.curp = '';
        form.client.birthdate = '';
        form.client.nss = '';
        form.client.regime_end_date = '';
        form.client.unemployment_assistance_discounted_weeks = '';
        form.client.notes = '';
        form.family_information.has_spouse = '';
        form.family_information.minor_or_student_children_count = '';
        form.family_information.parents_count = '';
    };

    const applyServerErrors = (
        errors: Record<string, string[]>,
        enableManualMode: () => void,
    ) => {
        clearStepErrors();

        Object.entries(errors).forEach(([field, messages]) => {
            const target = field as ClientStepField;

            if (target in stepErrors) {
                stepErrors[target] = messages[0] ?? '';
            }
        });

        if (Object.keys(errors).some((field) => field !== 'client_id')) {
            enableManualMode();
        }
    };

    const submitCalculate = (
        enableManualMode: () => void,
        returnToClientStep: () => void,
    ) => {
        form.post(calculate.store().url, {
            preserveScroll: true,
            onError: (errors) => {
                const normalizedErrors = Object.fromEntries(
                    Object.entries(errors).map(([field, message]) => {
                        const normalizedField = field
                            .replace('client.', '')
                            .replace('family_information.', '');

                        return [normalizedField, [message]];
                    }),
                );

                applyServerErrors(normalizedErrors, enableManualMode);
                returnToClientStep();
            },
        });
    };

    return {
        form,
        average_daily_salary_last_250_weeks,
        contributed_weeks,
        years_recognized,
        stepErrors,
        clearStepError,
        clearStepErrors,
        clearClientFields,
        applyServerErrors,
        submitCalculate,
    };
};
