import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { toFiniteNumber } from './useFinancing';

export interface ProjectionPensionRow {
    year: number;
    realPension: number;
    freePension: number;
}

type ProjectionOptions = {
    monthlyPension: MaybeRefOrGetter<number>;
    monthlyPayment: MaybeRefOrGetter<string | number>;
    retirement97Sar92: MaybeRefOrGetter<string | number>;
    pensionCredit: MaybeRefOrGetter<string | number>;
    pagoTotal: MaybeRefOrGetter<number>;
    totalCostoDelProyecto: MaybeRefOrGetter<number>;
};

export const useProjection = ({
    monthlyPension,
    monthlyPayment,
    retirement97Sar92,
    pensionCredit,
    pagoTotal,
    totalCostoDelProyecto,
}: ProjectionOptions) => {
    const monthlyPensionValue = computed(() =>
        toFiniteNumber(toValue(monthlyPension)),
    );

    const monthlyPaymentValue = computed(() =>
        toFiniteNumber(toValue(monthlyPayment)),
    );

    const retirement97Sar92Value = computed(() =>
        toFiniteNumber(toValue(retirement97Sar92)),
    );

    const pensionCreditValue = computed(() =>
        toFiniteNumber(toValue(pensionCredit)),
    );

    const projectionRows = computed<ProjectionPensionRow[]>(() =>
        Array.from({ length: 6 }, (_, index) => {
            const realPension =
                monthlyPensionValue.value * Math.pow(1.05, index);

            return {
                year: index + 1,
                realPension,
                freePension: realPension - monthlyPaymentValue.value,
            };
        }),
    );

    const firstPensionRetroactiveAndBonus = computed(
        () =>
            monthlyPensionValue.value * 4 +
            (monthlyPensionValue.value / 1.15 / 12) * 5,
    );

    const modality40RecoveredAmount = computed(
        () => toFiniteNumber(toValue(pagoTotal)) * 0.23,
    );

    const totalRecovered = computed(
        () =>
            firstPensionRetroactiveAndBonus.value +
            retirement97Sar92Value.value +
            modality40RecoveredAmount.value +
            pensionCreditValue.value,
    );

    const freeCapital = computed(
        () =>
            totalRecovered.value -
            toFiniteNumber(toValue(totalCostoDelProyecto)),
    );

    return {
        projectionRows,
        firstPensionRetroactiveAndBonus,
        modality40RecoveredAmount,
        totalRecovered,
        freeCapital,
    };
};
