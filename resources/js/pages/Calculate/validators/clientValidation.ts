import type {
    CalculateForm,
    ClientValidationField,
    FamilyInformationField,
    StepErrors,
} from '../types/calculate';

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
    form: CalculateForm,
    stepErrors: StepErrors,
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

        if (form.client.regime_end_date) {
            validateClientField(form, stepErrors, 'regime_end_date');
        }

        return !stepErrors.birthdate;
    }

    if (field === 'nss') {
        form.client.nss = normalizeDigits(form.client.nss);

        stepErrors.nss = !form.client.nss
            ? options.requireRequiredFields
                ? 'El NSS es obligatorio.'
                : ''
            : form.client.nss.length === 11
              ? ''
              : 'El NSS debe contener exactamente 11 digitos.';

        return !stepErrors.nss;
    }

    if (field === 'regime_end_date') {
        stepErrors.regime_end_date =
            form.client.regime_end_date &&
            !isValidDateValue(form.client.regime_end_date)
                ? 'La fecha de baja de regimen no es valida.'
                : form.client.regime_end_date &&
                    form.client.birthdate &&
                    isValidDateValue(form.client.birthdate) &&
                    !isAfterDate(
                        form.client.regime_end_date,
                        form.client.birthdate,
                    )
                  ? 'La fecha de baja de regimen debe ser posterior a la fecha de nacimiento.'
                  : form.client.regime_end_date &&
                      form.client.birthdate &&
                      isValidDateValue(form.client.birthdate) &&
                      !isAfterEighteenthBirthday(
                          form.client.regime_end_date,
                          form.client.birthdate,
                      )
                    ? 'La fecha de baja de regimen debe ser posterior a la fecha en que el cliente cumplio 18 anos.'
                    : '';

        return !stepErrors.regime_end_date;
    }

    if (field === 'unemployment_assistance_discounted_weeks') {
        stepErrors.unemployment_assistance_discounted_weeks = !form.client
            .unemployment_assistance_discounted_weeks
            ? options.requireRequiredFields
                ? 'Las semanas descontadas son obligatorias.'
                : ''
            : isNonNegativeInteger(
                    form.client.unemployment_assistance_discounted_weeks,
                )
              ? ''
              : 'Las semanas descontadas deben ser un entero mayor o igual a 0.';

        return !stepErrors.unemployment_assistance_discounted_weeks;
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
    form: CalculateForm,
    stepErrors: StepErrors,
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

    return (
        phoneIsValid &&
        emailIsValid &&
        curpIsValid &&
        birthdateIsValid &&
        nssIsValid &&
        regimeEndDateIsValid &&
        unemploymentWeeksAreValid
    );
};

export const validateFamilyInformationField = (
    form: CalculateForm,
    stepErrors: StepErrors,
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

    stepErrors[field] = !value
        ? options.requireRequiredFields && field !== 'parents_count'
            ? `El numero de ${fieldLabel} es obligatorio.`
            : ''
        : isNonNegativeInteger(value)
          ? ''
          : `El numero de ${fieldLabel} debe ser un entero mayor o igual a 0.`;

    return !stepErrors[field];
};

export const validateFamilyInformation = (
    form: CalculateForm,
    stepErrors: StepErrors,
) => {
    const hasSpouseIsValid = validateFamilyInformationField(
        form,
        stepErrors,
        'has_spouse',
        {
            requireRequiredFields: true,
        },
    );
    const childrenCountIsValid = validateFamilyInformationField(
        form,
        stepErrors,
        'minor_or_student_children_count',
        {
            requireRequiredFields: true,
        },
    );
    const parentsCountIsValid = validateFamilyInformationField(
        form,
        stepErrors,
        'parents_count',
        {
            requireRequiredFields: true,
        },
    );

    return hasSpouseIsValid && childrenCountIsValid && parentsCountIsValid;
};
