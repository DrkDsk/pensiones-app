import { describe, expect, it } from 'vitest';
import { useCalculateForm } from './useCalculateForm';

describe('useCalculateForm', () => {
    it('calculates contributed weeks from social security information', () => {
        const { form, contributed_weeks } = useCalculateForm(null);
        const modalidad40 = form.regime_periods.find(
            (period) => period.regime_type === 'modalidad_40',
        );

        expect(modalidad40).toBeDefined();

        form.social_security_information.total_contributed_weeks = '1200';
        modalidad40!.time = 2;

        expect(contributed_weeks.value).toBe(1308);
    });
});
