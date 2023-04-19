import { WritableComputedRef } from "vue";
import { RouteLocationRaw } from "vue-router";
export interface MenuItem {
  key: string;
  title: string;
  route?: RouteLocationRaw;
  children?: MenuItem[];
}

export interface FIsMenuOpen {
  (key: MenuItem["key"]): boolean;
}

export interface MenuProvide {
  modelValue: WritableComputedRef<any>;
  isOpen: FIsMenuOpen;
  open(key: string): void;
  close(key: string): void;
  toggle(key: string): void;
}
