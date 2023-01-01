export const pick = (obj: any, keys: string[]): any =>
  keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {})
