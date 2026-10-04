function serialize<T>(value: T) {
  const data = JSON.stringify(value);

  if (data === undefined) {
    throw new Error('Value is not JSON serializable');
  }

  return data;
}

function parse<T>(value: string) {
  return JSON.parse(value) as T;
}

export const HelperJson = {
  serialize,
  parse,
};
