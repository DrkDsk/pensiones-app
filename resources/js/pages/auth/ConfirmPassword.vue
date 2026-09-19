<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import AppButton from '@/components/AppButton.vue';
import PasskeyVerify from '@/components/PasskeyVerify.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { store } from '@/routes/password/confirm';

defineOptions({
    layout: {
        title: 'Confirmar contraseña',
        description:
            'Esta es un área segura de la aplicación. Confirma tu contraseña antes de continuar.',
    },
});
</script>

<template>
    <Head title="Confirmar contraseña" />

    <PasskeyVerify
        :routes="{
            options: confirmOptions(),
            submit: confirmStore(),
        }"
        label="Confirmar con clave de acceso"
        loading-label="Confirmando..."
        separator="O confirmar con contraseña"
    />

    <Form
        v-bind="store.form()"
        reset-on-success
        v-slot="{ errors, processing }"
    >
        <div class="space-y-6">
            <div class="grid gap-2">
                <label
                    for="password"
                    class="text-sm font-medium text-text-primary"
                    >Contraseña</label
                >
                <PasswordInput
                    id="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    autofocus
                    :error="errors.password"
                />
            </div>

            <div class="flex items-center">
                <AppButton
                    class="w-full"
                    :loading="processing"
                    data-test="confirm-password-button"
                >
                    Confirmar contraseña
                </AppButton>
            </div>
        </div>
    </Form>
</template>
