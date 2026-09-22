<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { login } from '@/routes';
import { store } from '@/routes/register';

defineProps<{
    passwordRules: string;
}>();

defineOptions({
    layout: {
        title: 'Crear una cuenta',
        description: 'Ingresa tus datos para crear tu cuenta',
    },
});
</script>

<template>
    <Head title="Registro" />

    <Form
        v-bind="store.form()"
        :reset-on-success="['password', 'password_confirmation']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-6"
    >
        <div class="grid gap-6">
            <div>
                <AppInput
                    id="name"
                    type="text"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="name"
                    name="name"
                    placeholder="Nombre completo"
                    label="Nombre"
                    :error="errors.name"
                />
            </div>

            <div>
                <AppInput
                    id="email"
                    type="email"
                    required
                    :tabindex="2"
                    autocomplete="email"
                    name="email"
                    placeholder="email@example.com"
                    label="Correo electrónico"
                    :error="errors.email"
                />
            </div>

            <div class="grid gap-2">
                <label
                    for="password"
                    class="text-sm font-medium text-text-primary"
                    >Contraseña</label
                >
                <PasswordInput
                    id="password"
                    required
                    :tabindex="3"
                    autocomplete="new-password"
                    name="password"
                    placeholder="Contraseña"
                    :passwordrules="passwordRules"
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
                    required
                    :tabindex="4"
                    autocomplete="new-password"
                    name="password_confirmation"
                    placeholder="Confirmar contraseña"
                    :passwordrules="passwordRules"
                    :error="errors.password_confirmation"
                />
            </div>

            <AppButton
                type="submit"
                class="mt-2 w-full"
                tabindex="5"
                :loading="processing"
                data-test="register-user-button"
            >
                Crear cuenta
            </AppButton>
        </div>

        <div class="text-center text-sm text-text-secondary">
            ¿Ya tienes una cuenta?
            <TextLink
                :href="login()"
                class="underline underline-offset-4"
                :tabindex="6"
                >Iniciar sesión</TextLink
            >
        </div>
    </Form>
</template>
