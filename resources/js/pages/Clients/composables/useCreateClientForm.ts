import { HttpResponseError } from '@inertiajs/core';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import clients from '@/routes/clients';
import {
    ClientAlreadyExistsError,
    useClientService,
} from '../services/clientService';
import type { ClientFormField } from '../types/client';
import { validateClientForm } from '../validators/clientValidation';

export const useCreateClientForm = () => {
    const { form, createClient } = useClientService();
    const duplicateDialogOpen = ref(false);
    const duplicateMessage = ref('El cliente ya existe.');
    const requestError = ref('');

    const clearFieldError = (field: ClientFormField): void => {
        form.clearErrors(field);
    };

    const submit = async (): Promise<void> => {
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

        try {
            await createClient();
            router.visit(clients.index().url);
        } catch (error) {
            if (error instanceof ClientAlreadyExistsError) {
                duplicateMessage.value = error.message;
                duplicateDialogOpen.value = true;

                return;
            }

            if (
                error instanceof HttpResponseError &&
                error.response.status === 422
            ) {
                return;
            }

            requestError.value =
                'No fue posible guardar el cliente. Inténtalo nuevamente.';
        }
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
