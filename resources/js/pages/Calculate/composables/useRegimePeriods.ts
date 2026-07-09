import { createBaseRegimePeriods } from '../constants/formDefaults';
import {
    BASE_REGIME_TYPES,
    CUSTOM_REGIME_TYPE,
    MAX_ADDITIONAL_REGIME_PERIODS,
} from '../constants/regimeTypes';
import type { CalculateForm, RegimePeriod } from '../types/calculate';

type DateParts = {
    year: number;
    month: number;
    day: number;
};

const parseDateParts = (value: string | null): DateParts | null => {
    if (!value) {
        return null;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return { year, month, day };
};

const isLastDayOfFebruary = ({ year, month, day }: DateParts) => {
    if (month !== 2) {
        return false;
    }

    return day === new Date(year, 2, 0).getDate();
};

export const calculateDays360 = (
    startDate: string | null,
    endDate: string | null,
): number => {
    const start = parseDateParts(startDate);
    const end = parseDateParts(endDate);

    if (!start || !end) {
        return 0;
    }

    let startDay = start.day;
    let endDay = end.day;

    if (isLastDayOfFebruary(start) || startDay === 31) {
        startDay = 30;
    }

    if (
        (isLastDayOfFebruary(end) && startDay >= 30) ||
        (endDay === 31 && startDay >= 30)
    ) {
        endDay = 30;
    }

    return (
        (end.year - start.year) * 360 +
        (end.month - start.month) * 30 +
        (endDay - startDay)
    );
};

export const calculateRegimeTime = (
    startDate: string | null,
    endDate: string | null,
): number => Math.max(calculateDays360(startDate, endDate) / 360, 0);

export const calculateIntegratedBalance = (umaValueYear: number): number =>
    umaValueYear * 25;

const BASE_REGIME_TYPE_VALUES: string[] = BASE_REGIME_TYPES.map(
    (regimeType) => regimeType.value,
);

export const isFixedRegimePeriod = (period: RegimePeriod): boolean =>
    period.is_fixed || BASE_REGIME_TYPE_VALUES.includes(period.regime_type);

export const addOneDay = (dateString: string | null): string | null => {
    const dateParts = parseDateParts(dateString);

    if (!dateParts) {
        return null;
    }

    const date = new Date(
        Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day),
    );

    date.setUTCDate(date.getUTCDate() + 1);

    return date.toISOString().slice(0, 10);
};

