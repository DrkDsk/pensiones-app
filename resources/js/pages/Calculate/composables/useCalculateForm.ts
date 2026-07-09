import { useForm } from '@inertiajs/vue3';
import { computed, reactive } from 'vue';
import type { Client } from '@/models/client';
import calculate from '@/routes/calculate';
import { createCalculateFormDefaults } from '../constants/formDefaults';
import type { CalculateFormData, ClientStepField, StepErrors } from '../types/calculate';

const toFiniteNumber = (value: unknown): number | null => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
};

type DateParts = {
    year: number;
    month: number;
    day: number;
};

const parseDateParts = (value: string | null): DateParts | null => {
    if (!value) {
        return null;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return { year, month, day };
};

const addDays = (dateString: string | null, days: number): string => {
    const dateParts = parseDateParts(dateString);

    if (!dateParts || !Number.isFinite(days)) {
        return '';
    }

    const date = new Date(
        Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day),
    );

    date.setUTCDate(date.getUTCDate() + Math.floor(days));

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
};

const calculateAgeInYears = (birthdate: string | null): number => {
    const dateParts = parseDateParts(birthdate);

    if (!dateParts) {
        return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - dateParts.year;
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    if (
        currentMonth < dateParts.month ||
        (currentMonth === dateParts.month && currentDay < dateParts.day)
    ) {
        age -= 1;
    }

    return Math.max(age, 0);
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

    const sum_time_regime_periods = computed(() =>
        form.regime_periods.reduce((sum, period) => {
            return sum + period.time;
        }, 0),
    );

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

    const ageInYears = computed(() => {
        return calculateAgeInYears(form.client.birthdate);
    });

    const entitlementRetentionYears = computed(
        () => contributed_weeks.value / 4 / 52,
    );

    const entitlementExpirationDate = computed(() => {
        const daysFromRetentionYears = entitlementRetentionYears.value * 365;
        const leapDaysAdjustment = entitlementRetentionYears.value / 4;
        const leapYear = leapDaysAdjustment + 1;
        const adjustment = daysFromRetentionYears + leapYear;

        return addDays(form.client.regime_end_date, adjustment);
    });

    const entitlementExpirationDateModalidad40 = computed(() =>
        addDays(form.client.regime_end_date, 365 * 5),
    );

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
        sum_time_regime_periods,
        ageInYears,
        entitlementExpirationDate,
        entitlementExpirationDateModalidad40,
        entitlementRetentionYears,
        years_recognized,
        stepErrors,
        clearStepError,
        clearStepErrors,
        clearClientFields,
        applyServerErrors,
        submitCalculate,
    };
};
