<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { ShieldCheck } from '@lucide/vue';
import { onUnmounted, ref } from 'vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import { disable, enable } from '@/routes/two-factor';

export type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

withDefaults(defineProps<Props>(), {
    canManageTwoFactor: false,
    requiresConfirmation: false,
    twoFactorEnabled: false,
});

const { hasSetupData, clearTwoFactorAuthData } = useTwoFactorAuth();
const showSetupModal = ref<boolean>(false);

onUnmounted(() => clearTwoFactorAuthData());
</script>

<template>
    <AppCard v-if="canManageTwoFactor" class="p-6">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-on-surface">
                Autenticación de dos factores
            </h2>
            <p class="mt-1 text-sm text-text-secondary">
                Administra la configuración de autenticación de dos factores.
            </p>
        </div>

        <div
            v-if="!twoFactorEnabled"
            class="flex flex-col items-start justify-start space-y-4"
        >
            <p class="text-sm leading-6 text-text-secondary">
                Al activar la autenticación de dos factores, se te solicitará un
                código seguro al iniciar sesión. Puedes obtenerlo desde una
                aplicación compatible con TOTP en tu teléfono.
            </p>

            <div>
                <AppButton v-if="hasSetupData" @click="showSetupModal = true">
                    <ShieldCheck />Continuar configuración
                </AppButton>
                <Form
                    v-else
                    v-bind="enable.form()"
                    @success="showSetupModal = true"
                    #default="{ processing }"
                >
                    <AppButton type="submit" :loading="processing">
                        Activar 2FA
                    </AppButton>
                </Form>
            </div>
        </div>

        <div v-else class="flex flex-col items-start justify-start space-y-4">
            <p class="text-sm leading-6 text-text-secondary">
                Al iniciar sesión se te solicitará un código seguro y aleatorio,
                que puedes obtener desde la aplicación compatible con TOTP en tu
                teléfono.
            </p>

            <div class="relative inline">
                <Form v-bind="disable.form()" #default="{ processing }">
                    <AppButton
                        variant="danger"
                        type="submit"
                        :loading="processing"
                    >
                        Desactivar 2FA
                    </AppButton>
                </Form>
            </div>

            <TwoFactorRecoveryCodes />
        </div>

        <TwoFactorSetupModal
            v-model:isOpen="showSetupModal"
            :requiresConfirmation="requiresConfirmation"
            :twoFactorEnabled="twoFactorEnabled"
        />
    </AppCard>
</template>
