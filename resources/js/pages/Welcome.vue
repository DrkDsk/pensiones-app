<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowRight, Landmark, ShieldCheck, TrendingUp } from '@lucide/vue';
import AppBadge from '@/components/AppBadge.vue';
import AppCard from '@/components/AppCard.vue';
import { dashboard, login, register } from '@/routes';
</script>

<template>
    <Head title="Bienvenido" />

    <main class="min-h-screen bg-background text-text-primary">
        <section class="financial-gradient px-6 py-6 text-on-primary">
            <header class="mx-auto flex max-w-6xl items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="flex size-11 items-center justify-center rounded-lg bg-on-primary/12"
                    >
                        <Landmark class="size-6" />
                    </div>
                </div>

                <nav class="flex items-center gap-3">
                    <Link
                        v-if="$page.props.auth.user"
                        :href="dashboard()"
                        class="rounded-md bg-on-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-on-primary/90"
                    >
                        Panel de control
                    </Link>
                    <template v-else>
                        <Link
                            :href="login()"
                            class="text-sm font-medium text-on-primary/80 transition hover:text-on-primary"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            :href="register()"
                            class="rounded-md bg-on-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-on-primary/90"
                        >
                            Registrarse
                        </Link>
                    </template>
                </nav>
            </header>

            <div
                class="mx-auto grid max-w-6xl gap-10 py-20 lg:grid-cols-[1fr_0.8fr] lg:items-center"
            >
                <div>
                    <AppBadge
                        variant="info"
                        class="border-on-primary/20 bg-on-primary/12 text-on-primary"
                    >
                        Inteligencia moderna para pensiones
                    </AppBadge>
                    <h1
                        class="mt-6 max-w-3xl text-5xl leading-tight font-semibold text-on-primary"
                    >
                        Calcula los resultados de tu retiro con claridad
                        ejecutiva.
                    </h1>
                    <p
                        class="mt-5 max-w-2xl text-base leading-7 text-on-primary/80"
                    >
                        Un espacio profesional para proyecciones de pensión,
                        escenarios de cotización y planificación financiera
                        segura.
                    </p>
                    <Link
                        :href="$page.props.auth.user ? dashboard() : login()"
                        class="mt-8 inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-secondary/90"
                    >
                        Abrir espacio de trabajo
                        <ArrowRight class="size-4" />
                    </Link>
                </div>

                <AppCard
                    class="bg-on-primary/10 p-5 text-on-primary backdrop-blur"
                >
                    <div class="rounded-lg bg-surface p-5 text-on-surface">
                        <div class="mb-6 flex items-center justify-between">
                            <div>
                                <p class="text-sm text-text-secondary">
                                    Pensión proyectada
                                </p>
                                <p
                                    class="mt-1 text-3xl font-semibold text-text-primary"
                                >
                                    $42,850
                                </p>
                            </div>
                            <TrendingUp class="size-8 text-success" />
                        </div>
                        <div class="h-2 rounded-full bg-border-muted">
                            <div
                                class="h-2 w-[76%] rounded-full bg-secondary"
                            />
                        </div>
                        <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
                            <div class="rounded-md bg-background p-3">
                                <p class="text-text-secondary">Preparación</p>
                                <p class="mt-1 font-semibold text-text-primary">
                                    86%
                                </p>
                            </div>
                            <div class="rounded-md bg-background p-3">
                                <p class="text-text-secondary">Seguridad</p>
                                <p
                                    class="mt-1 flex items-center gap-1 font-semibold text-text-primary"
                                >
                                    <ShieldCheck class="size-4 text-success" />
                                    AA
                                </p>
                            </div>
                        </div>
                    </div>
                </AppCard>
            </div>
        </section>
    </main>
</template>
