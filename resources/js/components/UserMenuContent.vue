<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { LogOut, Settings } from '@lucide/vue';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

defineProps<{
    user: User;
}>();

const handleLogout = () => {
    router.flushAll();
};
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center gap-3 rounded-lg bg-on-primary/5 p-3">
            <div
                class="flex size-10 items-center justify-center rounded-md bg-secondary text-on-primary"
            >
                <span class="text-sm font-semibold">
                    {{ user.name.charAt(0).toUpperCase() }}
                </span>
            </div>
            <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-on-primary">
                    {{ user.name }}
                </p>
                <p class="truncate text-xs text-on-primary/75">
                    {{ user.email }}
                </p>
            </div>
        </div>

        <div class="grid gap-1">
            <Link
                :href="edit()"
                prefetch
                class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-on-primary/75 transition hover:bg-on-primary/10 hover:text-on-primary"
            >
                <Settings class="size-4" />
                Configuración
            </Link>
            <Link
                :href="logout()"
                method="post"
                as="button"
                data-test="logout-button"
                class="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-on-primary/75 transition hover:bg-on-primary/10 hover:text-on-primary"
                @click="handleLogout"
            >
                <LogOut class="size-4" />
                Cerrar Sesión
            </Link>
        </div>
    </div>
</template>
