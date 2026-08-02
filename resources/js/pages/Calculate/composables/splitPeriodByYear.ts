export type AnnualContributionPeriod = {
    year: number;
    startDate: string;
    endDate: string;
};

const parseIsoDate = (value: string | null): Date | null => {
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
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;
};

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

export const formatContributionDate = (value: string): string => {
    const date = parseIsoDate(value);

    if (!date) {
        return '';
    }

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');

    return `${day}/${month}/${date.getUTCFullYear()}`;
};

export const splitPeriodByYear = (
    startDate: string | null,
    endDate: string | null,
): AnnualContributionPeriod[] => {
    const start = parseIsoDate(startDate);
    const end = parseIsoDate(endDate);

    if (!start || !end || start.getTime() > end.getTime()) {
        return [];
    }

    const startYear = start.getUTCFullYear();
    const endYear = end.getUTCFullYear();

    return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
        const year = startYear + index;
        const annualStart =
            year === startYear ? start : new Date(Date.UTC(year, 0, 1));
        const annualEnd =
            year === endYear ? end : new Date(Date.UTC(year, 11, 31));

        return {
            year,
            startDate: toIsoDate(annualStart),
            endDate: toIsoDate(annualEnd),
        };
    });
};
