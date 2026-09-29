import { router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import clients from '@/routes/clients';
import {
    validateClientForm,
    validateFamilyInformationField,
} from '@/validators/clientValidation';
import type {
    FamilyInformationErrors,
    FamilyInformationField,
} from '@/validators/clientValidation';
import { createClientFormDefaults } from '../constants/formDefaults';
import type { ClientFormData, ClientFormField } from '../types/client';

export const useCreateClientForm = () => {
    const form = useForm<ClientFormData>(createClientFormDefaults());
    const duplicateDialogOpen = ref(false);
    const duplicateMessage = ref('El cliente ya existe.');
    const requestError = ref('');

    const clearFieldError = (field: ClientFormField): void => {
        form.clearErrors(field);
    };

    const validateFamilyField = (field: FamilyInformationField): boolean => {
        const errors: FamilyInformationErrors = {};
        const isValid = validateFamilyInformationField(form, errors, field, {
            requireRequiredFields: true,
        });
        const formField = `family_information.${field}` as ClientFormField;
        const message = errors[field];

        if (message) {
            form.setError(formField, message);
        } else {
            form.clearErrors(formField);
        }

        return isValid;
    };

    const handleFamilyInformationInput = (
        field: FamilyInformationField,
        value: string | number | undefined,
    ): void => {
        if (field === 'parents_count') {
            form.family_information.parents_count =
                value !== undefined && value !== '' ? Number(value) : '';
        } else {
            form.family_information[field] = String(value ?? '');
        }

        form.clearErrors(`family_information.${field}` as ClientFormField);
    };

    const submit = (): void => {
        if (form.processing) {
            return;
        }

        requestError.value = '';
        duplicateDialogOpen.value = false;
        form.client.curp = form.client.curp.trim().toUpperCase();

        const clientErrors = validateClientForm(form.data());

        if (Object.keys(clientErrors).length > 0) {
            form.clearErrors();
            form.setError(clientErrors);

            return;
        }

        form.post(clients.store().url, {
            preserveScroll: true,
            onError: (errors) => {
                const clientExists = errors.client_exists;

                if (typeof clientExists === 'string') {
                    duplicateMessage.value = clientExists;
                    form.clearErrors();
                    duplicateDialogOpen.value = true;
                }
            },
            onHttpException: () => {
                requestError.value =
                    'No fue posible guardar el cliente. Inténtalo nuevamente.';
            },
            onNetworkError: () => {
                requestError.value =
                    'No fue posible guardar el cliente. Inténtalo nuevamente.';
            },
        });
    };

    const cancel = (): void => {
        router.visit(clients.index().url);
    };

    return {
        form,
        duplicateDialogOpen,
        duplicateMessage,
        requestError,
        clearFieldError,
        handleFamilyInformationInput,
        validateFamilyField,
        submit,
        cancel,
    };
};
