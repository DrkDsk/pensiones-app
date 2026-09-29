export interface FamilyInformationForm {
    has_spouse: string;
    minor_or_student_children_count: string;
    parents_count: string | number;
}

export type FamilyInformationField = keyof FamilyInformationForm;

export type FamilyInformationErrors = Partial<
    Record<FamilyInformationField, string>
>;

export interface ClientValidationForm {
    client: {
        name: string;
        last_name: string;
        phone: string;
        email: string;
        curp: string;
        birthdate: string;
        notes: string;
    };
    social_security_information: {
        nss: string;
        regime_end_date: string;
        unemployment_assistance_discounted_weeks: string;
        total_contributed_weeks: string;
    };
    family_information: FamilyInformationForm;
}

type ClientValidationField =
    | 'name'
    | 'phone'
    | 'email'
    | 'curp'
    | 'birthdate'
    | 'nss'
    | 'regime_end_date'
    | 'unemployment_assistance_discounted_weeks'
    | 'total_contributed_weeks';

type ClientValidationErrors = Partial<
    Record<
        ClientValidationField | FamilyInformationField | 'last_name' | 'notes',
        string
    >
>;

type ClientFormField =
    | `client.${keyof ClientValidationForm['client']}`
    | `social_security_information.${keyof ClientValidationForm['social_security_information']}`
    | `family_information.${keyof ClientValidationForm['family_information']}`;

export type ClientFormErrors = Partial<Record<ClientFormField, string>>;

export const createEmptyFamilyInformation = (): FamilyInformationForm => ({
    has_spouse: '',
    minor_or_student_children_count: '',
    parents_count: '',
});

const curpPattern =
    /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const normalizePhone = (value: string) => value.replace(/\D+/g, '');
const normalizeDigits = (value: string) => value.replace(/\D+/g, '');

const isValidDateValue = (value: string) => {
    if (!value) {
        return false;
    }

    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
};

const eighteenYearsAgo = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setFullYear(date.getFullYear() - 18);

    return date;
};

const isAtLeast18YearsOld = (value: string) => {
    if (!isValidDateValue(value)) {
        return false;
    }

    const birthdate = new Date(`${value}T00:00:00`);

    return birthdate <= eighteenYearsAgo();
};

const isAfterDate = (value: string, comparisonValue: string) => {
    if (!isValidDateValue(value) || !isValidDateValue(comparisonValue)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00`);
    const comparisonDate = new Date(`${comparisonValue}T00:00:00`);

    return date > comparisonDate;
};

const eighteenthBirthdayFor = (value: string) => {
    if (!isValidDateValue(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00`);
    date.setFullYear(date.getFullYear() + 18);

    return date;
};

const isAfterEighteenthBirthday = (value: string, birthdateValue: string) => {
    if (!isValidDateValue(value)) {
        return false;
    }

    const eighteenthBirthday = eighteenthBirthdayFor(birthdateValue);

    if (!eighteenthBirthday) {
        return false;
    }

    const date = new Date(`${value}T00:00:00`);

    return date > eighteenthBirthday;
};

const isNonNegativeInteger = (value: string | number) =>
    /^\d+$/.test(String(value)) && Number(value) >= 0;

