/**
 * Elimina de un objeto las claves especificadas y devuelve
 * una **copia nueva** con el resto de propiedades.
 *
 * @param obj  Objeto de entrada
 * @param keys Claves a eliminar
 * @returns Objeto nuevo sin las claves especificadas
 */
export function omitKeys<
  T extends object,
  const K extends readonly (keyof T)[],
>(obj: T, keys: K): Omit<T, K[number]> {
  const clone = { ...obj };
  for (const k of keys) {
    // cast puntual dentro del helper, encapsulado:
    delete (clone as Record<string, unknown>)[k as string];
  }
  return clone;
}
