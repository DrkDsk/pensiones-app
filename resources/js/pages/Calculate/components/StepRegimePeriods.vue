<script setup lang="ts">
import { GripVertical, Plus, Trash2 } from '@lucide/vue';
import Sortable from 'sortablejs';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AlertError from '@/components/AlertError.vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import { useRegimePeriods } from '../composables/useRegimePeriods';
import { MAX_ADDITIONAL_REGIME_PERIODS } from '../constants/regimeTypes';
import type {
    CalculateForm,
    RegimePeriod,
    RegimePeriodField,
    StepErrors,
} from '../types/calculate';

const props = defineProps<{
    form: CalculateForm;
    stepErrors: StepErrors;
    age: number;
    sum_time_regime_periods: number;
    averageDailySalaryLast250Weeks: number;
    contributedWeeks: number;
    entitlementRetentionYears: number;
    entitlementExpirationDate: string;
    entitlementExpirationDateModalidad40: string;
    hasRegimeTimeError: boolean;
    regimeTimeErrorMessage: string;
    validateRegimePeriods: () => boolean;
}>();

const form = props.form;
const { addRegimePeriod, removeRegimePeriod, updateRegimePeriodField } =
    useRegimePeriods(form);

const maxRowsMessage = ref('');
const periodsTableBody = ref<HTMLElement | null>(null);
let sortable: Sortable | null = null;

const additionalPeriodsCount = computed(
    () => props.form.regime_periods.filter((period) => !period.is_fixed).length,
);

const canAddRegimePeriod = computed(
    () => additionalPeriodsCount.value < MAX_ADDITIONAL_REGIME_PERIODS,
);

const formatTime = (value: number) =>
    Number.isFinite(value) && value > 0 ? value.toFixed(2) : '0.00';

const formatDate = (dateString: string | null) => {
    if (!dateString) {
        return '';
    }

    const [year, month, day] = dateString.split('-');

    return `${day}/${month}/${year}`;
};

const formatIntegratedBalance = (value: number) => {
    return Number.isFinite(value) && value > 0
        ? `${value.toFixed(2)}`
        : '$0.00';
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(Number.isFinite(value) ? value : 0);

const periodError = (index: number, field: RegimePeriodField) =>
    props.stepErrors.regime_periods[index]?.[field] ?? '';

const isFixedRegime = (period: RegimePeriod): boolean => {
    return (
        period.regime_type === 'modalidad_10' ||
        period.regime_type === 'modalidad_40'
    );
};

const restoreDraggedRowDom = (event: Sortable.SortableEvent) => {
    if (event.oldIndex === undefined) {
        return;
    }

    event.item.remove();
    event.from.insertBefore(
        event.item,
        event.from.children.item(event.oldIndex),
    );
};

const moveDynamicRegimePeriod = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
        return;
    }

    const dynamicPeriods = form.regime_periods.filter(
        (period) => !isFixedRegime(period),
    );
    const fixedPeriods = form.regime_periods.filter(isFixedRegime);
    const [movedPeriod] = dynamicPeriods.splice(fromIndex, 1);

    if (!movedPeriod) {
        return;
    }

    dynamicPeriods.splice(toIndex, 0, movedPeriod);
    form.regime_periods.splice(
        0,
        form.regime_periods.length,
        ...dynamicPeriods,
        ...fixedPeriods,
    );
    props.validateRegimePeriods();
};

const handleAddRegimePeriod = () => {
    maxRowsMessage.value = '';
    const wasAdded = addRegimePeriod();

    if (!wasAdded) {
        maxRowsMessage.value = `Solo puedes agregar hasta ${MAX_ADDITIONAL_REGIME_PERIODS} periodos adicionales.`;
    }
};

const handleRemoveRegimePeriod = (index: number) => {
    removeRegimePeriod(index);
    props.validateRegimePeriods();
};

const updateRegimeName = (
    index: number,
    value: string | number | undefined,
) => {
    updateRegimePeriodField(index, 'regime_name', value ? String(value) : '');
    props.validateRegimePeriods();
};

const updateUMA = (index: number, value: string | number | undefined) => {
    updateRegimePeriodField(index, 'uma_value_year', value ? Number(value) : 0);
    props.validateRegimePeriods();
};

const updateIntegratedBalance = (
    index: number,
    value: string | number | undefined,
) => {
    updateRegimePeriodField(
        index,
        'integrated_balance',
        value ? Number(value) : 0,
    );
    props.validateRegimePeriods();
};

const updateContributionDate = (
    index: number,
    field: 'contribution_start_date' | 'contribution_end_date',
    value: string | number | undefined,
) => {
    updateRegimePeriodField(index, field, value ? String(value) : null);
    props.validateRegimePeriods();
};

