type MaskType = 'currency' | 'phone' | 'date' | 'card';
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

export function getValueFromNonCurrencyMask({
  value,
  mask,
}: NonCurrencyMaskTypeArgs): ResultType {
  let unmasked = value.replace(/[^0-9A-Za-z]/g, '');

  // mark positions of special characters
  let positions: number[] = [];
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

function removeAllDotsAndCommas(value: string): string {
  return value.replace(/[,.]/g, '');
}

function iDontYetKnowWhatsGoingOnHere(
  value: string,
  divider: CurrencyDivider,
): string {
  if (value.length > 3) {
    let arr: string[] = [];
    for (let i = 0; i < value.length; i += 3) {
      arr.push(
        value
          .split('')
          .splice(value.length - i, 3)
          .join(''),
      );
    }

    arr = arr.reverse();
    arr.pop();
    let initial = arr.join('');
    if (value.includes(initial)) {
      value = value.replace(initial, '');
    }
    return (value = value + divider + arr.join(divider));
  } else return value;
}

export function getValueFromCurrencyMask({
  value,
  newValue,
  currencyDivider,
  maxDecimalPlaces,
}: CurrencyMaskTypeArgs): ResultType {
  const { divider, decimal } = getCurrencyDividerAndDecimal(currencyDivider);

  if (value.length >= newValue.length) return undefined;

  if (newValue.includes(decimal)) {
    let intVal = removeAllDotsAndCommas(newValue.split(decimal)[0]);
    let fractionalVal = newValue.split(decimal)[1];

    intVal = iDontYetKnowWhatsGoingOnHere(intVal, divider);

    newValue = intVal + decimal + fractionalVal;

    let decimalPlaces: number =
      maxDecimalPlaces !== undefined ? maxDecimalPlaces : 2;

    if (
      newValue.split(decimal)[1] !== undefined &&
      value.split(decimal)[1] !== undefined &&
      newValue.split(decimal)[1].length > value.split(decimal)[1].length &&
      value.split(decimal)[1].length === decimalPlaces
    ) {
      return undefined;
    }
    if (newValue.split(decimal)[1].length > decimalPlaces) {
      newValue = newValue.slice(0, newValue.length - 1);
    }
  } else if (newValue.length > 3) {
    let arr: string[] = [];
    let unmasked = removeAllDotsAndCommas(newValue);

    newValue = iDontYetKnowWhatsGoingOnHere(unmasked, divider);
  }
  return newValue;
}
