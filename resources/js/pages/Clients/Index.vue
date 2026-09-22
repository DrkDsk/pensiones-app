<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { UserPlus, Users } from '@lucide/vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import EmptyState from '@/components/EmptyState.vue';
import clients from '@/routes/clients';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Clientes',
                href: clients.index(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Clientes" />

    <div class="space-y-6 p-4 md:p-8">
        <div>
            <h1 class="text-2xl font-semibold text-text-primary">Clientes</h1>
            <p class="mt-1 text-sm text-text-secondary">
                Administra la información de tus clientes.
            </p>
        </div>

        <AppCard class="p-6">
            <EmptyState
                title="El listado de clientes estará disponible próximamente"
                description="Mientras tanto, puedes registrar un cliente nuevo."
                :icon="Users"
            >
                <Link :href="clients.create()">
                    <AppButton>
                        <UserPlus class="size-4" />
                        Registrar cliente
                    </AppButton>
                </Link>
            </EmptyState>
        </AppCard>
    </div>
</template>
