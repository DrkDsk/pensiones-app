<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppCard from '@/components/AppCard.vue';
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import { edit } from '@/routes/appearance';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Configuración de apariencia',
                href: edit(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Configuración de apariencia" />

    <h1 class="sr-only">Configuración de apariencia</h1>

    <AppCard class="p-6">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-on-surface">
                Configuración de apariencia
            </h2>
            <p class="mt-1 text-sm text-text-secondary">
                Actualiza la configuración de apariencia de tu cuenta.
            </p>
        </div>
        <AppearanceTabs />
    </AppCard>
</template>
