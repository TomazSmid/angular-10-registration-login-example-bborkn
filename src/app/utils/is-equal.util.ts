import { isEqual as lodashIsEqual } from 'lodash';

// Preserve types in pipeline
export function isEqual<T, A extends T, B extends T>(a: A, b: B): boolean {
  return lodashIsEqual(a, b);
}