const createDynamicRegimePeriod = (): RegimePeriod => ({
    id: `dynamic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    regime_type: CUSTOM_REGIME_TYPE,
    regime_name: '',
    contribution_start_date: null,
    contribution_end_date: null,
    time: 0,
    uma_value_year: null,
    integrated_balance: null,
    is_fixed: false,
});

export const useRegimePeriods = (form: CalculateForm) => {
    const sortBaseRegimePeriodsToEnd = () => {
        const dynamicPeriods = form.regime_periods.filter(
            (period) => !isFixedRegimePeriod(period),
        );
        const fixedPeriods = form.regime_periods.filter(isFixedRegimePeriod);

        form.regime_periods.splice(
            0,
            form.regime_periods.length,
            ...dynamicPeriods,
            ...fixedPeriods,
        );
    };

    const ensureBaseRegimePeriods = () => {
        const basePeriods = createBaseRegimePeriods();

        basePeriods.forEach((basePeriod) => {
            const existingIndex = form.regime_periods.findIndex(
                (period) => period.regime_type === basePeriod.regime_type,
            );

            if (existingIndex === -1) {
                form.regime_periods.push(basePeriod);

                return;
            }

            form.regime_periods[existingIndex].is_fixed = true;
            form.regime_periods[existingIndex].regime_type =
                basePeriod.regime_type;
            form.regime_periods[existingIndex].regime_name =
                basePeriod.regime_name;
        });

        sortBaseRegimePeriodsToEnd();
    };

    const recalculatePeriodTime = (period: RegimePeriod) => {
        period.time = calculateRegimeTime(
            period.contribution_start_date,
            period.contribution_end_date,
        );
    };

    const recalculateIntegratedBalance = (period: RegimePeriod) => {
        period.integrated_balance = calculateIntegratedBalance(
            period.uma_value_year ?? 0,
        );
    };

    const recalculateAllPeriodTimes = () => {
        form.regime_periods.forEach(recalculatePeriodTime);
    };

    const getLastDynamicRegimePeriod = (): RegimePeriod | null => {
        for (let index = form.regime_periods.length - 1; index >= 0; index--) {
            const period = form.regime_periods[index];

            if (period && !period.is_fixed) {
                return period;
            }
        }

        return null;
    };

    const syncModalidad40StartDate = () => {
        const lastDynamicPeriod = getLastDynamicRegimePeriod();

        if (!lastDynamicPeriod) {
            return;
        }

        const nextStartDate = addOneDay(lastDynamicPeriod.contribution_end_date);

        if (!nextStartDate) {
            return;
        }

        const modalidad40 = form.regime_periods.find(
            (period) => period.regime_type === 'modalidad_40',
        );

        if (!modalidad40) {
            return;
        }

        modalidad40.contribution_start_date = nextStartDate;
        recalculatePeriodTime(modalidad40);
    };

    const syncModalidad10StartDate = () => {
        const modalidad40 = form.regime_periods.find(
            (period) => period.regime_type === 'modalidad_40',
        );

        if (!modalidad40) {
            return;
        }

        const nextStartDate = addOneDay(modalidad40.contribution_end_date);

        if (!nextStartDate) {
            return;
        }

        const modalidad10 = form.regime_periods.find(
            (period) => period.regime_type === 'modalidad_10',
        );

        if (!modalidad10) {
            return;
        }

        modalidad10.contribution_start_date = nextStartDate;
        recalculatePeriodTime(modalidad10);
    };

    const syncFixedRegimePeriodsDates = () => {
        syncModalidad40StartDate();
        syncModalidad10StartDate();
    };

    const addDynamicRegimePeriod = () => {
        const additionalPeriodsCount = form.regime_periods.filter(
            (period) => !period.is_fixed,
        ).length;

        if (additionalPeriodsCount >= MAX_ADDITIONAL_REGIME_PERIODS) {
            return false;
        }

        const firstBaseIndex = form.regime_periods.findIndex((period) =>
            ['modalidad_10', 'modalidad_40'].includes(period.regime_type),
        );

        const newPeriod = createDynamicRegimePeriod();

        if (firstBaseIndex === -1) {
            form.regime_periods.push(newPeriod);
            syncFixedRegimePeriodsDates();

            return true;
        }

        form.regime_periods.splice(firstBaseIndex, 0, newPeriod);
        syncFixedRegimePeriodsDates();

        return true;
    };

    const removeRegimePeriod = (index: number) => {
        const period = form.regime_periods[index];

        if (!period || period.is_fixed) {
            return false;
        }

        form.regime_periods.splice(index, 1);
        syncFixedRegimePeriodsDates();

        return true;
    };

    const updateRegimePeriodField = <Field extends keyof RegimePeriod>(
        index: number,
        field: Field,
        value: RegimePeriod[Field],
    ) => {
        const period = form.regime_periods[index];

        if (!period) {
            return;
        }

        period[field] = value;

        if (
            field === 'contribution_start_date' ||
            field === 'contribution_end_date'
        ) {
            recalculatePeriodTime(period);
            syncFixedRegimePeriodsDates();
        }

        if (field === 'uma_value_year' && period.is_fixed) {
            recalculateIntegratedBalance(period);
        }
    };

    ensureBaseRegimePeriods();
    recalculateAllPeriodTimes();
    syncFixedRegimePeriodsDates();

    return {
        addDynamicRegimePeriod,
        addRegimePeriod: addDynamicRegimePeriod,
        calculateRegimeTime,
        ensureBaseRegimePeriods,
        getLastDynamicRegimePeriod,
        recalculateAllPeriodTimes,
        recalculatePeriodTime,
        removeRegimePeriod,
        syncFixedRegimePeriodsDates,
        syncModalidad10StartDate,
        syncModalidad40StartDate,
        updateRegimePeriodField,
    };
};
