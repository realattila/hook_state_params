import type { AllowedTypeValue } from './types';

export const findCurrentParamInValidParams = (
  validParams: Array<AllowedTypeValue>,
  currentParams: string
) => {
  return validParams
    .map((item) => String(item))
    .find((item) => item === currentParams);
};

export const convertNullUndefinedStringToValue = (value: string) => {
  if (value === 'undefined') {
    return undefined;
  } else if (value === 'null') {
    return null;
  } else {
    return value;
  }
};
