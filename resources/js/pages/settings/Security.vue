<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import type { Props as ManagePasskeysProps } from '@/components/ManagePasskeys.vue';
import ManagePasskeys from '@/components/ManagePasskeys.vue';
import type { Props as ManageTwoFactorProps } from '@/components/ManageTwoFactor.vue';
import ManageTwoFactor from '@/components/ManageTwoFactor.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Configuración de seguridad',
                href: edit(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Configuración de seguridad" />

    <h1 class="sr-only">Configuración de seguridad</h1>

    <AppCard class="p-6">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-on-surface">
                Actualizar contraseña
            </h2>
            <p class="mt-1 text-sm text-text-secondary">
                Asegúrate de usar una contraseña larga y aleatoria para mantener
                segura tu cuenta.
            </p>
        </div>
        <Form
            v-bind="SecurityController.update.form()"
            :options="{
                preserveScroll: true,
            }"
            reset-on-success
            :reset-on-error="[
                'password',
                'password_confirmation',
                'current_password',
            ]"
            class="space-y-6"
            v-slot="{ errors, processing }"
        >
            <div class="grid gap-2">
                <label
                    for="current_password"
                    class="text-sm font-medium text-text-primary"
                    >Contraseña actual</label
                >
                <PasswordInput
                    id="current_password"
                    name="current_password"
                    autocomplete="current-password"
                    placeholder="Contraseña actual"
                    :error="errors.current_password"
                />
            </div>

            <div class="grid gap-2">
                <label
                    for="password"
                    class="text-sm font-medium text-text-primary"
                    >Nueva contraseña</label
                >
                <PasswordInput
                    id="password"
                    name="password"
                    autocomplete="new-password"
                    placeholder="Nueva contraseña"
                    :passwordrules="props.passwordRules"
                    :error="errors.password"
                />
            </div>

            <div class="grid gap-2">
                <label
                    for="password_confirmation"
                    class="text-sm font-medium text-text-primary"
                    >Confirmar contraseña</label
                >
                <PasswordInput
                    id="password_confirmation"
                    name="password_confirmation"
                    autocomplete="new-password"
                    placeholder="Confirmar contraseña"
                    :passwordrules="props.passwordRules"
                    :error="errors.password_confirmation"
                />
            </div>

            <div class="flex items-center gap-4">
                <AppButton
                    :loading="processing"
                    data-test="update-password-button"
                >
                    Guardar contraseña
                </AppButton>
            </div>
        </Form>
    </AppCard>

    <ManageTwoFactor
        :canManageTwoFactor="canManageTwoFactor"
        :requiresConfirmation="requiresConfirmation"
        :twoFactorEnabled="twoFactorEnabled"
    />

    <ManagePasskeys
        :canManagePasskeys="canManagePasskeys"
        :passkeys="passkeys"
    />
</template>
