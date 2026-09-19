<script setup lang="ts">
import { Menu } from '@lucide/vue';
import AppButton from '@/components/AppButton.vue';
import type { BreadcrumbItem } from '@/types';

const props = withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
        sidebarOpen?: boolean;
    }>(),
    {
        breadcrumbs: () => [],
        sidebarOpen: false,
    },
);

const emit = defineEmits<{
    toggleSidebar: [];
}>();
</script>

<template>
    <header
        class="sticky top-0 z-20 border-b border-border-muted bg-surface/95 px-4 py-4 backdrop-blur md:px-8"
    >
        <div class="flex items-center justify-between gap-4">
            <AppButton
                variant="ghost"
                size="sm"
                class="lg:hidden"
                aria-controls="app-sidebar"
                :aria-expanded="props.sidebarOpen"
                :aria-label="
                    props.sidebarOpen ? 'Close navigation' : 'Open navigation'
                "
                @click="emit('toggleSidebar')"
            >
                <Menu class="size-5" />
            </AppButton>
        </div>
    </header>
</template>
