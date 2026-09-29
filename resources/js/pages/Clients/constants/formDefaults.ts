import type { ClientFormData } from '../types/client';

export const createClientFormDefaults = (): ClientFormData => ({
    client: {
        name: '',
        last_name: '',
        phone: '',
        email: '',
        curp: '',
        birthdate: '',
        notes: '',
    },
    social_security_information: {
        nss: '',
        regime_end_date: '',
        unemployment_assistance_discounted_weeks: '0',
        total_contributed_weeks: '',
    },
});
