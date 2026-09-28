import { ref } from 'vue';
import { toast } from 'vue-sonner';
import {
    ClientAlreadyExistsError,
    ClientCreationError,
    ClientValidationError,
    storeClient as persistClient,
} from '../services/clientService';
import {
    generatePensionProposal as requestPensionProposal,
    PensionProposalError,
} from '../services/pensionProposalService';
import type { CalculateForm, ClientStepField } from '../types/calculate';

export const useCalculateProposal = ({
    form,
    applyServerErrors,
    enableManualMode,
    returnToClientStep,
    services = {
        storeClient: persistClient,
        generatePensionProposal: requestPensionProposal,
    },
}: {
    form: CalculateForm;
    applyServerErrors: (
        errors: Record<string, string[]>,
        enableManualMode: () => void,
    ) => void;
    enableManualMode: () => void;
    returnToClientStep: () => void;
    services?: {
        storeClient: typeof persistClient;
        generatePensionProposal: typeof requestPensionProposal;
    };
}) => {
    const isGeneratingProposal = ref(false);
    const duplicateClientDialogOpen = ref(false);
    const duplicateClientMessage = ref(
        'Ya existe un cliente registrado con alguno de estos datos. Busca y selecciona el cliente existente para continuar.',
    );

    const ensureClientExists = async (): Promise<number> => {
        if (form.client_id !== null) {
            return form.client_id;
        }

        const client = await services.storeClient(form.client);
        form.client_id = client.id;

        return client.id;
    };

    const submitProposal = async (calculatedValues: {
        retroactive_modality_40: number;
    }): Promise<void> => {
        if (isGeneratingProposal.value) {
            return;
        }

        isGeneratingProposal.value = true;
        duplicateClientDialogOpen.value = false;

        try {
            const clientId = await ensureClientExists();

            await services.generatePensionProposal(clientId, {
                ...form.data(),
                ...calculatedValues,
            });
        } catch (error) {
            if (error instanceof ClientAlreadyExistsError) {
                duplicateClientMessage.value = `${error.message} Busca y selecciona el cliente existente para continuar.`;
                duplicateClientDialogOpen.value = true;

                return;
            }

            if (error instanceof ClientValidationError) {
                const errors = Object.fromEntries(
                    Object.entries(error.errors).map(([field, messages]) => [
                        field.replace(/^client\./, '') as ClientStepField,
                        messages,
                    ]),
                );

                applyServerErrors(errors, enableManualMode);
                returnToClientStep();

                return;
            }

            if (
                error instanceof ClientCreationError ||
                error instanceof PensionProposalError
            ) {
                toast.error(error.message);

                return;
            }

            toast.error('Ocurrió un error inesperado al generar la propuesta.');
        } finally {
            isGeneratingProposal.value = false;
        }
    };

    const searchExistingClient = (): void => {
        duplicateClientDialogOpen.value = false;
        returnToClientStep();
    };

    return {
        isGeneratingProposal,
        duplicateClientDialogOpen,
        duplicateClientMessage,
        ensureClientExists,
        submitProposal,
        searchExistingClient,
    };
};
