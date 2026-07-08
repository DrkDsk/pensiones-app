<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppCard from '@/components/AppCard.vue';
import type { Client } from '@/models/client';
import StepBeneficiaries from './Calculate/components/StepBeneficiaries.vue';
import StepClient from './Calculate/components/StepClient.vue';
import StepNavigation from './Calculate/components/StepNavigation.vue';
import StepperHeader from './Calculate/components/StepperHeader.vue';
import StepRegimePeriods from './Calculate/components/StepRegimePeriods.vue';
import StepSummary from './Calculate/components/StepSummary.vue';
import { useCalculateForm } from './Calculate/composables/useCalculateForm';
import { useCalculateSteps } from './Calculate/composables/useCalculateSteps';
import { useClientSearch } from './Calculate/composables/useClientSearch';
import { calculateSteps } from './Calculate/constants/calculateSteps';
import type {
    ClientValidationField,
    FamilyInformationField,
} from './Calculate/types/calculate';
import { validateCalculateStep } from './Calculate/validators/calculateValidation';
import {
    validateClientField as validateClientFieldValue,
    validateFamilyInformationField as validateFamilyInformationFieldValue,
} from './Calculate/validators/clientValidation';

const props = defineProps<{
    clients: Client[];
    selectedClient: Client | null;
    filters: {
        search: string;
    };
}>();

const {
    form,
    average_daily_salary_last_250_weeks,
    contributed_weeks,
    years_recognized,
    stepErrors,
    clearStepError,
    clearStepErrors,
    clearClientFields,
    submitCalculate,
} = useCalculateForm(props.selectedClient);

const {
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
} = useClientSearch({
    clients: props.clients ?? [],
    initialSearch: props.filters?.search ?? '',
    initialSelectedClient: props.selectedClient,
    form,
    stepErrors,
    clearStepError,
    clearStepErrors,
    clearClientFields,
});

const enableManualMode = () => {
    manualCustomerMode.value = true;
};

const validateCurrentStep = (step: number) =>
    validateCalculateStep(
        step,
        form,
        stepErrors,
        clearStepErrors,
        enableManualMode,
    );

const validateRegimePeriodsStep = () => validateCurrentStep(2);

const {
    currentStep,
    progressWidth,
    goToStep,
    goToPreviousStep,
    goToNextStep,
    returnToClientStep,
} = useCalculateSteps({
    steps: calculateSteps,
    validateCurrentStep,
    submitCalculate: () =>
        submitCalculate(enableManualMode, returnToClientStep),
});

const validateClientField = (
    field: ClientValidationField,
    options: { requireRequiredFields?: boolean } = {},
) => validateClientFieldValue(form, stepErrors, field, options);

const validateFamilyInformationField = (
    field: FamilyInformationField,
    options: { requireRequiredFields?: boolean } = {},
) => validateFamilyInformationFieldValue(form, stepErrors, field, options);
</script>

<template>
    <Head title="Cálculo de Pensión" />

    <div class="mx-auto w-full p-4">
        <AppCard class="overflow-hidden">
            <StepperHeader
                :steps="calculateSteps"
                :current-step="currentStep"
                :progress-width="progressWidth"
                @go-to-step="goToStep"
            />

            <div class="px-6 py-6 sm:px-8">
                <Transition
                    mode="out-in"
                    enter-active-class="transition duration-250 ease-out"
                    enter-from-class="translate-y-2 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="-translate-y-1 opacity-0"
                >
                    <section :key="currentStep" class="space-y-6">
                        <StepClient
                            v-if="currentStep === 1"
                            v-model:show-client-dropdown="showClientDropdown"
                            :form="form"
                            :step-errors="stepErrors"
                            :client-search="clientSearch"
                            :filtered-clients="filteredClients"
                            :selected-client="selectedClient"
                            :show-manual-customer-fields="
                                showManualCustomerFields
                            "
                            :manual-customer-mode="manualCustomerMode"
                            :manual-focus-request="manualFocusRequest"
                            :handle-search-input="handleSearchInput"
                            :select-client="selectClient"
                            :activate-manual-customer="activateManualCustomer"
                            :hide-dropdown="hideDropdown"
                            :handle-manual-input="handleManualInput"
                            :handle-family-information-input="
                                handleFamilyInformationInput
                            "
                            :validate-client-field="validateClientField"
                            :validate-family-information-field="
                                validateFamilyInformationField
                            "
                        />

                        <StepRegimePeriods
                            v-else-if="currentStep === 2"
                            :form="form"
                            :step-errors="stepErrors"
                            :average-daily-salary-last250-weeks="
                                average_daily_salary_last_250_weeks
                            "
                            :contributed-weeks="contributed_weeks"
                            :validate-regime-periods="validateRegimePeriodsStep"
                        />
                        <StepBeneficiaries
                            v-else-if="currentStep === 3"
                            :form="form"
                            :average-daily-salary-last250-weeks="
                                average_daily_salary_last_250_weeks
                            "
                            :years-recognized="years_recognized"
                            :contributed-weeks="contributed_weeks"
                        />
                        <StepSummary v-else-if="currentStep === 4" />
                    </section>
                </Transition>
            </div>

            <StepNavigation
                :current-step="currentStep"
                :processing="form.processing"
                @previous="goToPreviousStep"
                @next="goToNextStep"
            />
        </AppCard>
    </div>
</template>

<style scoped></style>
