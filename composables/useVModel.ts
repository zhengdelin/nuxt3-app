interface UseVModel<T, K extends keyof T> {
  props: T;
  propName?: K;
  emit: any;
  setter?(v: T[K]): void;
}

export function useVModel<T, K extends keyof T>({
  props,
  propName = "modelValue" as K,
  emit,
  setter = function (v) {
    emit(`update:${propName as string}`, v);
  },
}: UseVModel<T, K>) {
  return computed({
    get() {
      return props[propName];
    },
    set: setter,
  });
}

export function useVDeepModel<T extends Record<string, any>, K extends keyof T>({ props, propName = "modelValue" as K, emit }: UseVModel<T, K>) {
  return computed({
    get() {
      return new Proxy<T[K]>(props[propName], {
        set(target, name, newValue) {
          emit(`update:${propName as string}`, Object.assign({}, target, { [name]: newValue }));
          // console.log("target, name, newValue :>> ", target, name, newValue, { ...target, [name]: newValue }, `update:${propName as string}`);
          return true;
        },
      });
    },
    set(v) {
      emit(`update:${propName as string}`, v);
    },
  });
}
