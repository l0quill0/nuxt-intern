import pkg from "lodash";

const { every, has, isEqual, isUndefined, omit, omitBy } = pkg;

interface args {
  initialState: Object;
  newState: Object;
  omitKeys?: string[];
}

const clean = (obj: object, omitKeys?: string[]) =>
  omitBy(omit(obj, omitKeys || []), isUndefined);

const checkEquality = (largeObject: Object, smallObject: Object) => {
  return every(smallObject, (value, key) => {
    return has(largeObject, key) && isEqual(largeObject[key], value);
  });
};

export const checkForChange = ({
  initialState,
  newState,
  omitKeys = [],
}: args) => {
  return checkEquality(
    clean(initialState, omitKeys),
    clean(newState, omitKeys)
  );
};
