import { reactive, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { usePercentageCostService } from '../services/percentageCostService';
import type {
    PercentageCostForModality40,
    PercentageCostFormData,
    PercentageCostFormErrors,
    PercentageCostOperation,
} from '../types/percentage';

const emptyForm = (): PercentageCostFormData => ({
    year: '',
    percentage: '',
});

export const usePercentageCosts = () => {
    const service = usePercentageCostService();
    const editingId = ref<number | null>(null);
    const isCreating = ref(false);
    const deletingItem = ref<PercentageCostForModality40 | null>(null);
    const deleteModalOpen = ref(false);
    const processingOperation = ref<PercentageCostOperation | null>(null);
    const createForm = reactive<PercentageCostFormData>(emptyForm());
    const editForm = reactive<PercentageCostFormData>(emptyForm());
    const errors = reactive<PercentageCostFormErrors>({});

    const isProcessing = () => processingOperation.value !== null;

    const clearErrors = (): void => {
        delete errors.year;
        delete errors.percentage;
    };

    const resetForm = (form: PercentageCostFormData): void => {
        Object.assign(form, emptyForm());
    };

    const setErrors = (validationErrors: Record<string, string>): void => {
        clearErrors();

        if (typeof validationErrors.year === 'string') {
            errors.year = validationErrors.year;
        }

        if (typeof validationErrors.percentage === 'string') {
            errors.percentage = validationErrors.percentage;
        }
    };

    const startCreating = (): void => {
        if (isProcessing()) {
            return;
        }

        editingId.value = null;
        resetForm(editForm);
        clearErrors();
        resetForm(createForm);
        isCreating.value = true;
    };

    const cancelCreating = (): void => {
        if (isProcessing()) {
            return;
        }

        isCreating.value = false;
        resetForm(createForm);
        clearErrors();
    };

    const startEditing = (item: PercentageCostForModality40): void => {
        if (isProcessing()) {
            return;
        }

        isCreating.value = false;
        resetForm(createForm);
        clearErrors();
        editingId.value = item.id;
        editForm.year = item.year;
        editForm.percentage = item.percentage;
    };

    const cancelEditing = (): void => {
        if (isProcessing()) {
            return;
        }

        editingId.value = null;
        resetForm(editForm);
        clearErrors();
    };

    const mutationCallbacks = (
        operation: PercentageCostOperation,
        successMessage: string,
        onSuccess: () => void,
    ) => ({
        onStart: () => {
            processingOperation.value = operation;
        },
        onSuccess: () => {
            onSuccess();
            clearErrors();
            toast.success(successMessage);
        },
        onError: setErrors,
        onFinish: () => {
            processingOperation.value = null;
        },
        onFailure: () => {
            toast.error(
                'No fue posible completar la operación. Inténtalo nuevamente.',
            );
        },
    });

    const createPercentage = (): void => {
        if (isProcessing()) {
            return;
        }

        service.create(
            { ...createForm },
            mutationCallbacks(
                'create',
                'Registro creado correctamente.',
                () => {
                    isCreating.value = false;
                    resetForm(createForm);
                },
            ),
        );
    };

    const updatePercentage = (): void => {
        if (isProcessing() || editingId.value === null) {
            return;
        }

        service.update(
            editingId.value,
            { ...editForm },
            mutationCallbacks(
                'update',
                'Registro actualizado correctamente.',
                () => {
                    editingId.value = null;
                    resetForm(editForm);
                },
            ),
        );
    };

    const requestDelete = (item: PercentageCostForModality40): void => {
        if (isProcessing()) {
            return;
        }

        deletingItem.value = item;
        deleteModalOpen.value = true;
    };

    const cancelDelete = (): void => {
        if (processingOperation.value === 'delete') {
            return;
        }

        deleteModalOpen.value = false;
        deletingItem.value = null;
    };

    const deletePercentage = (): void => {
        if (isProcessing() || deletingItem.value === null) {
            return;
        }

        service.destroy(
            deletingItem.value.id,
            mutationCallbacks(
                'delete',
                'Registro eliminado correctamente.',
                () => {
                    deleteModalOpen.value = false;
                    deletingItem.value = null;
                },
            ),
        );
    };

    const clearFieldError = (field: keyof PercentageCostFormData): void => {
        delete errors[field];
    };

    watch(deleteModalOpen, (open) => {
        if (!open && processingOperation.value !== 'delete') {
            deletingItem.value = null;
        }
    });

    return {
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
    };
};
