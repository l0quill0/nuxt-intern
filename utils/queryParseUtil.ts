import type { LocationQueryValue } from "vue-router";

type Param = LocationQueryValue | LocationQueryValue[] | undefined;
type Args<T, R> = {
  def?: T;
  value: Param;
  required?: R;
  transformer?: (value: Omit<LocationQueryValue, "undefined">) => T;
};

export function parseQueryParam<T = string, R extends boolean = false>({
  def,
  value,
  required,
  transformer,
}: Args<T, R>): R extends true ? T : T | undefined {
  const result =
    !value || (!Array.isArray(value) && !/^[1-9]\d*$/.test(value))
      ? def
      : transformer?.(value) ?? def;

  if (required && result === undefined) {
    throw new Error("negative number");
  }

  return result as T;
}
