<script setup lang="ts">
import { ref } from 'vue';
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
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
const showUmaValues = ref(false);

const {
    rows,
    updateCostPercentage,
    updateRegimePeriodDate,
    umaMultipliers,
    selectedUmaMultiplier,
    updateModalidad40UmaMultiplier,
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
} = useFinancing(form, () => props.monthlyPension);

const handleFinancingChange = (
    field: keyof FinancingData,
    value: AppInputModelValue,
) => {
    if (
        field === 'modalidad10Dates' ||
        field === 'modalidad40Dates' ||
        field === 'modalidad40UmaMultiplier'
    ) {
        return;
    }

    form.financing[field] = value ?? '';
};

const handleUmaMultiplierSelect = (multiplier: number) => {
    updateModalidad40UmaMultiplier(multiplier);
    showUmaValues.value = false;
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
                            {{ umaLabel }}
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
                            Costo Porcentual
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
                    <template v-for="row in rows" :key="row.regimeType">
                        <tr class="align-top">
                            <td
                                class="px-4 py-4 font-semibold text-slate-800 dark:text-slate-100"
                            >
                                {{ row.label }}
                            </td>
                            <td class="px-4 py-4">
                                <div class="grid gap-3 sm:grid-cols-2">
                                    <AppInput
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
                                    />
                                    <AppInput
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
                                    />
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <div class="grid gap-2">
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
                                    <button
                                        v-if="row.regimeType === 'modalidad_40'"
                                        type="button"
                                        class="w-max text-xs font-medium text-slate-600 underline underline-offset-4 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                        @click="showUmaValues = !showUmaValues"
                                    >
                                        {{
                                            showUmaValues
                                                ? 'Ocultar valores por UMA'
                                                : 'Ver valores por UMA'
                                        }}
                                    </button>
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
                            <td class="px-4 py-4">
                                <AppInput
                                    :model-value="row.costPercentage"
                                    @update:model-value="
                                        updateCostPercentage(
                                            row.costPercentageField,
                                            $event,
                                        )
                                    "
                                    label="Costo Porcentual"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="40"
                                    helper="Captura 40 para 40%."
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
                        <tr
                            v-if="
                                row.regimeType === 'modalidad_40' &&
                                showUmaValues
                            "
                        >
                            <td colspan="8" class="p-0">
                                <div
                                    class="border-t border-slate-200 bg-slate-50/80 px-4 py-5 dark:border-slate-800 dark:bg-slate-900/40"
                                >
                                    <div
                                        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                                    >
                                        <div class="mb-4">
                                            <h4
                                                class="text-sm font-semibold text-slate-900 dark:text-slate-100"
                                            >
                                                Valores por UMA
                                            </h4>
                                            <p
                                                class="mt-1 text-sm text-slate-500 dark:text-slate-400"
                                            >
                                                Selecciona el valor UMA que se
                                                utilizará para los cálculos de
                                                esta fila.
                                            </p>
                                        </div>

                                        <div
                                            class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800"
                                        >
                                            <table
                                                class="min-w-full divide-y divide-slate-100 text-left text-xs dark:divide-slate-800"
                                            >
                                                <thead
                                                    class="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                                                >
                                                    <tr>
                                                        <th
                                                            class="px-3 py-2 font-semibold"
                                                        >
                                                            UMAS
                                                        </th>
                                                        <th
                                                            class="px-3 py-2 font-semibold"
                                                        >
                                                            Operación
                                                        </th>
                                                        <th
                                                            class="px-3 py-2 font-semibold"
                                                        >
                                                            Resultado
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody
                                                    class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950"
                                                >
                                                    <tr
                                                        v-for="multiplier in umaMultipliers"
                                                        :key="multiplier"
                                                        class="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-900"
                                                        :class="
                                                            selectedUmaMultiplier(
                                                                row,
                                                            ) === multiplier
                                                                ? 'bg-slate-100 ring-1 ring-slate-300 ring-inset dark:bg-slate-900 dark:ring-slate-700'
                                                                : ''
                                                        "
                                                        @click="
                                                            handleUmaMultiplierSelect(
                                                                multiplier,
                                                            )
                                                        "
                                                    >
                                                        <td
                                                            class="px-3 py-2 font-medium text-slate-700 dark:text-slate-200"
                                                        >
                                                            {{ multiplier }}
                                                            {{
                                                                multiplier === 1
                                                                    ? 'UMA'
                                                                    : 'UMAS'
                                                            }}
                                                        </td>
                                                        <td
                                                            class="px-3 py-2 font-mono text-slate-500 dark:text-slate-400"
                                                        >
                                                            {{
                                                                formatCurrency(
                                                                    valorUma(
                                                                        row,
                                                                    ),
                                                                )
                                                            }}
                                                            × {{ multiplier }}
                                                        </td>
                                                        <td
                                                            class="px-3 py-2 font-mono text-slate-700 dark:text-slate-200"
                                                        >
                                                            {{
                                                                formatCurrency(
                                                                    valorUma(
                                                                        row,
                                                                    ) *
                                                                        multiplier,
                                                                )
                                                            }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
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
                <span class="ui-label text-sm font-medium"> Pago Total </span>
                <div
                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                    {{ formatCurrency(pagoTotal) }}
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

            <AppInput
                :model-value="props.form.financing.modalidad10"
                @update:model-value="
                    handleFinancingChange('modalidad10', $event)
                "
                label="Modalidad 10"
                type="number"
                min="0"
                step="0.01"
                :helper="
                    formatCurrency(
                        toFiniteNumber(props.form.financing.modalidad10),
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
                label="Costo Adicional"
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
