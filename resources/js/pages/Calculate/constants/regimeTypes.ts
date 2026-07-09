export const REGIME_TYPES = [
    { value: 'modalidad_40', label: 'Modalidad 40', fixed: true },
    { value: 'modalidad_10', label: 'Modalidad 10', fixed: true },
] as const;

export const BASE_REGIME_TYPES = REGIME_TYPES.filter(
    (regimeType) => regimeType.fixed,
);

export const MAX_ADDITIONAL_REGIME_PERIODS = 20;
export const CUSTOM_REGIME_TYPE = 'custom';
