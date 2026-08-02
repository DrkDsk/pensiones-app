import { useHttp } from '@inertiajs/vue3';
import PercentageCostModality40Controller from '@/actions/App/Http/Controllers/PercentageCostModality40Controller';
import type { PercentageCostModality40Response } from '../types/calculate';

type PercentageCostModality40Request = Record<string, never>;

export const usePercentageCostModality40Service = () => {
    const http = useHttp<
        PercentageCostModality40Request,
        PercentageCostModality40Response
    >({});

    const getPercentageCostsByYears = async (
        years: number[],
    ): Promise<PercentageCostModality40Response> =>
        http.submit(
            PercentageCostModality40Controller.index({
                query: { years },
            }),
        );

    return {
        getPercentageCostsByYears,
    };
};
