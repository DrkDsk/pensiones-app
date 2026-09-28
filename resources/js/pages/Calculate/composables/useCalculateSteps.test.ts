import { describe, expect, it, vi } from 'vitest';
import type { CalculateStep } from '../types/calculate';
import { useCalculateSteps } from './useCalculateSteps';

const steps: CalculateStep[] = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    label: `Paso ${index + 1}`,
    helper: '',
}));

describe('useCalculateSteps', () => {
    it('allows returning to the final visited step after searching for a client', () => {
        const calculateSteps = useCalculateSteps({
            steps,
            validateCurrentStep: () => true,
            submitCalculate: vi.fn(),
        });

        for (let step = 1; step < steps.length; step += 1) {
            calculateSteps.goToNextStep();
        }

        calculateSteps.returnToClientStep();
        expect(calculateSteps.currentStep.value).toBe(1);

        calculateSteps.goToStep(5);
        expect(calculateSteps.currentStep.value).toBe(5);
    });
});
