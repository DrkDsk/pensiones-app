import { calculateRegimeTime } from '../composables/useRegimePeriods';
import {
    BASE_REGIME_TYPES,
    CUSTOM_REGIME_TYPE,
    MAX_ADDITIONAL_REGIME_PERIODS,
    REGIME_TYPES,
} from '../constants/regimeTypes';
import type {
    CalculateForm,
    RegimePeriodErrors,
    StepErrors,
} from '../types/calculate';

type RegimePeriodsValidationContext = {
    birthdate?: string | null;
    regimeEndDate?: string | null;
};

const fixedRegimeTypeValues: string[] = BASE_REGIME_TYPES.map(
    (regimeType) => regimeType.value,
);

const availableRegimeTypeValues: string[] = REGIME_TYPES.map(
    (regimeType) => regimeType.value,
);

const normalizeRegimeName = (value: string) =>
    value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();

const fixedRegimeNames = BASE_REGIME_TYPES.map((regimeType) =>
    normalizeRegimeName(regimeType.label),
);

const isValidDateValue = (value: string | null) => {
    if (!value) {
        return false;
    }

    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
};

const dateValue = (value: string | null) =>
    isValidDateValue(value) ? new Date(`${value}T00:00:00`) : null;

const addYearsToDate = (value: string, years: number) => {
    const date = dateValue(value);

    if (!date) {
        return null;
    }

    date.setFullYear(date.getFullYear() + years);

    return date;
};

const isBeforeDate = (value: string | null, comparisonValue: Date) => {
    const date = dateValue(value);

    return date ? date < comparisonValue : false;
};

const isAfterDate = (value: string | null, comparisonValue: string | null) => {
    const date = dateValue(value);
    const comparisonDate = dateValue(comparisonValue);

    return date && comparisonDate ? date > comparisonDate : false;
};

const resolveValidationContext = (
    form: CalculateForm,
    context: RegimePeriodsValidationContext = {},
): RegimePeriodsValidationContext => ({
    birthdate: context.birthdate ?? form.client.birthdate,
    regimeEndDate: context.regimeEndDate ?? form.client.regime_end_date,
});

