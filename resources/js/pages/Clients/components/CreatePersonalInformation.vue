<script setup lang="ts">
import AppInput from '@/components/AppInput.vue';
import AppSelect from '@/components/AppSelect.vue';
import type {
    FamilyInformationField,
    FamilyInformationForm,
} from '@/validators/clientValidation';
import type { ClientFormField } from '../types/client';

defineProps<{
    familyInformation: FamilyInformationForm;
    errors: Partial<Record<ClientFormField, string>>;
    handleInput: (
        field: FamilyInformationField,
        value: string | number | undefined,
    ) => void;
    validateField: (field: FamilyInformationField) => boolean;
}>();
</script>

<template>
    <div class="border-t border-border-muted pt-5 md:col-span-2">
        <div class="mb-4">
            <h3 class="text-sm font-semibold text-on-surface">
                Información familiar
            </h3>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <AppSelect
                :model-value="familyInformation.has_spouse"
                label="Esposo/a"
                required
                :error="errors['family_information.has_spouse']"
                @update:model-value="handleInput('has_spouse', $event)"
                @blur="validateField('has_spouse')"
            >
                <option value="">Seleccionar</option>
                <option value="1">Si</option>
                <option value="0">No</option>
            </AppSelect>

            <AppInput
                :model-value="familyInformation.minor_or_student_children_count"
                label="Hijos menores o estudiando"
                type="number"
                min="0"
                step="1"
                required
                :error="
                    errors['family_information.minor_or_student_children_count']
                "
                @update:model-value="
                    handleInput('minor_or_student_children_count', $event)
                "
                @blur="validateField('minor_or_student_children_count')"
            />

            <AppSelect
                :model-value="familyInformation.parents_count"
                label="Padres"
                required
                :error="errors['family_information.parents_count']"
                @update:model-value="handleInput('parents_count', $event)"
                @blur="validateField('parents_count')"
            >
                <option :value="0">0</option>
                <option :value="1">1</option>
                <option :value="2">2</option>
            </AppSelect>
        </div>
    </div>
</template>
