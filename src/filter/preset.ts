export type FilterParameters = {
  identity: number;
  anime: number;
  softLight: number;
  digital: number;
};

export type FilterParameterKey = keyof FilterParameters;

export const APPROVED_PRESET: FilterParameters = {
  identity: 0.66,
  anime: 0.72,
  softLight: 0.78,
  digital: 0.84,
};

export const FILTER_LIMITS: Record<
  FilterParameterKey,
  { min: number; max: number }
> = {
  identity: { min: 0.5, max: 0.86 },
  anime: { min: 0.45, max: 0.9 },
  softLight: { min: 0.35, max: 0.92 },
  digital: { min: 0.25, max: 1 },
};

export function clampFilterParameter(
  key: FilterParameterKey,
  value: number,
): number {
  const { min, max } = FILTER_LIMITS[key];
  return Math.min(max, Math.max(min, Number(value.toFixed(2))));
}

export function adjustFilterParameter(
  preset: FilterParameters,
  key: FilterParameterKey,
  delta: number,
): FilterParameters {
  return {
    ...preset,
    [key]: clampFilterParameter(key, preset[key] + delta),
  };
}

export function asPercent(value: number): string {
  return `${Math.round(value * 100)}`;
}
