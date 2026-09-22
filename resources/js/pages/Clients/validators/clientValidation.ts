import type { ClientFormData, ClientFormField } from '../types/client';

export type ClientFormErrors = Partial<Record<ClientFormField, string>>;

const curpPattern =
    /^[A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidDate = (value: string): boolean => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
        return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

export const validateClientForm = (form: ClientFormData): ClientFormErrors => {
    const errors: ClientFormErrors = {};
    const name = form.name.trim();
    const lastName = form.last_name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const curp = form.curp.trim().toUpperCase();
    const nss = form.nss.trim();

    if (!name) {
        errors.name = 'El nombre es obligatorio.';
    } else if (name.length > 255) {
        errors.name = 'El nombre no puede exceder 255 caracteres.';
    }

    if (lastName.length > 255) {
        errors.last_name = 'Los apellidos no pueden exceder 255 caracteres.';
    }

    if (phone && !/^\d{10}$/.test(phone)) {
        errors.phone = 'El teléfono debe contener exactamente 10 dígitos.';
    }

    if (email.length > 255) {
        errors.email = 'El correo no puede exceder 255 caracteres.';
    } else if (email && !emailPattern.test(email)) {
        errors.email = 'El correo debe tener un formato válido.';
    }

    if (!curp) {
        errors.curp = 'La CURP es obligatoria.';
    } else if (!curpPattern.test(curp)) {
        errors.curp = 'El formato de la CURP no es válido.';
    }

    if (!form.birthdate) {
        errors.birthdate = 'La fecha de nacimiento es obligatoria.';
    } else if (!isValidDate(form.birthdate)) {
        errors.birthdate = 'La fecha de nacimiento no es válida.';
    }

    if (!nss) {
        errors.nss = 'El NSS es obligatorio.';
    } else if (!/^\d{11}$/.test(nss)) {
        errors.nss = 'El NSS debe contener exactamente 11 dígitos.';
    }

    if (form.regime_end_date && !isValidDate(form.regime_end_date)) {
        errors.regime_end_date = 'La fecha de baja no es válida.';
    }

    if (!/^\d+$/.test(form.unemployment_assistance_discounted_weeks)) {
        errors.unemployment_assistance_discounted_weeks =
            'Las semanas descontadas deben ser un entero mayor o igual a 0.';
    }

    return errors;
};
