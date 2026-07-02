import { computed, ref, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

const toFiniteNumber = (value: unknown): number | null => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
};

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(Number.isFinite(value) ? value : 0);

export const formatPercentage = (value: number) =>
    new Intl.NumberFormat('es-MX', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

export const useBeneficiaries = (
    averageDailySalaryLast250Weeks: MaybeRefOrGetter<number>,
) => {
    const basicAmountPercentage = ref<string | number>('');

    const basicAmountPercentageNumber = computed(() =>
        toFiniteNumber(basicAmountPercentage.value),
    );

    const basicAmountPercentageError = computed(() => {
        if (basicAmountPercentage.value === '') {
            return '';
        }

        if (basicAmountPercentageNumber.value === null) {
            return 'Captura un porcentaje numerico.';
        }

        if (basicAmountPercentageNumber.value < 0) {
            return 'El porcentaje debe ser mayor o igual a 0.';
        }

        return '';
    });

    const basicAmountFactor = computed(() => {
        if (
            basicAmountPercentageNumber.value === null ||
            basicAmountPercentageNumber.value < 0
        ) {
            return 0;
        }

        return basicAmountPercentageNumber.value / 100;
    });

    const dailyAmount = computed(() => {
        const averageDailySalary = toFiniteNumber(
            toValue(averageDailySalaryLast250Weeks),
        );

        if (averageDailySalary === null) {
            return 0;
        }

        const value = averageDailySalary * basicAmountFactor.value;

        return Number.isFinite(value) ? value : 0;
    });

    const annualBasicAmount = computed(() => dailyAmount.value * 365);

    const foxUpdateFactor = computed(() => annualBasicAmount.value * 1.11);

    return {
        basicAmountPercentage,
        basicAmountPercentageError,
        basicAmountFactor,
        dailyAmount,
        annualBasicAmount,
        foxUpdateFactor,
    };
};