onMounted(() => {
    if (!periodsTableBody.value) {
        return;
    }

    sortable = Sortable.create(periodsTableBody.value, {
        animation: 150,
        draggable: '.regime-draggable-row',
        handle: '.regime-drag-handle',
        ghostClass: 'opacity-60',
        chosenClass: 'ring-1',
        dragClass: 'shadow-sm',
        onEnd(event) {
            if (
                event.oldDraggableIndex === undefined ||
                event.newDraggableIndex === undefined
            ) {
                return;
            }

            restoreDraggedRowDom(event);
            moveDynamicRegimePeriod(
                event.oldDraggableIndex,
                event.newDraggableIndex,
            );
        },
    });
});

onBeforeUnmount(() => {
    sortable?.destroy();
    sortable = null;
});
</script>

<template>
    <div class="space-y-2">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Periodos de patrones
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">
            Captura las fechas de cotizacion por tipo de patrón.
        </p>
    </div>

    <AlertError
        title="Tiempo de cotización insuficiente"
        :message="hasRegimeTimeError ? regimeTimeErrorMessage : ''"
    />

    <div
        class="overflow-hidden rounded-sm border transition-colors"
        :class="
            hasRegimeTimeError
                ? 'border-danger ring-1 ring-danger/30'
                : 'border-slate-200 dark:border-slate-800'
        "
    >
        <div class="overflow-x-auto">
            <table
                class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800"
            >
                <thead class="bg-slate-50 dark:bg-slate-950/60">
                    <tr>
                        <th class="w-10 px-2 py-3">
                            <span class="sr-only">Ordenar</span>
                        </th>
                        <th
                            class="w-[28%] px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Patrón
                        </th>
                        <th
                            class="px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Fecha de cotizacion
                        </th>
                        <th
                            class="w-32 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Tiempo
                        </th>

                        <th
                            class="w-32 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            UMA
                        </th>

                        <th
                            class="w-32 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Salario Integrado
                        </th>

                        <th class="w-16 px-4 py-3">
                            <span class="sr-only">Acciones</span>
                        </th>
                    </tr>
                </thead>

                <tbody
                    ref="periodsTableBody"
                    class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950"
                >
                    <tr
                        v-for="(period, index) in form.regime_periods"
                        :key="period.id ?? `${period.regime_type}-${index}`"
                        :data-period-id="period.id"
                        class="align-top"
                        :class="
                            !isFixedRegime(period) ? 'regime-draggable-row' : ''
                        "
                    >
                        <td class="px-2 py-10">
                            <button
                                v-if="!isFixedRegime(period)"
                                type="button"
                                title="Reordenar periodo"
                                class="regime-drag-handle inline-flex size-8 cursor-grab items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-50 hover:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing dark:hover:bg-slate-900 dark:hover:text-slate-400"
                            >
                                <GripVertical class="size-4" />
                                <span class="sr-only">Reordenar periodo</span>
                            </button>
                        </td>
                        <td class="min-w-56 px-4 py-4">
                            <AppInput
                                v-if="!period.is_fixed"
                                :model-value="period.regime_name"
                                label="Patrón"
                                placeholder="Ej. Patrón anterior"
                                maxlength="100"
                                :error="periodError(index, 'regime_name')"
                                required
                                @update:model-value="
                                    updateRegimeName(index, $event)
                                "
                                @blur="validateRegimePeriods"
                            />

                            <AppInput
                                v-else
                                :model-value="period.regime_name"
                                label="Patrón"
                                disabled
                                :error="periodError(index, 'regime_type')"
                            />
                        </td>

                        <td class="min-w-md px-4 py-4">
                            <div class="grid gap-3 sm:grid-cols-2">
                                <AppInput
                                    v-if="!period.is_fixed"
                                    :model-value="
                                        period.contribution_start_date ?? ''
                                    "
                                    label="Fecha inicio"
                                    type="date"
                                    :error="
                                        periodError(
                                            index,
                                            'contribution_start_date',
                                        )
                                    "
                                    required
                                    @update:model-value="
                                        updateContributionDate(
                                            index,
                                            'contribution_start_date',
                                            $event,
                                        )
                                    "
                                    @blur="validateRegimePeriods"
                                />

                                <div class="grid gap-2" v-else>
                                    <span class="ui-label text-sm font-medium">
                                        Fecha inicio
                                    </span>
                                    <div
                                        class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {{
                                            formatDate(
                                                period.contribution_start_date,
                                            )
                                        }}
                                    </div>
                                </div>

                                <AppInput
                                    v-if="period.regime_type !== 'modalidad_10'"
                                    :model-value="
                                        period.contribution_end_date ?? ''
                                    "
                                    label="Fecha fin"
                                    type="date"
                                    :error="
                                        periodError(
                                            index,
                                            'contribution_end_date',
                                        )
                                    "
                                    required
                                    @update:model-value="
                                        updateContributionDate(
                                            index,
                                            'contribution_end_date',
                                            $event,
                                        )
                                    "
                                    @blur="validateRegimePeriods"
                                />

                                <div class="grid gap-2" v-else>
                                    <span class="ui-label text-sm font-medium">
                                        Fecha fin
                                    </span>
                                    <div
                                        class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {{
                                            formatDate(
                                                period.contribution_end_date,
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <td class="px-4 py-4">
                            <div class="grid gap-2">
                                <span class="ui-label text-sm font-medium">
                                    Calculado
                                </span>
                                <div
                                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    {{ formatTime(period.time) }}
                                </div>
                            </div>
                        </td>

                        <td class="min-w-56 px-4 py-4">
                            <AppInput
                                v-if="period.is_fixed"
                                :model-value="period.uma_value_year ?? 0"
                                label="Valor"
                                placeholder="0"
                                maxlength="100"
                                :error="periodError(index, 'uma_value_year')"
                                required
                                @update:model-value="updateUMA(index, $event)"
                                @blur="validateRegimePeriods"
                            />
                        </td>

                        <td class="min-w-56 px-4 py-4">
                            <div class="grid gap-2" v-if="period.is_fixed">
                                <span class="ui-label text-sm font-medium">
                                    Salario Integrado
                                </span>
                                <div
                                    class="flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                >
                                    {{
                                        formatIntegratedBalance(
                                            period.integrated_balance ?? 0,
                                        )
                                    }}
                                </div>
                            </div>

                            <AppInput
                                v-if="!period.is_fixed"
                                :model-value="period.integrated_balance ?? 0"
                                label="Salario Integrado"
                                placeholder="0"
                                maxlength="100"
                                :error="
                                    periodError(index, 'integrated_balance')
                                "
                                required
                                @update:model-value="
                                    updateIntegratedBalance(index, $event)
                                "
                                @blur="validateRegimePeriods"
                            />
                        </td>

                        <td class="px-4 py-10 text-right">
                            <button
                                v-if="!period.is_fixed"
                                type="button"
                                title="Eliminar periodo"
                                class="inline-flex size-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                                @click="handleRemoveRegimePeriod(index)"
                            >
                                <Trash2 class="size-4" />
                                <span class="sr-only">Eliminar periodo</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
        <p
            v-if="maxRowsMessage"
            class="text-sm text-rose-600 dark:text-rose-300"
        >
            {{ maxRowsMessage }}
        </p>
        <p v-else class="text-sm text-slate-500 dark:text-slate-400">
            {{ additionalPeriodsCount }} de
            {{ MAX_ADDITIONAL_REGIME_PERIODS }} periodos adicionales.
        </p>

        <AppButton
            variant="secondary"
            :disabled="!canAddRegimePeriod"
            @click="handleAddRegimePeriod"
        >
            <Plus class="size-4" />
            Agregar periodo
        </AppButton>
    </div>

    <div
        class="grid grid-cols-2 items-start justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
    >
        <span class="ui-label text-sm font-medium">
            1) Salario Diario Promedio (últimas 250 semanas)
        </span>
        <span class="font-mono text-sm text-slate-700 dark:text-slate-200">
            {{ formatCurrency(props.averageDailySalaryLast250Weeks) }}
        </span>
        <span class="ui-label text-sm font-medium">
            2) Número de semanas cotizadas
        </span>
        <span class="font-mono text-sm text-slate-700 dark:text-slate-200">
            {{ props.contributedWeeks }}
        </span>
        <span class="ui-label text-sm font-medium">
            3) Fecha de vencimiento de derechos
        </span>
        <span class="font-mono text-sm text-slate-700 dark:text-slate-200">
            {{ props.entitlementExpirationDate }}
        </span>
        <span class="ui-label text-sm font-medium">
            4) Fecha de vencimiento para llevar acabo la MOD40
        </span>
        <span class="font-mono text-sm text-slate-700 dark:text-slate-200">
            {{ props.entitlementExpirationDateModalidad40 }}
        </span>
        <span class="ui-label text-sm font-medium">
            5) Tiempo de Cotización por empleo en los últimos 5 años
        </span>
        <span class="font-mono text-sm text-slate-700 dark:text-slate-200">
            {{ props.sum_time_regime_periods }}
        </span>
    </div>
</template>
