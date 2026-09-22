<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { UserPlus } from '@lucide/vue';
import AppButton from '@/components/AppButton.vue';
import AppTable from '@/components/AppTable.vue';
import clientRoutes from '@/routes/clients';
import type { PaginatedClients, PaginationLink } from './types/client';

const props = defineProps<{
    clients: PaginatedClients;
}>();

const paginationLabel = (link: PaginationLink, index: number): string => {
    if (index === 0) {
        return 'Anterior';
    }

    if (index === props.clients.links.length - 1) {
        return 'Siguiente';
    }

    return link.label;
};

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Clientes',
                href: clientRoutes.index(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Clientes" />

    <div class="space-y-6 p-4 md:p-8">
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-semibold text-text-primary">
                    Clientes
                </h1>
                <p class="mt-1 text-sm text-text-secondary">
                    Administra la información de tus clientes.
                </p>
            </div>

            <Link :href="clientRoutes.create()">
                <AppButton>
                    <UserPlus class="size-4" />
                    Registrar cliente
                </AppButton>
            </Link>
        </div>

        <AppTable
            :empty="props.clients.data.length === 0"
            empty-title="No hay clientes registrados"
            empty-description="Registra un cliente para comenzar a administrar su información."
        >
            <thead
                class="bg-background/50 text-xs text-text-secondary uppercase"
            >
                <tr>
                    <th class="px-6 py-3 font-medium">Cliente</th>
                    <th class="px-6 py-3 font-medium">Contacto</th>
                    <th class="px-6 py-3 font-medium">CURP</th>
                    <th class="px-6 py-3 font-medium">NSS</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-border-muted">
                <tr
                    v-for="client in props.clients.data"
                    :key="client.id"
                    class="text-text-primary"
                >
                    <td class="px-6 py-4">
                        <p class="font-medium">
                            {{ client.name }} {{ client.last_name }}
                        </p>
                    </td>
                    <td class="px-6 py-4 text-text-secondary">
                        <p>{{ client.email || 'Sin correo' }}</p>
                        <p>{{ client.phone || 'Sin teléfono' }}</p>
                    </td>
                    <td class="px-6 py-4 font-mono text-xs">
                        {{ client.curp }}
                    </td>
                    <td class="px-6 py-4 font-mono text-xs">
                        {{ client.nss }}
                    </td>
                </tr>
            </tbody>

            <template v-if="props.clients.meta.last_page > 1" #pagination>
                <nav
                    aria-label="Paginación de clientes"
                    class="flex flex-wrap items-center justify-between gap-3"
                >
                    <p class="text-sm text-text-secondary">
                        Mostrando {{ props.clients.meta.from }}–{{
                            props.clients.meta.to
                        }}
                        de {{ props.clients.meta.total }}
                    </p>
                    <div class="flex flex-wrap gap-1">
                        <template
                            v-for="(link, index) in props.clients.links"
                            :key="`${link.label}-${index}`"
                        >
                            <Link
                                v-if="link.url"
                                :href="link.url"
                                preserve-scroll
                                class="inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm transition"
                                :class="
                                    link.active
                                        ? 'bg-primary text-on-primary'
                                        : 'text-text-primary hover:bg-border-muted'
                                "
                            >
                                {{ paginationLabel(link, index) }}
                            </Link>
                            <span
                                v-else
                                class="inline-flex h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-md px-3 text-sm text-text-secondary opacity-50"
                            >
                                {{ paginationLabel(link, index) }}
                            </span>
                        </template>
                    </div>
                </nav>
            </template>
        </AppTable>
    </div>
</template>
