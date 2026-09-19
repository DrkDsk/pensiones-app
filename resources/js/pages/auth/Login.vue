<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import PasskeyVerify from '@/components/PasskeyVerify.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

defineOptions({
    layout: {
        title: 'Inicia sesión en tu cuenta',
        description:
            'Ingresa tu correo electrónico y contraseña para iniciar sesión',
    },
});

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();
</script>

<template>
    <Head title="Iniciar sesión" />

    <AppAlert v-if="status" variant="success" class="mb-5">
        {{ status }}
    </AppAlert>

    <PasskeyVerify />

    <Form
        v-bind="store.form()"
        :reset-on-success="['password']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-6"
    >
        <div class="grid gap-6">
            <div>
                <AppInput
                    id="email"
                    type="email"
                    name="email"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="email"
                    placeholder="email@example.com"
                    label="Correo electrónico"
                    :error="errors.email"
                />
            </div>

            <div class="grid gap-2">
                <div class="flex items-center justify-between">
                    <label
                        for="password"
                        class="text-sm font-medium text-text-primary"
                        >Contraseña</label
                    >
                    <TextLink
                        v-if="canResetPassword"
                        :href="request()"
                        class="text-sm"
                        :tabindex="5"
                    >
                        ¿Olvidaste tu contraseña?
                    </TextLink>
                </div>
                <PasswordInput
                    id="password"
                    name="password"
                    :error="errors.password"
                    required
                    :tabindex="2"
                    autocomplete="current-password"
                    placeholder="Contraseña"
                />
            </div>

            <div class="flex items-center justify-between">
                <label
                    for="remember"
                    class="flex items-center gap-3 text-sm font-medium text-text-secondary"
                >
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        :tabindex="3"
                        class="size-4 rounded border-border-default text-primary"
                    />
                    <span>Recordar este dispositivo</span>
                </label>
            </div>

            <AppButton
                type="submit"
                class="mt-4 w-full"
                :tabindex="4"
                :loading="processing"
                data-test="login-button"
            >
                Iniciar sesión
            </AppButton>
        </div>

        <div class="text-center text-sm text-text-secondary">
            ¿No tienes una cuenta?
            <TextLink :href="register()" :tabindex="5">Regístrate</TextLink>
        </div>
    </Form>
</template>
