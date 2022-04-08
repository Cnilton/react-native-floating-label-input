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

export function getValueWithCurrencyMask({
  value,
  newValue,
  currencyDivider,
}: CurrencyMaskTypeArgs): ResultType {
  const { divider, decimal } = getCurrencyDividerAndDecimal(currencyDivider);

  if (value !== undefined) {
    if (!newValue.includes(decimal)) {
      if (newValue?.replace(/[,.]/g, '')?.length > 3) {
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
        const initial = arr.join('');
        if (unmasked.includes(initial)) {
          unmasked = unmasked.replace(initial, '');
        }
        newValue = unmasked + divider + arr.join(divider);
      } else {
        newValue = newValue?.replace(/[,.]/g, '');
      }
    } else {
      if (
        newValue?.split(decimal).length > 2 ||
        newValue?.split(decimal)[1].includes(divider)
      ) {
        return value;
      }
    }
  }

  return newValue;
}
