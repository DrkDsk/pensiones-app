<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import AppContent from '@/components/AppContent.vue';
import AppShell from '@/components/AppShell.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppSidebarHeader from '@/components/AppSidebarHeader.vue';
import ToastStack from '@/components/ToastStack.vue';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const isSidebarOpen = ref(false);
let previousBodyOverflow: string | null = null;
let mediaQuery: MediaQueryList | null = null;

const closeSidebar = () => {
    isSidebarOpen.value = false;
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeSidebar();
    }
};

const handleDesktopBreakpoint = (event: MediaQueryListEvent) => {
    if (event.matches) {
        closeSidebar();
    }
};

watch(isSidebarOpen, (isOpen) => {
    if (isOpen) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return;
    }

    if (previousBodyOverflow !== null) {
        document.body.style.overflow = previousBodyOverflow;
        previousBodyOverflow = null;
    }
});

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
    mediaQuery = window.matchMedia('(min-width: 1024px)');
    mediaQuery.addEventListener('change', handleDesktopBreakpoint);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
    mediaQuery?.removeEventListener('change', handleDesktopBreakpoint);

    if (previousBodyOverflow !== null) {
        document.body.style.overflow = previousBodyOverflow;
    }
});
</script>

<template>
    <AppShell variant="sidebar">
        <AppSidebar :is-open="isSidebarOpen" :on-navigate="closeSidebar" />
        <button
            v-if="isSidebarOpen"
            class="fixed inset-0 z-40 bg-black/55 transition-opacity lg:hidden"
            type="button"
            aria-label="Cerrar navegación"
            @click="closeSidebar"
        />
        <AppContent variant="sidebar" class="overflow-x-hidden">
            <AppSidebarHeader
                :breadcrumbs="breadcrumbs"
                :sidebar-open="isSidebarOpen"
                @toggle-sidebar="toggleSidebar"
            />
            <slot />
        </AppContent>
        <ToastStack />
    </AppShell>
</template>
