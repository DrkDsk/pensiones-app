<script setup lang="ts">
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import { formatCurrency } from '../composables/useBeneficiaries';
import { toFiniteNumber } from '../composables/useFinancing';
import { useProjection } from '../composables/useProjection';
import type { CalculateForm, ProjectionData } from '../types/calculate';

type AppInputModelValue = string | number | undefined;

const props = defineProps<{
    form: CalculateForm;
    monthlyPension: number;
    pagoTotal: number;
    totalCostoDelProyecto: number;
}>();

const form = props.form;

const {
    projectionRows,
    firstPensionRetroactiveAndBonus,
    modality40RecoveredAmount,
    totalRecovered,
    freeCapital,
} = useProjection({
    monthlyPension: () => props.monthlyPension,
    monthlyPayment: () => form.projection.monthlyPayment,
    retirement97Sar92: () => form.projection.retirement97Sar92,
    pensionCredit: () => form.projection.pensionCredit,
    pagoTotal: () => props.pagoTotal,
    totalCostoDelProyecto: () => props.totalCostoDelProyecto,
});

const handleProjectionChange = (
    field: keyof ProjectionData,
    value: AppInputModelValue,
) => {
    form.projection[field] = value ?? 0;
};
</script>

<template>
    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Proyección de pensión
            </h3>
        </div>

        <div class="grid gap-5 p-5">
            <div class="max-w-md">
                <AppInput
                    :model-value="props.form.projection.monthlyPayment"
                    @update:model-value="
                        handleProjectionChange('monthlyPayment', $event)
                    "
                    label="Pago mensual"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    :helper="
                        formatCurrency(
                            toFiniteNumber(
                                props.form.projection.monthlyPayment,
                            ),
                        )
                    "
                />
            </div>

            <div
                class="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800"
            >
                <div class="overflow-x-auto">
                    <table
                        class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800"
                    >
                        <thead class="bg-slate-50 dark:bg-slate-950/60">
                            <tr>
                                <th
                                    class="min-w-44 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                                >
                                    Pensión libre
                                </th>
                                <th
                                    class="min-w-44 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                                >
                                    Pensión real
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950"
                        >
                            <tr
                                v-for="row in projectionRows"
                                :key="row.year"
                                class="hover:bg-slate-50/80 dark:hover:bg-slate-900/60"
                            >
                                <td
                                    class="px-4 py-4 font-mono font-semibold text-slate-800 dark:text-slate-100"
                                >
                                    {{ formatCurrency(row.freePension) }}
                                </td>
                                <td
                                    class="px-4 py-4 font-mono text-slate-700 dark:text-slate-200"
                                >
                                    {{ formatCurrency(row.realPension) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Recuperación y capital libre
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Primer pensión - retroactivo 6 meses + aguinaldo
                </span>
                <div
                    class="flex min-h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(firstPensionRetroactiveAndBonus) }}
                </div>
            </div>

            <AppInput
                :model-value="props.form.projection.retirement97Sar92"
                @update:model-value="
                    handleProjectionChange('retirement97Sar92', $event)
                "
                label="Retiro 97 - SAR 92"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                :helper="
                    formatCurrency(
                        toFiniteNumber(props.form.projection.retirement97Sar92),
                    )
                "
            />

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium"> Modalidad 40 </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(modality40RecoveredAmount) }}
                </div>
            </div>

            <AppInput
                :model-value="props.form.projection.pensionCredit"
                @update:model-value="
                    handleProjectionChange('pensionCredit', $event)
                "
                label="Crédito a pensión"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                :helper="
                    formatCurrency(
                        toFiniteNumber(props.form.projection.pensionCredit),
                    )
                "
            />

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Total recuperado
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 font-mono text-sm font-semibold text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200"
                >
                    {{ formatCurrency(totalRecovered) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Capital libre
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                    {{ formatCurrency(freeCapital) }}
                </div>
            </div>
        </div>
    </AppCard>
</template>

<style scoped></style>
