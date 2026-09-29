import {
    validateClientField,
    validateClientFormatFields,
    validateFamilyInformation,
} from '@/validators/clientValidation';
import type { CalculateForm, StepErrors } from '../types/calculate';
import { validateRegimePeriods } from './regimePeriodsValidation';

export const validateClientStep = (
    form: CalculateForm,
    stepErrors: StepErrors,
    clearStepErrors: () => void,
    enableManualMode: () => void,
) => {
    clearStepErrors();

    if (form.client_id) {
        return true;
    }

    const nameIsValid = validateClientField(form, stepErrors, 'name', {
        requireRequiredFields: true,
    });
    const formatFieldsAreValid = validateClientFormatFields(form, stepErrors);
    const familyInformationIsValid = validateFamilyInformation(
        form,
        stepErrors,
    );

    if (!nameIsValid || !formatFieldsAreValid || !familyInformationIsValid) {
        enableManualMode();

        return false;
    }

    return true;
};

export const validateCalculateStep = (
    step: number,
    form: CalculateForm,
    stepErrors: StepErrors,
    clearStepErrors: () => void,
    enableManualMode: () => void,
) => {
    if (step === 1) {
        return validateClientStep(
            form,
            stepErrors,
            clearStepErrors,
            enableManualMode,
        );
    }

    if (step === 2) {
        return validateRegimePeriods(form, stepErrors);
    }

    return true;
};
