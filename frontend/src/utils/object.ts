interface Item {
  [key: string]: any;
}

export function containsMatchingValue<T extends Item>(
  array: T[],
  key: keyof T,
  value: any
): boolean {
  return array.some((obj) => obj[key] === value);
}
