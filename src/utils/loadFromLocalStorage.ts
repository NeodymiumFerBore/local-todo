/**
 * @description Load arbitrary JSON data from local storage, and return it as type T
 * @param key String to search in localStorage
 * @param defaults What to return if key is not found in localStorage.
 * @returns The loaded object<T>
 *          If key was not found in localStorage, returns defaults
 *          (can be an object structured by a type T, a new class instance (()=>new T()), etc.)
 *          If defaults is undefined, empty object<T>
 * @example:
 *    const data: MyData = loadFromLocalStorage<MyData>('myDataKey');
 *    const data: MyData = loadFromLocalStorage<MyData>('key', {data: {}});
 *    const data: MyData = loadFromLocalStorage<MyData>('key', () => new MyData());
 */
// https://stackoverflow.com/questions/76201173/how-to-safely-call-a-function-in-typescript-that-was-passed-as-a-parameter-of-t
export const loadFromLocalStorage = <T>(
  key: string,
  defaults: (T | undefined) | (() => T) = undefined
): T => {
  const localValue = localStorage.getItem(key);
  if (localValue === null) {
    if (defaults instanceof Function) return defaults();
    if (defaults !== undefined) return defaults as T;
    return {} as T;
  }

  return JSON.parse(localValue) as T;
};
