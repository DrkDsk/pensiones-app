<script setup lang="ts">
import { Search } from '@lucide/vue';
import { nextTick, ref, watch } from 'vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTextArea from '@/components/AppTextArea.vue';
import type { Client } from '@/models/client';
import type {
    CalculateForm,
    ClientValidationField,
    FamilyInformationField,
    ManualClientField,
    StepErrors,
} from '../types/calculate';

const props = defineProps<{
    form: CalculateForm;
    stepErrors: StepErrors;
    clientSearch: string;
    filteredClients: Client[];
    selectedClient: Client | null;
    showClientDropdown: boolean;
    showManualCustomerFields: boolean;
    manualCustomerMode: boolean;
    manualFocusRequest: number;
    handleSearchInput: (event: Event) => void;
    selectClient: (client: Client) => void;
    activateManualCustomer: () => void;
    hideDropdown: () => void;
    handleManualInput: (
        field: ManualClientField,
        value: string | number | undefined,
    ) => void;
    handleFamilyInformationInput: (
        field: FamilyInformationField,
        value: string | number | undefined,
    ) => void;
    validateClientField: (
        field: ClientValidationField,
        options?: { requireRequiredFields?: boolean },
    ) => boolean;
    validateFamilyInformationField: (
        field: FamilyInformationField,
        options?: { requireRequiredFields?: boolean },
    ) => boolean;
}>();

const emit = defineEmits<{
    'update:showClientDropdown': [value: boolean];
}>();

const manualNameInputRef = ref<{ focus: () => void } | null>(null);

watch(
    () => props.manualFocusRequest,
    async () => {
        if (props.showManualCustomerFields && !props.selectedClient) {
            await nextTick();
            manualNameInputRef.value?.focus?.();
        }
    },
);
</script>

