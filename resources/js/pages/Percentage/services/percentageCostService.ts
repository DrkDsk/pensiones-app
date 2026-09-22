import { router } from '@inertiajs/vue3';
import CesantiaController from '@/actions/App/Http/Controllers/CesantiaController';
import type { PercentageCostFormData } from '../types/percentage';

type ValidationErrors = Record<string, string>;

interface MutationCallbacks {
    onStart: () => void;
    onSuccess: () => void;
    onError: (errors: ValidationErrors) => void;
    onFinish: () => void;
    onFailure: () => void;
}

const mutationOptions = (callbacks: MutationCallbacks) => ({
    preserveScroll: true,
    onStart: callbacks.onStart,
    onSuccess: callbacks.onSuccess,
    onError: callbacks.onError,
    onFinish: callbacks.onFinish,
    onHttpException: callbacks.onFailure,
    onNetworkError: callbacks.onFailure,
});

export const usePercentageCostService = () => {
    const create = (
        data: PercentageCostFormData,
        callbacks: MutationCallbacks,
    ): void => {
        router.post(
            CesantiaController.store().url,
            { year: data.year, percentage: data.percentage },
            mutationOptions(callbacks),
        );
    };

    const update = (
        id: number,
        data: PercentageCostFormData,
        callbacks: MutationCallbacks,
    ): void => {
        router.put(
            CesantiaController.update(id).url,
            { year: data.year, percentage: data.percentage },
            mutationOptions(callbacks),
        );
    };

    const destroy = (id: number, callbacks: MutationCallbacks): void => {
        router.delete(
            CesantiaController.destroy(id).url,
            mutationOptions(callbacks),
        );
    };

    return { create, update, destroy };
};
