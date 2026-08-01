import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import type { CalculateForm, RegimePeriod } from '../types/calculate';

type FinancingRegimeType = 'modalidad_10' | 'modalidad_40';

type FinancingCostPercentageField =
    | 'modalidad10CostPercentage'
    | 'modalidad40CostPercentage';

const DEFAULT_UMA_MULTIPLIER = 25;
const MIN_UMA_MULTIPLIER = 1;
const MAX_UMA_MULTIPLIER = 25;

export type FinancingRegimeRow = {
    regimeType: FinancingRegimeType;
    label: string;
    startDate: string;
    endDate: string;
    costPercentage: string | number;
    costPercentageField: FinancingCostPercentageField;
};

export const toFiniteNumber = (value: unknown) => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : 0;
};

export const useFinancing = (
    form: CalculateForm,
    monthlyPension: MaybeRefOrGetter<number>,
) => {
    const umaMultipliers = Array.from(
        { length: MAX_UMA_MULTIPLIER },
        (_, index) => index + 1,
    );

    const regimePeriodFor = (
        regimeType: FinancingRegimeType,
    ): RegimePeriod | undefined =>
        form.regime_periods.find((period) => period.regime_type === regimeType);

    const rows = computed<FinancingRegimeRow[]>(() => [
        {
            regimeType: 'modalidad_10',
            label: 'Modalidad 10',
            startDate:
                form.financing.modalidad10Dates.contribution_start_date ?? '',
            endDate:
                form.financing.modalidad10Dates.contribution_end_date ?? '',
            costPercentage: form.financing.modalidad10CostPercentage,
            costPercentageField: 'modalidad10CostPercentage',
        },
        {
            regimeType: 'modalidad_40',
            label: 'Modalidad 40',
            startDate:
                form.financing.modalidad40Dates.contribution_start_date ?? '',
            endDate:
                form.financing.modalidad40Dates.contribution_end_date ?? '',
            costPercentage: form.financing.modalidad40CostPercentage,
            costPercentageField: 'modalidad40CostPercentage',
        },
    ]);

    const updateCostPercentage = (
        field: FinancingCostPercentageField,
        value: string | number | undefined,
    ) => {
        form.financing[field] = value ?? '';
    };

    const updateRegimePeriodDate = (
        regimeType: FinancingRegimeType,
        field: 'contribution_start_date' | 'contribution_end_date',
        value: string | number | undefined,
    ) => {
        if (regimeType === 'modalidad_10') {
            form.financing.modalidad10Dates[field] =
                value === undefined ? '' : String(value);
        } else if (regimeType === 'modalidad_40') {
            form.financing.modalidad40Dates[field] =
                value === undefined ? '' : String(value);
        }
    };

    const valorUma = (row: FinancingRegimeRow | RegimePeriod) =>
        toFiniteNumber(
            'uma_value_year' in row
                ? row.uma_value_year
                : regimePeriodFor(row.regimeType)?.uma_value_year,
        );

    const selectedUmaMultiplier = (row: FinancingRegimeRow) => {
        if (row.regimeType !== 'modalidad_40') {
            return DEFAULT_UMA_MULTIPLIER;
        }

        const multiplier = Math.trunc(
            toFiniteNumber(form.financing.modalidad40UmaMultiplier),
        );

        return multiplier >= MIN_UMA_MULTIPLIER &&
            multiplier <= MAX_UMA_MULTIPLIER
            ? multiplier
            : DEFAULT_UMA_MULTIPLIER;
    };

    const salarioDiarioTopado = (row: FinancingRegimeRow) =>
        valorUma(row) * selectedUmaMultiplier(row);

    const salarioMensualAlta = (row: FinancingRegimeRow) =>
        salarioDiarioTopado(row) * 30.4;

    const costoPorcentual = (row: FinancingRegimeRow) =>
        toFiniteNumber(row.costPercentage) / 100;

    const pagoMensual = (row: FinancingRegimeRow) =>
        salarioMensualAlta(row) * costoPorcentual(row);

    const pagoTotalPorPeriodo = (row: FinancingRegimeRow) => {
        const value = row.regimeType === 'modalidad_10' ? 9.767 : 5;

        return pagoMensual(row) * value;
    };

    const pagoTotal = computed(() =>
        rows.value.reduce((total, row) => total + pagoTotalPorPeriodo(row), 0),
    );

    const inversionTotal = computed(
        () =>
            toFiniteNumber(form.financing.pagoRetroactivo) +
            toFiniteNumber(form.financing.modalidad10) +
            toFiniteNumber(form.financing.pagoAyudaDeDesempleo) +
            toFiniteNumber(form.financing.seguroDeVida),
    );

    const financiamiento = computed(() => inversionTotal.value);

    const intereses = computed(() => financiamiento.value * 0.4);

    const honorarios = computed(() => toFiniteNumber(toValue(monthlyPension)));

    const totalCostoDelProyecto = computed(
        () =>
            financiamiento.value +
            intereses.value +
            honorarios.value +
            toFiniteNumber(form.financing.costoAdicional),
    );

    return {
        rows,
        updateCostPercentage,
        updateRegimePeriodDate,
        umaMultipliers,
        selectedUmaMultiplier,
        valorUma,
        salarioDiarioTopado,
        salarioMensualAlta,
        pagoMensual,
        pagoTotalPorPeriodo,
        pagoTotal,
        inversionTotal,
        financiamiento,
        intereses,
        honorarios,
        totalCostoDelProyecto,
    };
};
