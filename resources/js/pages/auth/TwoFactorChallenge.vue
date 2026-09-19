<script setup lang="ts">
import { Form, Head, setLayoutProps } from '@inertiajs/vue3';
import { computed, ref, watchEffect } from 'vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import InputError from '@/components/InputError.vue';
import { store } from '@/routes/two-factor/login';
import type { TwoFactorConfigContent } from '@/types';

const showRecoveryInput = ref<boolean>(false);
const code = ref<string>('');

const authConfigContent = computed<TwoFactorConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: 'Código de recuperación',
            description:
                'Confirma el acceso a tu cuenta ingresando uno de tus códigos de recuperación de emergencia.',
            buttonText: 'iniciar sesión con un código de autenticación',
        };
    }

    return {
        title: 'Código de autenticación',
        description:
            'Ingresa el código proporcionado por tu aplicación de autenticación.',
        buttonText: 'iniciar sesión con un código de recuperación',
    };
});

watchEffect(() => {
    setLayoutProps({
        title: authConfigContent.value.title,
        description: authConfigContent.value.description,
    });
});

const toggleRecoveryMode = (clearErrors: () => void): void => {
    showRecoveryInput.value = !showRecoveryInput.value;
    clearErrors();
    code.value = '';
};
</script>

<template>
    <Head title="Autenticación de dos factores" />

    <div class="space-y-6">
        <template v-if="!showRecoveryInput">
            <Form
                v-bind="store.form()"
                class="space-y-4"
                reset-on-error
                @error="code = ''"
                #default="{ errors, processing, clearErrors }"
            >
                <input type="hidden" name="code" :value="code" />
                <div
                    class="flex flex-col items-center justify-center space-y-3 text-center"
                >
                    <div class="flex w-full items-center justify-center">
                        <AppInput
                            id="otp"
                            v-model="code"
                            inputmode="numeric"
                            maxlength="6"
                            :disabled="processing"
                            placeholder="000000"
                            class="text-center text-xl font-semibold tracking-[0.45em]"
                            autofocus
                        />
                    </div>
                    <InputError :message="errors.code" />
                </div>
                <AppButton type="submit" class="w-full" :loading="processing">
                    Continuar
                </AppButton>
                <div class="text-center text-sm text-text-secondary">
                    <span>o puedes </span>
                    <button
                        type="button"
                        class="font-medium text-on-surface underline underline-offset-4 transition hover:text-on-surface/80"
                        @click="() => toggleRecoveryMode(clearErrors)"
                    >
                        {{ authConfigContent.buttonText }}
                    </button>
                </div>
            </Form>
        </template>

        <template v-else>
            <Form
                v-bind="store.form()"
                class="space-y-4"
                reset-on-error
                #default="{ errors, processing, clearErrors }"
            >
                <AppInput
                    name="recovery_code"
                    type="text"
                    placeholder="Ingresa el código de recuperación"
                    :autofocus="showRecoveryInput"
                    required
                    :error="errors.recovery_code"
                />
                <AppButton type="submit" class="w-full" :loading="processing">
                    Continuar
                </AppButton>

                <div class="text-center text-sm text-text-secondary">
                    <span>o puedes </span>
                    <button
                        type="button"
                        class="font-medium text-on-surface underline underline-offset-4 transition hover:text-on-surface/80"
                        @click="() => toggleRecoveryMode(clearErrors)"
                    >
                        {{ authConfigContent.buttonText }}
                    </button>
                </div>
            </Form>
        </template>
    </div>
</template>
