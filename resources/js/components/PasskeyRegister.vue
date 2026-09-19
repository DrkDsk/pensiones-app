<script setup lang="ts">
import { usePasskeyRegister } from '@laravel/passkeys/vue';
import { ref } from 'vue';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import InputError from '@/components/InputError.vue';

const emit = defineEmits<{
    success: [];
}>();

const getDefaultPasskeyName = () => {
    const ua = navigator.userAgent;

    const browser = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'].find(
        (browser) => new RegExp(browser).test(ua),
    );

    const os = ['iPhone', 'iPad', 'Android', 'Mac', 'Windows'].find((os) =>
        new RegExp(os).test(ua),
    );

    return [browser, os].filter(Boolean).join(' en ') || '';
};

const name = ref(getDefaultPasskeyName());
const showForm = ref(false);

const { register, isLoading, error, isSupported } = usePasskeyRegister({
    onSuccess: () => {
        name.value = '';
        showForm.value = false;
        emit('success');
    },
});

const handleSubmit = async (event: Event) => {
    event.preventDefault();

    if (!name.value.trim()) {
        return;
    }

    await register(name.value);
};

const handleCancel = () => {
    showForm.value = false;
    name.value = '';
};
</script>

<template>
    <AppAlert v-if="!isSupported" variant="warning">
        Este navegador no admite claves de acceso.
    </AppAlert>

    <AppButton v-else-if="!showForm" variant="ghost" @click="showForm = true">
        Agregar clave de acceso
    </AppButton>

    <form
        v-else
        @submit="handleSubmit"
        class="space-y-4 rounded-lg border border-border-default bg-background p-4"
    >
        <AppInput
            id="passkey-name"
            v-model="name"
            type="text"
            placeholder="Ej.: MacBook Pro, iPhone"
            label="Nombre de la clave de acceso"
            helper="Un nombre te ayuda a identificar esta clave de acceso más adelante."
            autofocus
        />

        <InputError v-if="error" :message="error" />

        <div class="flex gap-2">
            <AppButton
                type="submit"
                :loading="isLoading"
                :disabled="!name.trim()"
            >
                Registrar clave de acceso
            </AppButton>
            <AppButton type="button" variant="ghost" @click="handleCancel">
                Cancelar
            </AppButton>
        </div>
    </form>
</template>
