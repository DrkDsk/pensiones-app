<script setup lang="ts">
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import {
    RECOGNIZED_YEARS_AFTER_500_WEEKS,
    formatCurrency,
    formatPercentage,
    useBeneficiaries,
} from '../composables/useBeneficiaries';

const props = defineProps<{
    averageDailySalaryLast250Weeks: number;
}>();

const {
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
} = useBeneficiaries(() => props.averageDailySalaryLast250Weeks);
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
</template>
