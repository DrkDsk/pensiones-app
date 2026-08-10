<script setup lang="ts">
import { Settings } from '@lucide/vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import { formatContributionDate } from '../composables/splitPeriodByYear';
import { formatCurrency } from '../composables/useBeneficiaries';
import { toFiniteNumber, useFinancing } from '../composables/useFinancing';
import type { CalculateForm, FinancingData } from '../types/calculate';

type AppInputModelValue = string | number | undefined;

const props = defineProps<{
    form: CalculateForm;
    monthlyPension: number;
}>();

const form = props.form;
const currentYear = new Date().getFullYear();
const umaLabel = `Valor UMA ${currentYear}`;

const {
    rows,
    isLoadingPercentageCosts,
    initializeModality40PercentageCosts,
    modalidad10Value,
    updateCostPercentage,
    updateUmaValue,
    updateRegimePeriodDate,
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
} = useFinancing(form, () => props.monthlyPension);

initializeModality40PercentageCosts();

const handleFinancingChange = (
    field: keyof FinancingData,
    value: AppInputModelValue,
) => {
    if (
        field === 'modalidad10Dates' ||
        field === 'modalidad40Dates' ||
        field === 'modalidad40UmaMultiplier' ||
        field === 'modalidad40AnnualValues'
    ) {
        return;
    }

    form.financing[field] = value ?? '';
};
</script>

