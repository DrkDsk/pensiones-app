<script setup lang="ts">
import { X } from '@lucide/vue';
import AppButton from '@/components/AppButton.vue';

const open = defineModel<boolean>('open', { default: false });

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <button
                type="button"
                class="absolute inset-0 bg-sidebar-background/70"
                aria-label="Cerrar modal"
                @click="open = false"
            />
            <section
                class="app-shadow-elevated relative w-full max-w-lg rounded-lg border border-border-default bg-surface p-6 text-on-surface"
            >
                <div class="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2
                            v-if="title"
                            class="text-lg font-semibold text-on-surface"
                        >
                            {{ title }}
                        </h2>
                        <p
                            v-if="description"
                            class="mt-1 text-sm text-text-secondary"
                        >
                            {{ description }}
                        </p>
                    </div>
                    <AppButton
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 px-0"
                        @click="open = false"
                    >
                        <X class="size-4" />
                    </AppButton>
                </div>
                <slot />
            </section>
        </div>
    </Teleport>
</template>
