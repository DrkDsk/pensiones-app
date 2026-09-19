<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from '@lucide/vue';
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import AlertError from '@/components/AlertError.vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import { regenerateRecoveryCodes } from '@/routes/two-factor';

const { recoveryCodesList, fetchRecoveryCodes, errors } = useTwoFactorAuth();
const isRecoveryCodesVisible = ref<boolean>(false);
const recoveryCodeSectionRef = useTemplateRef('recoveryCodeSectionRef');

const toggleRecoveryCodesVisibility = async () => {
    if (!isRecoveryCodesVisible.value && !recoveryCodesList.value.length) {
        await fetchRecoveryCodes();
    }

    isRecoveryCodesVisible.value = !isRecoveryCodesVisible.value;

    if (isRecoveryCodesVisible.value) {
        await nextTick();
        recoveryCodeSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
    }
};

onMounted(async () => {
    if (!recoveryCodesList.value.length) {
        await fetchRecoveryCodes();
    }
});
</script>

<template>
    <AppCard class="w-full p-5">
        <div class="mb-5">
            <h3 class="flex gap-3 font-semibold text-on-surface">
                <LockKeyhole class="size-4" />Códigos de recuperación de 2FA
            </h3>
            <p class="mt-2 text-sm text-text-secondary">
                Los códigos de recuperación te permiten volver a acceder si
                pierdes tu dispositivo de 2FA. Guárdalos en un gestor de
                contraseñas seguro.
            </p>
        </div>
        <div
            class="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between"
        >
            <AppButton @click="toggleRecoveryCodesVisibility" class="w-fit">
                <component
                    :is="isRecoveryCodesVisible ? EyeOff : Eye"
                    class="size-4"
                />
                {{ isRecoveryCodesVisible ? 'Ocultar' : 'Ver' }} códigos de
                recuperación
            </AppButton>

            <Form
                v-if="isRecoveryCodesVisible && recoveryCodesList.length"
                v-bind="regenerateRecoveryCodes.form()"
                method="post"
                :options="{ preserveScroll: true }"
                @success="fetchRecoveryCodes"
                #default="{ processing }"
            >
                <AppButton
                    variant="secondary"
                    type="submit"
                    :loading="processing"
                >
                    <RefreshCw /> Regenerar códigos
                </AppButton>
            </Form>
        </div>
        <div
            :class="[
                'relative overflow-hidden transition-all duration-300',
                isRecoveryCodesVisible ? 'h-auto opacity-100' : 'h-0 opacity-0',
            ]"
        >
            <div v-if="errors?.length" class="mt-6">
                <AlertError :message="errors.join(', ')" />
            </div>
            <div v-else class="mt-3 space-y-3">
                <div
                    ref="recoveryCodeSectionRef"
                    class="grid gap-1 rounded-lg bg-background p-4 font-mono text-sm text-text-primary"
                >
                    <div v-if="!recoveryCodesList.length" class="space-y-2">
                        <SkeletonLoader variant="tables" :rows="4" />
                    </div>
                    <div
                        v-else
                        v-for="(code, index) in recoveryCodesList"
                        :key="index"
                    >
                        {{ code }}
                    </div>
                </div>
                <p class="text-xs text-text-secondary select-none">
                    Cada código de recuperación se puede usar una sola vez para
                    acceder a tu cuenta y se eliminará después de usarlo. Si
                    necesitas más, haz clic en
                    <span class="font-bold">Regenerar códigos</span> arriba.
                </p>
            </div>
        </div>
    </AppCard>
</template>