export const validateClientField = (
    form: ClientValidationForm,
    stepErrors: ClientValidationErrors,
    field: ClientValidationField,
    options: { requireRequiredFields?: boolean } = {},
) => {
    if (field === 'name') {
        stepErrors.name = form.client.name.trim()
            ? ''
            : options.requireRequiredFields
              ? 'El nombre es obligatorio.'
              : '';

        return !stepErrors.name;
    }

    if (field === 'phone') {
        const normalizedPhone = normalizePhone(form.client.phone);

        stepErrors.phone =
            normalizedPhone && normalizedPhone.length !== 10
                ? 'El telefono debe contener exactamente 10 digitos.'
                : '';

        return !stepErrors.phone;
    }

    if (field === 'email') {
        const email = form.client.email.trim();

        stepErrors.email =
            email && !emailPattern.test(email)
                ? 'El correo electronico debe tener un formato valido.'
                : '';

        return !stepErrors.email;
    }

    if (field === 'birthdate') {
        stepErrors.birthdate = !form.client.birthdate
            ? options.requireRequiredFields
                ? 'La fecha de nacimiento es obligatoria.'
                : ''
            : !isValidDateValue(form.client.birthdate)
              ? 'La fecha de nacimiento no es valida.'
              : !isAtLeast18YearsOld(form.client.birthdate)
                ? 'El cliente debe tener al menos 18 anos cumplidos.'
                : '';

        if (form.social_security_information.regime_end_date) {
            validateClientField(form, stepErrors, 'regime_end_date');
        }

        return !stepErrors.birthdate;
    }

    if (field === 'nss') {
        form.social_security_information.nss = normalizeDigits(
            form.social_security_information.nss,
        );

        stepErrors.nss = !form.social_security_information.nss
            ? options.requireRequiredFields
                ? 'El NSS es obligatorio.'
                : ''
            : form.social_security_information.nss.length === 11
              ? ''
              : 'El NSS debe contener exactamente 11 digitos.';

        return !stepErrors.nss;
    }

    if (field === 'regime_end_date') {
        stepErrors.regime_end_date =
            form.social_security_information.regime_end_date &&
            !isValidDateValue(form.social_security_information.regime_end_date)
                ? 'La fecha de baja de regimen no es valida.'
                : form.social_security_information.regime_end_date &&
                    form.client.birthdate &&
                    isValidDateValue(form.client.birthdate) &&
                    !isAfterDate(
                        form.social_security_information.regime_end_date,
                        form.client.birthdate,
                    )
                  ? 'La fecha de baja de regimen debe ser posterior a la fecha de nacimiento.'
                  : form.social_security_information.regime_end_date &&
                      form.client.birthdate &&
                      isValidDateValue(form.client.birthdate) &&
                      !isAfterEighteenthBirthday(
                          form.social_security_information.regime_end_date,
                          form.client.birthdate,
                      )
                    ? 'La fecha de baja de regimen debe ser posterior a la fecha en que el cliente cumplio 18 anos.'
                    : '';

        return !stepErrors.regime_end_date;
    }

    if (field === 'unemployment_assistance_discounted_weeks') {
        stepErrors.unemployment_assistance_discounted_weeks = !form
            .social_security_information
            .unemployment_assistance_discounted_weeks
            ? options.requireRequiredFields
                ? 'Las semanas descontadas son obligatorias.'
                : ''
            : isNonNegativeInteger(
                    form.social_security_information
                        .unemployment_assistance_discounted_weeks,
                )
              ? ''
              : 'Las semanas descontadas deben ser un entero mayor o igual a 0.';

        return !stepErrors.unemployment_assistance_discounted_weeks;
    }

    if (field === 'total_contributed_weeks') {
        stepErrors.total_contributed_weeks = !form.social_security_information
            .total_contributed_weeks
            ? options.requireRequiredFields
                ? 'El total de semanas cotizadas es obligatorio.'
                : ''
            : isNonNegativeInteger(
                    form.social_security_information.total_contributed_weeks,
                )
              ? ''
              : 'El total de semanas cotizadas debe ser un entero mayor o igual a 0.';

        return !stepErrors.total_contributed_weeks;
    }

    form.client.curp = form.client.curp.toUpperCase();

    stepErrors.curp = !form.client.curp.trim()
        ? options.requireRequiredFields
            ? 'La CURP es obligatoria.'
            : ''
        : curpPattern.test(form.client.curp)
          ? ''
          : 'La CURP debe tener un formato mexicano valido.';

    return !stepErrors.curp;
};