export const validateRegimePeriods = (
    form: CalculateForm,
    stepErrors: StepErrors,
    context: RegimePeriodsValidationContext = {},
) => {
    const validationContext = resolveValidationContext(form, context);
    const errors = form.regime_periods.map<RegimePeriodErrors>(() => ({}));
    let isValid = true;

    const fail = (
        index: number,
        field: keyof RegimePeriodErrors,
        message: string,
    ) => {
        errors[index] = {
            ...errors[index],
            [field]: errors[index]?.[field] ?? message,
        };
        isValid = false;
    };

    const additionalPeriodsCount = form.regime_periods.filter(
        (period) => !period.is_fixed,
    ).length;

    if (additionalPeriodsCount > MAX_ADDITIONAL_REGIME_PERIODS) {
        form.regime_periods.forEach((period, index) => {
            if (!period.is_fixed) {
                fail(
                    index,
                    'regime_name',
                    `Solo puedes agregar hasta ${MAX_ADDITIONAL_REGIME_PERIODS} periodos adicionales.`,
                );
            }
        });
    }

    BASE_REGIME_TYPES.forEach((baseRegimeType) => {
        const basePeriod = form.regime_periods.find(
            (period) =>
                period.regime_type === baseRegimeType.value && period.is_fixed,
        );

        if (!basePeriod) {
            const targetIndex = form.regime_periods.findIndex(
                (period) => period.regime_type === baseRegimeType.value,
            );

            fail(
                Math.max(targetIndex, 0),
                'regime_type',
                `Debe existir la fila base ${baseRegimeType.label}.`,
            );
        }
    });

    const eighteenthBirthday =
        validationContext.birthdate &&
        isValidDateValue(validationContext.birthdate)
            ? addYearsToDate(validationContext.birthdate, 18)
            : null;

    form.regime_periods.forEach((period, index) => {
        period.time = calculateRegimeTime(
            period.contribution_start_date,
            period.contribution_end_date,
        );

        if (!period.regime_type) {
            fail(index, 'regime_type', 'Selecciona el tipo de regimen.');
        } else if (
            period.is_fixed &&
            !availableRegimeTypeValues.includes(period.regime_type)
        ) {
            fail(index, 'regime_type', 'El tipo de regimen no es valido.');
        }

        if (!period.is_fixed && period.regime_type !== CUSTOM_REGIME_TYPE) {
            fail(
                index,
                'regime_type',
                'Las filas dinamicas deben capturarse como regimen personalizado.',
            );
        }

        if (
            period.is_fixed &&
            !fixedRegimeTypeValues.includes(period.regime_type)
        ) {
            fail(index, 'regime_type', 'El tipo fijo no es valido.');
        }

        if (!period.is_fixed) {
            const regimeName = period.regime_name.trim();
            const normalizedRegimeName = normalizeRegimeName(
                period.regime_name,
            );

            if (!regimeName) {
                fail(
                    index,
                    'regime_name',
                    'El nombre del patrón es obligatorio.',
                );
            } else if (regimeName.length < 3) {
                fail(
                    index,
                    'regime_name',
                    'El nombre del regimen debe tener al menos 3 caracteres.',
                );
            } else if (regimeName.length > 100) {
                fail(
                    index,
                    'regime_name',
                    'El nombre del regimen no puede exceder 100 caracteres.',
                );
            } else if (fixedRegimeNames.includes(normalizedRegimeName)) {
                fail(
                    index,
                    'regime_name',
                    'Las filas dinamicas no pueden usar Modalidad 10 ni Modalidad 40.',
                );
            }
        }

        if (period.is_fixed && period.uma_value_year == 0) {
            fail(index, 'uma_value_year', 'El valor de UMA es obligatorio.');
        }

        if (!period.contribution_start_date) {
            fail(
                index,
                'contribution_start_date',
                'La fecha de inicio es obligatoria.',
            );
        } else if (!isValidDateValue(period.contribution_start_date)) {
            fail(
                index,
                'contribution_start_date',
                'La fecha de inicio no es valida.',
            );
        }

        if (!period.contribution_end_date) {
            fail(
                index,
                'contribution_end_date',
                'La fecha de fin es obligatoria.',
            );
        } else if (!isValidDateValue(period.contribution_end_date)) {
            fail(
                index,
                'contribution_end_date',
                'La fecha de fin no es valida.',
            );
        }

        if (
            isValidDateValue(period.contribution_start_date) &&
            isValidDateValue(period.contribution_end_date) &&
            isAfterDate(
                period.contribution_start_date,
                period.contribution_end_date,
            )
        ) {
            fail(
                index,
                'contribution_end_date',
                'La fecha de fin debe ser mayor o igual a la fecha de inicio.',
            );
        }

        if (
            eighteenthBirthday &&
            isBeforeDate(period.contribution_start_date, eighteenthBirthday)
        ) {
            fail(
                index,
                'contribution_start_date',
                'La fecha de inicio debe ser posterior al cumpleanos 18 del cliente.',
            );
        }

        if (
            eighteenthBirthday &&
            isBeforeDate(period.contribution_end_date, eighteenthBirthday)
        ) {
            fail(
                index,
                'contribution_end_date',
                'La fecha de fin debe ser posterior al cumpleanos 18 del cliente.',
            );
        }

        /*if (
            validationContext.regimeEndDate &&
            isValidDateValue(validationContext.regimeEndDate) &&
            isAfterDate(
                period.contribution_start_date,
                validationContext.regimeEndDate,
            )
        ) {
            fail(
                index,
                'contribution_start_date',
                'La fecha de inicio no puede ser posterior a la baja de regimen.',
            );
        }*/

        /*if (
            validationContext.regimeEndDate &&
            isValidDateValue(validationContext.regimeEndDate) &&
            isAfterDate(
                period.contribution_end_date,
                validationContext.regimeEndDate,
            )
        ) {
            fail(
                index,
                'contribution_end_date',
                'La fecha de fin no puede ser posterior a la baja de regimen.',
            );
        }*/
    });

    const dynamicRegimeNameIndexes = new Map<string, number>();

    form.regime_periods.forEach((period, index) => {
        if (period.is_fixed || !period.regime_name.trim()) {
            return;
        }

        const normalizedRegimeName = normalizeRegimeName(period.regime_name);
        const duplicatedIndex =
            dynamicRegimeNameIndexes.get(normalizedRegimeName);

        if (duplicatedIndex !== undefined) {
            fail(
                duplicatedIndex,
                'regime_name',
                'El nombre del regimen esta duplicado en otro periodo dinamico.',
            );
            fail(
                index,
                'regime_name',
                'El nombre del regimen esta duplicado en otro periodo dinamico.',
            );

            return;
        }

        dynamicRegimeNameIndexes.set(normalizedRegimeName, index);
    });

    stepErrors.regime_periods = errors;

    return isValid;
};
