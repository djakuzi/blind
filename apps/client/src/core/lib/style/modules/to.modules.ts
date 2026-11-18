export type tStyleSizeValue = number | string;

function toSizeValue(value?: tStyleSizeValue) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

export const moduleTo = {
  toSizeValue,
};
