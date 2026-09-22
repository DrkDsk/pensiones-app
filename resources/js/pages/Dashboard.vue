<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    Calculator,
    CircleDollarSign,
    Landmark,
    TrendingUp,
} from '@lucide/vue';
import AppBadge from '@/components/AppBadge.vue';
import AppCard from '@/components/AppCard.vue';
import AppTable from '@/components/AppTable.vue';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Panel de control',
                href: dashboard(),
            },
        ],
    },
});

const kpis = [
    {
        label: 'Pensión mensual proyectada',
        value: '$42,850',
        delta: '+8.4%',
        icon: CircleDollarSign,
    },
    {
        label: 'Tasa de reemplazo',
        value: '71%',
        delta: '+3.1%',
        icon: TrendingUp,
    },
    {
        label: 'Horizonte de cotización',
        value: '18 años',
        delta: 'En buen camino',
        icon: Landmark,
    },
];
</script>

<template>
    <Head title="Panel de control" />

    <div class="space-y-8 p-4 md:p-8">
        <section class="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <AppCard variant="elevated" class="overflow-hidden">
                <div class="financial-gradient p-7 text-on-primary md:p-8">
                    <div
                        class="flex flex-wrap items-start justify-between gap-4"
                    >
                        <div>
                            <AppBadge
                                variant="info"
                                class="border-on-primary/20 bg-on-primary/12 text-on-primary"
                            >
                                Proyección avanzada
                            </AppBadge>
                            <h1
                                class="mt-5 max-w-2xl text-3xl leading-tight font-semibold text-on-primary"
                            >
                                Panel de planificación para el retiro
                            </h1>
                            <p
                                class="mt-3 max-w-xl text-sm leading-6 text-on-primary/80"
                            >
                                Supervisa la preparación para la pensión, el
                                ritmo de cotización y el nivel de riesgo desde
                                un espacio de trabajo seguro.
                            </p>
                        </div>
                        <div
                            class="rounded-lg border border-on-primary/15 bg-on-primary/10 p-4 text-right"
                        >
                            <p class="text-xs text-on-primary/75">
                                Índice de confianza
                            </p>
                            <p
                                class="mt-1 text-3xl font-semibold text-on-primary"
                            >
                                86
                            </p>
                        </div>
                    </div>
                </div>
            </AppCard>

            <AppCard class="p-6">
                <div class="flex items-center gap-3">
                    <div
                        class="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary"
                    >
                        <Calculator class="size-5" />
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-on-surface">
                            Próximo cálculo
                        </p>
                        <p class="text-sm text-text-secondary">
                            Listo para simular con datos actualizados
                        </p>
                    </div>
                </div>
                <div class="mt-6 space-y-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-text-secondary">Datos completos</span>
                        <span class="font-semibold text-text-primary">92%</span>
                    </div>
                    <div class="h-2 rounded-full bg-border-muted">
                        <div class="h-2 w-[92%] rounded-full bg-success" />
                    </div>
                </div>
            </AppCard>
        </section>

        <section class="grid gap-4 md:grid-cols-3">
            <AppCard v-for="item in kpis" :key="item.label" class="p-5">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-sm text-text-secondary">
                            {{ item.label }}
                        </p>
                        <p class="mt-3 text-2xl font-semibold text-on-surface">
                            {{ item.value }}
                        </p>
                    </div>
                    <div
                        class="flex size-10 items-center justify-center rounded-lg bg-border-muted text-primary"
                    >
                        <component :is="item.icon" class="size-5" />
                    </div>
                </div>
                <div class="mt-5 flex items-center gap-2 text-sm">
                    <ArrowUpRight class="size-4 text-success" />
                    <span class="font-medium text-success">{{
                        item.delta
                    }}</span>
                    <span class="text-text-secondary">vs. referencia</span>
                </div>
            </AppCard>
        </section>

        <section class="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <AppCard class="p-6">
                <div class="mb-6 flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-on-surface">
                            Curva de financiamiento
                        </h2>
                        <p class="text-sm text-text-secondary">
                            Tendencia estimada de preparación
                        </p>
                    </div>
                    <AppBadge variant="success">Saludable</AppBadge>
                </div>
                <div
                    class="flex h-64 items-end gap-3 rounded-lg bg-background p-4"
                >
                    <div
                        v-for="height in [34, 42, 48, 58, 63, 72, 80, 88]"
                        :key="height"
                        class="flex-1 rounded-t-md bg-secondary/80"
                        :style="{ height: `${height}%` }"
                    />
                </div>
            </AppCard>

            <div>
                <div class="mb-4">
                    <h2 class="text-lg font-semibold text-text-primary">
                        Escenarios de pensión recientes
                    </h2>
                    <p class="text-sm text-text-secondary">
                        Los registros guardados aparecerán en este espacio de
                        trabajo.
                    </p>
                </div>
                <AppTable
                    empty
                    empty-title="Aún no hay escenarios"
                    empty-description="Crea un cálculo de pensión para comparar proyecciones aquí."
                />
            </div>
        </section>
    </div>
</template>
