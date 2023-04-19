export {};

type NotNullObject<T> = NonNullable<T> extends object ? NonNullable<T> : never;

declare global {
  interface ObjectConstructor {
    isObject<T>(v: T): v is NotNullObject<T>;
    isEqual(val1: any, val2: any): boolean;
  }
}

Object.isObject = function <T>(v: T): v is NotNullObject<T> {
  return typeof v === "object" && v !== null;
};

Object.isEqual = function (obj1, obj2) {
  // console.log("obj1, obj2 :>> ", obj1, obj2);
  if (Object.isObject(obj1) && Object.isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }
      if (!Object.isEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  } else {
    return obj1 === obj2;
  }
};
