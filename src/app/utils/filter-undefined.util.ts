import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Same as filter((x)=> x !== undefined) except it will work better with TypeScript
 */
export function filterUndefined<T>(): (
  source$: Observable<T>
) => Observable<NonNullable<T>> {
  return (source$) =>
    source$.pipe(
      filter((x: T) => x !== undefined),
      map((x) => x as NonNullable<T>)
    );
}
