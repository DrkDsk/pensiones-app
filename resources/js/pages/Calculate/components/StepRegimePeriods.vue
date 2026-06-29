<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue';
import { computed, ref } from 'vue';
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
    validateRegimePeriods: () => boolean;
}>();

const { addRegimePeriod, removeRegimePeriod, updateRegimePeriodField } =
    useRegimePeriods(props.form);

const maxRowsMessage = ref('');

const additionalPeriodsCount = computed(
    () => props.form.regime_periods.filter((period) => !period.is_fixed).length,
);

const canAddRegimePeriod = computed(
    () => additionalPeriodsCount.value < MAX_ADDITIONAL_REGIME_PERIODS,
);

const formatTime = (value: number) =>
    Number.isFinite(value) && value > 0 ? value.toFixed(4) : '0.0000';

const formatIntegratedBalance = (value: number) => {
    return Number.isFinite(value) && value > 0
        ? `${value.toFixed(2)}`
        : '$0.00';
};

const periodError = (index: number, field: RegimePeriodField) =>
    props.stepErrors.regime_periods[index]?.[field] ?? '';

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

const updateUMA = (
    index: number,
    value: string | number | undefined,
    period: RegimePeriod,
) => {
    updateRegimePeriodField(index, 'uma_value_year', value ? Number(value) : 0);
    updateRegimePeriodField(
        index,
        'integrated_balance',
        period.integrated_balance ?? 0,
    );
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
</script>

<template>
    <div class="space-y-2">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Periodos de regimen
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">
            Captura las fechas de cotizacion por tipo de regimen.
        </p>
    </div>

    <div
        class="overflow-hidden rounded-sm border border-slate-200 dark:border-slate-800"
    >
        <div class="overflow-x-auto">
            <table
                class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800"
            >
                <thead class="bg-slate-50 dark:bg-slate-950/60">
                    <tr>
                        <th
                            class="w-[28%] px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Tipo de regimen
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
                            Saldo Integrado
                        </th>

                        <th class="w-16 px-4 py-3">
                            <span class="sr-only">Acciones</span>
                        </th>
                    </tr>
                </thead>

                <tbody
                    class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950"
                >
                    <tr
                        v-for="(period, index) in form.regime_periods"
                        :key="period.id ?? `${period.regime_type}-${index}`"
                        class="align-top"
                    >
                        <td class="min-w-56 px-4 py-4">
                            <AppInput
                                v-if="!period.is_fixed"
                                :model-value="period.regime_name"
                                label="Tipo"
                                placeholder="Ej. Regimen anterior"
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
                                label="Tipo"
                                disabled
                                :error="periodError(index, 'regime_type')"
                            />
                        </td>

                        <td class="min-w-md px-4 py-4">
                            <div class="grid gap-3 sm:grid-cols-2">
                                <AppInput
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

                                <AppInput
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
                                placeholder="113.14"
                                maxlength="100"
                                :error="periodError(index, 'uma_value_year')"
                                required
                                @update:model-value="
                                    updateUMA(index, $event, period)
                                "
                                @blur="validateRegimePeriods"
                            />
                        </td>

                        <td class="min-w-56 px-4 py-4">
                            <div class="grid gap-2" v-if="period.is_fixed">
                                <span class="ui-label text-sm font-medium">
                                    Saldo Integrado
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
                                label="Saldo Integrado"
                                placeholder="230.85"
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
</template>
