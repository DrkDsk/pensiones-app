<script setup lang="ts">
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import {
    RECOGNIZED_YEARS_AFTER_500_WEEKS,
    formatCurrency,
    formatPercentage,
    useBeneficiaries,
} from '../composables/useBeneficiaries';
import type { CalculateForm } from '../types/calculate';

const props = defineProps<{
    averageDailySalaryLast250Weeks: number;
    form: CalculateForm;
}>();

const {
    basicAmountPercentage,
    basicAmountPercentageError,
    dailyAmount,
    annualBasicAmount,
    foxUpdateFactor,
    annualBasicAmountIncreasePercentage,
    annualBasicAmountIncreasePercentageError,
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
} = useBeneficiaries(() => props.averageDailySalaryLast250Weeks, props.form);
</script>

<template>
    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Cuantía Básica
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Salario Diario Promedio
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(props.averageDailySalaryLast250Weeks) }}
                </div>
            </div>

            <div class="grid gap-2">
                <AppInput
                    v-model="basicAmountPercentage"
                    label="Cuantía Básica (%)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="13"
                    :error="basicAmountPercentageError"
                />
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Cuantía Diaria
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(dailyAmount) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Cuantía Básica Anual
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(annualBasicAmount) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Factor de actualización - FOX
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(foxUpdateFactor) }}
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Incremento Anual a la Cuantía Básica
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Salario Diario Promedio
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(props.averageDailySalaryLast250Weeks) }}
                </div>
            </div>

            <div class="grid gap-2">
                <AppInput
                    v-model="annualBasicAmountIncreasePercentage"
                    label="Incremento Cuantía Básica (%)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2"
                    :error="annualBasicAmountIncreasePercentageError"
                />
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Incremento Diario
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(dailyIncrease) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Incremento Anual previo
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(previousAnnualIncrease) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Total Años Reconocidos Posteriores a 500 Semanas
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ RECOGNIZED_YEARS_AFTER_500_WEEKS.toFixed(2) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Incremento Anual a la Cuantía Básica
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(incrementoAnualCuantiaBasica) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Factor de actualización - FOX
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(incrementoFoxUpdateFactor) }}
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Cuantía Anual de la Pensión
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Cuantía Básica Anual
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(foxUpdateFactor) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Incremento Anual a la Cuantía Básica
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(incrementoFoxUpdateFactor) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Cuantía Anual de la Pensión
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(cuantiaAnualPension) }}
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Pensión Anual x Cesantía en Edad Avanzada
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <AppInput
                    v-model="cesantiaEdadAvanzada"
                    label="Cesantía en Edad Avanzada"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="75"
                    :helper="formatPercentage(cesantiaEdadAvanzadaPorcentaje)"
                    :error="cesantiaEdadAvanzadaError"
                />
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Porcentaje de pensión x Edad Trabajador
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(pensionPorEdadTrabajador) }}
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Ayuda Asignación Familiar
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Cuantía Anual de la Pensión
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(pensionPorEdadTrabajador) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Ayuda del 15%
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(ayudaAsignacionFamiliar) }}
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Ayuda Hijos Menores o Estudiando
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Cuantía Anual de la Pensión
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(pensionPorEdadTrabajador) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Porcentaje de ayuda
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(ayudaHijosMenoresEstudiando) }}
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard
        variant="bordered"
        class="overflow-hidden"
        :class="{ 'opacity-75': !aplicaAyudaPadres }"
    >
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Ayuda Padres
            </h3>
        </div>

        <div
            v-if="!aplicaAyudaPadres"
            class="border-b border-slate-200 px-5 py-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300"
        >
            No aplica por existir viuda y/o huérfanos.
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Cuantía Anual de la Pensión
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{
                        formatCurrency(
                            aplicaAyudaPadres ? cuantiaAnualPension : 0,
                        )
                    }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Ayuda del 10%
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatPercentage(aplicaAyudaPadres ? 0.1 : 0) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Ayuda anual a padres
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(ayudaAnualPadres) }}
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Ayuda Asistencial
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Ayuda Anual Asistencial
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(ayudaAnualAsistencial) }}
                </div>
            </div>
        </div>
    </AppCard>
</template>
