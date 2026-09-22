<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { AlertTriangle, Pencil, Plus, Trash2 } from '@lucide/vue';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import AppModal from '@/components/AppModal.vue';
import AppTable from '@/components/AppTable.vue';
import percentage from '@/routes/percentage';
import { usePercentageCosts } from './composables/usePercentageCosts';
import type { PercentageCostCollection } from './types/percentage';

const props = defineProps<{
    percentages: PercentageCostCollection;
}>();

const {
    editingId,
    isCreating,
    deletingItem,
    deleteModalOpen,
    processingOperation,
    createForm,
    editForm,
    errors,
    startCreating,
    cancelCreating,
    startEditing,
    cancelEditing,
    createPercentage,
    updatePercentage,
    requestDelete,
    cancelDelete,
    deletePercentage,
    clearFieldError,
} = usePercentageCosts();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Porcentajes',
                href: percentage.index(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Porcentajes Modalidad 40" />

    <div class="space-y-6 p-4 md:p-8">
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-semibold text-text-primary">
                    Porcentajes Modalidad 40
                </h1>
                <p class="mt-1 text-sm text-text-secondary">
                    Administra el costo porcentual correspondiente a cada año.
                </p>
            </div>

            <AppButton
                :disabled="
                    isCreating ||
                    editingId !== null ||
                    processingOperation !== null
                "
                @click="startCreating"
            >
                <Plus class="size-4" />
                Agregar registro
            </AppButton>
        </div>

        <AppTable
            :empty="props.percentages.data.length === 0 && !isCreating"
            empty-title="No hay porcentajes registrados"
            empty-description="Agrega un registro para comenzar a administrar los porcentajes de Modalidad 40."
        >
            <thead
                class="bg-background/50 text-xs text-text-secondary uppercase"
            >
                <tr>
                    <th class="px-6 py-3 font-medium">Año</th>
                    <th class="px-6 py-3 font-medium">Porcentaje</th>
                    <th class="px-6 py-3 text-right font-medium">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-border-muted">
                <tr v-if="isCreating" class="align-top text-text-primary">
                    <td class="min-w-48 px-6 py-4">
                        <AppInput
                            v-model="createForm.year"
                            aria-label="Año del nuevo registro"
                            type="number"
                            inputmode="numeric"
                            min="1900"
                            max="2100"
                            step="1"
                            placeholder="Año"
                            :disabled="processingOperation === 'create'"
                            :error="errors.year"
                            @input="clearFieldError('year')"
                        />
                    </td>
                    <td class="min-w-56 px-6 py-4">
                        <AppInput
                            v-model="createForm.percentage"
                            aria-label="Porcentaje del nuevo registro"
                            type="number"
                            inputmode="decimal"
                            min="0"
                            max="99.999"
                            step="0.001"
                            placeholder="Porcentaje"
                            :disabled="processingOperation === 'create'"
                            :error="errors.percentage"
                            @input="clearFieldError('percentage')"
                        />
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex justify-end gap-2">
                            <AppButton
                                variant="ghost"
                                size="sm"
                                :disabled="processingOperation !== null"
                                @click="cancelCreating"
                            >
                                Cancelar
                            </AppButton>
                            <AppButton
                                size="sm"
                                :loading="processingOperation === 'create'"
                                :disabled="processingOperation !== null"
                                @click="createPercentage"
                            >
                                Guardar
                            </AppButton>
                        </div>
                    </td>
                </tr>

                <tr
                    v-for="item in props.percentages.data"
                    :key="item.id"
                    class="align-top text-text-primary"
                >
                    <template v-if="editingId === item.id">
                        <td class="min-w-48 px-6 py-4">
                            <AppInput
                                v-model="editForm.year"
                                :aria-label="`Año del registro ${item.year}`"
                                type="number"
                                inputmode="numeric"
                                min="1900"
                                max="2100"
                                step="1"
                                :disabled="processingOperation === 'update'"
                                :error="errors.year"
                                @input="clearFieldError('year')"
                            />
                        </td>
                        <td class="min-w-56 px-6 py-4">
                            <AppInput
                                v-model="editForm.percentage"
                                :aria-label="`Porcentaje del registro ${item.year}`"
                                type="number"
                                inputmode="decimal"
                                min="0"
                                max="99.999"
                                step="0.001"
                                :disabled="processingOperation === 'update'"
                                :error="errors.percentage"
                                @input="clearFieldError('percentage')"
                            />
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex justify-end gap-2">
                                <AppButton
                                    variant="ghost"
                                    size="sm"
                                    :disabled="processingOperation !== null"
                                    @click="cancelEditing"
                                >
                                    Cancelar
                                </AppButton>
                                <AppButton
                                    size="sm"
                                    :loading="processingOperation === 'update'"
                                    :disabled="processingOperation !== null"
                                    @click="updatePercentage"
                                >
                                    Guardar
                                </AppButton>
                            </div>
                        </td>
                    </template>

                    <template v-else>
                        <td class="px-6 py-4 font-medium">
                            {{ item.year }}
                        </td>
                        <td class="px-6 py-4 font-mono">
                            {{ item.percentage }}%
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex justify-end gap-2">
                                <AppButton
                                    variant="ghost"
                                    size="sm"
                                    :disabled="
                                        isCreating ||
                                        editingId !== null ||
                                        processingOperation !== null
                                    "
                                    @click="startEditing(item)"
                                >
                                    <Pencil class="size-4" />
                                    Editar
                                </AppButton>
                                <AppButton
                                    variant="danger"
                                    size="sm"
                                    :disabled="
                                        isCreating ||
                                        editingId !== null ||
                                        processingOperation !== null
                                    "
                                    @click="requestDelete(item)"
                                >
                                    <Trash2 class="size-4" />
                                    Eliminar
                                </AppButton>
                            </div>
                        </td>
                    </template>
                </tr>
            </tbody>
        </AppTable>
    </div>

    <AppModal
        v-model:open="deleteModalOpen"
        title="Eliminar registro"
        :description="
            deletingItem
                ? `¿Deseas eliminar el porcentaje correspondiente al año ${deletingItem.year}?`
                : undefined
        "
    >
        <div class="flex items-start gap-3 rounded-lg bg-danger/10 p-4">
            <AlertTriangle class="mt-0.5 size-5 shrink-0 text-danger" />
            <p class="text-sm text-text-secondary">
                Esta acción no se puede deshacer.
            </p>
        </div>
        <div class="mt-5 flex justify-end gap-3">
            <AppButton
                variant="ghost"
                :disabled="processingOperation === 'delete'"
                @click="cancelDelete"
            >
                Cancelar
            </AppButton>
            <AppButton
                variant="danger"
                :loading="processingOperation === 'delete'"
                :disabled="processingOperation !== null"
                @click="deletePercentage"
            >
                Eliminar
            </AppButton>
        </div>
    </AppModal>
</template>
