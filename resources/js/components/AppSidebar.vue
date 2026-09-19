<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { LayoutGrid } from '@lucide/vue';
import AppLogo from '@/components/AppLogo.vue';
import NavUser from '@/components/NavUser.vue';
import SidebarNavItem from '@/components/SidebarNavItem.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { cn } from '@/lib/utils';
import { dashboard, calculate } from '@/routes';
import type { NavItem } from '@/types';

const props = withDefaults(
    defineProps<{
        isOpen?: boolean;
        onNavigate?: () => void;
    }>(),
    {
        isOpen: false,
    },
);

const mainNavItems: NavItem[] = [
    {
        title: 'Panel de control',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Formulario',
        href: calculate(),
        icon: LayoutGrid,
    },
];

const { isCurrentOrParentUrl } = useCurrentUrl();

const handleNavigate = () => {
    props.onNavigate?.();
};

const handleSidebarAction = (event: MouseEvent) => {
    const target = event.target;

    if (target instanceof HTMLElement && target.closest('a, button')) {
        handleNavigate();
    }
};
</script>

<template>
    <aside
        id="app-sidebar"
        :class="
            cn(
                'fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] shrink-0 flex-col border-r border-on-primary/10 bg-sidebar-background px-4 py-5 text-on-primary shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-72 lg:translate-x-0 lg:shadow-none',
                props.isOpen ? 'translate-x-0' : '-translate-x-full',
            )
        "
        aria-label="Navegación principal"
    >
        <Link
            :href="dashboard()"
            class="mb-8 flex items-center rounded-lg px-2 py-1"
            @click="handleNavigate"
        >
            <AppLogo />
        </Link>

        <div
            class="mb-4 px-3 text-xs font-semibold tracking-[0.18em] text-on-primary/70 uppercase"
        >
            Plataforma
        </div>
        <nav class="space-y-1" aria-label="Navegación principal">
            <SidebarNavItem
                v-for="item in mainNavItems"
                :key="item.title"
                :title="item.title"
                :href="item.href"
                :icon="item.icon"
                :active="isCurrentOrParentUrl(item.href)"
                @navigate="handleNavigate"
            />
        </nav>

        <div
            class="mt-auto border-t border-on-primary/10 pt-4"
            @click.capture="handleSidebarAction"
        >
            <NavUser />
        </div>
    </aside>
    <slot />
</template>
