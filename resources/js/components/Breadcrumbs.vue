<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ChevronRight } from '@lucide/vue';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

defineProps<{
    breadcrumbs: BreadcrumbItemType[];
}>();
</script>

<template>
    <nav
        aria-label="Ruta de navegación"
        class="flex items-center gap-2 text-sm"
    >
        <template v-for="(item, index) in breadcrumbs" :key="index">
            <Link
                v-if="index !== breadcrumbs.length - 1"
                :href="item.href"
                class="font-medium text-text-secondary transition hover:text-text-primary"
            >
                {{ item.title }}
            </Link>
            <span v-else class="font-semibold text-text-primary">
                {{ item.title }}
            </span>
            <ChevronRight
                v-if="index !== breadcrumbs.length - 1"
                class="size-4 text-text-secondary/70"
            />
        </template>
    </nav>
</template>
