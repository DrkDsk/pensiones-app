import { computed, ref, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import type { CalculateForm } from '../types/calculate';

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

export const RECOGNIZED_YEARS_AFTER_500_WEEKS = 18.5;

export const useBeneficiaries = (
    averageDailySalaryLast250Weeks: MaybeRefOrGetter<number>,
    form: CalculateForm,
) => {
    const basicAmountPercentage = ref<string | number>('');
    const annualBasicAmountIncreasePercentage = ref<string | number>('');
    const cesantiaEdadAvanzada = ref<string | number>('');

    const averageDailySalary = computed(
        () => toFiniteNumber(toValue(averageDailySalaryLast250Weeks)) ?? 0,
    );

    const basicAmountPercentageNumber = computed(() =>
        toFiniteNumber(basicAmountPercentage.value),
    );
    const annualBasicAmountIncreasePercentageNumber = computed(() =>
        toFiniteNumber(annualBasicAmountIncreasePercentage.value),
    );
    const cesantiaEdadAvanzadaNumber = computed(() =>
        toFiniteNumber(cesantiaEdadAvanzada.value),
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

    const annualBasicAmountIncreasePercentageError = computed(() => {
        if (annualBasicAmountIncreasePercentage.value === '') {
            return '';
        }

        if (annualBasicAmountIncreasePercentageNumber.value === null) {
            return 'Captura un porcentaje numerico.';
        }

        if (annualBasicAmountIncreasePercentageNumber.value < 0) {
            return 'El porcentaje debe ser mayor o igual a 0.';
        }

        return '';
    });

    const cesantiaEdadAvanzadaError = computed(() => {
        if (cesantiaEdadAvanzada.value === '') {
            return '';
        }

        if (cesantiaEdadAvanzadaNumber.value === null) {
            return 'Captura un porcentaje numerico.';
        }

        if (cesantiaEdadAvanzadaNumber.value < 0) {
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

    const annualBasicAmountIncreaseFactor = computed(() => {
        if (
            annualBasicAmountIncreasePercentageNumber.value === null ||
            annualBasicAmountIncreasePercentageNumber.value < 0
        ) {
            return 0;
        }

        return annualBasicAmountIncreasePercentageNumber.value / 100;
    });

    const cesantiaEdadAvanzadaPorcentaje = computed(() => {
        if (
            cesantiaEdadAvanzadaNumber.value === null ||
            cesantiaEdadAvanzadaNumber.value < 0
        ) {
            return 0;
        }

        return cesantiaEdadAvanzadaNumber.value / 100;
    });

    const dailyAmount = computed(() => {
        const value = averageDailySalary.value * basicAmountFactor.value;

        return Number.isFinite(value) ? value : 0;
    });

    const annualBasicAmount = computed(() => dailyAmount.value * 365);

    const foxUpdateFactor = computed(() => annualBasicAmount.value * 1.11);

    const dailyIncrease = computed(() => {
        const value =
            averageDailySalary.value * annualBasicAmountIncreaseFactor.value;

        return Number.isFinite(value) ? value : 0;
    });

    const previousAnnualIncrease = computed(() => dailyIncrease.value * 365);

    const incrementoAnualCuantiaBasica = computed(
        () => previousAnnualIncrease.value * RECOGNIZED_YEARS_AFTER_500_WEEKS,
    );

    const incrementoFoxUpdateFactor = computed(
        () => incrementoAnualCuantiaBasica.value * 1.11,
    );

    const cuantiaAnualPension = computed(
        () => foxUpdateFactor.value + incrementoFoxUpdateFactor.value,
    );

    const pensionPorEdadTrabajador = computed(() => {
        const value =
            cuantiaAnualPension.value * cesantiaEdadAvanzadaPorcentaje.value;

        return Number.isFinite(value) ? value : 0;
    });

    const hasSpouse = computed(() => form.family_information.has_spouse === '1');

    const ayudaAsignacionFamiliar = computed(() => {
        console.log(hasSpouse.value);

        const value = hasSpouse.value ? pensionPorEdadTrabajador.value * 0.15 : 0;

        return Number.isFinite(value) ? value : 0;
    });

    const minorOrStudentChildrenCount = computed(() => {
        const value = toFiniteNumber(
            form.family_information.minor_or_student_children_count,
        );

        return value !== null && value > 0 ? value : 0;
    });

    const ayudaHijosMenoresEstudiando = computed(() => {
        const value =
            pensionPorEdadTrabajador.value *
            0.1 *
            minorOrStudentChildrenCount.value;

        return Number.isFinite(value) ? value : 0;
    });

    const parentsCount = computed(() => {
        const value = toFiniteNumber(form.family_information.parents_count);

        return value !== null && value > 0 ? value : 0;
    });

    const aplicaAyudaPadres = computed(
        () => !hasSpouse.value && minorOrStudentChildrenCount.value <= 0,
    );

    const ayudaAnualPadres = computed(() => {
        const value = aplicaAyudaPadres.value
            ? cuantiaAnualPension.value * 0.1 * parentsCount.value
            : 0;

        return Number.isFinite(value) ? value : 0;
    });

    const ayudaAnualAsistencial = computed(() => {
        const value = pensionPorEdadTrabajador.value * 0.15;

        return Number.isFinite(value) ? value : 0;
    });

    return {
        basicAmountPercentage,
        basicAmountPercentageError,
        basicAmountFactor,
        dailyAmount,
        annualBasicAmount,
        foxUpdateFactor,
        annualBasicAmountIncreasePercentage,
        annualBasicAmountIncreasePercentageError,
        annualBasicAmountIncreaseFactor,
        dailyIncrease,
        previousAnnualIncrease,
        incrementoAnualCuantiaBasica,
        incrementoFoxUpdateFactor,
        cuantiaAnualPension,
        cesantiaEdadAvanzada,
        cesantiaEdadAvanzadaError,
        cesantiaEdadAvanzadaPorcentaje,
        pensionPorEdadTrabajador,
        ayudaAsignacionFamiliar,
        ayudaHijosMenoresEstudiando,
        aplicaAyudaPadres,
        ayudaAnualPadres,
        ayudaAnualAsistencial,
    };
};
