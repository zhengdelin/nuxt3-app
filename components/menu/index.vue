<template>
  <div class="menu">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { MenuItem, MenuProvide } from "./index";

const props = withDefaults(
  defineProps<{
    items?: MenuItem[];
    modelValue?: any;
    defaultActive?: string;
    uniqueOpened?: boolean;
  }>(),
  {
    defaultActive: "default",
    uniqueOpened: false,
  },
);

const emit = defineEmits(["update:modelValue", "change"]);

const modelV = props.modelValue
  ? useVModel({
      props,
      emit,
      setter(v) {
        emit("update:modelValue", v);
      },
    })
  : ref(props.defaultActive);

watch(modelV, () => {
  emit("change");
});

// 子元素開關
const openingMenu = ref<MenuItem["key"][]>([]);
const isMenuOpen: MenuProvide["isOpen"] = (key: MenuItem["key"]) => openingMenu.value.includes(key);
const open: MenuProvide["open"] = (key) => {
  if (props.uniqueOpened) {
    openingMenu.value = [];
  }
  openingMenu.value.push(key);
};
const close: MenuProvide["close"] = (key) => {
  const index = openingMenu.value.indexOf(key);
  if (index !== -1) {
    openingMenu.value.splice(index, 1);
  }
};
const toggle: MenuProvide["toggle"] = (key) => {
  if (isMenuOpen(key)) {
    close(key);
  } else {
    open(key);
  }
};
provide("menu", {
  modelValue: modelV,
  isOpen: isMenuOpen,
  open,
  close,
  toggle,
} as MenuProvide);
</script>
<style scoped lang="scss">
.menu {
  background-color: white;
}
</style>
