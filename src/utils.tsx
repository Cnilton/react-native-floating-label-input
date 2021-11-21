type Mask = string;
type CurrencyDivider = ',' | '.';

type CurrencyMaskTypeArgs = {
  value: string;
  newValue: string;
  currencyDivider: CurrencyDivider | undefined;
  maxDecimalPlaces: number | undefined;
};

type NonCurrencyMaskTypeArgs = {
  value: string;
  mask: Mask;
};

type ResultType = string | undefined;

export function getValueWithNonCurrencyMask({
  value,
  mask,
}: NonCurrencyMaskTypeArgs): ResultType {
  const unmasked = value.replace(/[^0-9A-Za-z]/g, '');

  // mark positions of special characters
  const positions: number[] = [];
  for (let i = 0; i < mask.length; i++) {
    if (mask[i].match(/[^0-9A-Za-z]/)) {
      positions.push(i);
    }
  }

  let newValue = '';
  let offset = 0;
  for (let j = 0; j < unmasked.length; j++) {
    // add special characters
    while (mask[j + offset]?.match(/[^0-9A-Za-z]/)) {
      newValue += mask[j + offset];
      offset++;
    }
    newValue += unmasked[j];
  }

  return newValue;
}

function getCurrencyDividerAndDecimal(divider: CurrencyDivider | undefined) {
  if (divider === ',') {
    return {
      divider: ',' as const,
      decimal: '.' as const,
    };
  } else
    return {
      divider: '.' as const,
      decimal: ',' as const,
    };
}

function convertToNumber(
  value: string,
  divider: CurrencyDivider,
  decimal: CurrencyDivider,
): number {
  // Replace decimal with a dot to allow parsing with Number default constructor
  return Number(
    value.replace(`/${divider}/g`, '').replace(`/${decimal}/`, '.'),
  );
}

export function getValueWithCurrencyMask({
  value,
  newValue,
  currencyDivider,
  maxDecimalPlaces,
}: CurrencyMaskTypeArgs): ResultType {
  const { divider, decimal } = getCurrencyDividerAndDecimal(currencyDivider);

  if (value.length >= newValue.length) return undefined;

  const newValueAsNumber = convertToNumber(newValue, divider, decimal);

  const decimalPlaces: number =
    maxDecimalPlaces !== undefined ? maxDecimalPlaces : 2;

  if (divider === ',') {
    // en-US uses dot as decimal separator and comma for thousands
    return newValueAsNumber.toLocaleString('en-US', {
      maximumFractionDigits: decimalPlaces,
    });
  } else {
    // German uses comma as decimal separator and period for thousands
    return newValueAsNumber.toLocaleString('de-DE', {
      maximumFractionDigits: decimalPlaces,
    });
  }
}
