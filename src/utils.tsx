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

export function getValueFromCurrencyMask({
  value,
  newValue,
  currencyDivider,
  maxDecimalPlaces,
}: CurrencyMaskTypeArgs): ResultType {
  const { divider, decimal } = getCurrencyDividerAndDecimal(currencyDivider);

  if (value.length >= newValue.length) return undefined;

  if (newValue.includes(decimal)) {
    let intVal = newValue.split(decimal)[0].replace(/[,.]/g, '');
    let decimalValue = newValue.split(decimal)[1];
    if (intVal.length > 3) {
      let arr: string[] = [];
      for (let i = 0; i < intVal.length; i += 3) {
        arr.push(
          intVal
            .split('')
            .splice(intVal.length - i, 3)
            .join(''),
        );
      }

      arr = arr.reverse();
      arr.pop();
      let initial = arr.join('');
      if (intVal.includes(initial)) {
        intVal = intVal.replace(initial, '');
      }
      intVal = intVal + divider + arr.join(divider);
    }

    newValue = intVal + decimal + decimalValue;

    let decimalPlaces: number =
      maxDecimalPlaces !== undefined ? maxDecimalPlaces : 2;

    if (
      newValue.split(decimal)[1] !== undefined &&
      value.split(decimal)[1] !== undefined &&
      newValue.split(decimal)[1].length > value.split(decimal)[1].length &&
      value.split(decimal)[1].length === decimalPlaces
    ) {
      return '';
    }
    if (newValue.split(decimal)[1].length > decimalPlaces) {
      newValue = newValue.slice(0, newValue.length - 1);
    }
  } else if (newValue.length > 3) {
    let arr: string[] = [];
    let unmasked = newValue.replace(/[,.]/g, '');
    for (let i = 0; i < unmasked.length; i += 3) {
      arr.push(
        unmasked
          .split('')
          .splice(unmasked.length - i, 3)
          .join(''),
      );
    }

    arr = arr.reverse();
    arr.pop();
    let initial = arr.join('');
    if (unmasked.includes(initial)) {
      unmasked = unmasked.replace(initial, '');
    }
    newValue = unmasked + divider + arr.join(divider);
  }
  return newValue;
}
