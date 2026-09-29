import type { Client } from '@/models/client';
import clients from '@/routes/clients';
import type {
    CalculateClientForm,
    CalculateSocialSecurityInformationForm,
} from '../types/calculate';
import { jsonHeaders, readJson } from './http';

type ErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

type StoredClient = Pick<Client, 'id'>;

export class ClientAlreadyExistsError extends Error {}

export class ClientValidationError extends Error {
    constructor(public readonly errors: Record<string, string[]>) {
        super('Los datos del cliente no son válidos.');
    }
}

export class ClientCreationError extends Error {}

export const storeClient = async (data: {
    client: CalculateClientForm;
    social_security_information: CalculateSocialSecurityInformationForm;
}): Promise<StoredClient> => {
    let response: Response;

    try {
        response = await fetch(clients.store().url, {
            method: 'POST',
            headers: jsonHeaders(),
            body: JSON.stringify(data),
        });
    } catch {
        throw new ClientCreationError(
            'No fue posible registrar el cliente. Inténtalo nuevamente.',
        );
    }

    const payload = await readJson<ErrorResponse & { data?: StoredClient }>(
        response,
    );

    if (response.status === 409) {
        throw new ClientAlreadyExistsError(
            payload?.message ??
                'Ya existe un cliente registrado con alguno de estos datos.',
        );
    }

    if (response.status === 422) {
        throw new ClientValidationError(payload?.errors ?? {});
    }

    if (!response.ok || !payload?.data) {
        throw new ClientCreationError(
            payload?.message ??
                'No fue posible registrar el cliente. Inténtalo nuevamente.',
        );
    }

    return payload.data;
};
