<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import type { CalculateForm, RegimePeriod } from '../types/calculate';

type FinancingRegimeType = 'modalidad_10' | 'modalidad_40';

type FinancingRegimeRow = {
    regimeType: FinancingRegimeType;
    label: string;
    startDate: string;
    endDate: string;
    costPercentage: string | number;
};

const props = defineProps<{
    form: CalculateForm;
    monthlyPension: number;
}>();

const currentYear = new Date().getFullYear();
const umaLabel = `Valor UMA ${currentYear}`;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(Number.isFinite(value) ? value : 0);

const toFiniteNumber = (value: unknown) => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : 0;
};

const regimePeriodFor = (
    regimeType: FinancingRegimeType,
): RegimePeriod | undefined =>
    props.form.regime_periods.find(
        (period) => period.regime_type === regimeType,
    );

const rows = reactive<FinancingRegimeRow[]>([
    {
        regimeType: 'modalidad_10',
        label: 'Modalidad 10',
        startDate:
            regimePeriodFor('modalidad_10')?.contribution_start_date ?? '',
        endDate: regimePeriodFor('modalidad_10')?.contribution_end_date ?? '',
        costPercentage: '',
    },
    {
        regimeType: 'modalidad_40',
        label: 'Modalidad 40',
        startDate:
            regimePeriodFor('modalidad_40')?.contribution_start_date ?? '',
        endDate: regimePeriodFor('modalidad_40')?.contribution_end_date ?? '',
        costPercentage: '',
    },
]);

const valorUma = (row: FinancingRegimeRow) =>
    toFiniteNumber(regimePeriodFor(row.regimeType)?.uma_value_year);

const salarioDiarioTopado = (row: FinancingRegimeRow) => valorUma(row) * 25;

const salarioMensualAlta = (row: FinancingRegimeRow) =>
    salarioDiarioTopado(row) * 30.4;

const costoPorcentual = (row: FinancingRegimeRow) =>
    toFiniteNumber(row.costPercentage) / 100;

const pagoMensual = (row: FinancingRegimeRow) =>
    salarioMensualAlta(row) * costoPorcentual(row);

const pagoTotalPorPeriodo = (row: FinancingRegimeRow) =>
    pagoMensual(row) * 9.767;

const pagoTotal = computed(() =>
    rows.reduce((total, row) => total + pagoTotalPorPeriodo(row), 0),
);

const pagoRetroactivo = ref<string | number>(205167);
const modalidad10 = ref<string | number>(16426.84);
const pagoAyudaDeDesempleo = ref<string | number>(93860.61);
const seguroDeVida = ref<string | number>(12759.35);
const costoAdicional = ref<string | number>(0);

const inversionTotal = computed(
    () =>
        toFiniteNumber(pagoRetroactivo.value) +
        toFiniteNumber(modalidad10.value) +
        toFiniteNumber(pagoAyudaDeDesempleo.value) +
        toFiniteNumber(seguroDeVida.value),
);

const financiamiento = computed(() => inversionTotal.value);

const intereses = computed(() => financiamiento.value * 0.4);

const honorarios = computed(() =>
    Number.isFinite(props.monthlyPension) ? props.monthlyPension : 0,
);

const totalCostoDelProyecto = computed(
    () =>
        financiamiento.value +
        intereses.value +
        honorarios.value +
        toFiniteNumber(costoAdicional.value),
);
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
                            Salario Diario Topado A 25 UMAS
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
                    <tr
                        v-for="row in rows"
                        :key="row.regimeType"
                        class="align-top"
                    >
                        <td
                            class="px-4 py-4 font-semibold text-slate-800 dark:text-slate-100"
                        >
                            {{ row.label }}
                        </td>
                        <td class="px-4 py-4">
                            <div class="grid gap-3 sm:grid-cols-2">
                                <AppInput
                                    v-model="row.startDate"
                                    label="Fecha Inicial"
                                    type="date"
                                />
                                <AppInput
                                    v-model="row.endDate"
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
                                    Salario Diario Topado A 25 UMAS
                                </span>
                                <div
                                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    {{
                                        formatCurrency(salarioDiarioTopado(row))
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
                                        formatCurrency(salarioMensualAlta(row))
                                    }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-4">
                            <AppInput
                                v-model="row.costPercentage"
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
                                        formatCurrency(pagoTotalPorPeriodo(row))
                                    }}
                                </div>
                            </div>
                        </td>
                    </tr>
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
                v-model="pagoRetroactivo"
                label="Pago Retroactivo"
                type="number"
                min="0"
                step="0.01"
                :helper="formatCurrency(toFiniteNumber(pagoRetroactivo))"
            />

            <AppInput
                v-model="modalidad10"
                label="Modalidad 10"
                type="number"
                min="0"
                step="0.01"
                :helper="formatCurrency(toFiniteNumber(modalidad10))"
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
                v-model="pagoAyudaDeDesempleo"
                label="Pago Ayuda De Desempleo"
                type="number"
                min="0"
                step="0.01"
                :helper="formatCurrency(toFiniteNumber(pagoAyudaDeDesempleo))"
            />

            <AppInput
                v-model="seguroDeVida"
                label="Seguro De Vida"
                type="number"
                min="0"
                step="0.01"
                :helper="formatCurrency(toFiniteNumber(seguroDeVida))"
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
                v-model="costoAdicional"
                label="Costo Adicional"
                type="number"
                min="0"
                step="0.01"
                :helper="formatCurrency(toFiniteNumber(costoAdicional))"
            />
        </div>
    </AppCard>

    <AppCard
        variant="bordered"
        class="overflow-hidden border-emerald-400 bg-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.28)]"
    >
        <div class="p-5">
            <div
                class="rounded-md bg-black px-5 py-6"
            >
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
