import { HttpResponseError } from '@inertiajs/core';
import { useHttp } from '@inertiajs/vue3';
import ClientController from '@/actions/App/Http/Controllers/ClientController';
import { createClientFormDefaults } from '../constants/formDefaults';
import type { ClientFormData, CreatedClientResponse } from '../types/client';

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const parseClientExistsMessage = (responseBody: string): string | null => {
    try {
        const payload: unknown = JSON.parse(responseBody);

        if (!isRecord(payload) || !isRecord(payload.data)) {
            return null;
        }

        const message = payload.data.message;

        return typeof message === 'string' ? message : null;
    } catch {
        return null;
    }
};

export class ClientAlreadyExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ClientAlreadyExistsError';
    }
}

export const useClientService = () => {
    const form = useHttp<ClientFormData, CreatedClientResponse>(
        createClientFormDefaults(),
    );

    const createClient = async (): Promise<CreatedClientResponse> => {
        try {
            return await form.submit(ClientController.store());
        } catch (error) {
            if (
                error instanceof HttpResponseError &&
                error.response.status === 422
            ) {
                const duplicateMessage = parseClientExistsMessage(
                    error.response.data,
                );

                if (duplicateMessage !== null) {
                    throw new ClientAlreadyExistsError(duplicateMessage);
                }
            }

            throw error;
        }
    };

    return { form, createClient };
};
