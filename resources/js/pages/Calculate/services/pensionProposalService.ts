import clients from '@/routes/clients';
import type { CalculateFormData } from '../types/calculate';
import { jsonHeaders, readJson } from './http';

type ProposalPayload = CalculateFormData & {
    retroactive_modality_40: number;
};

export class PensionProposalError extends Error {}

const filenameFromDisposition = (disposition: string | null): string =>
    disposition?.match(/filename="?([^";]+)"?/i)?.[1] ??
    'propuesta-pension.pdf';

const downloadPdf = (blob: Blob, filename: string): void => {
    const blobUrl = URL.createObjectURL(blob);
    const download = document.createElement('a');

    download.href = blobUrl;
    download.download = filename;
    document.body.appendChild(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
};

export const generatePensionProposal = async (
    clientId: number,
    payload: ProposalPayload,
): Promise<void> => {
    let response: Response;

    try {
        response = await fetch(clients.pensionProposal.pdf(clientId).url, {
            method: 'POST',
            headers: {
                ...jsonHeaders(),
                Accept: 'application/pdf, application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new PensionProposalError(
            'No fue posible generar la propuesta. Inténtalo nuevamente.',
        );
    }

    if (!response.ok) {
        const error = await readJson<{ message?: string }>(response);

        throw new PensionProposalError(
            error?.message ?? 'No fue posible generar la propuesta.',
        );
    }

    if (!response.headers.get('Content-Type')?.includes('application/pdf')) {
        throw new PensionProposalError(
            'La respuesta recibida no contiene una propuesta en PDF.',
        );
    }

    downloadPdf(
        await response.blob(),
        filenameFromDisposition(response.headers.get('Content-Disposition')),
    );
};
