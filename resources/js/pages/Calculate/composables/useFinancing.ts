import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue, watch } from 'vue';
import { toast } from 'vue-sonner';
import { usePercentageCostModality40Service } from '../services/percentageCostModality40Service';
import type { CalculateForm, RegimePeriod } from '../types/calculate';
import { splitPeriodByYear } from './splitPeriodByYear';
import { calculateRegimeTime } from './useRegimePeriods';

type FinancingRegimeType = 'modalidad_10' | 'modalidad_40';

type FinancingCostPercentageField =
    | 'modalidad10CostPercentage'
    | 'modalidad40CostPercentage';

const DEFAULT_UMA_MULTIPLIER = 25;
const MIN_UMA_MULTIPLIER = 1;
const MAX_UMA_MULTIPLIER = 25;
const MODALIDAD_10_COSTO_PORCENTUAL_DEFAULT = 21;

export type FinancingRegimeRow = {
    key: string;
    regimeType: FinancingRegimeType;
    label: string;
    year: number;
    startDate: string;
    endDate: string;
    umaValue: string | number;
    integratedBalance?: string | number;
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
    const { getPercentageCostsByYears } = usePercentageCostModality40Service();
    const isLoadingPercentageCosts = ref(false);
    let loadedPercentageCostYears = '';
    let pendingPercentageCostYears = '';
    let percentageCostsWatchInitialized = false;
    let percentageCostRequestSequence = 0;

    const umaMultipliers = Array.from(
        { length: MAX_UMA_MULTIPLIER },
        (_, index) => index + 1,
    );

    const modalidad10Value = computed(() => {
        const modalidad10Row = rows.value.find(
            (value) => value.regimeType === 'modalidad_10',
        );

        if (!modalidad10Row) {
            return 0;
        }

        const pagoMensualValue = pagoMensual(modalidad10Row);

        return Number.parseFloat(pagoMensualValue.toFixed(2));
    });

    const regimePeriodFor = (
        regimeType: FinancingRegimeType,
    ): RegimePeriod | undefined =>
        form.regime_periods.find((period) => period.regime_type === regimeType);

    const modality40AnnualPeriods = computed(() => {
        const period = regimePeriodFor('modalidad_40');

        return splitPeriodByYear(
            period?.contribution_start_date ?? null,
            period?.contribution_end_date ?? null,
        );
    });

    watch(
        modality40AnnualPeriods,
        (periods) => {
            const currentValues = form.financing.modalidad40AnnualValues ?? {};

            form.financing.modalidad40AnnualValues = Object.fromEntries(
                periods.map(({ year }) => {
                    const yearKey = String(year);

                    return [
                        yearKey,
                        currentValues[yearKey] ?? {
                            umaValue: '',
                            costPercentage:
                                form.financing.modalidad40CostPercentage,
                        },
                    ];
                }),
            );
        },
        { immediate: true },
    );

    const rows = computed<FinancingRegimeRow[]>(() => {
        const modality10 = form.regime_periods.find(
            (value) => value.regime_type == 'modalidad_10',
        );
        const modality40 = regimePeriodFor('modalidad_40');
        const modality10ContributionStartDate =
            modality10?.contribution_start_date ?? '';
        const modality10ContributionEndDate =
            modality10?.contribution_end_date ?? '';

        const modality10Row: FinancingRegimeRow = {
            key: 'modalidad_10',
            regimeType: 'modalidad_10',
            label: 'Modalidad 10',
            year: new Date().getFullYear(),
            startDate: modality10ContributionStartDate,
            endDate: modality10ContributionEndDate,
            umaValue: modality10?.uma_value_year ?? 0,
            integratedBalance: modality10?.integrated_balance ?? 0,
            costPercentage: MODALIDAD_10_COSTO_PORCENTUAL_DEFAULT,
            costPercentageField: 'modalidad10CostPercentage',
        };

        const modality40Rows = modality40AnnualPeriods.value.map(
            (period): FinancingRegimeRow => {
                const annualValues = form.financing.modalidad40AnnualValues[
                    String(period.year)
                ] ?? {
                    umaValue: '',
                    costPercentage: form.financing.modalidad40CostPercentage,
                };

                return {
                    key: `modalidad_40-${period.year}-${period.startDate}-${period.endDate}`,
                    regimeType: 'modalidad_40',
                    label: 'Modalidad 40',
                    year: period.year,
                    startDate: period.startDate,
                    endDate: period.endDate,
                    umaValue: modality40?.uma_value_year ?? 0,
                    costPercentage: annualValues.costPercentage,
                    costPercentageField: 'modalidad40CostPercentage',
                };
            },
        );

        return [modality10Row, ...modality40Rows];
    });

    const modality40Years = computed(() => [
        ...new Set(
            rows.value
                .filter((row) => row.regimeType === 'modalidad_40')
                .map((row) => row.year)
                .filter(
                    (year) =>
                        Number.isInteger(year) && year >= 1900 && year <= 2100,
                ),
        ),
    ]);

    const loadModality40PercentageCosts = async (years: number[]) => {
        const yearsKey = [...years]
            .sort((left, right) => left - right)
            .join(',');

        if (
            !yearsKey ||
            yearsKey === loadedPercentageCostYears ||
            yearsKey === pendingPercentageCostYears
        ) {
            return;
        }

        const requestSequence = ++percentageCostRequestSequence;
        pendingPercentageCostYears = yearsKey;
        isLoadingPercentageCosts.value = true;

        try {
            const { data: percentages } =
                await getPercentageCostsByYears(years);

            if (requestSequence !== percentageCostRequestSequence) {
                return;
            }

            const missingYears: number[] = [];

            rows.value.forEach((row) => {
                if (row.regimeType !== 'modalidad_40') {
                    return;
                }

                const percentage = percentages[String(row.year)];

                if (!Number.isFinite(percentage)) {
                    missingYears.push(row.year);

                    return;
                }

                form.financing.modalidad40AnnualValues[
                    String(row.year)
                ].costPercentage = percentage;
            });

            loadedPercentageCostYears = yearsKey;

            if (missingYears.length > 0) {
                toast.error(
                    `No se encontraron costos porcentuales para: ${[
                        ...new Set(missingYears),
                    ].join(', ')}.`,
                );
            }
        } catch {
            if (requestSequence === percentageCostRequestSequence) {
                toast.error(
                    'No fue posible cargar los costos porcentuales de Modalidad 40.',
                );
            }
        } finally {
            if (requestSequence === percentageCostRequestSequence) {
                pendingPercentageCostYears = '';
                isLoadingPercentageCosts.value = false;
            }
        }
    };

    const initializeModality40PercentageCosts = () => {
        if (percentageCostsWatchInitialized) {
            return;
        }

        percentageCostsWatchInitialized = true;

        watch(
            () => modality40Years.value.join(','),
            () => {
                void loadModality40PercentageCosts(modality40Years.value);
            },
            { immediate: true },
        );
    };

    const updateCostPercentage = (
        row: FinancingRegimeRow,
        value: string | number | undefined,
    ) => {
        if (row.regimeType === 'modalidad_40') {
            form.financing.modalidad40AnnualValues[
                String(row.year)
            ].costPercentage = value ?? '';

            return;
        }

        form.financing[row.costPercentageField] = value ?? '';
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
        toFiniteNumber('umaValue' in row ? row.umaValue : row.uma_value_year);

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
        row.regimeType === 'modalidad_10'
            ? toFiniteNumber(row.integratedBalance)
            : valorUma(row) * selectedUmaMultiplier(row);

    const salarioMensualAlta = (row: FinancingRegimeRow) =>
        salarioDiarioTopado(row) * 30.4;

    const costoPorcentual = (row: FinancingRegimeRow) =>
        toFiniteNumber(row.costPercentage) / 100;

    const pagoMensual = (row: FinancingRegimeRow) =>
        salarioMensualAlta(row) * costoPorcentual(row);

    const pagoTotalPorPeriodo = (row: FinancingRegimeRow) => {
        const value =
            row.regimeType === 'modalidad_10'
                ? 1
                : calculateRegimeTime(row.startDate, row.endDate);

        return pagoMensual(row) * value;
    };

    const pagoTotalModalidad40 = computed(() =>
        rows.value.reduce((total, row) => total + pagoTotalPorPeriodo(row), 0),
    );

    const inversionTotal = computed(
        () =>
            toFiniteNumber(form.financing.pagoRetroactivo) +
            toFiniteNumber(form.financing.modalidad10) +
            toFiniteNumber(form.financing.pagoAyudaDeDesempleo) +
            toFiniteNumber(form.financing.seguroDeVida),
    );

    const aportacionCliente = computed(() =>
        toFiniteNumber(form.financing.costoAdicional),
    );

    const financiamiento = computed(
        () => inversionTotal.value - aportacionCliente.value,
    );

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
        isLoadingPercentageCosts,
        initializeModality40PercentageCosts,
        modalidad10Value,
        updateCostPercentage,
        updateRegimePeriodDate,
        umaMultipliers,
        selectedUmaMultiplier,
        valorUma,
        salarioDiarioTopado,
        salarioMensualAlta,
        pagoMensual,
        pagoTotalPorPeriodo,
        pagoTotalModalidad40,
        inversionTotal,
        financiamiento,
        intereses,
        honorarios,
        totalCostoDelProyecto,
    };
};
