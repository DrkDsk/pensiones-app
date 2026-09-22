<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import TextLink from '@/components/TextLink.vue';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

defineOptions({
    layout: {
        title: 'Verificación de correo electrónico',
        description:
            'Verifica tu correo electrónico haciendo clic en el enlace que acabamos de enviarte.',
    },
});

defineProps<{
    status?: string;
}>();
</script>

<template>
    <Head title="Verificación de correo electrónico" />

    <AppAlert
        v-if="status === 'verification-link-sent'"
        variant="success"
        class="mb-5"
    >
        Se envió un nuevo enlace de verificación al correo electrónico que
        proporcionaste durante el registro.
    </AppAlert>

    <Form
        v-bind="send.form()"
        class="space-y-6 text-center"
        v-slot="{ processing }"
    >
        <AppButton :loading="processing" variant="secondary">
            Reenviar correo de verificación
        </AppButton>

        <TextLink :href="logout()" as="button" class="mx-auto block text-sm">
            Cerrar sesión
        </TextLink>
    </Form>
</template>
