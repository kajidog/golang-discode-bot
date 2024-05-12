export function findObjectByKey<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T | undefined {
  return items.find((item) => item[key] === value);
}

export function getObjectByPath<T>(
  items: T[],
  path: string,
  value: any
): T | undefined {
  const pathParts = path.split('.');
  return items.find((item) => getValueByPath(item, pathParts) === value);
}

function getValueByPath<T>(obj: T, pathParts: string[]): any {
  let current: any = obj;
  for (const part of pathParts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}
