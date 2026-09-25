export interface PercentageCostForModality40 {
    id: number;
    year: number;
    percentage: number;
}

export interface PercentageCostCollection {
    data: PercentageCostForModality40[];
}

export interface PercentageCostFormData {
    year: string | number;
    percentage: string | number;
}

export type PercentageCostFormErrors = Partial<
    Record<keyof PercentageCostFormData, string>
>;

export type PercentageCostOperation = 'create' | 'update' | 'delete';
