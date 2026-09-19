<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import TextLink from '@/components/TextLink.vue';
import { login } from '@/routes';
import { email } from '@/routes/password';

defineOptions({
    layout: {
        title: 'Olvidé mi contraseña',
        description:
            'Ingresa tu correo electrónico para recibir un enlace de restablecimiento',
    },
});

defineProps<{
    status?: string;
}>();
</script>

<template>
    <Head title="Olvidé mi contraseña" />

    <AppAlert v-if="status" variant="success" class="mb-5">
        {{ status }}
    </AppAlert>

    <div class="space-y-6">
        <Form v-bind="email.form()" v-slot="{ errors, processing }">
            <div>
                <AppInput
                    id="email"
                    type="email"
                    name="email"
                    autocomplete="off"
                    autofocus
                    placeholder="email@example.com"
                    label="Correo electrónico"
                    :error="errors.email"
                />
            </div>

            <div class="my-6 flex items-center justify-start">
                <AppButton
                    class="w-full"
                    :loading="processing"
                    data-test="email-password-reset-link-button"
                >
                    Enviar enlace para restablecer la contraseña
                </AppButton>
            </div>
        </Form>

        <div class="space-x-1 text-center text-sm text-text-secondary">
            <span>O regresa a</span>
            <TextLink :href="login()">iniciar sesión</TextLink>
        </div>
    </div>
</template>
