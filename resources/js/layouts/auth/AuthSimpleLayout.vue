<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Landmark } from '@lucide/vue';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="grid min-h-screen bg-background text-text-primary lg:grid-cols-[1.05fr_0.95fr]"
    >
        <aside
            class="financial-gradient relative hidden overflow-hidden p-10 text-on-primary lg:flex lg:flex-col"
        >
            <Link :href="home()" class="flex items-center gap-3">
                <div
                    class="flex size-11 items-center justify-center rounded-lg bg-on-primary/12"
                >
                    <Landmark class="size-6" />
                </div>
            </Link>
        </aside>

        <main
            class="flex min-h-screen items-center justify-center px-5 py-10 md:px-10"
        >
            <div class="w-full max-w-xl">
                <div class="mb-8 lg:hidden">
                    <Link :href="home()" class="flex items-center gap-3">
                        <div
                            class="flex size-11 items-center justify-center rounded-lg bg-primary text-on-primary"
                        >
                            <Landmark class="size-6" />
                        </div>
                    </Link>
                </div>

                <section
                    class="app-shadow-elevated rounded-lg border border-border-muted bg-surface p-6 text-on-surface md:p-8"
                >
                    <div class="mb-7">
                        <h1 class="mt-2 text-2xl font-semibold text-on-surface">
                            {{ title }}
                        </h1>
                        <p class="mt-2 text-sm leading-6 text-text-secondary">
                            {{ description }}
                        </p>
                    </div>
                    <slot />
                </section>
            </div>
        </main>
    </div>
</template>
