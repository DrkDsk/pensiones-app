import type { ClientFormData } from '../types/client';

export const createClientFormDefaults = (): ClientFormData => ({
    name: '',
    last_name: '',
    phone: '',
    email: '',
    curp: '',
    birthdate: '',
    nss: '',
    regime_end_date: '',
    unemployment_assistance_discounted_weeks: '0',
    notes: '',
});