export const validateClientFormatFields = (
    form: ClientValidationForm,
    stepErrors: ClientValidationErrors,
) => {
    const phoneIsValid = validateClientField(form, stepErrors, 'phone');
    const emailIsValid = validateClientField(form, stepErrors, 'email');
    const curpIsValid = validateClientField(form, stepErrors, 'curp', {
        requireRequiredFields: true,
    });
    const birthdateIsValid = validateClientField(
        form,
        stepErrors,
        'birthdate',
        {
            requireRequiredFields: true,
        },
    );
    const nssIsValid = validateClientField(form, stepErrors, 'nss', {
        requireRequiredFields: true,
    });
    const regimeEndDateIsValid = validateClientField(
        form,
        stepErrors,
        'regime_end_date',
    );
    const unemploymentWeeksAreValid = validateClientField(
        form,
        stepErrors,
        'unemployment_assistance_discounted_weeks',
        {
            requireRequiredFields: true,
        },
    );
    const totalContributedWeeksAreValid = validateClientField(
        form,
        stepErrors,
        'total_contributed_weeks',
        {
            requireRequiredFields: true,
        },
    );

    return (
        phoneIsValid &&
        emailIsValid &&
        curpIsValid &&
        birthdateIsValid &&
        nssIsValid &&
        regimeEndDateIsValid &&
        unemploymentWeeksAreValid &&
        totalContributedWeeksAreValid
    );
};

export const validateFamilyInformationField = (
    form: ClientValidationForm,
    stepErrors: ClientValidationErrors,
    field: FamilyInformationField,
    options: { requireRequiredFields?: boolean } = {},
) => {
    if (field === 'has_spouse') {
        stepErrors.has_spouse =
            form.family_information.has_spouse === '' &&
            options.requireRequiredFields
                ? 'Selecciona si tiene esposo/a.'
                : '';

        return !stepErrors.has_spouse;
    }

    const value = form.family_information[field];
    const fieldLabel =
        field === 'minor_or_student_children_count'
            ? 'hijos menores o estudiando'
            : 'padres';

    stepErrors[field] =
        value === null || value === undefined
            ? options.requireRequiredFields && field !== 'parents_count'
                ? `El numero de ${fieldLabel} es obligatorio.`
                : ''
            : isNonNegativeInteger(value)
              ? ''
              : `El numero de ${fieldLabel} debe ser un entero`;

    return !stepErrors[field];
};

export const validateFamilyInformation = (
    form: ClientValidationForm,
    stepErrors: ClientValidationErrors,
) => {
    const hasSpouseIsValid = validateFamilyInformationField(
        form,
        stepErrors,
        'has_spouse',
        { requireRequiredFields: true },
    );
    const childrenCountIsValid = validateFamilyInformationField(
        form,
        stepErrors,
        'minor_or_student_children_count',
        { requireRequiredFields: true },
    );
    const parentsCountIsValid = validateFamilyInformationField(
        form,
        stepErrors,
        'parents_count',
        { requireRequiredFields: true },
    );

    return hasSpouseIsValid && childrenCountIsValid && parentsCountIsValid;
};

export const validateClientForm = (
    form: ClientValidationForm,
): ClientFormErrors => {
    const fieldErrors: ClientValidationErrors = {};

    validateClientField(form, fieldErrors, 'name', {
        requireRequiredFields: true,
    });
    validateClientFormatFields(form, fieldErrors);
    validateFamilyInformation(form, fieldErrors);

    if (form.client.name.length > 255) {
        fieldErrors.name = 'El nombre no puede exceder 255 caracteres.';
    }

    if (form.client.last_name.length > 255) {
        fieldErrors.last_name =
            'Los apellidos no pueden exceder 255 caracteres.';
    }

    if (form.client.email.length > 255) {
        fieldErrors.email = 'El correo no puede exceder 255 caracteres.';
    }

    const errors: ClientFormErrors = {};

    for (const [field, message] of Object.entries(fieldErrors)) {
        if (!message) {
            continue;
        }

        if (
            field === 'nss' ||
            field === 'regime_end_date' ||
            field === 'unemployment_assistance_discounted_weeks' ||
            field === 'total_contributed_weeks'
        ) {
            errors[`social_security_information.${field}` as ClientFormField] =
                message;
        } else if (
            field === 'has_spouse' ||
            field === 'minor_or_student_children_count' ||
            field === 'parents_count'
        ) {
            errors[`family_information.${field}` as ClientFormField] = message;
        } else {
            errors[`client.${field}` as ClientFormField] = message;
        }
    }

    return errors;
};
