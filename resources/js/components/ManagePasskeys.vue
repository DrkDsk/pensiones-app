<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { KeyRound } from '@lucide/vue';
import { destroy } from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyRegistrationController';
import AppCard from '@/components/AppCard.vue';
import EmptyState from '@/components/EmptyState.vue';
import PasskeyItem from '@/components/PasskeyItem.vue';
import PasskeyRegister from '@/components/PasskeyRegister.vue';
import type { Passkey } from '@/types/auth';

export type Props = {
    canManagePasskeys?: boolean;
    passkeys?: Passkey[];
};

withDefaults(defineProps<Props>(), {
    canManagePasskeys: false,
    passkeys: () => [],
});

const handleDelete = (id: number, onError: () => void) => {
    router.delete(destroy.url(id), {
        preserveScroll: true,
        onError,
    });
};

const handleRegisterSuccess = () => {
    router.reload();
};
</script>

<template>
    <AppCard v-if="canManagePasskeys" class="p-6">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-on-surface">
                Claves de acceso
            </h2>
            <p class="mt-1 text-sm text-text-secondary">
                Administra tus claves de acceso para iniciar sesión sin
                contraseña.
            </p>
        </div>

        <div class="overflow-hidden rounded-lg border border-border-default">
            <template v-if="passkeys.length">
                <PasskeyItem
                    v-for="passkey in passkeys"
                    :key="passkey.id"
                    :passkey="passkey"
                    @remove="handleDelete"
                />
            </template>

            <EmptyState
                v-else
                title="Aún no hay claves de acceso"
                description="Agrega una clave de acceso para iniciar sesión sin contraseña."
                :icon="KeyRound"
                class="m-4"
            />
        </div>

        <PasskeyRegister @success="handleRegisterSuccess" />
    </AppCard>
</template>
