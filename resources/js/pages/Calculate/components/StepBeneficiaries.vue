<script setup lang="ts">
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import {
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
                    helper="13% se calcula como 0.13"
                />
                <span
                    class="text-xs text-slate-500 dark:text-slate-400"
                    aria-live="polite"
                >
                    {{ formatPercentage(basicAmountFactor) }}
                </span>
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
</template>
