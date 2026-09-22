<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { AlertTriangle } from '@lucide/vue';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import AppInput from '@/components/AppInput.vue';
import AppModal from '@/components/AppModal.vue';
import AppTextArea from '@/components/AppTextArea.vue';
import clients from '@/routes/clients';
import { useCreateClientForm } from './composables/useCreateClientForm';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Clientes',
                href: clients.index(),
            },
            {
                title: 'Registrar cliente',
                href: clients.create(),
            },
        ],
    },
});

const {
    form,
    duplicateDialogOpen,
    duplicateMessage,
    requestError,
    clearFieldError,
    submit,
    cancel,
} = useCreateClientForm();
</script>

<template>
    <Head title="Registrar cliente" />

    <div class="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-8">
        <div>
            <h1 class="text-2xl font-semibold text-text-primary">
                Registrar cliente
            </h1>
            <p class="mt-1 text-sm text-text-secondary">
                Captura la información necesaria para crear el expediente del
                cliente.
            </p>
        </div>

        <AppAlert
            v-if="requestError"
            variant="danger"
            title="No se pudo guardar"
        >
            {{ requestError }}
        </AppAlert>

        <form novalidate @submit.prevent="submit">
            <AppCard class="overflow-hidden">
                <div class="border-b border-border-muted px-6 py-5">
                    <h2 class="text-lg font-semibold text-on-surface">
                        Datos del cliente
                    </h2>
                    <p class="mt-1 text-sm text-text-secondary">
                        Los campos marcados con * son obligatorios.
                    </p>
                </div>

                <div class="grid gap-5 p-6 md:grid-cols-2">
                    <AppInput
                        v-model="form.name"
                        label="Nombre"
                        autocomplete="given-name"
                        maxlength="255"
                        required
                        :error="form.errors.name"
                        @input="clearFieldError('name')"
                    />
                    <AppInput
                        v-model="form.last_name"
                        label="Apellidos"
                        autocomplete="family-name"
                        maxlength="255"
                        :error="form.errors.last_name"
                        @input="clearFieldError('last_name')"
                    />
                    <AppInput
                        v-model="form.phone"
                        label="Teléfono"
                        helper="10 dígitos"
                        type="tel"
                        inputmode="numeric"
                        autocomplete="tel"
                        maxlength="10"
                        pattern="[0-9]{10}"
                        :error="form.errors.phone"
                        @input="clearFieldError('phone')"
                    />
                    <AppInput
                        v-model="form.email"
                        label="Correo electrónico"
                        type="email"
                        autocomplete="email"
                        maxlength="255"
                        :error="form.errors.email"
                        @input="clearFieldError('email')"
                    />
                    <AppInput
                        v-model="form.curp"
                        label="CURP"
                        helper="18 caracteres"
                        autocomplete="off"
                        maxlength="18"
                        class="uppercase"
                        required
                        :error="form.errors.curp"
                        @input="clearFieldError('curp')"
                    />
                    <AppInput
                        v-model="form.nss"
                        label="NSS"
                        helper="11 dígitos"
                        inputmode="numeric"
                        autocomplete="off"
                        maxlength="11"
                        pattern="[0-9]{11}"
                        required
                        :error="form.errors.nss"
                        @input="clearFieldError('nss')"
                    />
                    <AppInput
                        v-model="form.birthdate"
                        label="Fecha de nacimiento"
                        type="date"
                        required
                        :error="form.errors.birthdate"
                        @input="clearFieldError('birthdate')"
                    />
                    <AppInput
                        v-model="form.regime_end_date"
                        label="Fecha de baja del régimen"
                        type="date"
                        :error="form.errors.regime_end_date"
                        @input="clearFieldError('regime_end_date')"
                    />
                    <AppInput
                        v-model="form.unemployment_assistance_discounted_weeks"
                        label="Semanas descontadas por ayuda de desempleo"
                        type="number"
                        inputmode="numeric"
                        min="0"
                        step="1"
                        required
                        :error="
                            form.errors.unemployment_assistance_discounted_weeks
                        "
                        @input="
                            clearFieldError(
                                'unemployment_assistance_discounted_weeks',
                            )
                        "
                    />
                    <div class="md:col-span-2">
                        <AppTextArea
                            v-model="form.notes"
                            label="Notas"
                            :error="form.errors.notes"
                            @input="clearFieldError('notes')"
                        />
                    </div>
                </div>

                <div
                    class="flex flex-col-reverse gap-3 border-t border-border-muted bg-background/50 px-6 py-4 sm:flex-row sm:justify-end"
                >
                    <AppButton
                        type="button"
                        variant="ghost"
                        :disabled="form.processing"
                        @click="cancel"
                    >
                        Cancelar
                    </AppButton>
                    <AppButton
                        type="submit"
                        :loading="form.processing"
                        :disabled="form.processing"
                    >
                        Guardar
                    </AppButton>
                </div>
            </AppCard>
        </form>
    </div>

    <AppModal
        v-model:open="duplicateDialogOpen"
        title="El cliente ya existe."
        :description="duplicateMessage"
    >
        <div class="flex items-start gap-3 rounded-lg bg-warning/10 p-4">
            <AlertTriangle class="mt-0.5 size-5 shrink-0 text-warning" />
            <p class="text-sm text-text-secondary">
                Verifica la información capturada. Los datos del formulario se
                conservarán al cerrar este aviso.
            </p>
        </div>
        <div class="mt-5 flex justify-end">
            <AppButton @click="duplicateDialogOpen = false">
                Entendido
            </AppButton>
        </div>
    </AppModal>
</template>
