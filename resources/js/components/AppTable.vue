<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import AppCard from '@/components/AppCard.vue';
import EmptyState from '@/components/EmptyState.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        loading?: boolean;
        empty?: boolean;
        emptyTitle?: string;
        emptyDescription?: string;
        class?: HTMLAttributes['class'];
    }>(),
    {
        emptyTitle: 'No se encontraron registros',
        emptyDescription:
            'Los registros aparecerán aquí cuando estén disponibles.',
    },
);
</script>

<template>
    <AppCard variant="bordered" :class="cn('overflow-hidden', props.class)">
        <div v-if="props.loading" class="p-4">
            <SkeletonLoader variant="tables" />
        </div>
        <EmptyState
            v-else-if="props.empty"
            :title="props.emptyTitle"
            :description="props.emptyDescription"
            class="m-4"
        />
        <div v-else class="overflow-x-auto">
            <table
                class="min-w-full divide-y divide-border-muted text-left text-sm"
            >
                <slot />
            </table>
        </div>
        <div
            v-if="$slots.pagination"
            class="border-t border-border-muted px-4 py-3"
        >
            <slot name="pagination" />
        </div>
    </AppCard>
</template>