<template>
    <div class="space-y-2">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Cliente
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">
            Busca un cliente existente o captura los datos para continuar.
        </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div class="space-y-4">
            <div class="relative">
                <label
                    class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                    Buscar cliente
                </label>
                <div class="relative">
                    <span
                        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
                    >
                        <Search class="size-4" />
                    </span>
                    <input
                        :value="clientSearch"
                        type="text"
                        placeholder="Nombre, apellido, telefono, correo o CURP"
                        class="focus:border-primary-500 focus:ring-primary-500/15 block w-full rounded-sm border bg-white py-2 pr-4 pl-10 text-sm text-slate-900 transition duration-200 ease-in-out placeholder:text-slate-400 focus:ring-2 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                        :class="
                            stepErrors.client_id
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                                : 'border-slate-200'
                        "
                        @input="handleSearchInput"
                        @focus="emit('update:showClientDropdown', true)"
                        @blur="hideDropdown"
                    />
                </div>
                <p
                    v-if="stepErrors.client_id"
                    class="mt-1.5 text-xs text-rose-600 dark:text-rose-300"
                >
                    {{ stepErrors.client_id }}
                </p>

                <div
                    v-if="showClientDropdown"
                    class="z-20 mt-2 w-full overflow-hidden rounded-sm border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
                >
                    <button
                        v-for="client in filteredClients"
                        :key="client.id"
                        type="button"
                        class="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                        @mousedown.prevent="selectClient(client)"
                    >
                        <div class="min-w-0">
                            <p
                                class="truncate text-sm font-medium text-slate-900 dark:text-slate-100"
                            >
                                {{
                                    `${client.name ?? ''} ${client.last_name ?? ''}`.trim()
                                }}
                            </p>
                            <p
                                class="mt-1 text-xs text-slate-500 dark:text-slate-400"
                            >
                                {{ client.phone || 'Sin telefono registrado' }}
                            </p>
                        </div>
                        <span class="text-xs text-slate-400 dark:text-slate-500"
                            >Seleccionar</span
                        >
                    </button>

                    <div
                        v-if="!filteredClients.length"
                        class="px-4 py-4 text-sm text-slate-500 dark:text-slate-400"
                    >
                        No encontramos coincidencias con esa busqueda.
                    </div>
                </div>
            </div>

            <div
                v-if="selectedClient"
                class="bg-primary-500/5 dark:bg-primary-500/10 rounded-sm border border-slate-200 px-4 py-4 dark:border-slate-800"
            >
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p
                            class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400"
                        >
                            Cliente seleccionado
                        </p>
                        <p
                            class="mt-2 text-base font-semibold text-slate-600 dark:text-slate-300"
                        >
                            {{
                                `${selectedClient.name ?? ''} ${selectedClient.last_name ?? ''}`.trim()
                            }}
                        </p>
                        <p
                            class="mt-1 text-sm text-slate-500 dark:text-slate-400"
                        >
                            {{
                                selectedClient.phone ||
                                'Sin telefono registrado'
                            }}
                        </p>
                        <p
                            v-if="selectedClient.email"
                            class="mt-1 text-sm text-slate-500 dark:text-slate-400"
                        >
                            {{ selectedClient.email }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                        @click="activateManualCustomer"
                    >
                        Cambiar
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <AppButton variant="ghost" @click="activateManualCustomer">
                    + Nuevo cliente
                </AppButton>
                <p class="text-xs text-slate-400 dark:text-slate-500">
                    Captura manual solo si no existe en la lista.
                </p>
            </div>
        </div>

        <div
            class="rounded-sm border border-dashed border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50"
        >
            <p
                class="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500"
            >
                Contexto rapido
            </p>
            <div
                class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300"
            >
                <p>
                    Usa la busqueda para evitar duplicados y conservar historial
                    del cliente.
                </p>
                <p>
                    Si no existe, puedes capturarlo manualmente y continuar sin
                    friccion.
                </p>
            </div>
        </div>
    </div>

    <div
        v-if="showManualCustomerFields && !selectedClient"
        class="grid gap-4 rounded-sm border border-slate-200 bg-slate-50/60 p-5 md:grid-cols-2 dark:border-slate-800 dark:bg-slate-950/40"
    >
        <AppInput
            ref="manualNameInputRef"
            :model-value="form.client.name"
            label="Nombre"
            placeholder="Ej. Maria"
            :required="!form.client_id"
            :error="stepErrors.name"
            @update:model-value="handleManualInput('name', $event)"
            @blur="
                validateClientField('name', {
                    requireRequiredFields: true,
                })
            "
        />

        <AppInput
            :model-value="form.client.last_name"
            label="Apellidos"
            placeholder="Ej. Lopez Hernandez"
            :error="stepErrors.last_name"
            @update:model-value="handleManualInput('last_name', $event)"
        />

        <AppInput
            :model-value="form.client.phone"
            label="Telefono"
            placeholder="Ej. 55 1234 5678"
            :error="stepErrors.phone"
            @update:model-value="handleManualInput('phone', $event)"
            @blur="validateClientField('phone')"
        />

        <AppInput
            :model-value="form.client.email"
            label="Correo electronico"
            placeholder="cliente@correo.com"
            type="email"
            :error="stepErrors.email"
            @update:model-value="handleManualInput('email', $event)"
            @blur="validateClientField('email')"
        />

        <AppInput
            :model-value="form.client.curp"
            label="CURP"
            placeholder="Ej. LOMM800101HDFPRR09"
            :required="!form.client_id"
            :error="stepErrors.curp"
            @update:model-value="handleManualInput('curp', $event)"
            @blur="
                validateClientField('curp', {
                    requireRequiredFields: true,
                })
            "
        />

        <AppInput
            :model-value="form.client.birthdate"
            label="Fecha de nacimiento"
            type="date"
            :required="!form.client_id"
            :error="stepErrors.birthdate"
            @update:model-value="handleManualInput('birthdate', $event)"
            @blur="
                validateClientField('birthdate', {
                    requireRequiredFields: true,
                })
            "
        />

        <AppInput
            :model-value="form.client.nss"
            label="NSS"
            placeholder="11 digitos"
            inputmode="numeric"
            :required="!form.client_id"
            :error="stepErrors.nss"
            @update:model-value="handleManualInput('nss', $event)"
            @blur="
                validateClientField('nss', {
                    requireRequiredFields: true,
                })
            "
        />

        <AppInput
            :model-value="form.client.regime_end_date"
            label="Fecha de baja de regimen"
            type="date"
            :error="stepErrors.regime_end_date"
            @update:model-value="handleManualInput('regime_end_date', $event)"
            @blur="validateClientField('regime_end_date')"
        />

        <AppInput
            :model-value="form.client.unemployment_assistance_discounted_weeks"
            label="Semanas descontadas por ayuda de desempleo"
            type="number"
            min="0"
            step="1"
            :required="!form.client_id"
            :error="stepErrors.unemployment_assistance_discounted_weeks"
            @update:model-value="
                handleManualInput(
                    'unemployment_assistance_discounted_weeks',
                    $event,
                )
            "
            @blur="
                validateClientField(
                    'unemployment_assistance_discounted_weeks',
                    {
                        requireRequiredFields: true,
                    },
                )
            "
        />

        <div
            class="border-t border-slate-200 pt-5 md:col-span-2 dark:border-slate-800"
        >
            <div class="mb-4">
                <h4
                    class="text-sm font-semibold text-slate-800 dark:text-slate-100"
                >
                    Información familiar
                </h4>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                <AppSelect
                    :model-value="form.family_information.has_spouse"
                    label="Esposo/a"
                    :required="!form.client_id"
                    :error="stepErrors.has_spouse"
                    @update:model-value="
                        handleFamilyInformationInput('has_spouse', $event)
                    "
                    @blur="
                        validateFamilyInformationField('has_spouse', {
                            requireRequiredFields: true,
                        })
                    "
                >
                    <option value="">Seleccionar</option>
                    <option value="1">Si</option>
                    <option value="0">No</option>
                </AppSelect>

                <AppInput
                    :model-value="
                        form.family_information.minor_or_student_children_count
                    "
                    label="Hijos menores o estudiando"
                    type="number"
                    min="0"
                    step="1"
                    :required="!form.client_id"
                    :error="stepErrors.minor_or_student_children_count"
                    @update:model-value="
                        handleFamilyInformationInput(
                            'minor_or_student_children_count',
                            $event,
                        )
                    "
                    @blur="
                        validateFamilyInformationField(
                            'minor_or_student_children_count',
                            {
                                requireRequiredFields: true,
                            },
                        )
                    "
                />

                <AppSelect
                    :model-value="form.family_information.parents_count"
                    label="Padres"
                    :required="!form.client_id"
                    :error="stepErrors.parents_count"
                    @update:model-value="
                        handleFamilyInformationInput('parents_count', $event)
                    "
                    @blur="
                        validateFamilyInformationField('parents_count', {
                            requireRequiredFields: true,
                        })
                    "
                >
                    <option :value="1">1</option>
                    <option :value="2">2</option>
                </AppSelect>
            </div>
        </div>

        <AppTextArea
            :model-value="form.client.notes"
            label="Notas del cliente"
            placeholder="Datos adicionales del expediente"
            :error="stepErrors.notes"
            class="md:col-span-2"
            @update:model-value="handleManualInput('client_notes', $event)"
        />
    </div>
</template>
