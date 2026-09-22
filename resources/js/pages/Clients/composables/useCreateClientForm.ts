import { router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import clients from '@/routes/clients';
import { createClientFormDefaults } from '../constants/formDefaults';
import type { ClientFormData, ClientFormField } from '../types/client';
import { validateClientForm } from '../validators/clientValidation';

export const useCreateClientForm = () => {
    const form = useForm<ClientFormData>(createClientFormDefaults());
    const duplicateDialogOpen = ref(false);
    const duplicateMessage = ref('El cliente ya existe.');
    const requestError = ref('');

    const clearFieldError = (field: ClientFormField): void => {
        form.clearErrors(field);
    };

    const submit = (): void => {
        if (form.processing) {
            return;
        }

        requestError.value = '';
        duplicateDialogOpen.value = false;
        form.curp = form.curp.trim().toUpperCase();

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
        submit,
        cancel,
    };
};
