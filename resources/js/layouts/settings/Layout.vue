<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { MonitorCog, ShieldCheck, UserRound } from '@lucide/vue';
import AppCard from '@/components/AppCard.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: editProfile(),
        icon: UserRound,
    },
    {
        title: 'Seguridad',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Apariencia',
        href: editAppearance(),
        icon: MonitorCog,
    },
];

const { isCurrentOrParentUrl } = useCurrentUrl();
</script>

<template>
    <div class="p-4 md:p-8">
        <div class="mb-8">
            <h1 class="text-2xl font-semibold text-text-primary">
                Configuración
            </h1>
            <p class="mt-2 text-sm text-text-secondary">
                Administra la cuenta, la autenticación y las preferencias del
                espacio de trabajo.
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[17rem_1fr]">
            <AppCard class="h-fit p-3">
                <nav class="grid gap-1" aria-label="Configuración">
                    <Link
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        :href="item.href"
                        :class="[
                            'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
                            isCurrentOrParentUrl(item.href)
                                ? 'bg-primary text-on-primary'
                                : 'text-text-secondary hover:bg-border-muted hover:text-text-primary',
                        ]"
                    >
                        <component :is="item.icon" class="size-4" />
                        {{ item.title }}
                    </Link>
                </nav>
            </AppCard>

            <section class="max-w-3xl space-y-6">
                <slot />
            </section>
        </div>
    </div>
</template>
