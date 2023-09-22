/**
 * This helper asserts wether a variable has a specific key only if it is an object
 *
 * @param key the key to search for
 * @param x the element to search the key in
 * @returns a boolean indicating if the object has the key
 */

export const hasProperty = <K extends string, T>(key: K, x: T): x is (T & { [key in K]: unknown }) => (
    typeof x === 'object' && !Array.isArray(x) && x !== null && key in x
);
