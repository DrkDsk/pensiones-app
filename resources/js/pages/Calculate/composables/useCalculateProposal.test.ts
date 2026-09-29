import { describe, expect, it, vi } from 'vitest';
import type { Client } from '@/models/client';
import { createCalculateFormDefaults } from '../constants/formDefaults';
import { ClientAlreadyExistsError } from '../services/clientService';
import type { CalculateForm } from '../types/calculate';
import { useCalculateProposal } from './useCalculateProposal';

const client = (id: number): Client => ({
    id,
    name: 'Maria',
    last_name: 'Lopez',
    phone: '5512345678',
    email: 'maria@example.com',
    curp: 'LOMM800101HDFPRR09',
    birthdate: '1980-01-01',
    notes: null,
    social_security_information: {
        nss: '12345678901',
        regime_end_date: null,
        unemployment_assistance_discounted_weeks: 0,
        total_contributed_weeks: 1200,
    },
    family_information: null,
});

const calculateForm = (clientId: number | null): CalculateForm => {
    const data = createCalculateFormDefaults(null);
    data.client_id = clientId;
    data.client = {
        name: 'Maria',
        last_name: 'Lopez',
        phone: '5512345678',
        email: 'maria@example.com',
        curp: 'LOMM800101HDFPRR09',
        birthdate: '1980-01-01',
        notes: '',
    };
    data.social_security_information = {
        nss: '12345678901',
        regime_end_date: '',
        unemployment_assistance_discounted_weeks: '0',
        total_contributed_weeks: '1200',
    };

    const form = { ...data } as CalculateForm;
    form.data = () =>
        Object.fromEntries(
            Object.keys(data).map((key) => [
                key,
                structuredClone(form[key as keyof typeof data]),
            ]),
        ) as unknown as ReturnType<CalculateForm['data']>;

    return form;
};

const setup = (clientId: number | null) => {
    const form = calculateForm(clientId);
    const storeClient = vi.fn(async () => client(25));
    const generatePensionProposal = vi.fn(async () => undefined);
    const returnToClientStep = vi.fn();
    const applyServerErrors = vi.fn();
    const enableManualMode = vi.fn();
    const proposal = useCalculateProposal({
        form,
        applyServerErrors,
        enableManualMode,
        returnToClientStep,
        services: { storeClient, generatePensionProposal },
    });

    return {
        form,
        storeClient,
        generatePensionProposal,
        returnToClientStep,
        proposal,
    };
};

describe('useCalculateProposal', () => {
    it('uses an already selected client without creating it again', async () => {
        const { proposal, storeClient, generatePensionProposal } = setup(8);

        await proposal.submitProposal({ retroactive_modality_40: 100 });

        expect(storeClient).not.toHaveBeenCalled();
        expect(generatePensionProposal).toHaveBeenCalledWith(
            8,
            expect.objectContaining({
                client_id: 8,
                retroactive_modality_40: 100,
            }),
        );
    });

    it('creates a new client, stores its id and then generates the pdf', async () => {
        const { form, proposal, storeClient, generatePensionProposal } =
            setup(null);

        await proposal.submitProposal({ retroactive_modality_40: 100 });

        expect(storeClient).toHaveBeenCalledWith({
            client: form.client,
            social_security_information: form.social_security_information,
        });
        expect(form.client_id).toBe(25);
        expect(generatePensionProposal).toHaveBeenCalledWith(
            25,
            expect.objectContaining({ client_id: 25 }),
        );
        expect(storeClient.mock.invocationCallOrder[0]).toBeLessThan(
            generatePensionProposal.mock.invocationCallOrder[0],
        );
    });

    it('opens the duplicate modal, preserves the form and does not generate', async () => {
        const { form, proposal, storeClient, generatePensionProposal } =
            setup(null);
        const before = structuredClone(form.data());
        storeClient.mockRejectedValueOnce(
            new ClientAlreadyExistsError('El cliente ya existe.'),
        );

        await proposal.submitProposal({ retroactive_modality_40: 100 });

        expect(proposal.duplicateClientDialogOpen.value).toBe(true);
        expect(generatePensionProposal).not.toHaveBeenCalled();
        expect(form.data()).toEqual(before);
    });

    it('moves to client search only when the modal action is used', () => {
        const { proposal, returnToClientStep } = setup(null);
        proposal.duplicateClientDialogOpen.value = true;

        proposal.searchExistingClient();

        expect(proposal.duplicateClientDialogOpen.value).toBe(false);
        expect(returnToClientStep).toHaveBeenCalledOnce();
    });
});
