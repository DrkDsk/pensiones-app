import { computed, nextTick, ref } from 'vue';
import type { Client } from '@/models/client';
import calculate from '@/routes/calculate';
import { createFamilyInformationDefaults } from '../constants/formDefaults';
import type {
    CalculateForm,
    ClientStepField,
    FamilyInformationField,
    ManualClientField,
    StepErrors,
} from '../types/calculate';
import {
    validateClientField,
    validateFamilyInformationField,
} from '../validators/clientValidation';

const normalizeDateValue = (value: string | null | undefined): string => {
    if (!value) {
        return '';
    }

    const dateValue = value.slice(0, 10);

    return /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? dateValue : '';
};

const hydrateClientForm = (form: CalculateForm, client: Client) => {
    form.client.name = client.name ?? '';
    form.client.last_name = client.last_name ?? '';
    form.client.phone = client.phone ?? '';
    form.client.email = client.email ?? '';
    form.client.curp = client.curp ?? '';
    form.client.birthdate = normalizeDateValue(client.birthdate);
    form.client.nss = client.nss ?? '';
    form.client.regime_end_date = normalizeDateValue(client.regime_end_date);
    form.client.unemployment_assistance_discounted_weeks = String(
        client.unemployment_assistance_discounted_weeks ?? '',
    );
    form.client.notes = client.notes ?? '';
};

export const useClientSearch = ({
    clients,
    initialSearch,
    initialSelectedClient,
    form,
    stepErrors,
    clearStepError,
    clearStepErrors,
    clearClientFields,
}: {
    clients: Client[];
    initialSearch: string;
    initialSelectedClient: Client | null;
    form: CalculateForm;
    stepErrors: StepErrors;
    clearStepError: (field: ClientStepField) => void;
    clearStepErrors: () => void;
    clearClientFields: () => void;
}) => {
    const clientSearch = ref(initialSearch);
    const clientResults = ref<Client[]>(clients);
    const selectedClient = ref<Client | null>(initialSelectedClient);
    const showClientDropdown = ref(false);
    const manualCustomerMode = ref(false);
    const manualFocusRequest = ref(0);
    let searchTimer: ReturnType<typeof window.setTimeout> | null = null;
    let searchRequestId = 0;

    const normalizedSearch = computed(() =>
        clientSearch.value.trim().toLowerCase(),
    );

    const filteredClients = computed(() => {
        if (!normalizedSearch.value) {
            return clientResults.value.slice(0, 6);
        }

        return clientResults.value
            .filter((client) => {
                const fullName =
                    `${client.name ?? ''} ${client.last_name ?? ''}`
                        .trim()
                        .toLowerCase();
                const phone = `${client.phone ?? ''}`.toLowerCase();
                const email = `${client.email ?? ''}`.toLowerCase();
                const curp = `${client.curp ?? ''}`.toLowerCase();

                return (
                    fullName.includes(normalizedSearch.value) ||
                    phone.includes(normalizedSearch.value) ||
                    email.includes(normalizedSearch.value) ||
                    curp.includes(normalizedSearch.value)
                );
            })
            .slice(0, 6);
    });

    const showManualCustomerFields = computed(
        () =>
            manualCustomerMode.value ||
            (!!clientSearch.value.trim() && !form.client_id) ||
            !!form.client.name ||
            !!form.client.last_name ||
            !!form.client.phone ||
            !!form.client.email ||
            !!form.client.curp ||
            !!form.client.birthdate ||
            !!form.client.nss ||
            !!form.client.regime_end_date ||
            !!form.client.unemployment_assistance_discounted_weeks ||
            form.family_information.has_spouse !== '' ||
            !!form.family_information.minor_or_student_children_count ||
            !!form.family_information.parents_count ||
            !!form.client.notes,
    );

    const searchClients = async () => {
        const requestId = ++searchRequestId;
        const params = new URLSearchParams({
            search: clientSearch.value.trim(),
        });

        const response = await fetch(
            calculate.clients.search.url({
                query: Object.fromEntries(params),
            }),
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );

        if (!response.ok || requestId !== searchRequestId) {
            return;
        }

        const data = (await response.json()) as { clients: Client[] };
        clientResults.value = data.clients;
    };

    const scheduleClientSearch = () => {
        if (searchTimer) {
            window.clearTimeout(searchTimer);
        }

        searchTimer = window.setTimeout(() => {
            void searchClients();
        }, 250);
    };

    const handleSearchInput = (event: Event) => {
        clientSearch.value = (event.target as HTMLInputElement).value;
        showClientDropdown.value = true;
        manualCustomerMode.value = false;

        if (form.client_id) {
            form.client_id = null;
            selectedClient.value = null;
        }

        stepErrors.client_id = '';
        scheduleClientSearch();
    };

    const selectClient = (client: Client) => {
        form.client_id = client.id;
        clearClientFields();
        hydrateClientForm(form, client);
        form.family_information = createFamilyInformationDefaults(client);
        selectedClient.value = client;
        clientSearch.value =
            `${client.name ?? ''} ${client.last_name ?? ''}`.trim();
        showClientDropdown.value = false;
        manualCustomerMode.value = false;
        clearStepErrors();
    };

    const activateManualCustomer = async () => {
        form.client_id = null;
        selectedClient.value = null;
        clientSearch.value = '';
        manualCustomerMode.value = true;
        showClientDropdown.value = false;
        await nextTick();
        manualFocusRequest.value += 1;
    };

    const hideDropdown = () => {
        window.setTimeout(() => {
            showClientDropdown.value = false;
        }, 120);
    };

    const handleManualInput = (
        field: ManualClientField,
        value: string | number | undefined,
    ) => {
        form.client_id = null;
        selectedClient.value = null;
        const clientField = field === 'client_notes' ? 'notes' : field;
        const normalizedValue =
            clientField === 'curp' ? String(value ?? '').toUpperCase() : value;

        form.client[clientField] = String(normalizedValue ?? '');
        manualCustomerMode.value = true;
        stepErrors.client_id = '';

        if (
            clientField === 'name' ||
            clientField === 'phone' ||
            clientField === 'email' ||
            clientField === 'curp' ||
            clientField === 'birthdate' ||
            clientField === 'nss' ||
            clientField === 'regime_end_date' ||
            clientField === 'unemployment_assistance_discounted_weeks'
        ) {
            validateClientField(form, stepErrors, clientField);

            return;
        }

        clearStepError(clientField);
    };

    const handleFamilyInformationInput = (
        field: FamilyInformationField,
        value: string | number | undefined,
    ) => {
        form.client_id = null;
        selectedClient.value = null;

        if (field === 'parents_count') {
            form.family_information.parents_count =
                value !== undefined && value !== '' ? Number(value) : '';
        } else {
            form.family_information[field] = String(value ?? '');
        }

        manualCustomerMode.value = true;
        stepErrors.client_id = '';
        validateFamilyInformationField(form, stepErrors, field);
    };

    return {
        clientSearch,
        filteredClients,
        selectedClient,
        showClientDropdown,
        manualCustomerMode,
        manualFocusRequest,
        showManualCustomerFields,
        handleSearchInput,
        selectClient,
        activateManualCustomer,
        hideDropdown,
        handleManualInput,
        handleFamilyInformationInput,
    };
};