<template>
    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Modalidad 10 Y Modalidad 40
            </h3>
        </div>

        <div class="overflow-x-auto">
            <table
                class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800"
            >
                <thead class="bg-slate-50 dark:bg-slate-950/60">
                    <tr>
                        <th
                            class="w-40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Modalidad
                        </th>
                        <th
                            class="min-w-80 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Periodo
                        </th>
                        <th
                            class="min-w-44 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Valor UMA
                        </th>
                        <th
                            class="min-w-56 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Salario Diario Topado
                        </th>
                        <th
                            class="min-w-52 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Salario Mensual Alta
                        </th>
                        <th
                            class="min-w-48 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            <span class="flex items-center gap-1">
                                <span>Costo Porcentual</span>
                                <span title="Administrar costos porcentuales">
                                    <!-- TODO: habilitar la navegación con Inertia cuando exista la ruta de administración. -->
                                    <AppButton
                                        variant="ghost"
                                        size="sm"
                                        class="size-8 px-0"
                                        disabled
                                        aria-label="Administrar costos porcentuales"
                                    >
                                        <Settings class="size-4" />
                                    </AppButton>
                                </span>
                            </span>
                        </th>
                        <th
                            class="min-w-44 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Pago Mensual
                        </th>
                        <th
                            class="min-w-52 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Pago Total Por Periodo
                        </th>
                    </tr>
                </thead>

                <tbody
                    class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950"
                >
                    <template v-for="row in rows" :key="row.key">
                        <tr class="align-top">
                            <td
                                class="px-4 py-4 font-semibold text-slate-800 dark:text-slate-100"
                            >
                                {{ row.label }}
                            </td>
                            <td class="px-4 py-4">
                                <div class="grid gap-3 sm:grid-cols-2">
                                    <AppInput
                                        v-if="row.regimeType === 'modalidad_10'"
                                        :model-value="row.startDate"
                                        @update:model-value="
                                            updateRegimePeriodDate(
                                                row.regimeType,
                                                'contribution_start_date',
                                                $event,
                                            )
                                        "
                                        label="Fecha Inicial"
                                        type="date"
                                        disabled
                                    />
                                    <div v-else class="grid gap-2">
                                        <span
                                            class="ui-label text-sm font-medium"
                                        >
                                            Fecha Inicial
                                        </span>
                                        <span
                                            class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                        >
                                            {{
                                                formatContributionDate(
                                                    row.startDate,
                                                )
                                            }}
                                        </span>
                                    </div>
                                    <AppInput
                                        v-if="row.regimeType === 'modalidad_10'"
                                        :model-value="row.endDate"
                                        @update:model-value="
                                            updateRegimePeriodDate(
                                                row.regimeType,
                                                'contribution_end_date',
                                                $event,
                                            )
                                        "
                                        label="Fecha Final"
                                        type="date"
                                        disabled
                                    />
                                    <div v-else class="grid gap-2">
                                        <span
                                            class="ui-label text-sm font-medium"
                                        >
                                            Fecha Final
                                        </span>
                                        <span
                                            class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                        >
                                            {{
                                                formatContributionDate(
                                                    row.endDate,
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <AppInput
                                    v-if="row.regimeType === 'modalidad_40'"
                                    :model-value="row.umaValue"
                                    @update:model-value="
                                        updateUmaValue(row, $event)
                                    "
                                    :label="`Valor UMA ${row.year}`"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                />
                                <div v-else class="grid gap-2">
                                    <span class="ui-label text-sm font-medium">
                                        {{ umaLabel }}
                                    </span>
                                    <div
                                        class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {{ formatCurrency(valorUma(row)) }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <div class="grid gap-2">
                                    <span class="ui-label text-sm font-medium">
                                        Salario Diario Topado A
                                        {{ selectedUmaMultiplier(row) }} UMAS
                                    </span>
                                    <div
                                        class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {{
                                            formatCurrency(
                                                salarioDiarioTopado(row),
                                            )
                                        }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <div class="grid gap-2">
                                    <span class="ui-label text-sm font-medium">
                                        Salario Mensual Alta
                                    </span>
                                    <div
                                        class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {{
                                            formatCurrency(
                                                salarioMensualAlta(row),
                                            )
                                        }}
                                    </div>
                                </div>
                            </td>
                            <td class="flex flex-row px-4 py-4">
                                <AppInput
                                    :model-value="row.costPercentage"
                                    @update:model-value="
                                        updateCostPercentage(row, $event)
                                    "
                                    label="Costo Porcentual"
                                    type="number"
                                    :disabled="
                                        row.regimeType === 'modalidad_10' ||
                                        row.regimeType === 'modalidad_40'
                                    "
                                    min="0"
                                    :step="
                                        row.regimeType === 'modalidad_40'
                                            ? 0.001
                                            : 0.01
                                    "
                                    :placeholder="
                                        row.regimeType === 'modalidad_10'
                                            ? '40'
                                            : isLoadingPercentageCosts
                                              ? 'Cargando...'
                                              : 'Sin porcentaje'
                                    "
                                    helper="%"
                                    helperOrientation="horizontal"
                                />
                            </td>
                            <td class="px-4 py-4">
                                <div class="grid gap-2">
                                    <span class="ui-label text-sm font-medium">
                                        Pago Mensual
                                    </span>
                                    <div
                                        class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {{ formatCurrency(pagoMensual(row)) }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <div class="grid gap-2">
                                    <span class="ui-label text-sm font-medium">
                                        Pago Total Por Periodo
                                    </span>
                                    <div
                                        class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {{
                                            formatCurrency(
                                                pagoTotalPorPeriodo(row),
                                            )
                                        }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Pagos
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Pago Total Modalidad 40
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(pagoTotalModalidad40) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium"> Modalidad 10 </span>

                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(modalidad10Value) }}
                </div>
            </div>

            <AppInput
                :model-value="props.form.financing.pagoRetroactivo"
                @update:model-value="
                    handleFinancingChange('pagoRetroactivo', $event)
                "
                label="Pago Retroactivo"
                type="number"
                min="0"
                step="0.01"
                :helper="
                    formatCurrency(
                        toFiniteNumber(props.form.financing.pagoRetroactivo),
                    )
                "
            />
        </div>
    </AppCard>

    <AppCard variant="bordered" class="overflow-hidden">
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
                Financiamiento
            </h3>
        </div>

        <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            <AppInput
                :model-value="props.form.financing.pagoAyudaDeDesempleo"
                @update:model-value="
                    handleFinancingChange('pagoAyudaDeDesempleo', $event)
                "
                label="Pago Ayuda De Desempleo"
                type="number"
                min="0"
                step="0.01"
                :helper="
                    formatCurrency(
                        toFiniteNumber(
                            props.form.financing.pagoAyudaDeDesempleo,
                        ),
                    )
                "
            />

            <AppInput
                :model-value="props.form.financing.seguroDeVida"
                @update:model-value="
                    handleFinancingChange('seguroDeVida', $event)
                "
                label="Seguro De Vida"
                type="number"
                min="0"
                step="0.01"
                :helper="
                    formatCurrency(
                        toFiniteNumber(props.form.financing.seguroDeVida),
                    )
                "
            />

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Inversión Total
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(inversionTotal) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium">
                    Financiamiento
                </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(financiamiento) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium"> Intereses </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(intereses) }}
                </div>
            </div>

            <div class="grid gap-2">
                <span class="ui-label text-sm font-medium"> Honorarios </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(honorarios) }}
                </div>
            </div>

            <AppInput
                :model-value="props.form.financing.costoAdicional"
                @update:model-value="
                    handleFinancingChange('costoAdicional', $event)
                "
                label="Aportación Cliente"
                type="number"
                min="0"
                step="0.01"
                :helper="
                    formatCurrency(
                        toFiniteNumber(props.form.financing.costoAdicional),
                    )
                "
            />
        </div>
    </AppCard>

    <AppCard
        variant="bordered"
        class="overflow-hidden border-emerald-400 bg-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.28)]"
    >
        <div class="p-5">
            <div class="rounded-md bg-black px-5 py-6">
                <span
                    class="ui-label text-xs font-semibold tracking-[0.24em] text-emerald-300 uppercase"
                >
                    Total Costo Del Proyecto
                </span>
                <div
                    class="mt-3 font-mono text-3xl font-semibold text-emerald-300 sm:text-4xl"
                >
                    {{ formatCurrency(totalCostoDelProyecto) }}
                </div>
            </div>
        </div>
    </AppCard>
</template>
