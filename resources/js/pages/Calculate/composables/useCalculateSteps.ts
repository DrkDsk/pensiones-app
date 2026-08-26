import type { InertiaForm } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import type { CalculateFormData, CalculateStep } from '../types/calculate';

export const useCalculateSteps = ({
    steps,
    validateCurrentStep,
    submitCalculate,
}: {
    steps: CalculateStep[];
    validateCurrentStep: (step: number) => boolean;
    submitCalculate: () => void;
}) => {
    const currentStep = ref(1);

    const progressWidth = computed(
        () => `${((currentStep.value - 1) / (steps.length - 1)) * 100}%`,
    );

    const goToStep = (step: number) => {
        if (step <= currentStep.value) {
            currentStep.value = step;
        }
    };

    const goToPreviousStep = () => {
        currentStep.value = Math.max(currentStep.value - 1, 1);
    };

    const goToNextStep = (form: InertiaForm<CalculateFormData>) => {
        console.log(form.data());

        if (currentStep.value === steps.length) {
            for (let step = 1; step <= steps.length; step += 1) {
                if (!validateCurrentStep(step)) {
                    currentStep.value = step;

                    return;
                }
            }

            submitCalculate();

            return;
        }

        if (!validateCurrentStep(currentStep.value)) {
            return;
        }

        currentStep.value = Math.min(currentStep.value + 1, steps.length);
    };

    const returnToClientStep = () => {
        currentStep.value = 1;
    };

    return {
        currentStep,
        progressWidth,
        goToStep,
        goToPreviousStep,
        goToNextStep,
        returnToClientStep,
    };
};
